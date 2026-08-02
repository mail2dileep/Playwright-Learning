import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;
  private readonly serviceTypeElectricAndGasRadio: Locator;
  private readonly electricPreviousReadField: Locator;
  private readonly electricCurrentReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceTypeElectricAndGasRadio = page.locator('#eg');
    this.electricPreviousReadField = page.getByLabel('Enter Previous Read:');
    this.electricCurrentReadField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric and Gas' service type option.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.serviceTypeElectricAndGasRadio.click();
  }

  /**
   * Returns the Locator for the Electric Current Read field.
   * This can be used for assertions in the test spec.
   */
  getElectricCurrentReadFieldLocator(): Locator {
    return this.electricCurrentReadField;
  }

  /**
   * Returns the Locator for the Estimated Gas Use field.
   * This can be used for assertions in the test spec.
   */
  getEstimatedGasUseFieldLocator(): Locator {
    return this.estimatedGasUseField;
  }

  /**
   * Enters a value into the Electric Current Read field.
   * @param value The value to enter.
   */
  async enterElectricCurrentRead(value: string): Promise<void> {
    await this.electricCurrentReadField.fill(value);
  }

  /**
   * Enters a value into the Estimated Gas use (Ccf) field.
   * @param value The value to enter.
   */
  async enterGasConsumption(value: string): Promise<void> {
    await this.estimatedGasUseField.fill(value);
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Returns the displayed value from the Estimated Electric use (kWh) field.
   */
  async getEstimatedElectricUseValue(): Promise<string | null> {
    return await this.estimatedElectricUseField.inputValue();
  }

  /**
   * Returns the displayed value from the Estimated Gas use (Ccf) field.
   */
  async getEstimatedGasUseValue(): Promise<string | null> {
    return await this.estimatedGasUseField.inputValue();
  }
}