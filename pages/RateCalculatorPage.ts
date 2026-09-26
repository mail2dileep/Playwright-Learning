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
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // This is disabled according to catalog
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in Playwright config.
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/rate-calculator'); // Placeholder for specific URL
  }

  /**
   * Verifies that key elements of the rate calculator page are visible.
   * This can be used as a page load check.
   */
  async isPageLoaded(): Promise<boolean> {
    await this.monthDropdown.waitFor({ state: 'visible' });
    await this.previousReadInput.waitFor({ state: 'visible' });
    return (await this.monthDropdown.isVisible()) && (await this.previousReadInput.isVisible());
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
   * @param readValue The previous meter read as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  /**
   * Clicks the 'Calculate' button to perform the rate calculation.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the form.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value from the Estimated Electric use (kWh) input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the Estimated Gas use (Ccf) input field.
   * Note: This field is disabled by default according to the catalog.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the Estimated Gas use (Ccf) input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return (await this.estimatedGasUseInput.isDisabled());
  }

  /**
   * Retrieves the currently selected month value from the dropdown.
   * @returns The value attribute of the selected month.
   */
  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the value from the 'Enter Previous Read:' input field.
   * @returns The current value of the previous read input.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Enter Current Read:' input field.
   * @returns The current value of the current read input.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Performs a complete calculation workflow for electric service.
   * @param monthValue The value attribute of the month option (e.g., 'm06').
   * @param previousRead The previous meter read as a string.
   * @param currentRead The current meter read as a string.
   */
  async calculateElectricUsage(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricService();
    await this.clickCalculate();
  }

  /**
   * Performs a complete calculation workflow for electric and gas service.
   * @param monthValue The value attribute of the month option (e.g., 'm06').
   * @param previousRead The previous meter read as a string.
   * @param currentRead The current meter read as a string.
   */
  async calculateElectricAndGasUsage(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricAndGasService();
    await this.clickCalculate();
  }
}