import { Page, Locator } from "@playwright/test";

export class CalculatorPage {
  private readonly page: Page;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly calculateButton: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly monthDropdown: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Enters a value into the previous meter read field.
   * @param value The value to enter.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the current meter read field.
   * @param value The value to enter.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Returns the Locator for the Previous Read input field.
   * Useful for assertions in the test spec.
   * @returns The Locator object for the previous read input.
   */
  getPreviousReadInputLocator(): Locator {
    return this.previousReadInput;
  }

  /**
   * Returns the Locator for the Current Read input field.
   * Useful for assertions in the test spec.
   * @returns The Locator object for the current read input.
   */
  getCurrentReadInputLocator(): Locator {
    return this.currentReadInput;
  }

  /**
   * Returns the Locator for the Estimated Electric use output field.
   * Useful for assertions in the test spec.
   * @returns The Locator object for the estimated electric use output.
   */
  getEstimatedElectricUseOutputLocator(): Locator {
    return this.estimatedElectricUseOutput;
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
