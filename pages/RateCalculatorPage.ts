import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Service Type Radio Buttons
  private readonly _serviceTypeElectricAndGasRadio: Locator;

  // Meter Read Fields
  private readonly _previousElectricReadInput: Locator;
  private readonly _currentElectricReadInput: Locator;

  // Estimated Usage Fields (also act as potential output)
  private readonly _estimatedElectricUseInput: Locator;
  private readonly _estimatedGasUseInput: Locator; // Initially disabled

  // Buttons
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators from Catalog, respecting priority and recommendedLocator
    // { "displayName": "eg", "recommendedLocator": "locator('#eg')" }
    this._serviceTypeElectricAndGasRadio = page.locator('#eg');

    // { "displayName": "Enter Previous Read:", "recommendedLocator": "getByLabel('Enter Previous Read:')" }
    this._previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    // { "displayName": "Enter Current Read:", "recommendedLocator": "getByLabel('Enter Current Read:')" }
    this._currentElectricReadInput = page.getByLabel('Enter Current Read:');

    // { "displayName": "Estimated Electric use (kWh):", "recommendedLocator": "getByLabel('Estimated Electric use (kWh):')" }
    this._estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    // { "displayName": "Estimated Gas use (Ccf):", "recommendedLocator": "getByLabel('Estimated Gas use (Ccf):')" }
    this._estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');

    // { "displayName": "Calculate", "recommendedLocator": "locator('#validateMoveInBtn')" }
    this._calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeAsElectricAndGas(): Promise<void> {
    await this._serviceTypeElectricAndGasRadio.click();
  }

  /**
   * Enters the previous and current electric meter read values.
   * Assumes both fields are for electric readings.
   * @param previousRead The previous electric meter read value.
   * @param currentRead The current electric meter read value.
   */
  async enterElectricMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this._previousElectricReadInput.fill(previousRead);
    await this._currentElectricReadInput.fill(currentRead);
  }

  /**
   * Enters the estimated gas usage.
   * The test spec is responsible for asserting the enabled state of this field before calling this method.
   * @param gasUsage The estimated gas usage value.
   */
  async enterEstimatedGasUsage(gasUsage: string): Promise<void> {
    await this._estimatedGasUseInput.fill(gasUsage);
  }

  /**
   * Clicks the 'Calculate' button to compute the bill.
   */
  async clickCalculateButton(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is checked.
   * @returns A promise resolving to a boolean indicating if the radio button is checked.
   */
  async isElectricAndGasServiceTypeChecked(): Promise<boolean> {
    return await this._serviceTypeElectricAndGasRadio.isChecked();
  }

  /**
   * Retrieves the value from the 'Enter Previous Read:' field.
   * @returns The previous electric read value as a string.
   */
  async getPreviousElectricReadValue(): Promise<string> {
    return await this._previousElectricReadInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Enter Current Read:' field.
   * @returns The current electric read value as a string.
   */
  async getCurrentElectricReadValue(): Promise<string> {
    return await this._currentElectricReadInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Electric use (kWh):' field.
   * @returns The estimated electric usage as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this._estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Gas use (Ccf):' field.
   * @returns The estimated gas usage as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this._estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is enabled.
   * This is provided for assertions in the test layer, as per POM rules.
   * @returns A promise resolving to a boolean indicating if the field is enabled.
   */
  async isEstimatedGasUseInputEnabled(): Promise<boolean> {
    return await this._estimatedGasUseInput.isEnabled();
  }
}
