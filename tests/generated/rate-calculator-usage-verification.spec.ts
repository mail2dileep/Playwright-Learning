import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../../pages/RateCalculatorPage";

test.describe("Rate Calculator Functionality", () => {
  const BASE_URL = "http://localhost:3000/rate-calculator"; // Placeholder URL, adjust as needed

  test("should calculate electric usage correctly for 'Electric' service type", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.goto(BASE_URL);

    await rateCalculatorPage.calculateUsage('m07', '1000', '1500', 'Electric');

    const electricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
    const gasUsage = await rateCalculatorPage.getEstimatedGasUsage();

    // Assuming a simple calculation of Current Read - Previous Read for electric usage
    // Assuming gas usage remains '0' when only 'Electric' service is selected.
    await expect(electricUsage).toBe('500');
    await expect(gasUsage).toBe('0');
  });

  test("should calculate electric and gas usage correctly for 'ElectricAndGas' service type", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.goto(BASE_URL);

    await rateCalculatorPage.calculateUsage('m08', '2000', '2500', 'ElectricAndGas');

    const electricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
    const gasUsage = await rateCalculatorPage.getEstimatedGasUsage();

    // Assuming a simple calculation of Current Read - Previous Read for electric usage
    // Assuming a specific value for gas usage when 'ElectricAndGas' is selected (e.g., '250')
    await expect(electricUsage).toBe('500');
    await expect(gasUsage).toBe('250'); // Placeholder value, adjust based on actual application logic
  });

  test("should reset form fields when 'Reset' button is clicked", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.goto(BASE_URL);

    await rateCalculatorPage.selectMonth('m07');
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('200');
    await rateCalculatorPage.selectServiceType('Electric');

    // Verify fields have values before reset
    await expect(await rateCalculatorPage.previousReadInput.inputValue()).toBe('100');
    await expect(await rateCalculatorPage.currentReadInput.inputValue()).toBe('200');

    await rateCalculatorPage.clickReset();

    // Verify fields are reset (assuming reset sets them to '0' or empty based on application behavior)
    // The default current value for previous and current read is '0', as per the catalog.
    await expect(await rateCalculatorPage.previousReadInput.inputValue()).toBe('0');
    await expect(await rateCalculatorPage.currentReadInput.inputValue()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');
    // Month dropdown might revert to default 'm06' or first option
    await expect(await rateCalculatorPage.monthDropdown.inputValue()).toBe('m06');
  });
});