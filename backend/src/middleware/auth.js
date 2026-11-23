// ============================================================================
// FLOWWISE - JWT Authentication Middleware
// ============================================================================
// Extracts and verifies JWT from Authorization header. In DEMO_MODE,
// if no token is provided, a demo user object is attached to the request.
// ============================================================================

import jwt from 'jsonwebtoken';

/**
 * Authentication middleware.
 * Verifies the Bearer token from the Authorization header and attaches
 * the decoded user payload to `req.user`.
 *
 * In DEMO_MODE with no token present, a synthetic demo user is injected
 * so all protected routes remain functional for testing.
 */
const protect = (req, res, next) => {
  const demoMode = process.env.DEMO_MODE === 'true';
  let token = null;

  // Extract token from "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  // No token present
  if (!token) {
    if (demoMode) {
      // In demo mode, inject a synthetic demo user so routes still work
      req.user = {
        id: 'demo_user_001',
        _id: 'demo_user_001',
        name: 'Demo User',
        email: 'demo@flowwise.app',
        role: 'user',
        isDemo: true,
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      error: 'Not authorized — no token provided',
    });
  }

  // Verify token
  try {
    const secret = process.env.JWT_SECRET || 'flowwise_default_secret_dev';
    const decoded = jwt.verify(token, secret);

    // Attach user info to request (the token payload contains at least { id })
    req.user = {
      id: decoded.id,
      _id: decoded.id,
      name: decoded.name || null,
      email: decoded.email || null,
      role: decoded.role || 'user',
      isDemo: false,
    };

    next();
  } catch (error) {
    // Differentiate JWT error types for clearer client-side messaging
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired — please log in again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Not authorized — token verification failed',
    });
  }
};

export { protect };
export default protect;
