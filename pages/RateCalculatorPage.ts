import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private readonly page: Page) {
    this.monthDropdown = this.page.getByLabel("Month");
    this.previousReadInput = this.page.getByLabel("Enter Previous Read:");
    this.currentReadInput = this.page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = this.page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = this.page.getByLabel("Estimated Gas use (Ccf):");
    this.electricServiceRadio = this.page.locator("#e");
    this.electricGasServiceRadio = this.page.locator("#eg");
    this.calculateButton = this.page.locator("#validateMoveInBtn");
    this.resetButton = this.page.locator("#rateCalCancelBtn");
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the service type (Electric or ElectricAndGas).
   * @param type The service type: 'Electric' or 'ElectricAndGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'ElectricAndGas') {
      await this.electricGasServiceRadio.check();
    } else {
      throw new Error(`Invalid service type provided: ${type}. Expected 'Electric' or 'ElectricAndGas'.`);
    }
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the form.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric usage.
   * @returns A promise that resolves to the estimated electric usage as a string.
   */
  async getEstimatedElectricUsage(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas usage.
   * @returns A promise that resolves to the estimated gas usage as a string.
   */
  async getEstimatedGasUsage(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Performs a full usage calculation workflow.
   * @param month The month value (e.g., 'm07').
   * @param previousRead The previous meter read.
   * @param currentRead The current meter read.
   * @param serviceType The service type ('Electric' or 'ElectricAndGas').
   */
  async calculateUsage(month: string, previousRead: string, currentRead: string, serviceType: 'Electric' | 'ElectricAndGas'): Promise<void> {
    await this.selectMonth(month);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectServiceType(serviceType);
    await this.clickCalculate();
  }
}