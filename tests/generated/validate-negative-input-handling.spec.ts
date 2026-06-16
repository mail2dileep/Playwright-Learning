import { test, expect } from '@playwright/test';
import { MeterReadPage } from '../../pages/MeterReadPage';

// Requirement ID: MTX-4506
// Test Name: Validate Negative Input Handling
// Objective: Verify system behavior when invalid/negative values are entered in meter read fields

test.describe('MTX-4506 - Validate Negative Input Handling', () => {
  test('Validate Negative Input Handling', async ({ page }) => {
    const meterReadPage = new MeterReadPage(page);

    await meterReadPage.goto();

    // Step 1: Enter a negative value in the Electric Meter Read field
    await meterReadPage.enterElectricMeterRead(-100);
    await meterReadPage.blurElectricField();

    const electricErrorMsg = await meterReadPage.getElectricErrorMessage();
    const calcDisabledAfterElectric = await meterReadPage.isCalculateDisabled();

    // Expect: System displays an error message OR prevents calculation
    expect(Boolean(electricErrorMsg && electricErrorMsg.trim().length > 0) || calcDisabledAfterElectric).toBeTruthy();

    // Step 2: Enter non-numeric characters in the Gas Meter Read field
    await meterReadPage.enterGasMeterRead('ABC');
    await meterReadPage.blurGasField();

    const gasErrorMsg = await meterReadPage.getGasErrorMessage();
    const gasValue = await meterReadPage.getGasMeterReadValue();
    const calcDisabledAfterGas = await meterReadPage.isCalculateDisabled();

    // Determine if non-numeric entry was prevented (value should be empty or contain no letters)
    const preventsNonNumeric = gasValue === '' || !/[A-Za-z]/.test(gasValue);

    // Expect: System prevents entry OR displays a validation error
    expect(Boolean(gasErrorMsg && gasErrorMsg.trim().length > 0) || preventsNonNumeric || calcDisabledAfterGas).toBeTruthy();
  });
});
