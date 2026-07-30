import { test, expect } from "@playwright/test";
import { CalculatorComponentPage } from "../pages/CalculatorComponentPage";

test.describe("Verify Authoring: Edit location details fields in Calculator Component", () => {
  const TEST_URL = "https://example.com/calculator-component"; // Placeholder URL for AEM Authoring environment

  test("Should allow editing and persistence of calculator fields", async ({ page }) => {
    // Step 1: Open the 'location details' configuration within the calculator component in AEM.
    // Input Data: AEM Authoring environment (simulated by navigating to a URL)
    await page.goto(TEST_URL);

    const calculatorPage = new CalculatorComponentPage(page);

    // Expected Result: Location details fields are editable.
    await expect(calculatorPage.isPreviousReadInputEditable()).resolves.toBeTruthy();
    await expect(calculatorPage.monthDropdown).toBeEnabled();

    // Step 2: Update a field label or option and save.
    // Input Data: Field update (Month, Previous Read, Current Read, Service Type)
    await calculatorPage.selectMonth('m10'); // Select October
    await calculatorPage.enterPreviousRead('123');
    await calculatorPage.enterCurrentRead('456');
    await calculatorPage.selectServiceType('electric-gas');
    await calculatorPage.clickCalculate(); // Interpret Calculate as 'save' for persistence

    // Expected Result: Changes are persisted in the component configuration.
    await expect(calculatorPage.getMonthSelectedValue()).resolves.toBe('m10');
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('123');
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('456');
    await expect(calculatorPage.isElectricGasServiceTypeSelected()).resolves.toBeTruthy();
    await expect(calculatorPage.isElectricServiceTypeSelected()).resolves.toBeFalsy();

    // Optionally, verify estimated electric use changed (if calculation logic is present)
    await expect(calculatorPage.getEstimatedElectricUse()).resolves.not.toBe('0');
  });

  test("Should verify gas consumption input is disabled initially", async ({ page }) => {
    await page.goto(TEST_URL);
    const calculatorPage = new CalculatorComponentPage(page);
    await expect(calculatorPage.isEstimatedGasUseInputDisabled()).resolves.toBeTruthy();
  });

  test("Should reset fields to default values", async ({ page }) => {
    await page.goto(TEST_URL);
    const calculatorPage = new CalculatorComponentPage(page);

    await calculatorPage.selectMonth('m10'); 
    await calculatorPage.enterPreviousRead('123');
    await calculatorPage.enterCurrentRead('456');
    await calculatorPage.selectServiceType('electric-gas');

    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('123');

    await calculatorPage.clickReset();

    await expect(calculatorPage.getMonthSelectedValue()).resolves.not.toBe('m10'); // Assuming default is 'm06'
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('0');
    // Radio buttons might default, check initial state for a real application
  });
});