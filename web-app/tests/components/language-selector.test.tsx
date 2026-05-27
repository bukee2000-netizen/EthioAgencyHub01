import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from '@/components/layout/language-selector';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock('lucide-react', () => ({
  Globe: () => <span>Globe</span>,
}));

vi.mock('@/config/languages', () => ({
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr' },
    { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  ],
}));

describe('LanguageSelector', () => {
  it('renders the current language name', () => {
    render(<LanguageSelector currentLanguage="en" onLanguageChange={vi.fn()} />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('opens dropdown with language options on click', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={vi.fn()} />);
    await user.click(screen.getByLabelText('Select language'));
    expect(screen.getByText('አማርኛ')).toBeInTheDocument();
    expect(screen.getByText('Afaan Oromoo')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('calls onLanguageChange when selecting a language', async () => {
    const onLanguageChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={onLanguageChange} />);
    await user.click(screen.getByLabelText('Select language'));
    await user.click(screen.getByText('አማርኛ'));
    expect(onLanguageChange).toHaveBeenCalledWith('am');
  });
});
