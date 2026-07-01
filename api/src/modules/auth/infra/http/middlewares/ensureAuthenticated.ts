import { UserRole } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import jwt, { type Secret } from 'jsonwebtoken';

type TokenPayload = {
  sub: string;
  role: UserRole;
};

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: 'Token is missing',
    });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return response.status(401).json({
      message: 'Token is missing',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret,
    ) as TokenPayload;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    return response.status(401).json({
      message: 'Invalid token',
    });
  }
}
