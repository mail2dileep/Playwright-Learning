import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousElectricReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseOutput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = this.page.locator('#e');
    this.electricGasServiceRadio = this.page.locator('#eg');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the 'Enter Previous Read:' field.
   * @param read The value to enter.
   */
  async enterPreviousElectricRead(read: string): Promise<void> {
    await this.previousElectricReadInput.fill(read);
  }

  /**
   * Retrieves the current value from the 'Enter Previous Read:' field.
   * @returns The current value of the input field.
   */
  async getPreviousElectricReadValue(): Promise<string> {
    return await this.previousElectricReadInput.inputValue();
  }

  /**
   * Enters a value into the 'Enter Current Read:' field.
   * @param read The value to enter.
   */
  async enterCurrentElectricRead(read: string): Promise<void> {
    await this.currentElectricReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  /**
   * Enters a value into the 'Estimated Gas use (Ccf):' field.
   * This field is typically enabled after selecting the 'Electric & Gas' service type.
   * @param value The value to enter.
   */
  async enterEstimatedGasUse(value: string): Promise<void> {
    // Playwright's auto-waiting will handle waiting for the element to be enabled.
    await this.estimatedGasUseOutput.fill(value);
  }

  /**
   * Retrieves the current value from the 'Estimated Gas use (Ccf):' field.
   * @returns The current value of the input field.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseOutput.inputValue();
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
}