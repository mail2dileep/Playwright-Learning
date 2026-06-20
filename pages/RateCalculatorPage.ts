import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.electricServiceRadio = page.locator('#e'); // Recommended Locator: locator('#e')
    this.electricGasServiceRadio = page.locator('#eg'); // Recommended Locator: locator('#eg')
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.resetButton = page.locator('#rateCalCancelBtn'); // Recommended Locator: locator('#rateCalCancelBtn')
  }

  /**
   * Enters values into the previous and current meter read fields.
   * @param previousRead The value for the previous read.
   * @param currentRead The value for the current read.
   */
  async enterMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousReadInput.fill(previousRead);
    await this.currentReadInput.fill(currentRead);
  }

  /**
   * Selects a service type radio button.
   * @param type The service type to select ('Electric' | 'Electric and Gas').
   */
  async selectServiceType(type: 'Electric' | 'Electric and Gas'): Promise<void> {
    switch (type) {
      case 'Electric':
        await this.electricServiceRadio.check();
        break;
      case 'Electric and Gas':
        await this.electricGasServiceRadio.check();
        break;
      default:
        throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value from the Previous Read input field.
   * @returns The current value of the previous read input.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the Current Read input field.
   * @returns The current value of the current read input.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the selected value from the Month dropdown.
   * @returns The value attribute of the selected option.
   */
  async getMonthDropdownValue(): Promise<string> {
    return this.monthDropdown.inputValue();
  }

  /**
   * Checks if a specific service type radio button is selected.
   * @param type The service type to check ('Electric' | 'Electric and Gas').
   * @returns True if the specified service type is selected, false otherwise.
   */
  async isServiceTypeSelected(type: 'Electric' | 'Electric and Gas'): Promise<boolean> {
    switch (type) {
      case 'Electric':
        return this.electricServiceRadio.isChecked();
      case 'Electric and Gas':
        return this.electricGasServiceRadio.isChecked();
      default:
        throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Retrieves the value from the Estimated Electric use (kWh) field.
   * @returns The current value of the estimated electric use field.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseField.inputValue();
  }

  /**
   * Retrieves the value from the Estimated Gas use (Ccf) field.
   * Note: This field is disabled, but its value can still be read.
   * @returns The current value of the estimated gas use field.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseField.inputValue();
  }
}