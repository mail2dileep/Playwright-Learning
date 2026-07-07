import { Page, Locator } from "@playwright/test";

export class CalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInputField: Locator;
  private readonly currentReadInputField: Locator;
  private readonly estimatedElectricUseInputField: Locator;
  private readonly estimatedGasUseInputField: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInputField = page.getByLabel('Enter Previous Read:');
    this.currentReadInputField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInputField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInputField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceRadioButton.click();
  }

  /**
   * Enters the current electric meter read value.
   * @param value The numeric value for the current electric read.
   */
  async enterElectricCurrentRead(value: string): Promise<void> {
    await this.currentReadInputField.fill(value);
  }

  /**
   * Enters the estimated gas usage value.
   * @param value The numeric value for the estimated gas use.
   */
  async enterGasEstimatedUse(value: string): Promise<void> {
    await this.estimatedGasUseInputField.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the Estimated Gas use (Ccf) field is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isGasEstimatedUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInputField.isEnabled();
  }

  /**
   * Retrieves the value from the 'Enter Current Read' field.
   * @returns A promise that resolves to the string value of the field.
   */
  async getElectricCurrentReadValue(): Promise<string> {
    return await this.currentReadInputField.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Gas use (Ccf)' field.
   * @returns A promise that resolves to the string value of the field.
   */
  async getGasEstimatedUseValue(): Promise<string> {
    return await this.estimatedGasUseInputField.inputValue();
  }
}