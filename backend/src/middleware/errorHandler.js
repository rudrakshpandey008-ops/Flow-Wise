// ============================================================================
// FLOWWISE - Central Error Handler Middleware
// ============================================================================
// Catches all errors bubbling through Express and returns consistent
// JSON error responses with appropriate HTTP status codes.
// ============================================================================

/**
 * Central error handler.
 * Handles Mongoose-specific errors (validation, duplicate key, cast),
 * JWT errors, and generic application errors.
 *
 * @param {Error} err - The error object
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  // Clone relevant error properties into a mutable object
  let error = {
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
    errors: null,
  };

  // Log full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ [Error]', err);
  }

  // ── Mongoose: Validation Error ──────────────────────────────────────
  // Triggered when a document fails schema validation rules
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error.message = 'Validation failed';
    error.statusCode = 400;
    error.errors = messages;
  }

  // ── Mongoose: Duplicate Key Error ───────────────────────────────────
  // Triggered when a unique index constraint is violated (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `Duplicate value for "${field}". That ${field} is already in use.`;
    error.statusCode = 409;
  }

  // ── Mongoose: Cast Error ────────────────────────────────────────────
  // Triggered when a value cannot be cast to the expected type (e.g. bad ObjectId)
  if (err.name === 'CastError') {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // ── JWT: Token Expired ──────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    error.message = 'Authentication token has expired. Please log in again.';
    error.statusCode = 401;
  }

  // ── JWT: Malformed / Invalid Token ──────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid authentication token.';
    error.statusCode = 401;
  }

  // ── JWT: Token not yet active ───────────────────────────────────────
  if (err.name === 'NotBeforeError') {
    error.message = 'Authentication token is not yet active.';
    error.statusCode = 401;
  }

  // ── Payload Too Large ───────────────────────────────────────────────
  if (err.type === 'entity.too.large') {
    error.message = 'Request payload is too large.';
    error.statusCode = 413;
  }

  // ── Build response ─────────────────────────────────────────────────
  const response = {
    success: false,
    error: error.message,
  };

  // Include detailed validation errors if available
  if (error.errors) {
    response.errors = error.errors;
  }

  // Include stack trace in development only
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

export default errorHandler;
