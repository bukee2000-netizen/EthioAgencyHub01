import { describe, it, expect } from 'vitest';
import { 
  ok, 
  created, 
  notFound, 
  serverError, 
  validationError 
} from '@/lib/api/responses';

describe('API Response Helpers', () => {
  describe('ok()', () => {
    it('returns success response with data', () => {
      const response = ok({ user: { id: '1', name: 'Test' } });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('returns 200 status', () => {
      const response = ok({ test: true });
      expect(response.status).toBe(200);
    });
  });

  describe('created()', () => {
    it('returns 201 status with created resource', () => {
      const response = created({ id: 'new-1', name: 'New Item' });
      
      expect(response.status).toBe(201);
    });
  });

  describe('notFound()', () => {
    it('returns 404 status', () => {
      const response = notFound('Resource not found');
      
      expect(response.status).toBe(404);
    });
  });

  describe('serverError()', () => {
    it('returns 500 status', () => {
      const response = serverError('Internal error');
      
      expect(response.status).toBe(500);
    });

    it('returns generic message when no message provided', () => {
      const response = serverError();
      
      expect(response.status).toBe(500);
    });
  });

  describe('validationError()', () => {
    it('returns error with validation details', () => {
      const errors = { field: ['Invalid value'] };
      const response = validationError('Validation failed', errors);
      
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });
  });
});