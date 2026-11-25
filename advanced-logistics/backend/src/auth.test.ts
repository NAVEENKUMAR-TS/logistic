import { describe, it, expect, vi } from 'vitest';
import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from './middleware/auth.js';
import { router } from './routes/index.js';

describe('Backend Authentication & Authorization Verification', () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  describe('Unauthenticated Requests (HTTP 401)', () => {
    it('rejects protected /api/auth/me when Authorization header is missing', async () => {
      const req = {
        headers: {},
      } as unknown as Request;
      const jsonMock = vi.fn();
      const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
      const res = {
        status: statusMock,
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      await requireAuth(req, res, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('rejects protected request when Authorization header is not Bearer format', async () => {
      const req = {
        headers: { authorization: 'Basic dXNlcjpwYXNz' },
      } as unknown as Request;
      const jsonMock = vi.fn();
      const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
      const res = {
        status: statusMock,
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      await requireAuth(req, res, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('rejects fake or invalid JWT tokens with HTTP 401', async () => {
      const req = {
        headers: { authorization: 'Bearer fake.invalid.jwt.token' },
      } as unknown as Request;
      const jsonMock = vi.fn();
      const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
      const res = {
        status: statusMock,
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      await requireAuth(req, res, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Role-Based Access Control (HTTP 403 vs Allow)', () => {
    it('returns HTTP 403 Forbidden when authenticated user lacks required role', () => {
      const req = {
        user: { id: 'test-user-uuid', email: 'operator@logix.com' },
        userRole: 'viewer',
      } as unknown as Request;
      const jsonMock = vi.fn();
      const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
      const res = {
        status: statusMock,
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      const adminGuard = requireRole(['admin']);
      adminGuard(req, res, next);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Forbidden',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('allows access (calls next) when authenticated user has the required role', () => {
      const req = {
        user: { id: 'test-admin-uuid', email: 'admin@logix.com' },
        userRole: 'admin',
      } as unknown as Request;
      const res = {} as unknown as Response;
      const next = vi.fn() as NextFunction;

      const adminGuard = requireRole(['admin', 'dispatcher']);
      adminGuard(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

