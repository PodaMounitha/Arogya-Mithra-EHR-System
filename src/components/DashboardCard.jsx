import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.2
    }
  }
};

export default function DashboardCard({ 
  title, 
  icon, 
  children, 
  className = '',
  loading = false,
  darkMode = false,
  footer = null,
  onRefresh = null,
  delay = 0
}) {
  return (
    <motion.div
      className={`rounded-lg overflow-hidden ${
        darkMode ? 'bg-gray-800 shadow-gray-900/10' : 'bg-white shadow-gray-200/50'
      } shadow-lg ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={onRefresh ? "hover" : undefined}
      transition={{ delay }}
    >
      {/* Card Header */}
      <div className={`px-5 py-4 flex justify-between items-center border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex items-center space-x-3">
          {icon && (
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {icon}
            </span>
          )}
          <h3 className="font-medium">{title}</h3>
        </div>
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className={`p-1.5 rounded-full transition ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Card Body */}
      <div className={`px-5 py-4 ${loading ? 'opacity-60' : ''}`}>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`px-5 py-3 ${
          darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-100'
        } border-t`}>
          {footer}
        </div>
      )}
    </motion.div>
  );
} 