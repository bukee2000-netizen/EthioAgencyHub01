import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationWizard } from '@/components/employees/registration-wizard';

vi.mock('@/components/employees/passport-scanner', () => ({
  PassportScanner: ({ onAutoFill }: { onAutoFill: (data: any) => void }) => (
    <div data-testid="passport-scanner">
      <button type="button" onClick={() => onAutoFill({ firstName: 'ABEBE', lastName: 'TADESSE' })}>
        Mock Scan
      </button>
    </div>
  ),
}));

vi.mock('@/components/employees/form-fields', () => ({
  TextField: ({ value, onChange, label, placeholder, type }: any) => (
    <div data-testid="text-field">
      {label && <label>{label}</label>}
      <input
        type={type || 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`input-${label?.toLowerCase().replace(/\s+/g, '-') || 'text'}`}
      />
    </div>
  ),
  SelectField: ({ value, onChange, label, options }: any) => (
    <div data-testid="select-field">
      {label && <label>{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        {options?.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('@/config/registration-data', () => ({
  ethiopianRegions: [{ region: 'Addis Ababa', zones: [{ name: 'Not Applicable', woredas: ['Bole'] }] }],
  jobRoles: ['Domestic Worker', 'Caregiver', 'Driver'],
  countries: ['Saudi Arabia', 'UAE', 'Qatar'],
  languages: ['English', 'Arabic', 'Amharic'],
  genders: ['Male', 'Female'],
  maritalStatus: ['Single', 'Married', 'Divorced'],
  educationLevels: ['None', 'Primary', 'Secondary', 'Diploma', 'Degree'],
  experienceLevels: ['None', 'Less than 1 year', '1-3 years', '3+ years'],
}));

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  } as any);
});

describe('RegistrationWizard', () => {
  it('renders step indicators for all wizard steps', () => {
    render(<RegistrationWizard />);
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Bank')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('renders the first form step (Personal) by default', () => {
    render(<RegistrationWizard />);
    expect(screen.getByText('Register New Employee')).toBeInTheDocument();
    expect(screen.getByText('Passport & Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('shows step numbers 1 through 6 on the tab buttons', () => {
    render(<RegistrationWizard />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('switches to Skills step when the Skills tab is clicked', async () => {
    const user = userEvent.setup();
    render(<RegistrationWizard />);
    await user.click(screen.getByText('Skills'));
    expect(screen.getByText('Job Role')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Deploy Country *')).toBeInTheDocument();
  });

  it('has a New Registration button that resets the form', async () => {
    const user = userEvent.setup();
    render(<RegistrationWizard />);
    const newBtn = screen.getByText('New Registration');
    expect(newBtn).toBeInTheDocument();
    await user.click(newBtn);
    expect(screen.getByText('Passport & Personal Information')).toBeInTheDocument();
  });

  it('renders the draft and employee search toggle buttons', () => {
    render(<RegistrationWizard />);
    expect(screen.getByText('Search Drafts')).toBeInTheDocument();
    expect(screen.getByText('Search Employees')).toBeInTheDocument();
  });
});
