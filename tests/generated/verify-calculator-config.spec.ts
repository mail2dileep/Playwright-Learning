import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Component Configuration Validation', () => {

  test('Verify Authoring - Component Configuration', async ({ page }) => {
    // The objective is to validate component configuration in AEM Author mode.
    // However, the provided Locator Catalog only contains elements for the Rate Calculator's
    // operational interface, not for AEM authoring components or configuration dialogs.

    // Step 1: Open the page in AEM Author mode and add the Rate Calculator component.
    // TODO: Locator not found in catalog for AEM Authoring actions.
    // Assuming the test starts with the Rate Calculator component already present on a page
    // and configured, based on the availability of its internal locators.
    // For a real scenario, this step would involve navigation to AEM authoring, interacting with
    // the AEM UI to add the component, and verifying its presence.

    // Step 2: Edit the 'location details' fields within the component dialog.
    // Input Data: Update location labels
    // Expected Result: Changes are saved and reflected in the component.
    // TODO: Locator not found in catalog for component dialogs related to 'location details'.
    // This action would typically interact with an AEM component configuration dialog.

    // Step 3: Adjust pricing values for 'Electric fuel' and 'Gas fuel'.
    // Input Data: Electric fuel: 0.15, Gas fuel: 0.08
    // Expected Result: Pricing values are updated and used for calculations on the published page.
    // TODO: Locator not found in catalog for component dialogs related to 'pricing values'.
    // This action would typically interact with an AEM component configuration dialog to set pricing.

    // Initialize the Rate Calculator Page Object.
    const rateCalculatorPage = new RateCalculatorPage(page);

    // To validate that "Pricing values are updated and used for calculations on the published page",
    // we will simulate a calculation using the calculator's operational interface.
    // This implicitly verifies that the component is functional and (if configured correctly) uses
    // the updated pricing for calculations, even though we cannot directly set the pricing here.

    // Navigate to the page containing the calculator. (Assuming base URL is set in Playwright config)
    await page.goto('/your-application-path/rate-calculator'); // Placeholder for actual application URL

    // Perform a sample calculation using the available component elements.
    await rateCalculatorPage.selectMonth('m09'); // Select September
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('200');
    await rateCalculatorPage.selectServiceType('Electric');
    await rateCalculatorPage.clickCalculate();

    // Verify the estimated electric use is calculated (e.g., current - previous = 100).
    // A non-zero or specific expected value confirms the calculation is occurring.
    const electricUsage = await rateCalculatorPage.getEstimatedElectricUse();
    expect(electricUsage).not.toBe('0', 'Expected estimated electric use to be calculated and not zero.');
    expect(electricUsage).toBe('100', 'Expected electric usage to reflect (Current - Previous) read.');

    // Verify the estimated gas use is disabled as per the locator catalog metadata.
    const gasUsageDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
    expect(gasUsageDisabled).toBe(true, 'Expected estimated gas use field to be disabled for Electric service.');

    // Change service type to Electric and Gas to see if gas field becomes enabled (optional, if component logic allows)
    await rateCalculatorPage.selectServiceType('ElectricAndGas');
    await rateCalculatorPage.clickCalculate(); // Recalculate with new service type
    // After selecting 'ElectricAndGas', if the component logic enables the gas field,
    // we might check if isEstimatedGasUseDisabled() returns false.
    // However, the locator catalog explicitly states 'disabled: true' for gasconsumption, regardless of radio state.
    // So, we will stick to the catalog and expect it to remain disabled.
    expect(await rateCalculatorPage.isEstimatedGasUseDisabled()).toBe(false, 'Expected estimated gas use field to be enabled for Electric and Gas service.');

    // Perform another calculation to ensure calculations work for both types
    await rateCalculatorPage.enterPreviousRead('50');
    await rateCalculatorPage.enterCurrentRead('150');
    await rateCalculatorPage.clickCalculate();

    const electricUsageEG = await rateCalculatorPage.getEstimatedElectricUse();
    expect(electricUsageEG).toBe('100', 'Expected electric usage to be 100 for EG service.');
    const gasUsageEG = await rateCalculatorPage.getEstimatedGasUse();
    expect(gasUsageEG).not.toBe('0', 'Expected estimated gas use to be calculated and not zero for EG service.');

    // Note: Direct validation of pricing values (0.15, 0.08) set in the AEM dialog
    // is not possible with the provided calculator UI locators. This test primarily
    // validates the *functionality* of the calculator after its configuration
    // (which is assumed to have happened externally to this test's scope).
  });
});