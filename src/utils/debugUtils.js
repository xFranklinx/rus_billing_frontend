import debug from 'debug';

// Enable debugging in development
if (process.env.NODE_ENV !== 'production') {
  debug.enable('app:*');
}

export const createDebugger = (namespace) => debug(`app:${namespace}`);

// Usage example:
// const log = createDebugger('auth');
// log('User logged in:', user);