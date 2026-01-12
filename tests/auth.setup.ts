import { test as setup, expect } from '@playwright/test';
import path from 'path';
import LoginPage from '../page-model/auth/Login';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page, context }) => {
  if (!process.env.TEST_USER || !process.env.TEST_PASS) {
    throw new Error('Missing TEST_USER or TEST_PASS env vars');
  }

  const loginPage = new LoginPage(page);
  await loginPage.goTo();

  await loginPage.fillEmail(process.env.TEST_USER);
  await loginPage.fillPassword(process.env.TEST_PASS);
  await loginPage.submitLoginBtn();

  const cookies = await context.cookies();
  const cookieToken = cookies.find(cookie => cookie.name === 'token')
  if(cookieToken){
    expect(cookieToken.value).toBeTruthy();
  }else{
      console.log('Authentication token cookie not found.');
  }

  await page.context().storageState({ path: authFile });
});