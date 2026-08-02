import { Page, Locator } from \"@playwright/test\";

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly electricOnlyServiceRadioButton: Locator;
  private readonly previousMeterReadField: Locator;
  private readonly currentMeterReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators for Service Type selection
    // recommendedLocator: locator('#e'), displayName: 'e', inputType: 'radio', radioGroup: 'servicetype'
    this.electricOnlyServiceRadioButton = page.locator('#e');

    // Locators for meter reads
    // recommendedLocator: getByLabel('Enter Previous Read:'), displayName: 'Enter Previous Read:', id: 'eMeterRead'
    this.previousMeterReadField = page.getByLabel('Enter Previous Read:');
    // recommendedLocator: getByLabel('Enter Current Read:'), displayName: 'Enter Current Read:', id: 'eMeterNewRead'
    this.currentMeterReadField = page.getByLabel('Enter Current Read:');
    // recommendedLocator: getByLabel('Estimated Electric use (kWh):'), displayName: 'Estimated Electric use (kWh):', id: 'consumption'
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    // recommendedLocator: getByLabel('Estimated Gas use (Ccf):'), displayName: 'Estimated Gas use (Ccf):', id: 'gasconsumption', disabled: true
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');

    // Locators for actions
    // recommendedLocator: locator('#validateMoveInBtn'), displayName: 'Calculate', id: 'validateMoveInBtn', inputType: 'submit'
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectElectricOnlyServiceType(): Promise<void> {
    await this.electricOnlyServiceRadioButton.click();
  }

  /**
   * Enters a value into the current meter read field.
   * @param value The meter read value to enter.
   */
  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentMeterReadField.fill(value);
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the Current Meter Read field is enabled.
   * @returns A boolean indicating if the field is enabled.
   */
  async isCurrentMeterReadFieldEnabled(): Promise<boolean> {
    return await this.currentMeterReadField.isEnabled();
  }

  /**
   * Checks if the Estimated Gas Use field is disabled.
   * @returns A boolean indicating if the field is disabled.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseField.isDisabled();
  }

  /**
   * Retrieves the value from the Estimated Electric Use field.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseField.inputValue();
  }

  /**
   * Retrieves the value from the Estimated Gas Use field.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseField.inputValue();
  }
}
