import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { login } from '../services/api';

// Add Web3 imports for MetaMask integration
import Web3 from 'web3';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const floatIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

// Loading animation variants
const loadingVariants = {
  start: {
    scale: 0.8,
    opacity: 0.5
  },
  end: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState(searchParams.get('type') || 'patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // New states for enhanced validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [lastTypingTime, setLastTypingTime] = useState(0);
  const [securityTip, setSecurityTip] = useState('');

  // States for MetaMask integration
  const [accounts, setAccounts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [usingMetaMask, setUsingMetaMask] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if MetaMask is already connected
    checkMetaMaskConnection();
    
    // Set up event listeners for MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
    
    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // MetaMask connection functions
  const checkMetaMaskConnection = async () => {
    if (window.ethereum) {
      try {
        // Initialize Web3
        new Web3(window.ethereum);
        
        // Get connected accounts without showing the MetaMask popup
        const accts = await window.ethereum.request({
          method: 'eth_accounts'
        });
        
        if (accts.length > 0) {
          setAccounts(accts);
          setConnected(true);
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
      }
    }
  };

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        const accts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        setAccounts(accts);
        setConnected(true);
        
        // Set using MetaMask for login
        setUsingMetaMask(true);
      } else {
        console.error('MetaMask not detected. Please install MetaMask extension.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  // Event handlers for MetaMask
  const handleAccountsChanged = (accts) => {
    if (accts.length === 0) {
      // User has disconnected all accounts
      setConnected(false);
      setAccounts([]);
      setUsingMetaMask(false);
    } else {
      setAccounts(accts);
    }
  };

  const handleChainChanged = () => {
    // Reload the page as recommended by MetaMask
    window.location.reload();
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAccounts([]);
    setUsingMetaMask(false);
  };

  const handleMetaMaskLogin = async () => {
    if (!connected || accounts.length === 0) {
      await connectMetaMask();
      return;
    }
    
    setLoading(true);
    setFormError('');
    
    try {
      // Get a challenge from the server to sign
      const timestamp = Date.now().toString();
      const message = `Arogya Mithra Authentication Request ${timestamp}`;
      
      // Sign the message with MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, accounts[0]],
      });
      
      // Send the address, signature, and message to the server for verification
      const response = await login({
        walletAddress: accounts[0],
        signature,
        message,
        userType,
        isMetaMask: true
      });
      
      console.log('MetaMask login response:', response);
      
      if (!response || !response.token) {
        setFormError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }
      
      // Store the token
      localStorage.setItem('token', response.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user));
      // Store welcome message for displaying after redirect
      localStorage.setItem('welcomeMessage', `Welcome back, ${response.user.fullName || response.user.walletAddress}! You have successfully logged in with MetaMask.`);
      
      // Determine user type for redirection
      const redirectUserType = response.user.type || userType;
      console.log('Redirecting to dashboard for user type:', redirectUserType);
      
      // Show success animation
      setLoginSuccess(true);
      setLoading(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        console.log('Executing redirect after timeout');
        // Force redirection through window.location for reliability
        if (redirectUserType === 'doctor') {
          // Log before redirect
          console.log('Redirecting to doctor dashboard');
          // Use window.location.replace instead of href for more reliable navigation
          window.location.replace('/doctor-dashboard');
        } else if (redirectUserType === 'patient') {
          // Log before redirect
          console.log('Redirecting to patient dashboard');
          // Use window.location.replace instead of href for more reliable navigation
          window.location.replace('/patient-dashboard');
        } else {
          console.error('Unknown user type:', redirectUserType);
          window.location.replace('/');
        }
      }, 2000);
    } catch (err) {
      console.error('MetaMask login error:', err);
      setFormError(err.message || 'Failed to authenticate with MetaMask');
      setLoading(false);
    }
  };

  // Real-time email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Real-time password validation
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handle email change with debounced validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setLastTypingTime(Date.now());

    // Debounced validation
    setTimeout(() => {
      if (Date.now() - lastTypingTime >= 500) {
        validateEmail(newEmail);
      }
    }, 500);
  };

  // Handle password change with strength indicator
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);

    // Update security tip based on password strength
    if (newPassword.length > 0) {
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasNumbers = /\d/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      
      if (!hasUpperCase) {
        setSecurityTip('Add uppercase letters for stronger password');
      } else if (!hasLowerCase) {
        setSecurityTip('Add lowercase letters for stronger password');
      } else if (!hasNumbers) {
        setSecurityTip('Add numbers for stronger password');
      } else if (!hasSpecialChar) {
        setSecurityTip('Add special characters for stronger password');
      } else {
        setSecurityTip('Strong password! 💪');
      }
    } else {
      setSecurityTip('');
    }
  };

  // Enhanced form submission with additional validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    
    // If using MetaMask, handle that flow instead
    if (usingMetaMask) {
      await handleMetaMaskLogin();
      return;
    }
    
    // Enhanced validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }
    
    try {
      // Add rate limiting check
      const lastLoginAttempt = localStorage.getItem('lastLoginAttempt');
      const now = Date.now();
      if (lastLoginAttempt && now - parseInt(lastLoginAttempt) < 2000) {
        setFormError('Please wait a moment before trying again');
        setLoading(false);
        return;
      }
      localStorage.setItem('lastLoginAttempt', now.toString());

      const response = await login({ email, password });
      
      console.log('Login response:', response);
      
      if (!response || !response.token) {
        setFormError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }
      
      // Store the token
      localStorage.setItem('token', response.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user));
      // Store welcome message for displaying after redirect
      localStorage.setItem('welcomeMessage', `Welcome back, ${response.user.fullName}! You have successfully logged in.`);
      
      // Determine user type for redirection
      const redirectUserType = response.user.type || userType;
      console.log('Redirecting to dashboard for user type:', redirectUserType);
      
      // Show success animation
      setLoginSuccess(true);
      setLoading(false);
      
      // Log stored data for debugging
      console.log('Stored token:', localStorage.getItem('token'));
      console.log('Stored user:', localStorage.getItem('user'));
      console.log('Stored welcome message:', localStorage.getItem('welcomeMessage'));
      
      // Redirect after 2 seconds with a more reliable approach
      setTimeout(() => {
        console.log('Executing redirect after timeout');
        // Force redirection through window.location for reliability
        if (redirectUserType === 'doctor') {
          // Log before redirect
          console.log('Redirecting to doctor dashboard');
          // Use window.location.replace instead of href for more reliable navigation
          window.location.replace('/doctor-dashboard');
        } else if (redirectUserType === 'patient') {
          // Log before redirect
          console.log('Redirecting to patient dashboard');
          // Use window.location.replace instead of href for more reliable navigation
          window.location.replace('/patient-dashboard');
        } else {
          console.error('Unknown user type:', redirectUserType);
          window.location.replace('/');
        }
      }, 2000);
      
    } catch (err) {
      console.error('Login error in component:', err);
      handleLoginError(err);
    }
  };

  // Enhanced error handling
  const handleLoginError = (err) => {
    setPassword('');
    
    if (err?.message?.includes('rate limit')) {
      setFormError('Too many login attempts. Please try again later.');
    } else if (err?.message?.includes('credentials')) {
      setFormError('Invalid email or password. Please check your credentials.');
    } else if (err?.message?.includes('network')) {
      setFormError('Network error. Please check your internet connection.');
    } else if (err && typeof err === 'object' && err.error) {
      setFormError(err.error);
    } else if (typeof err === 'string') {
      setFormError(err);
    } else {
      setFormError('An error occurred during login. Please try again.');
    }
    
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-blue-50'} transition-colors duration-300`}>
      {/* Theme toggle button - positioned at top right */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm z-50 transition-colors duration-200 hover:bg-opacity-30"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6 text-yellow-300" />
        ) : (
          <MoonIcon className="h-6 w-6 text-blue-800" />
        )}
      </button>
      
      {/* Left side - Gradient background with text */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        {/* Logo Text */}
        <div className="absolute top-4 left-4 z-20">
          <h1 className="text-2xl font-bold text-white">
            Arogya Mithra
          </h1>
        </div>
        
        {/* Gradient background */}
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900' 
            : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600'
        }`}>
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Welcome to Healthcare Reimagined
            </motion.h2>
          <motion.p 
              className="text-xl text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your health records, secure and accessible anytime, anywhere.
          </motion.p>
            
            {/* Feature icons */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              {/* Secure icon */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Secure</span>
              </div>
              
              {/* Accessible icon */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Accessible</span>
              </div>
              
              {/* Private icon */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Private</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className={`max-w-md w-full space-y-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}
        >
          <div>
            <h2 className="text-center text-3xl font-extrabold">
              {userType === 'doctor' ? 'Doctor Login' : 'Patient Login'}
            </h2>
            <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please sign in to access your account
            </p>
          </div>

          {/* Toggle between Doctor and Patient */}
          <div className="flex justify-center space-x-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('doctor')}
              className={`px-6 py-3 rounded-full transition-colors duration-200 font-medium ${
                userType === 'doctor'
                  ? darkMode 
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' 
                    : 'bg-pink-500 text-white shadow-md'
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              Doctor
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('patient')}
              className={`px-6 py-3 rounded-full transition-colors duration-200 font-medium ${
                userType === 'patient'
                  ? darkMode 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-green-500 text-white shadow-md'
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              Patient
            </motion.button>
          </div>

          {/* Helpful info */}
          <motion.div 
            variants={floatIn}
            className={`p-4 rounded-xl ${
              darkMode 
                ? 'bg-gray-800/80 border border-gray-700' 
                : 'bg-blue-50 border border-blue-100'
            }`}
          >
            <p className="text-xs text-center">
              {userType === 'doctor' ? 
                'Use doctor1@example.com with Doctor@123' : 
                'Use patient1@example.com with Patient@123'}
            </p>
          </motion.div>

          {/* Error messages */}
          {formError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-md text-red-500 ${
                darkMode 
                  ? 'bg-red-900/20 border border-red-800' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {formError}
            </motion.div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500'
                  } ${emailError ? 'border-red-500' : ''}`}
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500'
                    } ${passwordError ? 'border-red-500' : ''}`}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {passwordError}
                  </motion.p>
                )}
                {securityTip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 p-2 rounded-md ${
                      securityTip.includes('Strong')
                        ? darkMode
                          ? 'bg-green-900/20 text-green-300'
                          : 'bg-green-50 text-green-700'
                        : darkMode
                          ? 'bg-yellow-900/20 text-yellow-300'
                          : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    <p className="text-sm flex items-center">
                      {securityTip.includes('Strong') ? (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {securityTip}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className={`font-medium ${
                    userType === 'doctor'
                      ? 'text-pink-600 hover:text-pink-500'
                      : 'text-green-600 hover:text-green-500'
                  }`}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || loginSuccess}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  userType === 'doctor'
                    ? darkMode 
                      ? 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500' 
                      : 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-500'
                    : darkMode 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  (loading || loginSuccess) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
                {loginSuccess ? (
                  <>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute flex items-center justify-center"
                    >
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.span>
                    <span className="opacity-0">Sign in</span>
                  </>
                ) : loading ? (
                  <motion.div
                    variants={loadingVariants}
                    initial="start"
                    animate="end"
                    className="flex items-center"
                  >
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </motion.div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link 
                to={`/register?type=${userType}`} 
                className={`font-medium ${
                  userType === 'doctor'
                    ? 'text-pink-600 hover:text-pink-500'
                    : 'text-green-600 hover:text-green-500'
                }`}
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success overlay */}
      {loginSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Login successful!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
              >
                Redirecting to your dashboard...
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}