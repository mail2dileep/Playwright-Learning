import { test, expect } from '@playwright/test';
import { CompanyAdminProfileModalPage } from '../../pages/CompanyAdminProfileModalPage';

// Requirement ID: MTX-4559
// Test Name: TC_003
// Objective: Verify the Company Admin Profile modal pop-up and data entry.

test.describe('MTX-4559 | TC_003 - Company Admin Profile modal', () => {
  test('TC_003 - Verify the Company Admin Profile modal pop-up and data entry', async ({ page }) => {
    const adminProfile = new CompanyAdminProfileModalPage(page);

    // Precondition: Navigate to the prototype root (leverages baseURL when configured)
    await adminProfile.navigateTo('/');

    // Step 1: Trigger the Company Admin Profile modal
    await adminProfile.openCompanyAdminProfileModal();
    await expect.poll(async () => await adminProfile.isModalDisplayed(), { message: 'Modal should be visible after triggering.' }).toBeTruthy();

    // Step 2: Enter valid admin details
    const testName = 'Test Admin';
    const testEmail = 'admin@test.ca';
    await adminProfile.enterAdminDetails(testName, testEmail);

    // Assertions for entered data (fields accept input)
    await expect.poll(async () => await adminProfile.getNameFieldValue(), { message: 'Name field should reflect entered value.' }).toBe(testName);
    await expect.poll(async () => await adminProfile.getEmailFieldValue(), { message: 'Email field should reflect entered value.' }).toBe(testEmail);

    // Step 3: Click Save/Continue and verify transition/close
    const beforeUrl = await adminProfile.getCurrentUrl();
    await adminProfile.clickSaveOrContinueButton();
    await adminProfile.waitForModalToClose();

    // Assertions: modal closes and prototype proceeds/simulates next step
    await expect.poll(async () => await adminProfile.isModalClosed(), { message: 'Modal should be closed after save/continue.' }).toBeTruthy();

    const afterUrl = await adminProfile.getCurrentUrl();
    const hasSuccess = await adminProfile.hasSuccessIndicator();

    // Either URL changes or a success/next-step indicator appears
    expect(beforeUrl !== afterUrl || hasSuccess).toBeTruthy();
  });
});
