import config from 'config/config';

const logger = {
  info: (message, ...args) => {
    if (config.enableLogging) {
      console.log(`%c[INFO] ${message}`, 'color: blue; font-weight: bold;', ...args);
    }
  },
  warn: (message, ...args) => {
    if (config.enableLogging) {
      console.warn(`%c[WARN] ${message}`, 'color: orange; font-weight: bold;', ...args);
    }
  },
  error: (message, ...args) => {
    if (config.enableLogging) {
      console.error(`%c[ERROR] ${message}`, 'color: red; font-weight: bold;', ...args);
    }
  },
  debug: (message, ...args) => {
    if (config.enableLogging && process.env.NODE_ENV !== 'production') {
      console.log(`%c[DEBUG] ${message}`, 'color: green; font-weight: bold;', ...args);
    }
  }
};

export default logger;