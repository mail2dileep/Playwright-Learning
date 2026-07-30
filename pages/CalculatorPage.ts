import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;
  private readonly _serviceTypeElectricAndGasRadio: Locator;
  private readonly _enterPreviousReadField: Locator;
  private readonly _estimatedGasUseField: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators using recommendedLocator from catalog
    // RecommendedLocator: locator('#eg') for radio button with id 'eg'
    this._serviceTypeElectricAndGasRadio = this.page.locator('#eg');
    // RecommendedLocator: getByLabel('Enter Previous Read:') for input field
    this._enterPreviousReadField = this.page.getByLabel('Enter Previous Read:');
    // RecommendedLocator: getByLabel('Estimated Gas use (Ccf):') for input field
    this._estimatedGasUseField = this.page.getByLabel('Estimated Gas use (Ccf):');
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this._serviceTypeElectricAndGasRadio.click();
  }

  /**
   * Returns the locator for the 'Enter Previous Read:' field for assertions.
   */
  public get enterPreviousReadField(): Locator {
    return this._enterPreviousReadField;
  }

  /**
   * Returns the locator for the 'Estimated Gas use (Ccf):' field for assertions.
   */
  public get estimatedGasUseField(): Locator {
    return this._estimatedGasUseField;
  }
}
