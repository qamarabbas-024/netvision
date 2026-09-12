import { Page, expect } from '@playwright/test';

export async function loginViaUI(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');

  // Fill in login credentials
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');

  await emailInput.fill(email);
  await passwordInput.fill(password);

  // Click Submit
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();

  // Wait for redirect to dashboard or token in localStorage
  await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });

  // Verify token is stored in localStorage
  const token = await page.evaluate(() => localStorage.getItem('netvision_token'));
  expect(token).toBeTruthy();
}

/**
 * Fast direct auth injection into browser localStorage for isolated specs
 */
export async function authenticateDirectly(page: Page, email: string, password: string): Promise<string> {
  // Call backend login endpoint directly to retrieve JWT token and user info
  const response = await page.request.post('http://localhost:4000/api/v1/auth/login', {
    data: {
      email: email.trim().toLowerCase(),
      password,
    },
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  const token = data.accessToken;
  const user = data.user;

  // Navigate to root to set localStorage
  await page.goto('/');
  await page.evaluate(
    ({ t, u }) => {
      localStorage.setItem('netvision_token', t);
      localStorage.setItem('netvision_user', JSON.stringify(u));
    },
    { t: token, u: user }
  );

  return token;
}
