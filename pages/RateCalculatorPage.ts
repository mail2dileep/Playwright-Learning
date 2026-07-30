import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadField: Locator;
  private readonly currentMeterReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadField = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    // Note: Estimated Gas use (Ccf) field is initially disabled per catalog data.
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e'); // For 'Electric' service type
    this.electricGasServiceTypeRadio = page.locator('#eg'); // For 'Electric and Gas' service type
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceTypeRadio.click();
  }

  /**
   * Enters a value into the previous meter read field.
   * @param value The numeric value to enter.
   */
  async enterPreviousMeterRead(value: string): Promise<void> {
    await this.previousMeterReadField.fill(value);
  }

  /**
   * Enters a value into the current meter read field.
   * @param value The numeric value to enter.
   */
  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentMeterReadField.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the current value from the estimated electric use field.
   * @returns The value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseField.inputValue();
  }

  /**
   * Checks if the estimated gas use field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedGasUseField.isEnabled();
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Gets the selected month from the month dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }
}
