import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseField: Locator; // This field serves as both estimated output and gas input
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    // As per analysis, 'Estimated Gas use (Ccf):' is the only text input related to Gas
    // and is assumed to become an input field upon selecting Electric and Gas service.
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the specified service type using the corresponding radio button.
   * @param type The service type to select: 'Electric' or 'Electric and Gas'.
   */
  async selectServiceType(type: 'Electric' | 'Electric and Gas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceTypeRadio.click();
    } else if (type === 'Electric and Gas') {
      await this.electricAndGasServiceTypeRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Enters a numeric value into the 'Enter Previous Read:' field.
   * @param value The value to enter.
   */
  async enterPreviousElectricRead(value: string): Promise<void> {
    await this.previousElectricReadInput.fill(value);
  }

  /**
   * Enters a numeric value into the 'Enter Current Read:' field.
   * @param value The value to enter.
   */
  async enterCurrentElectricRead(value: string): Promise<void> {
    await this.currentElectricReadInput.fill(value);
  }

  /**
   * Enters a numeric value into the 'Estimated Gas use (Ccf):' field,
   * which is assumed to serve as the Gas input field when 'Electric and Gas' service is selected.
   * @param value The value to enter.
   */
  async enterGasRead(value: string): Promise<void> {
    await this.estimatedGasUseField.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Returns the Locator for the 'Enter Previous Read:' field.
   * @returns Locator
   */
  getPreviousElectricReadLocator(): Locator {
    return this.previousElectricReadInput;
  }

  /**
   * Returns the Locator for the 'Enter Current Read:' field.
   * @returns Locator
   */
  getCurrentElectricReadLocator(): Locator {
    return this.currentElectricReadInput;
  }

  /**
   * Returns the Locator for the 'Estimated Electric use (kWh):' output field.
   * @returns Locator
   */
  getEstimatedElectricUseLocator(): Locator {
    return this.estimatedElectricUseOutput;
  }

  /**
   * Returns the Locator for the 'Estimated Gas use (Ccf):' field.
   * This locator is used for both enabling assertion and value assertion for Gas input/output.
   * @returns Locator
   */
  getEstimatedGasUseLocator(): Locator {
    return this.estimatedGasUseField;
  }

  /**
   * Returns the Locator for the 'Electric and Gas' service type radio button.
   * @returns Locator
   */
  getElectricAndGasServiceTypeRadioLocator(): Locator {
      return this.electricAndGasServiceTypeRadio;
  }
}