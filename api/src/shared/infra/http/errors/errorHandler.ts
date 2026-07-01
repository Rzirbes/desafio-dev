import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from './AppError.js';

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation failed',
      errors: error.flatten().fieldErrors,
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error',
  });
}
