import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardTabsModule } from '@/components/dashboard/dashboard-tabs-module';

vi.mock('@/components/layout/language-provider', () => ({
  useLanguage: () => ({
    dict: {
      common: {
        overview: 'Overview',
        trends: 'Trends',
        tasks: 'Tasks',
        activities: 'Activities',
        kpiCards: 'KPI cards',
        analytics: 'Analytics',
      },
    },
  }),
}));

vi.mock('@/components/dashboard/dashboard-overview-module', () => ({
  DashboardOverviewModule: () => <div>Overview Content</div>,
}));

vi.mock('@/components/dashboard/trends-module', () => ({
  TrendsModule: () => <div>Trends Content</div>,
}));

vi.mock('@/components/dashboard/tasks-module', () => ({
  TasksModule: () => <div>Tasks Content</div>,
}));

vi.mock('@/components/dashboard/activities-module', () => ({
  ActivitiesModule: () => <div>Activities Content</div>,
}));

vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <span>LayoutDashboard</span>,
  BarChart3: () => <span>BarChart3</span>,
  CheckSquare2: () => <span>CheckSquare2</span>,
  Activity: () => <span>Activity</span>,
}));

describe('DashboardTabsModule', () => {
  it('renders all tab buttons', () => {
    render(<DashboardTabsModule />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });

  it('shows overview content by default', () => {
    render(<DashboardTabsModule />);
    expect(screen.getByText('Overview Content')).toBeInTheDocument();
  });

  it('switches content when clicking a different tab', async () => {
    const user = userEvent.setup();
    render(<DashboardTabsModule />);
    await user.click(screen.getByText('Trends'));
    expect(screen.getByText('Trends Content')).toBeInTheDocument();
    expect(screen.queryByText('Overview Content')).not.toBeInTheDocument();
  });

  it('uses initialTab prop to set default tab', () => {
    render(<DashboardTabsModule initialTab="tasks" />);
    expect(screen.getByText('Tasks Content')).toBeInTheDocument();
  });
});
