import { test, expect } from '@playwright/test';

class RateEstimatorResidentialPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';
    this.ctx = null; // Page or Frame containing the calculator
    this.serviceTypeDropdown = null; // Locator within ctx
    this.calculatorRoot = null; // Locator scoped to calculator container
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    // Allow dynamic widgets/iframes to load
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await this.acceptCookiesIfPresent();
  }

  async acceptCookiesIfPresent() {
    const cookieButton = this.page.locator('#onetrust-accept-btn-handler, #onetrust-accept-btn-handler + *');
    if (await cookieButton.first().isVisible().catch(() => false)) {
      await cookieButton.first().click({ timeout: 5000 }).catch(() => {});
    }
  }

  // Attempt to find the Service Type dropdown within a given context (Page or Frame)
  async findServiceTypeDropdownIn(ctx) {
    const namePatterns = [/^service\s*type$/i, /service\s*type/i, /service/i];
    for (const pattern of namePatterns) {
      const combo = ctx.getByRole('combobox', { name: pattern });
      if ((await combo.count()) > 0) {
        // Prefer a visible one if multiple
        const visible = combo.filter({ hasText: '' }).locator(':visible');
        if ((await visible.count()) > 0) {
          return visible.first();
        }
        return combo.first();
      }
      // Fallback to native select if role mapping isn't available
      const selectByLabel = ctx.getByLabel(pattern, { exact: false });
      if ((await selectByLabel.count()) > 0) {
        const visibleSelect = selectByLabel.locator(':visible');
        if ((await visibleSelect.count()) > 0) {
          return visibleSelect.first();
        }
        return selectByLabel.first();
      }
      const selectByName = ctx.locator('select[name*="service" i], select[id*="service" i]');
      if ((await selectByName.count()) > 0) {
        const visibleSelectByName = selectByName.locator(':visible');
        if ((await visibleSelectByName.count()) > 0) {
          return visibleSelectByName.first();
        }
        return selectByName.first();
      }
    }
    return null;
  }

  async resolveContext() {
    // 1) Try main page
    let dropdown = await this.findServiceTypeDropdownIn(this.page);
    if (dropdown) {
      this.ctx = this.page;
      this.serviceTypeDropdown = dropdown;
      await this._resolveCalculatorRoot();
      return;
    }

    // 2) Try frames (if calculator is embedded)
    const frames = this.page.frames().filter(f => f !== this.page.mainFrame());
    for (const frame of frames) {
      dropdown = await this.findServiceTypeDropdownIn(frame);
      if (dropdown) {
        this.ctx = frame;
        this.serviceTypeDropdown = dropdown;
        await this._resolveCalculatorRoot();
        return;
      }
    }

    // 3) Last resort: try first iframe via frameLocator
    const iframeLoc = this.page.frameLocator('iframe');
    if (await iframeLoc.count()) {
      const firstFrame = this.page.frames().find(f => f !== this.page.mainFrame());
      if (firstFrame) {
        dropdown = await this.findServiceTypeDropdownIn(firstFrame);
        if (dropdown) {
          this.ctx = firstFrame;
          this.serviceTypeDropdown = dropdown;
          await this._resolveCalculatorRoot();
          return;
        }
      }
    }

    throw new Error('Service Type dropdown not found in page or iframes.');
  }

  async _resolveCalculatorRoot() {
    // Attempt to find the nearest container around the Service Type control
    this.calculatorRoot = this.serviceTypeDropdown.locator(
      'xpath=ancestor::*[self::form or self::section or self::div][1]'
    );
    // If not resolvable, fallback to a broader container
    if ((await this.calculatorRoot.count()) === 0) {
      // Fallback to region containing "Rate Calculator/Estimator"
      const regionByHeading = (this.ctx || this.page)
        .getByRole('heading', { name: /rate\s*(calculator|estimator)/i })
        .first()
        .locator('xpath=ancestor::*[self::section or self::div][1]');
      if ((await regionByHeading.count()) > 0) {
        this.calculatorRoot = regionByHeading;
      } else {
        // Last fallback to context body
        this.calculatorRoot = (this.ctx || this.page).locator('body');
      }
    }
  }

  // Assertions for visibility and initial state
  async assertCalculatorVisible() {
    // Ensure root is visible
    await expect(this.calculatorRoot, 'Rate calculator section should be visible').toBeVisible({ timeout: 15000 });

    // Service Type dropdown should be visible
    await expect(this.serviceTypeDropdown, 'Service Type dropdown should be visible').toBeVisible();

    // There should be input fields visible (textboxes or numeric spinbuttons)
    const visibleInputs = this.calculatorRoot.locator(
      'input[type="text"]:visible, input[type="number"]:visible, textarea:visible, [role="textbox"]:visible, [role="spinbutton"]:visible'
    );
    const inputCount = await visibleInputs.count();
    expect(inputCount, 'Expected at least 1 visible input field in the calculator').toBeGreaterThanOrEqual(1);

    // There should be at least one actionable button (e.g., Calculate/Estimate)
    const visibleButtons = this.calculatorRoot.locator('button:visible, [role="button"]:visible');
    const buttonCount = await visibleButtons.count();
    expect(buttonCount, 'Expected at least 1 visible button in the calculator').toBeGreaterThanOrEqual(1);

    // Optionally verify presence of a heading related to the calculator
    const heading = (this.ctx || this.page).getByRole('heading', { name: /rate\s*(calculator|estimator)/i });
    if ((await heading.count()) > 0) {
      await expect(heading.first(), 'Rate calculator heading should be visible if present').toBeVisible();
    }
  }
}

test.describe('MTX-4506 - Verify Rate Calculator Visibility and Initial State', () => {
  test('Verify Rate Calculator Visibility and Initial State', async ({ page }) => {
    const rateEstimatorPage = new RateEstimatorResidentialPage(page);

    // Step 1: Navigate to the Rate Estimator Residential page
    await rateEstimatorPage.goto();

    // Resolve calculator context and perform assertions
    await rateEstimatorPage.resolveContext();

    // Expected Result: The rate calculator section is displayed with Service Type dropdown, input fields, and buttons
    await rateEstimatorPage.assertCalculatorVisible();
  });
});