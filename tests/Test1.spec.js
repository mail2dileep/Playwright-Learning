import {test, expect} from '@playwright/test';
test('test1', async ({page}) => {
    await page.goto('https://www.cpsenergy.com/');
    await expect(page).toHaveTitle(/Welcome to CPS Energy/);
    //await page.getByRole('button', {name: 'My Home'}).click();
    await page.locator('#my-home').click();
   // await expect(page.getByRole('button', {name: 'My Home'})).toBeVisible();
})