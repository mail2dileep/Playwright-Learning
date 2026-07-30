import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly _serviceTypeElectricGasRadio: Locator;
  private readonly _previousMeterReadInput: Locator;
  private readonly _currentMeterReadInput: Locator;
  private readonly _electricUseInput: Locator;
  private readonly _gasUseInput: Locator;
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this._serviceTypeElectricGasRadio = page.locator('#eg');
    // These locators are available in the catalog but are not directly used
    // as input fields in the 'Verify calculation for Electric and Gas service' test flow.
    this._previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this._currentMeterReadInput = page.getByLabel('Enter Current Read:');

    this._electricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this._gasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this._calculateButton = page.locator('#validateMoveInBtn');
  }

  // Public locator property for direct assertion in the test spec, following POM guidelines.
  public get gasUseInputLocator(): Locator {
    return this._gasUseInput;
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this._serviceTypeElectricGasRadio.click();
  }

  /**
   * Enters the estimated electric usage value into the 'Estimated Electric use (kWh):' field.
   * @param value The numeric string value for electric usage.
   */
  async enterElectricUse(value: string): Promise<void> {
    await this._electricUseInput.fill(value);
  }

  /**
   * Enters the estimated gas usage value into the 'Estimated Gas use (Ccf):' field.
   * This field is typically enabled after selecting the 'Electric and Gas' service type.
   * @param value The numeric string value for gas usage.
   */
  async enterGasUse(value: string): Promise<void> {
    await this._gasUseInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button to initiate the rate calculation.
   */
  async clickCalculate(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Retrieves the current input value from the 'Estimated Electric use (kWh):' field.
   * @returns A promise that resolves to the string value of the electric use field.
   */
  async getElectricUseValue(): Promise<string> {
    return await this._electricUseInput.inputValue();
  }

  /**
   * Retrieves the current input value from the 'Estimated Gas use (Ccf):' field.
   * @returns A promise that resolves to the string value of the gas use field.
   */
  async getGasUseValue(): Promise<string> {
    return await this._gasUseInput.inputValue();
  }
}
