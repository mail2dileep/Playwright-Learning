import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path from tests/generated to pages

test.describe('MTX-4278: Rate Calculator Component Authoring - Add/Edit Component', () => {

  // This URL is a placeholder. In a real AEM environment, it would be the URL to
  // an AEM page in edit mode where the Rate Calculator component is present or can be added.
  const AEM_AUTHORING_PAGE_URL = 'https://your-aem-instance/editor.html/content/your-site/en/home/test-page-with-calculator';

  test('should allow an author to configure the Rate Calculator component and view changes', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Log into AEM and open a page in edit mode.
    // Step 2: Add the Rate Calculator component to a parsys.
    // NOTE: The provided locators are *internal* to the Rate Calculator component.
    // AEM login and component addition are outside the scope of these specific locators.
    // We simulate by navigating directly to a page where the component is assumed to be ready for interaction.
    await test.step('Navigate to the AEM authoring page with the Rate Calculator component', async () => {
      await rateCalculatorPage.navigateTo(AEM_AUTHORING_PAGE_URL);
      // A real test would include assertions for successful AEM login and editor readiness.
      await expect(page).toHaveTitle(/.*Test Page With Calculator.*|.*Editor.*/);
    });

    await test.step("Step 3: Open the component dialog and edit 'location details' (interpret as configuring calculator inputs)", async () => {
      // Input Data: New location text (interpreted as new month, meter reads, and service type)
      const desiredMonth = 'm07'; // July
      const previousReadValue = '1000';
      const currentReadValue = '1250';
      const serviceType = 'Electric'; // As an example

      await rateCalculatorPage.configureCalculatorDetails(
        desiredMonth,
        previousReadValue,
        currentReadValue,
        serviceType
      );

      // Expected Result: Changes are saved and reflected in the component.
      // Verify that the input fields reflect the entered values.
      await expect(rateCalculatorPage.monthSelect).toHaveValue(desiredMonth);
      await expect(rateCalculatorPage.previousReadInput).toHaveValue(previousReadValue);
      await expect(rateCalculatorPage.currentReadInput).toHaveValue(currentReadValue);
      await expect(rateCalculatorPage.electricServiceRadio).toBeChecked();

      // For 'Electric' service type, the 'Estimated Gas use (Ccf):' field should be disabled.
      await expect(rateCalculatorPage.estimatedGasUseInput).toBeDisabled();

      // Click calculate to see the effect of the changes.
      await rateCalculatorPage.clickCalculate();

      // Assert that the Estimated Electric use field is visible and contains a calculated value (not zero or empty).
      // Specific calculated values are not provided in the requirements, so we verify presence and non-zero value.
      await expect(rateCalculatorPage.estimatedElectricUseInput).toBeVisible();
      await expect(rateCalculatorPage.estimatedElectricUseInput).not.toHaveValue('0');
      await expect(rateCalculatorPage.estimatedElectricUseInput).not.toHaveValue('');
    });

    // Optional: Verify reset functionality for completeness
    await test.step('Verify component can be reset', async () => {
      await rateCalculatorPage.clickReset();
      // Assertions to ensure fields return to their default initial values as per catalog
      await expect(rateCalculatorPage.monthSelect).toHaveValue('m06'); // Initial value from catalog
      await expect(rateCalculatorPage.previousReadInput).toHaveValue('0'); // Initial value from catalog
      await expect(rateCalculatorPage.currentReadInput).toHaveValue('0'); // Initial value from catalog
      await expect(rateCalculatorPage.electricServiceRadio).toBeChecked(); // Default service type 'E'
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0'); // Should reset to 0
    });
  });
});