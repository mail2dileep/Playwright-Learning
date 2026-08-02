import { Page, Locator } from "@playwright/test";

export class CalculatorPage {
  private readonly page: Page;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly previousElectricReadField: Locator;
  private readonly currentElectricReadField: Locator;
  private readonly calculateButton: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.electricAndGasServiceRadio = page.locator('#eg'); // For 'Electric and Gas' service type
    this.previousElectricReadField = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadField = page.getByLabel('Enter Current Read:');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):'); // This is an estimated use output, not an input for meter read.
  }

  /**
   * Navigates to the calculator page. (Placeholder, as no URL was provided)
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
  }

  /**
   * Enters the previous electric meter read value.
   * @param read The previous electric meter read value.
   */
  async enterPreviousElectricRead(read: string): Promise<void> {
    await this.previousElectricReadField.fill(read);
  }

  /**
   * Enters the current electric meter read value.
   * @param read The current electric meter read value.
   */
  async enterCurrentElectricRead(read: string): Promise<void> {
    await this.currentElectricReadField.fill(read);
  }

  /**
   * Clicks the 'Calculate' button to compute results.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the previous electric read field is visible.
   */
  async isPreviousElectricReadFieldVisible(): Promise<boolean> {
    return await this.previousElectricReadField.isVisible();
  }

  /**
   * Checks if the previous electric read field is enabled.
   */
  async isPreviousElectricReadFieldEnabled(): Promise<boolean> {
    return await this.previousElectricReadField.isEnabled();
  }

  /**
   * Checks if the current electric read field is visible.
   */
  async isCurrentElectricReadFieldVisible(): Promise<boolean> {
    return await this.currentElectricReadField.isVisible();
  }

  /**
   * Checks if the current electric read field is enabled.
   */
  async isCurrentElectricReadFieldEnabled(): Promise<boolean> {
    return await this.currentElectricReadField.isEnabled();
  }

  /**
   * Checks if the estimated electric use field is visible.
   */
  async isEstimatedElectricUseFieldVisible(): Promise<boolean> {
    return await this.estimatedElectricUseField.isVisible();
  }

  /**
   * Checks if the estimated gas use field is visible.
   * Note: The catalog indicates this field is disabled, so its enabled state might not change.
   * It's primarily an output/display field based on description.
   */
  async isEstimatedGasUseFieldVisible(): Promise<boolean> {
    return await this.estimatedGasUseField.isVisible();
  }

  /**
   * Retrieves the value from the previous electric read field.
   */
  async getPreviousElectricReadValue(): Promise<string | null> {
    return await this.previousElectricReadField.inputValue();
  }

  /**
   * Retrieves the value from the current electric read field.
   */
  async getCurrentElectricReadValue(): Promise<string | null> {
    return await this.currentElectricReadField.inputValue();
  }

  /**
   * Retrieves the value from the estimated electric use field.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return await this.estimatedElectricUseField.inputValue();
  }

  /**
   * Retrieves the value from the estimated gas use field.
   */
  async getEstimatedGasUse(): Promise<string | null> {
    return await this.estimatedGasUseField.inputValue();
  }
}