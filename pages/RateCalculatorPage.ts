import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
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
    this.electricOnlyServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page. Assumes base URL is configured in Playwright config.
   * @param path The relative path to the rate calculator. E.g., '/calculator'
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric Only' service type radio button.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyServiceRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  /**
   * Clicks the 'Calculate' button to compute estimated usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all input fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value from the estimated electric use field.
   * @returns A promise that resolves to the string value of the estimated electric use.
   */
  async getEstimatedElectricUseValue(): Promise<string | null> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the previous meter read field.
   * @returns A promise that resolves to the string value of the previous meter read.
   */
  async getPreviousReadValue(): Promise<string | null> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the current meter read field.
   * @returns A promise that resolves to the string value of the current meter read.
   */
  async getCurrentReadValue(): Promise<string | null> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected value from the month dropdown.
   * @returns A promise that resolves to the string value of the selected month.
   */
  async getSelectedMonthValue(): Promise<string | null> {
    return this.monthDropdown.evaluate((el: HTMLSelectElement) => el.value);
  }

  /**
   * Retrieves the estimated gas use field's state (e.g., for disabled check).
   * @returns A promise that resolves to the Locator for the estimated gas use field.
   */
  getEstimatedGasUseLocator(): Locator {
    return this.estimatedGasUseInput;
  }
}
