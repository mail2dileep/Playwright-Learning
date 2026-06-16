import { test, expect } from '@playwright/test';
import { ServiceTypePage } from '../../pages/ServiceTypePage';

// Requirement ID: MTX-4506
// Test Name: Verify Service Type Selection - Electric Only

test.describe('MTX-4506 - Verify Service Type Selection - Electric Only', () => {
  test('Validate that selecting Electric only enables the correct input fields', async ({ page }) => {
    const serviceTypePage = new ServiceTypePage(page);

    await test.step('Navigate to Service Setup page', async () => {
      await serviceTypePage.open();
    });

    await test.step("Select 'Electric only' from Service Type dropdown", async () => {
      await serviceTypePage.selectServiceType('Electric only');
    });

    await test.step("Assert 'Electric Meter Read' is enabled", async () => {
      const isElectricEnabled = await serviceTypePage.isElectricMeterReadEnabled();
      expect(isElectricEnabled).toBe(true);
    });

    await test.step("Assert 'Gas Meter Read' is disabled or hidden", async () => {
      const isGasDisabledOrHidden = await serviceTypePage.isGasMeterReadDisabledOrHidden();
      expect(isGasDisabledOrHidden).toBe(true);
    });
  });
});
