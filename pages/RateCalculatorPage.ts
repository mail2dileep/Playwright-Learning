import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators for input fields
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricConsumptionInput: Locator;
  private readonly gasConsumptionInput: Locator;

  // Locators for radio buttons
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;

  // Locators for buttons
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators based on the catalog and recommended methods
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.electricConsumptionInput = page.getByLabel('Estimated Electric use (kWh):');
    this.gasConsumptionInput = page.getByLabel('Estimated Gas use (Ccf):');

    this.electricServiceRadio = page.locator('#e'); // Recommended locator for id='e'
    this.electricGasServiceRadio = page.locator('#eg'); // Recommended locator for id='eg'

    this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended locator for id='validateMoveInBtn'
  }

  /**
   * Navigates to the specified URL. Placeholder, as the test doesn't specify a base URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  /**
   * Enters the specified value into the electric consumption field.
   * @param value The electric consumption value to enter.
   */
  async enterElectricConsumption(value: string): Promise<void> {
    await this.electricConsumptionInput.fill(value);
  }

  /**
   * Enters the specified value into the gas consumption field.
   * @param value The gas consumption value to enter.
   */
  async enterGasConsumption(value: string): Promise<void> {
    await this.gasConsumptionInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the estimated electric consumption field is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isElectricConsumptionFieldEnabled(): Promise<boolean> {
    return await this.electricConsumptionInput.isEnabled();
  }

  /**
   * Checks if the estimated gas consumption field is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isGasConsumptionFieldEnabled(): Promise<boolean> {
    return await this.gasConsumptionInput.isEnabled();
  }

  /**
   * Retrieves the current value of the estimated electric consumption field.
   * @returns A promise that resolves to the string value of the field.
   */
  async getElectricConsumptionValue(): Promise<string> {
    return await this.electricConsumptionInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated gas consumption field.
   * @returns A promise that resolves to the string value of the field.
   */
  async getGasConsumptionValue(): Promise<string> {
    return await this.gasConsumptionInput.inputValue();
  }
}
