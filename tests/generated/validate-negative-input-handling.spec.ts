import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Adjust path as needed

test.describe('MTX-4506: Validate Negative Input Handling on Calculator', () => {
  const CALCULATOR_URL = 'https://www.example.com/calculator'; // Placeholder URL

  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.navigate(CALCULATOR_URL);
  });

  test('should display validation error for negative electric meter read', async () => {
    // Step 1: Enter a negative value in the 'Electric Meter Read' field.
    await calculatorPage.enterElectricMeterRead('-100');

    // Expected Result: The system should display a validation error or prevent calculation.
    // Note: Due to missing specific locators in the provided catalog for validation messages,
    // we are asserting for the presence of a generic error indicator or preventing input.
    // The actual error text assertion might need refinement once specific locators are available.

    // Assuming an error message becomes visible
    const isErrorVisible = await calculatorPage.isElectricMeterReadErrorVisible();
    expect(isErrorVisible).toBe(true, 'Expected validation error to be visible for negative electric meter read.');

    // Optional: If a specific error text is expected, uncomment and refine this line
    // const errorText = await calculatorPage.getElectricMeterReadErrorText();
    // expect(errorText).toContain('Invalid input', 'Expected specific validation error message.');
  });

  test('should display validation error for non-numeric gas meter read', async () => {
    // Step 2: Enter non-numeric characters in the 'Gas Meter Read' field.
    await calculatorPage.enterGasMeterRead('ABC');

    // Expected Result: The system should prevent non-numeric input or show a validation error.
    // Similar to the previous test, assertions are based on the visibility of an error message
    // or the system preventing the non-numeric input (which might mean the field remains empty
    // or changes its value).

    const isErrorVisible = await calculatorPage.isGasMeterReadErrorVisible();
    expect(isErrorVisible).toBe(true, 'Expected validation error to be visible for non-numeric gas meter read.');

    // Optional: If a specific error text is expected, uncomment and refine this line
    // const errorText = await calculatorPage.getGasMeterReadErrorText();
    // expect(errorText).toContain('Numeric input required', 'Expected specific validation error message.');

    // Additional check if the system 'prevents' input by clearing/resetting the field
    // const fieldValue = await calculatorPage.gasMeterReadField.inputValue(); // This would expose locator directly, breaking POM. Rephrase if needed.
    // expect(fieldValue).not.toContain('ABC'); // If the field is expected to clear non-numeric input
  });
});