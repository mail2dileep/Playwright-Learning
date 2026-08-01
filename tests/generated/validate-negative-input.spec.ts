import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Negative Input Validation', () => {
  // Assuming a base URL for the application's rate calculator page
  const PAGE_URL = '/rate-calculator'; 

  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test using the Page Object
    const rateCalculatorPage = new RateCalculatorPage(page);
    // For local development, ensure base URL is configured in playwright.config.ts
    // e.g., baseURL: 'http://localhost:3000'
    await rateCalculatorPage.navigateTo(PAGE_URL);
  });

  test('should prevent non-numeric input in Electric Meter Read field', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Enter alphabetic characters into the Electric Meter Read field.
    // Input Data: Electric Meter Read: ABC
    const invalidInput = 'ABC';
    await rateCalculatorPage.enterPreviousMeterRead(invalidInput);

    // Expected Result: System displays a validation error message or prevents non-numeric entry.
    // Since no specific error message locator for validation is provided in the catalog,
    // we verify that the field prevents the entry of non-numeric characters.
    // The 'Enter Previous Read:' field's catalog entry has 'currentValue: "0"'.
    // If it prevents non-numeric input, the value should either remain '0' or become empty,
    // but definitively not contain the invalid alphabetic string 'ABC'.
    const actualValue = await rateCalculatorPage.getPreviousMeterReadValue();

    // Assert that the field's value is NOT the invalid input.
    expect(actualValue).not.toBe(invalidInput); 
    
    // A stronger assertion, assuming the field reverts to its default numeric value '0'
    // or cleans up to '0' if non-numeric input is prevented.
    expect(actualValue).toBe('0'); 
  });
});
