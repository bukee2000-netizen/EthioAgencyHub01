import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CvGenerator } from '@/components/employees/cv-generator';

const mockEmployee = {
  id: 'EAH-1024',
  firstName: 'Mekdes',
  lastName: 'Tesfaye',
  role: 'Domestic Worker',
  passportNumber: 'ET1234567',
  contactPhone: '+251911234567',
  status: 'REGISTERED',
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(async (url: string) => {
    if (url.toString().includes('/api/employees/search')) {
      return {
        ok: true,
        json: () => Promise.resolve({ success: true, data: [mockEmployee] }),
      } as Response;
    }
    return {
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    } as Response;
  });
});

describe('CvGenerator', () => {
  it('renders the CV generator form with search input', () => {
    render(<CvGenerator />);
    expect(screen.getByText('Select Employee')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by name, passport, or phone...')).toBeInTheDocument();
  });

  it('searches and selects an employee, then shows template styles', async () => {
    const user = userEvent.setup();
    render(<CvGenerator />);

    const searchInput = screen.getByPlaceholderText('Search by name, passport, or phone...');
    await user.type(searchInput, 'Mekdes');

    const employeeButton = await screen.findByText(/Mekdes Tesfaye/);
    expect(employeeButton).toBeInTheDocument();

    await user.click(employeeButton);

    expect(await screen.findByText('Layout Mode')).toBeInTheDocument();
    expect(screen.getByText('Template Style')).toBeInTheDocument();
  });

  it('renders all layout mode options', async () => {
    const user = userEvent.setup();
    render(<CvGenerator />);

    const searchInput = screen.getByPlaceholderText('Search by name, passport, or phone...');
    await user.type(searchInput, 'Mekdes');
    const employeeButton = await screen.findByText(/Mekdes Tesfaye/);
    await user.click(employeeButton);

    expect(await screen.findByText('English Only')).toBeInTheDocument();
    expect(screen.getByText('Arabic Only')).toBeInTheDocument();
    expect(screen.getByText('Bilingual')).toBeInTheDocument();
  });

  it('changes template style on selection', async () => {
    const user = userEvent.setup();
    render(<CvGenerator />);

    const searchInput = screen.getByPlaceholderText('Search by name, passport, or phone...');
    await user.type(searchInput, 'Mekdes');
    const employeeButton = await screen.findByText(/Mekdes Tesfaye/);
    await user.click(employeeButton);

    const professionalButton = await screen.findByText('Professional');
    expect(professionalButton).toBeInTheDocument();

    await user.click(professionalButton);
    expect(screen.getByText('CV Preview — Professional')).toBeInTheDocument();
  });

  it('renders all five template style options', async () => {
    const user = userEvent.setup();
    render(<CvGenerator />);

    const searchInput = screen.getByPlaceholderText('Search by name, passport, or phone...');
    await user.type(searchInput, 'Mekdes');
    const employeeButton = await screen.findByText(/Mekdes Tesfaye/);
    await user.click(employeeButton);

    expect(await screen.findByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
    expect(screen.getByText('Elegant')).toBeInTheDocument();
    expect(screen.getByText('Compact')).toBeInTheDocument();
  });

  it('shows the preview section with an employee selected', async () => {
    const user = userEvent.setup();
    render(<CvGenerator />);

    const searchInput = screen.getByPlaceholderText('Search by name, passport, or phone...');
    await user.type(searchInput, 'Mekdes');
    const employeeButton = await screen.findByText(/Mekdes Tesfaye/);
    await user.click(employeeButton);

    expect(await screen.findByText('CV Preview — Standard')).toBeInTheDocument();
  });
});
