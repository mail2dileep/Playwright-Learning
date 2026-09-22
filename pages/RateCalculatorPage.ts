import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  // Using direct locator instances as properties for better type inference and encapsulation
  readonly monthDropdown: Locator;
  readonly previousReadInput: Locator;
  readonly currentReadInput: Locator;
  readonly estimatedElectricUseInput: Locator;
  readonly estimatedGasUseInput: Locator;
  readonly electricServiceRadioButton: Locator;
  readonly electricAndGasServiceRadioButton: Locator;
  readonly howToReadYourBillButton: Locator;
  readonly howToFindUsageButton: Locator;
  readonly resetButton: Locator;
  readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators using recommendedLocator from the catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e'); // RecommendedLocator was locator('#e')
    this.electricAndGasServiceRadioButton = page.locator('#eg'); // RecommendedLocator was locator('#eg')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in Playwright config.
   * Will likely be called in a before block or directly in a test.
   */
  async navigateTo(): Promise<void> {
    // This assumes '/rate-calculator' is the path relative to the baseURL configured in playwright.config.ts
    await this.page.goto('/rate-calculator');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
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
   * Enters the estimated gas use value.
   * This field is typically enabled after selecting the Electric & Gas service type.
   * @param gasUseValue The estimated gas use value.
   */
  async enterEstimatedGasUse(gasUseValue: string): Promise<void> {
    await this.estimatedGasUseInput.fill(gasUseValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadioButton.click();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricAndGasServiceRadioButton.click();
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
   * Clicks the 'Reset' button to clear input fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button to compute estimated usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) value.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the currently selected month value from the dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the Electric service radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  /**
   * Checks if the Electric and Gas service radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricAndGasServiceSelected(): Promise<boolean> {
    return await this.electricAndGasServiceRadioButton.isChecked();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedGasUseEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }
}