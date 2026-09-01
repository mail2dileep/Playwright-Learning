import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe("Rate Calculator Functionality", () => {
  const BASE_URL = "http://localhost:3000/rate-calculator"; // Assuming a base URL for the application

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("should calculate electric bill correctly with electric service selected", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.selectMonth("m07"); // July
    await rateCalculatorPage.enterPreviousRead("1000");
    await rateCalculatorPage.enterCurrentRead("1500");
    await rateCalculatorPage.selectElectricService();
    await rateCalculatorPage.clickCalculate();

    // Assertions
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe("500"); // (1500 - 1000)
    expect(await rateCalculatorPage.isGasUsageFieldDisabled()).toBe(true);
    expect(await rateCalculatorPage.getSelectedMonth()).toBe("m07");
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe("1000");
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe("1500");
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);
  });

  test("should calculate electric and gas bill correctly with combined service selected", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.selectMonth("m08"); // August
    await rateCalculatorPage.enterPreviousRead("2000");
    await rateCalculatorPage.enterCurrentRead("2100");
    await rateCalculatorPage.selectElectricAndGasService();
    await rateCalculatorPage.clickCalculate();

    // Assertions
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe("100"); // (2100 - 2000)
    expect(await rateCalculatorPage.isGasUsageFieldDisabled()).toBe(false);
    // The application logic would determine the actual gas usage. This is a placeholder.
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe("50"); 
    expect(await rateCalculatorPage.getSelectedMonth()).toBe("m08");
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe("2000");
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe("2100");
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(false);
    expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(true);
  });

  test("should reset form fields to default values", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.selectMonth("m04"); // April
    await rateCalculatorPage.enterPreviousRead("123");
    await rateCalculatorPage.enterCurrentRead("456");
    await rateCalculatorPage.selectElectricAndGasService(); // Change service type

    await rateCalculatorPage.clickReset();

    // Assertions: All fields should revert to default values as per initial page state in catalog
    expect(await rateCalculatorPage.getSelectedMonth()).toBe("m06"); // Default month from catalog
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe("0"); // Default value from catalog
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe("0"); // Default value from catalog
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true); // Assuming Electric is the default selection after reset
    expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe("0"); // Default value from catalog
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe("0"); // Default value from catalog
    expect(await rateCalculatorPage.isGasUsageFieldDisabled()).toBe(true); // Should be disabled if electric is default
  });
});
