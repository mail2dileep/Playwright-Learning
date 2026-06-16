import { test, expect } from '@playwright/test';
import { MeterServicePage } from '../../pages/MeterServicePage';

// Requirement ID: MTX-4506
// Test Name: Verify Reset Functionality

test.describe('Verify Reset Functionality', () => {
  const DEFAULT_SERVICE_LABEL = 'Select Service';

  test('should clear all entered values and reset service selection (MTX-4506)', async ({ page }) => {
    const meterPage = new MeterServicePage(page);

    await meterPage.open('/');
    await meterPage.waitForReady();

    // Step 1: Enter values and select service type
    await meterPage.enterElectricRead(450);
    await meterPage.enterGasRead(80);
    await meterPage.selectServiceTypeByLabel('Electric and Gas');

    // Expected Result after Step 1: Fields contain the entered data
    await expect.poll(async () => await meterPage.getElectricReadValue()).toBe('450');
    await expect.poll(async () => await meterPage.getGasReadValue()).toBe('80');
    await expect.poll(async () => await meterPage.getSelectedServiceTypeLabel()).toBe('Electric and Gas');

    // Step 2: Click Reset
    await meterPage.clickReset();

    // Expected Result after Step 2: Inputs cleared and service selection reset to default
    await expect.poll(async () => await meterPage.getElectricReadValue()).toBe('');
    await expect.poll(async () => await meterPage.getGasReadValue()).toBe('');
    await expect.poll(async () => await meterPage.getSelectedServiceTypeLabel()).toBe(DEFAULT_SERVICE_LABEL);
  });
});
