import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/layout/theme-provider';
import { type ReactNode } from 'react';

const STORAGE_KEY = 'theme';

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ThemeProvider', () => {
  it('provides default theme as light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('reads saved theme from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('sets dark class on html when theme is dark', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    renderHook(() => useTheme(), { wrapper });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when theme is light', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    renderHook(() => useTheme(), { wrapper });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists theme to localStorage on setTheme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme('dark'));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('uses system preference when theme is system', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    localStorage.setItem(STORAGE_KEY, 'system');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('system');
  });

  it('throws error when useTheme is used outside provider', () => {
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within ThemeProvider');
  });

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });
});
