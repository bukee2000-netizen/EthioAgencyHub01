import { expect, test } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Ethio Agency Hub' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in to dashboard' })).toBeVisible();
  });

  test('protected dashboard redirects to login without session', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.getByRole('heading', { name: 'Choose Your Plan' })).toBeVisible();
    await expect(page.getByText('ETB')).toBeVisible();
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });
});

test.describe('Employee Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employee-management/registration/personal');
  });

  test('registration page loads with step indicator', async ({ page }) => {
    await expect(page.getByText('Personal')).toBeVisible();
    await expect(page.getByText('Skills')).toBeVisible();
    await expect(page.getByText('Documents')).toBeVisible();
    await expect(page.getByText('Review')).toBeVisible();
  });

  test('registration form has required fields', async ({ page }) => {
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Contact Phone')).toBeVisible();
    await expect(page.getByLabel('Emergency Contact Name')).toBeVisible();
  });

  test('can navigate between steps', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled();

    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Contact Phone').fill('+251912345678');
    await page.getByLabel('Emergency Contact Name').fill('Emergency Contact');
    await page.getByLabel('Emergency Contact Phone').fill('+251911234567');

    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  });
});

test.describe('Dashboard Pages', () => {
  test('employee management page loads', async ({ page }) => {
    await page.goto('/employee-management');

    await expect(page.getByRole('heading', { name: 'Employee Management' })).toBeVisible();
  });

  test('travel page loads', async ({ page }) => {
    await page.goto('/travel');

    await expect(page.getByRole('heading', { name: 'Travel Management' })).toBeVisible();
  });

  test('documents page loads', async ({ page }) => {
    await page.goto('/documents');

    await expect(page.getByRole('heading', { name: 'Document Management' })).toBeVisible();
  });
});