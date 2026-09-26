import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe("Rate Calculator Functionality", () => {
  const CALCULATOR_PATH = "/calculator"; // Assuming a path to the calculator page

  test("should successfully calculate and reset meter readings", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // 1. Navigate to the calculator page
    await rateCalculatorPage.navigateTo(CALCULATOR_PATH);
    await expect(page).toHaveURL(new RegExp(CALCULATOR_PATH));

    // 2. Select July from the month dropdown
    await rateCalculatorPage.selectMonth("m07");
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe("m07");

    // 3. Enter previous and current meter reads
    const previousRead = "1000";
    const currentRead = "1500";
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe(previousRead);
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe(currentRead);

    // 4. Select 'Electric Only' service type
    await rateCalculatorPage.selectServiceTypeElectricOnly();
    // Verify estimated gas use is disabled as per locator catalog
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeDisabled();

    // 5. Click calculate button
    await rateCalculatorPage.clickCalculate();

    // 6. Verify estimated electric use (assuming current - previous)
    const expectedElectricUse = String(parseInt(currentRead) - parseInt(previousRead));
    await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe(expectedElectricUse);

    // 7. Click reset button
    await rateCalculatorPage.clickReset();

    // 8. Verify all fields are reset to initial values
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe("0");
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe("0");
    // Initial value for month is 'm06' (June) as per locator catalog
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe("m06");
    await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe("0");
  });

  test("should allow selecting Electric and Gas service type", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.navigateTo(CALCULATOR_PATH);
    await rateCalculatorPage.selectServiceTypeElectricGas();

    // After selecting EG, estimated gas use should be enabled (assuming this enables it)
    // Note: Locator catalog shows gasconsumption is disabled, but interaction suggests it should become enabled.
    // We'll assert for it NOT to be disabled, or to be enabled if the UI logic supports it.
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeEnabled();
    // A realistic test would then enter gas readings and calculate.
  });
});
