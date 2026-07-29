import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  readonly page: Page;

  // Encapsulated Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e'); // Corresponding to radioGroup "servicetype", currentValue "E"
    this.electricGasServiceRadio = page.locator('#eg'); // Corresponding to radioGroup "servicetype", currentValue "EG"
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the calculator page.
   * @param url The full or relative URL to the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the desired service type (e.g., Electric only or Electric & Gas).
   * @param type The service type to select: 'Electric' or 'Electric & Gas'.
   */
  async selectServiceType(type: 'Electric' | 'Electric & Gas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'Electric & Gas') {
      await this.electricGasServiceRadio.click();
    }
  }

  /**
   * Enters the previous and current meter read values into their respective input fields.
   * @param previousRead The value to enter for the previous meter read.
   * @param currentRead The value to enter for the current meter read.
   */
  async enterMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousReadInput.fill(previousRead);
    await this.currentReadInput.fill(currentRead);
  }

  /**
   * Initiates the usage calculation by clicking the 'Calculate' button.
   */
  async calculateUsage(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Resets all input fields and calculated outputs to their default states by clicking the 'Reset' button.
   */
  async resetCalculator(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current input value from the 'Estimated Electric use (kWh):' field.
   * @returns A promise that resolves to the estimated electric usage as a string.
   */
  async getEstimatedElectricUsage(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current input value from the 'Estimated Gas use (Ccf):' field.
   * This field is typically disabled, but its value can still be read if updated by calculation.
   * @returns A promise that resolves to the estimated gas usage as a string.
   */
  async getEstimatedGasUsage(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the current input value from the 'Enter Previous Read:' field.
   * @returns A promise that resolves to the previous meter read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current input value from the 'Enter Current Read:' field.
   * @returns A promise that resolves to the current meter read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the value of the currently selected option in the 'Month' dropdown.
   * @returns A promise that resolves to the selected month's value (e.g., 'm06') as a string.
   */
  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }
}