import { describe, it, expect } from 'vitest';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/db/pagination';

describe('Pagination Utilities', () => {
  it('should calculate correct pagination params with defaults', () => {
    const params = getPaginationParams({});
    
    expect(params.skip).toBe(0);
    expect(params.take).toBe(20);
    expect(params.orderBy).toEqual({ createdAt: 'desc' });
  });

  it('should calculate correct pagination params with custom values', () => {
    const params = getPaginationParams({ page: 3, limit: 50, sortBy: 'name', sortOrder: 'asc' });
    
    expect(params.skip).toBe(100);
    expect(params.take).toBe(50);
    expect(params.orderBy).toEqual({ name: 'asc' });
  });

  it('should enforce minimum page of 1', () => {
    const params = getPaginationParams({ page: 0 });
    expect(params.skip).toBe(0);
  });

  it('should enforce maximum limit of 100', () => {
    const params = getPaginationParams({ limit: 200 });
    expect(params.take).toBe(100);
  });

  it('should enforce minimum limit of 1', () => {
    const params = getPaginationParams({ limit: 0 });
    expect(params.take).toBe(1);
    expect(params.limit).toBe(1);
  });

  it('should build correct paginated response', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = buildPaginatedResponse(data, 100, 2, 20);
    
    expect(result.data).toHaveLength(3);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.limit).toBe(20);
    expect(result.pagination.total).toBe(100);
    expect(result.pagination.totalPages).toBe(5);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrev).toBe(true);
  });

  it('should handle first page correctly', () => {
    const data = [{ id: 1 }];
    const result = buildPaginatedResponse(data, 50, 1, 10);
    
    expect(result.pagination.hasPrev).toBe(false);
    expect(result.pagination.hasNext).toBe(true);
  });

  it('should handle last page correctly', () => {
    const data = [{ id: 10 }];
    const result = buildPaginatedResponse(data, 50, 5, 10);
    
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(true);
  });
});