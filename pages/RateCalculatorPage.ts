import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators for input fields
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;

  // Locators for service type radio buttons
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;

  // Locators for action buttons
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  // Locators for output/display fields
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator; // Note: catalog indicates this is disabled by default

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month'); // id: gMonth1
    this.previousReadInput = page.getByLabel('Enter Previous Read:'); // id: eMeterRead
    this.currentReadInput = page.getByLabel('Enter Current Read:'); // id: eMeterNewRead
    this.electricServiceRadio = page.locator('#e'); // radioGroup: servicetype, currentValue: E
    this.electricGasServiceRadio = page.locator('#eg'); // radioGroup: servicetype, currentValue: EG
    this.calculateButton = page.locator('#validateMoveInBtn'); // text: Calculate
    this.resetButton = page.locator('#rateCalCancelBtn'); // text: Reset
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):'); // id: consumption
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):'); // id: gasconsumption
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
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
   * @param read The previous meter read value.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the service type (Electric or Electric & Gas).
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
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
    // It's good practice to wait for network idle or a specific element to be visible/enabled
    // after a calculation to ensure the page has updated. This can be added here if needed.
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric use value from the input field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    await this.estimatedElectricUseField.waitFor({ state: 'attached' });
    return await this.estimatedElectricUseField.inputValue();
  }

  /**
   * Retrieves the estimated gas use value from the input field.
   * Note: The locator catalog indicates this field is disabled by default. It is assumed
   * that selecting 'Electric & Gas' service type enables it.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    // Wait for the field to be attached and potentially enabled before attempting to get its value.
    await this.estimatedGasUseField.waitFor({ state: 'attached' });
    // If it's expected to be enabled dynamically, add a wait for enabled state:
    // await this.estimatedGasUseField.waitFor({ state: 'enabled' });
    return await this.estimatedGasUseField.inputValue();
  }

  /**
   * Returns the Locator for the estimated gas use field. This is for assertions in the test spec.
   * @returns Playwright Locator for the estimated gas use field.
   */
  getEstimatedGasUseLocator(): Locator {
    return this.estimatedGasUseField;
  }
}
