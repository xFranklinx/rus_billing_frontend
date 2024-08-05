const config = {
  // App-wide settings
  app: {
    name: process.env.REACT_APP_NAME || 'RUS Billing Optimization & Automation',
    version: process.env.REACT_APP_VERSION || '0.1.0',
  },

  // Environment-specific settings
  env: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
  },

  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT, 10) || 5000,
  },

  // Feature flags
  features: {
    enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
    showDevLogin: process.env.REACT_APP_SHOW_DEV_LOGIN === 'true',
  },

  // UI configuration
  ui: {
    sidebarWidth: parseInt(process.env.REACT_APP_SIDEBAR_WIDTH, 10) || 260,
    theme: process.env.REACT_APP_DEFAULT_THEME || 'light',
  },
};

export default config;