import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This field is disabled
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Returns the Locator for the 'Month' select dropdown.
   * This locator can be used by the test spec for visibility assertions
   * to confirm the presence of the Rate Calculator section, as it's a key element within it.
   * @returns Locator for the Month select dropdown.
   */
  getMonthSelectLocator(): Locator {
    return this.monthSelect;
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the service type radio button.
   * @param type 'Electric' or 'Electric & Gas'.
   */
  async selectServiceType(type: 'Electric' | 'Electric & Gas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'Electric & Gas') {
      await this.electricGasServiceRadio.check();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh).
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf). Note: This field is disabled.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    // As per requirements, do not interact with disabled elements unless prior step enables them.
    // This method is provided for completeness but should only be called if the field is expected to be enabled.
    if (await this.estimatedGasUseInput.isEnabled()) {
      return await this.estimatedGasUseInput.inputValue();
    }
    return ''; // Return empty string if disabled or not applicable
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the "How to Read Your Bill" button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadBillButton.click();
  }

  /**
   * Clicks the "How to Find Usage" button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}