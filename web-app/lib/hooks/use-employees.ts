'use client';

import { useState, useEffect, useCallback } from 'react';
import type { EmployeeBasic } from '@/lib/types/employee';

interface UseEmployeesOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseEmployeesReturn {
  employees: EmployeeBasic[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployees(options: UseEmployeesOptions = {}): UseEmployeesReturn {
  const { limit = 100, autoFetch = true } = options;
  const [employees, setEmployees] = useState<EmployeeBasic[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/employees?limit=${limit}`);
      const data = await res.json();
      if (data.success && data.data) {
        setEmployees(data.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch employees';
      setError(msg);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) fetchEmployees();
  }, [fetchEmployees, autoFetch]);

  return { employees, loading, error, refetch: fetchEmployees };
}

interface UseEmployeeByIdReturn {
  employee: EmployeeBasic | null;
  loading: boolean;
  error: string | null;
}

export function useEmployeeById(id: string | undefined): UseEmployeeByIdReturn {
  const [employee, setEmployee] = useState<EmployeeBasic | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setEmployee(null);
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/employees/${id}`);
        const data = await res.json();
        if (data.success && data.data) setEmployee(data.data);
        else setEmployee(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee');
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { employee, loading, error };
}

interface UseEmployeeSearchReturn {
  results: EmployeeBasic[];
  searching: boolean;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

export function useEmployeeSearch(): UseEmployeeSearchReturn {
  const [results, setResults] = useState<EmployeeBasic[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.data) setResults(data.data.slice(0, 10));
      else setResults([]);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const clear = useCallback(() => setResults([]), []);

  return { results, searching, search, clear };
}
