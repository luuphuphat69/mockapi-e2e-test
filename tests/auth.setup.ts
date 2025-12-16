import { test as setup, expect } from '@playwright/test';
import path from 'path';
import LoginPage from '../page-model/auth/Login';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  if (!process.env.TEST_USER || !process.env.TEST_PASS) {
    throw new Error('Missing TEST_USER or TEST_PASS env vars');
  }

  const loginPage = new LoginPage(page);
  await loginPage.goTo();

  await loginPage.fillEmail(process.env.TEST_USER);
  await loginPage.fillPassword(process.env.TEST_PASS);

  await Promise.all([
    loginPage.submitLoginBtn(),
    page.waitForURL(/projects/, { timeout: 15_000 }),
  ]);

  await expect(page).toHaveURL(/projects/);

  await page.context().storageState({ path: authFile });
});