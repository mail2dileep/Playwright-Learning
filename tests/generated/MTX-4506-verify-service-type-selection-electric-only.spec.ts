import { test, expect } from '@playwright/test';

class ServiceSetupPage {
  constructor(page) {
    this.page = page;
  }

  route() {
    return process.env.SERVICE_SETUP_ROUTE || '/service-setup';
  }

  async goto(baseURL) {
    const explicitUrl = process.env.SERVICE_SETUP_URL;
    if (explicitUrl) {
      await this.page.goto(explicitUrl);
      return;
    }
    if (baseURL) {
      const url = new URL(this.route(), baseURL).toString();
      await this.page.goto(url);
      return;
    }
    await this.page.goto(`http://localhost:3000${this.route()}`);
  }

  async selectServiceType(value) {
    const dropdown = await this.getServiceTypeLocator();
    try {
      await dropdown.selectOption({ label: value });
    } catch {
      await dropdown.click();
      const option = this.page.getByRole('option', { name: new RegExp(`^${escapeRegex(value)}$`, 'i') });
      if (await option.count()) {
        await option.first().click();
      } else {
        // Fallback to clicking by text inside a listbox/menu
        await this.page.locator(`text=${value}`).first().click();
      }
    }
  }

  async expectElectricFieldVisible() {
    const electric = await this.getElectricMeterReadLocator();
    await expect(electric, 'Electric Meter Read field should be visible').toBeVisible();
  }

  async expectGasFieldHiddenOrDisabled() {
    const gas = await this.getGasMeterReadLocator();
    await expect
      .poll(async () => {
        const count = await gas.count();
        if (count === 0) return true; // Not present => treated as hidden
        const visible = await gas.isVisible().catch(() => false);
        if (!visible) return true; // Hidden
        // Visible: ensure disabled
        const enabled = await gas.isEnabled().catch(() => false);
        return !enabled;
      }, { message: 'Gas Meter Read must be hidden or disabled' })
      .toBe(true);
  }

  async getServiceTypeLocator() {
    return this.findFirstPresent([
      this.page.getByTestId('service-type'),
      this.page.getByLabel(/service type/i),
      this.page.getByRole('combobox', { name: /service type/i }),
      this.page.locator('select[name="serviceType"]'),
    ]);
  }

  async getElectricMeterReadLocator() {
    return this.findFirstPresent([
      this.page.getByTestId('electric-meter-read'),
      this.page.getByLabel(/electric meter read/i),
      this.page.locator('input[name="electricMeterRead"]'),
      this.page.getByRole('textbox', { name: /electric meter read/i }),
    ]);
  }

  async getGasMeterReadLocator() {
    return this.findFirstPresent([
      this.page.getByTestId('gas-meter-read'),
      this.page.getByLabel(/gas meter read/i),
      this.page.locator('input[name="gasMeterRead"]'),
      this.page.getByRole('textbox', { name: /gas meter read/i }),
    ]);
  }

  async findFirstPresent(locators) {
    for (const locator of locators) {
      if ((await locator.count()) > 0) {
        return locator;
      }
    }
    // Return the first as a best-effort locator if none are present (assertions will handle visibility)
    return locators[0];
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('MTX-4506 - Verify Service Type Selection - Electric Only', () => {
  test('Verify Service Type Selection - Electric Only', async ({ page, baseURL }) => {
    // Priority: High
    const servicePage = new ServiceSetupPage(page);

    await servicePage.goto(baseURL);

    // Step 1: Select 'Electric only' from the Service Type dropdown
    await servicePage.selectServiceType('Electric only');

    // Expected Results:
    // - 'Electric Meter Read' is visible
    // - 'Gas Meter Read' is hidden or disabled
    await servicePage.expectElectricFieldVisible();
    await servicePage.expectGasFieldHiddenOrDisabled();
  });
});