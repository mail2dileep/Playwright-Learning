import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Encapsulate all locators using recommendedLocator or best available per rules
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in playwright.config.ts.
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The value to enter.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousMeterReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The value to enter.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentMeterReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceTypeRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricAndGasServiceTypeRadio.check();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Gets the estimated electric use value from the input field.
   * @returns The string value of estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use value from the input field.
   * @returns The string value of estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated electric use input is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedElectricUseEnabled(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isEnabled();
  }

  /**
   * Checks if the estimated gas use input is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Gets the currently selected month value from the dropdown.
   * @returns The value attribute of the selected option.
   */
  async getSelectedMonthValue(): Promise<string> {
      return await this.monthDropdown.inputValue();
  }

  /**
   * Gets the value from the previous meter read input field.
   * @returns The string value of the input.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  /**
   * Gets the value from the current meter read input field.
   * @returns The string value of the input.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
      return await this.electricServiceTypeRadio.isChecked();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricAndGasServiceTypeSelected(): Promise<boolean> {
      return await this.electricAndGasServiceTypeRadio.isChecked();
  }
}
