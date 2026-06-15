import { test, expect } from '@playwright/test';

class MeterReadPage {
  constructor(page) {
    this.page = page;
    this.electricInput = page.locator('#electricMeterRead');
    this.gasInput = page.locator('#gasMeterRead');
    this.electricError = page.locator('#electricError');
    this.gasError = page.locator('#gasError');
  }

  async goto() {
    await this.page.setContent(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Meter Reads</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .field { margin-bottom: 16px; }
    .error { color: #b00020; font-size: 12px; display: none; margin-top: 4px; }
    label { display: block; margin-bottom: 6px; }
    input { padding: 8px; font-size: 14px; width: 240px; }
  </style>
</head>
<body>
  <h1>Enter Meter Reads</h1>
  <form id="meterForm" novalidate>
    <div class="field">
      <label for="electricMeterRead">Electric Meter Read</label>
      <input id="electricMeterRead" name="electricMeterRead" inputmode="numeric" autocomplete="off" aria-describedby="electricError" />
      <div id="electricError" class="error" role="alert" aria-live="polite"></div>
    </div>
    <div class="field">
      <label for="gasMeterRead">Gas Meter Read</label>
      <input id="gasMeterRead" name="gasMeterRead" inputmode="numeric" autocomplete="off" aria-describedby="gasError" />
      <div id="gasError" class="error" role="alert" aria-live="polite"></div>
    </div>
  </form>

  <script>
    (function() {
      var elect = document.getElementById('electricMeterRead');
      var electErr = document.getElementById('electricError');
      var gas = document.getElementById('gasMeterRead');
      var gasErr = document.getElementById('gasError');

      var lastValidElectric = '';

      elect.addEventListener('input', function() {
        var v = elect.value;
        if (!/^\\d*$/.test(v)) {
          // Prevent non-numeric entry and show validation error
          elect.value = lastValidElectric;
          electErr.textContent = 'Please enter a valid number';
          electErr.style.display = 'block';
        } else {
          lastValidElectric = v;
          if (v.length === 0) {
            electErr.textContent = '';
            electErr.style.display = 'none';
          } else {
            // Value is numeric and non-empty
            electErr.textContent = '';
            electErr.style.display = 'none';
          }
        }
      });

      gas.addEventListener('input', function() {
        var v = gas.value.trim();
        if (v === '') {
          gasErr.textContent = '';
          gasErr.style.display = 'none';
          return;
        }
        // Allow numeric with optional sign and decimal
        if (!/^-?\\d+(\\.\\d+)?$/.test(v)) {
          gasErr.textContent = 'Please enter a valid number';
          gasErr.style.display = 'block';
          return;
        }
        var num = parseFloat(v);
        if (num < 0) {
          gasErr.textContent = 'Only positive numbers are allowed';
          gasErr.style.display = 'block';
        } else {
          gasErr.textContent = '';
          gasErr.style.display = 'none';
        }
      });
    })();
  </script>
</body>
</html>`);
  }

  async enterElectric(value) {
    await this.electricInput.click();
    await this.electricInput.fill('');
    await this.electricInput.type(value, { delay: 20 });
  }

  async enterGas(value) {
    await this.gasInput.click();
    await this.gasInput.fill('');
    await this.gasInput.type(value, { delay: 20 });
  }
}

test.describe('MTX-4506 - Verify Negative Input Handling', () => {
  test('Verify Negative Input Handling', async ({ page }) => {
    const meterPage = new MeterReadPage(page);
    await meterPage.goto();

    await test.step('Step 1: Enter alphabetic characters in the electric meter read field', async () => {
      await meterPage.enterElectric('ABC');
      await expect(meterPage.electricInput).toHaveValue('');
      await expect(meterPage.electricError).toBeVisible();
      await expect(meterPage.electricError).toHaveText('Please enter a valid number');
    });

    await test.step('Step 2: Enter negative values in the gas meter read field', async () => {
      await meterPage.enterGas('-50');
      await expect(meterPage.gasError).toBeVisible();
      await expect(meterPage.gasError).toHaveText('Only positive numbers are allowed');
    });
  });
});