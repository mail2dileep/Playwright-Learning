import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly electricAndGasServiceRadioButton: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators based on catalog and priority
    this.electricAndGasServiceRadioButton = page.locator('#eg'); // Recommended: locator('#eg')
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:'); // Recommended: getByLabel('Enter Previous Read:')
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:'); // Recommended: getByLabel('Enter Current Read:')
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):'); // Recommended: getByLabel('Estimated Electric use (kWh):')
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):'); // Recommended: getByLabel('Estimated Gas use (Ccf):')
    this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended: locator('#validateMoveInBtn')
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricAndGasServiceRadioButton.click();
  }

  /**
   * Enters values into the previous and current electric meter read fields.
   * @param previousRead The value for the previous electric meter read.
   * @param currentRead The value for the current electric meter read.
   */
  async enterElectricMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousElectricReadInput.fill(previousRead);
    await this.currentElectricReadInput.fill(currentRead);
  }

  /**
   * Enters a value into the estimated gas use field. This field becomes editable after selecting 'Electric and Gas'.
   * @param gasValue The value for the estimated gas use.
   */
  async enterEstimatedGasUse(gasValue: string): Promise<void> {
    await this.estimatedGasUseOutput.fill(gasValue);
  }

  /**
   * Clicks the 'Calculate' button to compute service costs.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Returns the Locator for the current electric meter read input field for assertions.
   * @returns A Playwright Locator for the current electric meter read input.
   */
  getCurrentElectricReadInputField(): Locator {
    return this.currentElectricReadInput;
  }

  /**
   * Returns the Locator for the estimated gas use input/output field for assertions.
   * @returns A Playwright Locator for the estimated gas use field.
   */
  getEstimatedGasUseInputField(): Locator {
    return this.estimatedGasUseOutput;
  }

  /**
   * Returns the Locator for the estimated electric use output field for assertions.
   * @returns A Playwright Locator for the estimated electric use field.
   */
  getEstimatedElectricUseOutputField(): Locator {
    return this.estimatedElectricUseOutput;
  }
}
