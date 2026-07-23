import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This field is disabled based on locator catalog
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousElectricReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = this.page.locator('#e');
    this.electricGasServiceRadio = this.page.locator('#eg');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateToCalculator(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous electric meter read field.
   * @param readValue The value to enter.
   */
  async enterPreviousElectricRead(readValue: string): Promise<void> {
    await this.previousElectricReadInput.fill(readValue);
  }

  /**
   * Enters a value into the current electric meter read field.
   * @param readValue The value to enter.
   */
  async enterCurrentElectricRead(readValue: string): Promise<void> {
    await this.currentElectricReadInput.fill(readValue);
  }

  /**
   * Enters a value into the estimated electric use field.
   * @param useValue The value to enter.
   */
  async enterEstimatedElectricUse(useValue: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(useValue);
  }

  /**
   * Retrieves the current value of the previous electric read field.
   * @returns The input value as a string.
   */
  async getPreviousElectricReadValue(): Promise<string> {
    return await this.previousElectricReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current electric read field.
   * @returns The input value as a string.
   */
  async getCurrentElectricReadValue(): Promise<string> {
    return await this.currentElectricReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated electric use field.
   * @returns The input value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated gas use field.
   * Note: This field is marked as disabled in the locator catalog.
   * Interaction methods for this field are not provided due to the 'disabled: true' property.
   * @returns The input value as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Selects the service type radio button.
   * @param type The type of service: 'Electric' or 'ElectricGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'ElectricGas') {
      await this.electricGasServiceRadio.click();
    }
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }
}
