/**
 * Wraps an async route handler so thrown errors are passed to
 * Express's error-handling middleware instead of crashing the process.
 */
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
