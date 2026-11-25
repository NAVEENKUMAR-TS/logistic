import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

/**
 * Middleware that strictly verifies the Supabase access token (JWT).
 * Rejects requests without an authorization header or with an invalid/expired token with 401.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header. Expected Bearer <token>',
    });
    return;
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Bearer token cannot be empty',
    });
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: error?.message || 'Invalid or expired access token',
      });
      return;
    }

    // Attach authenticated user to request
    req.user = user;
    const appMetadata = user.app_metadata || {};
    const metadata = user.user_metadata || {};
    // SECURITY: Prefer app_metadata.role (server-controlled, not client-writable)
    // Fall back to user_metadata.role only if app_metadata.role is not set
    // Never trust user_metadata alone for authorization decisions
    req.userRole =
      (appMetadata.role as string) ||
      (metadata.role as string) ||
      'viewer';

    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Token verification failed';
    res.status(401).json({
      error: 'Unauthorized',
      message,
    });
  }
};

/**
 * Middleware that verifies the authenticated user possesses one of the required roles.
 * Returns 403 Forbidden if the user's role is not authorized.
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required prior to role authorization',
      });
      return;
    }

    const currentRole = req.userRole || 'viewer';

    if (!allowedRoles.includes(currentRole)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Required one of: [${allowedRoles.join(
          ', '
        )}], but user holds role: '${currentRole}'`,
      });
      return;
    }

    next();
  };
};

export default { requireAuth, requireRole };

