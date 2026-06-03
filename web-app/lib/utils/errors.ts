export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found.`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required.') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions.') {
    super(message, 'FORBIDDEN', 403);
  }
}

export function handleError(error: unknown): { message: string; code: string; statusCode: number } {
  if (error instanceof AppError) {
    return { message: error.message, code: error.code, statusCode: error.statusCode };
  }
  if (error instanceof Error) {
    return { message: error.message, code: 'INTERNAL_ERROR', statusCode: 500 };
  }
  return { message: 'An unexpected error occurred.', code: 'INTERNAL_ERROR', statusCode: 500 };
}
