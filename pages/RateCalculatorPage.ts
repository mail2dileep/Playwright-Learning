import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadField: Locator;
  private readonly currentElectricReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricOnlyServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousElectricReadField = this.page.getByLabel('Enter Previous Read:');
    this.currentElectricReadField = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyServiceTypeRadio = this.page.locator('#e');
    this.electricGasServiceTypeRadio = this.page.locator('#eg');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyServiceTypeRadio.click();
  }

  /**
   * Checks if the 'Enter Previous Read' electric field is visible.
   * @returns A promise that resolves to true if the field is visible, false otherwise.
   */
  async isPreviousElectricReadFieldVisible(): Promise<boolean> {
    return await this.previousElectricReadField.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' field is visible.
   * @returns A promise that resolves to true if the field is visible, false otherwise.
   */
  async isEstimatedGasUseFieldVisible(): Promise<boolean> {
    return await this.estimatedGasUseField.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' field is disabled.
   * @returns A promise that resolves to true if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseField.isDisabled();
  }
}