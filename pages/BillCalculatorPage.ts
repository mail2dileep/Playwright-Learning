import { Page, Locator } from "@playwright/test";

export class BillCalculatorPage {
  private readonly page: Page;
  private readonly _monthSelect: Locator;
  private readonly _previousElectricReadInput: Locator;
  private readonly _currentElectricReadInput: Locator;
  private readonly _estimatedElectricUseOutput: Locator;
  private readonly _estimatedGasUseOutput: Locator;
  private readonly _electricServiceRadio: Locator;
  private readonly _electricGasServiceRadio: Locator;
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this._monthSelect = page.getByLabel('Month');
    this._previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this._currentElectricReadInput = page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this._electricServiceRadio = page.locator('#e');
    this._electricGasServiceRadio = page.locator('#eg');
    this._calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the service type (e.g., Electric or Electric and Gas).
   * @param type - The service type to select. 'Electric' or 'Electric and Gas'.
   */
  async selectServiceType(type: 'Electric' | 'Electric and Gas'): Promise<void> {
    if (type === 'Electric') {
      await this._electricServiceRadio.click();
    } else if (type === 'Electric and Gas') {
      await this._electricGasServiceRadio.click();
    }
  }

  /**
   * Enters the previous and current electric meter read values.
   * @param previousRead - The previous electric meter read value.
   * @param currentRead - The current electric meter read value.
   */
  async enterElectricMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this._previousElectricReadInput.fill(previousRead);
    await this._currentElectricReadInput.fill(currentRead);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Retrieves the current value of the previous electric read input field.
   * @returns A promise that resolves to the previous electric read value.
   */
  async getPreviousElectricReadValue(): Promise<string> {
    return this._previousElectricReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current electric read input field.
   * @returns A promise that resolves to the current electric read value.
   */
  async getCurrentElectricReadValue(): Promise<string> {
    return this._currentElectricReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use value from its output field.
   * @returns A promise that resolves to the estimated electric use value.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this._estimatedElectricUseOutput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value from its output field.
   * Note: This field is marked as disabled in the locator catalog, typically an output field.
   * @returns A promise that resolves to the estimated gas use value.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this._estimatedGasUseOutput.inputValue();
  }

  /**
   * Returns the Locator for the previous electric read input field.
   * This is primarily for assertions in the test spec.
   */
  getPreviousElectricReadField(): Locator {
    return this._previousElectricReadInput;
  }

  /**
   * Returns the Locator for the current electric read input field.
   * This is primarily for assertions in the test spec.
   */
  getCurrentElectricReadField(): Locator {
    return this._currentElectricReadInput;
  }

  /**
   * Returns the Locator for the estimated electric use output field.
   * This is primarily for assertions in the test spec.
   */
  getEstimatedElectricUseField(): Locator {
    return this._estimatedElectricUseOutput;
  }

  /**
   * Returns the Locator for the estimated gas use output field.
   * This is primarily for assertions in the test spec.
   */
  getEstimatedGasUseField(): Locator {
    return this._estimatedGasUseOutput;
  }
}
