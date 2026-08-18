import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;

  // Encapsulate all locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This is disabled.
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read value.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read value.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Enters the estimated electric use (kWh) value.
   * This method is used to 'update the Electric fuel pricing values' as per test steps.
   * @param value The estimated electric use value.
   */
  async enterEstimatedElectricUse(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Attempts to enter the estimated gas use (Ccf) value.
   * NOTE: The 'Estimated Gas use (Ccf)' field is marked as disabled in the locator catalog.
   * This action will likely fail or have no effect if the field remains disabled.
   * @param value The estimated gas use value.
   */
  async enterEstimatedGasUse(value: string): Promise<void> {
    // This element is reported as disabled in the locator catalog.
    // Interaction might be disallowed or not have effect.
    // If a prior action enables it, this method could then be used.
    // As per rules, not to interact with disabled elements unless prior step enables.
    // Therefore, this method is provided but its usage in the test spec will be noted.
    await this.estimatedGasUseInput.fill(value);
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the current value of the estimated electric use input field.
   * @returns The current value of the estimated electric use input field.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the current value of the estimated gas use input field.
   * NOTE: The 'Estimated Gas use (Ccf)' field is marked as disabled in the locator catalog.
   * Its value might not be retrievable or meaningful if disabled.
   * @returns The current value of the estimated gas use input field.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }
}
