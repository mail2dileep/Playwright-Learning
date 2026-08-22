import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e'); // radioGroup: servicetype, currentValue: E
    this.electricAndGasServiceRadio = page.locator('#eg'); // radioGroup: servicetype, currentValue: EG
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous meter read input field.
   * @param readValue The previous meter read value.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters a value into the current meter read input field.
   * @param readValue The current meter read value.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric Only' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
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
   * Retrieves the estimated electric use value.
   * @returns The string value of estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value.
   * @returns The string value of estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    // This field is disabled, so we only retrieve its value, not interact.
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Navigates to the rate calculator page.
   * Note: The base URL should be configured in Playwright config.
   * Assuming a specific path for the calculator.
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/rate-calculator'); // Placeholder path
  }

  /**
   * Verifies the month dropdown's current selected value.
   * @returns The value attribute of the currently selected option.
   */
  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Verifies the previous read input's current value.
   * @returns The value attribute of the input.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Verifies the current read input's current value.
   * @returns The value attribute of the input.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Checks if the Electric Service radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the Electric and Gas Service radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricAndGasServiceSelected(): Promise<boolean> {
    return await this.electricAndGasServiceRadio.isChecked();
  }
}