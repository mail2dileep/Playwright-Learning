import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('MTX-4506: Verify Negative Input Handling for Meter Reads', () => {

  test('should handle non-numeric input and display validation for empty fields', async ({ page }) => {
    // Assuming the test starts on the calculator page or navigates there.
    // If navigation is required, uncomment and modify the line below:
    // await page.goto('/your/calculator/path'); 

    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Enter non-numeric characters into the 'Electric Meter Read' field.
    // Input Data: Electric Meter Read: ABC
    await test.step('Enter non-numeric characters into Previous Read field', async () => {
      await calculatorPage.enterPreviousRead('ABC');
      
      // Expected Result: The system should either prevent entry or display a validation error message.
      // Since a specific validation error message locator is not provided, we verify that
      // the input field's value does not remain 'ABC', implying prevention or resetting to default.
      const previousReadValue = await calculatorPage.getPreviousReadValue();
      expect(previousReadValue).not.toBe('ABC');
      // Assuming the system defaults to '0' if invalid input is not accepted.
      expect(previousReadValue).toBe('0'); 
    });

    // Step 2: Click 'Calculate' with empty fields.
    // (Note: 'Current Read' field would typically still be at its default '0' and no valid 'Previous Read' set)
    await test.step('Click Calculate with invalid/empty fields', async () => {
      await calculatorPage.clickCalculate();
      
      // Expected Result: The system displays a validation message indicating that fields are required.
      // Since no specific validation message locator is provided in the catalog,
      // we verify that the calculation did not proceed by checking the output field.
      // 'Estimated Electric use' should remain at its default '0'.
      const estimatedElectricUse = await calculatorPage.getEstimatedElectricUseValue();
      expect(estimatedElectricUse).toBe('0');

      // Optionally, verify the Calculate button remains enabled, implying client-side validation failed
      // and the form was not successfully submitted or navigated away.
      expect(await calculatorPage.isCalculateButtonEnabled()).toBe(true);
    });
  });
});
