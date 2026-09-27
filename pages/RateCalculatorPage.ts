import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(private page: Page) {
    // Locators for elements within the 'calculator_current' container
    // Month dropdown: getByLabel('Month')
    this.monthDropdown = page.getByLabel('Month');
    // Previous Read input: getByLabel('Enter Previous Read:')
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    // Current Read input: getByLabel('Enter Current Read:')
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    // Estimated Electric use (kWh) input: getByLabel('Estimated Electric use (kWh):')
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    // Electric service type radio button: locator('#e')
    this.electricServiceTypeRadio = page.locator('#e');
    // Electric and Gas service type radio button: locator('#eg')
    this.electricGasServiceTypeRadio = page.locator('#eg');
    // Calculate button: locator('#validateMoveInBtn')
    this.calculateButton = page.locator('#validateMoveInBtn');
    // Reset button: locator('#rateCalCancelBtn')
    this.resetButton = page.locator('#rateCalCancelBtn');
    // How to Read Your Bill button: locator('#howToReadYourBillBtn')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    // How to Find Usage button: locator('#howToFindUsageBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
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
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceTypeRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.electricGasServiceTypeRadio.check();
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
   * @returns A promise that resolves to the estimated electric use value as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }
}