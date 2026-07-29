import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricGasRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyRadio = page.locator('#e');
    this.electricGasRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Returns the locator for the 'Enter Previous Read:' input field.
   * @returns Locator
   */
  getPreviousReadInputField(): Locator {
    return this.previousReadInput;
  }

  /**
   * Returns the locator for the 'Enter Current Read:' input field.
   * @returns Locator
   */
  getCurrentReadInputField(): Locator {
    return this.currentReadInput;
  }

  /**
   * Returns the locator for the 'Estimated Electric use (kWh):' input field.
   * @returns Locator
   */
  getEstimatedElectricUseInputField(): Locator {
    return this.estimatedElectricUseInput;
  }

  /**
   * Returns the locator for the 'Estimated Gas use (Ccf):' input field.
   * @returns Locator
   */
  getEstimatedGasUseInputField(): Locator {
    return this.estimatedGasUseInput;
  }
}
