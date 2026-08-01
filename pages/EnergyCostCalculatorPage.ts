import { Page, Locator } from "@playwright/test";

export class EnergyCostCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;
  private readonly pageUrl: string = "https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html";

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel("Month");
    this.previousReadInput = page.getByLabel("Enter Previous Read:");
    this.currentReadInput = page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this.electricServiceTypeRadio = page.locator("#e");
    this.electricAndGasServiceTypeRadio = page.locator("#eg");
    this.resetButton = page.locator("#rateCalCancelBtn");
    this.calculateButton = page.locator("#validateMoveInBtn");
  }

  /**
   * Navigates to the Energy Cost Calculator page.
   */
  async navigateTo(): Promise<void> {
    await this.page.goto(this.pageUrl);
  }

  /**
   * Checks if the rate calculator section is visible by verifying a key element's visibility.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isRateCalculatorSectionVisible(): Promise<boolean> {
    return await this.monthSelect.isVisible();
  }

  /**
   * Retrieves the currently selected month's value from the dropdown.
   * @returns A promise that resolves to the selected month's value.
   */
  async getSelectedMonthValue(): Promise<string | null> {
    return await this.monthSelect.inputValue();
  }

  /**
   * Retrieves the value from the 'Previous Read' input field.
   * @returns A promise that resolves to the previous read value.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Current Read' input field.
   * @returns A promise that resolves to the current read value.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Electric use (kWh)' input field.
   * @returns A promise that resolves to the estimated electric use value.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the 'Estimated Gas use (Ccf)' input field.
   * @returns A promise that resolves to the estimated gas use value.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' field is disabled.
   * @returns A promise that resolves to true if disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns A promise that resolves to true if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceTypeRadio.isChecked();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is selected.
   * @returns A promise that resolves to true if selected, false otherwise.
   */
  async isElectricAndGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricAndGasServiceTypeRadio.isChecked();
  }

  /**
   * Checks if the 'Reset' button is visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isResetButtonVisible(): Promise<boolean> {
    return await this.resetButton.isVisible();
  }

  /**
   * Checks if the 'Calculate' button is visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isCalculateButtonVisible(): Promise<boolean> {
    return await this.calculateButton.isVisible();
  }
}