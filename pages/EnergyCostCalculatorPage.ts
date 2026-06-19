import { Page, Locator, expect } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly _rateCalculatorSection: Locator;
  private readonly _monthDropdown: Locator;
  private readonly _previousReadInput: Locator;
  private readonly _currentReadInput: Locator;
  private readonly _estimatedElectricUseInput: Locator;
  private readonly _estimatedGasUseInput: Locator;
  private readonly _serviceTypeElectricRadio: Locator;
  private readonly _serviceTypeElectricGasRadio: Locator;
  private readonly _howToReadYourBillButton: Locator;
  private readonly _howToFindUsageButton: Locator;
  private readonly _resetButton: Locator;
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locate the main rate calculator section using its ID based on 'parentContainer' metadata.
    this._rateCalculatorSection = page.locator('#calculator_current');
    // All other locators are directly from the 'recommendedLocator' in the catalog.
    this._monthDropdown = page.getByLabel('Month');
    this._previousReadInput = page.getByLabel('Enter Previous Read:');
    this._currentReadInput = page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this._serviceTypeElectricRadio = page.locator('#e');
    this._serviceTypeElectricGasRadio = page.locator('#eg');
    this._howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this._howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this._resetButton = page.locator('#rateCalCancelBtn');
    this._calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the Energy Cost Calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateToCalculatorPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Checks if the main Rate Calculator section is visible on the page.
   * @returns A boolean indicating the visibility of the section.
   */
  async isRateCalculatorSectionVisible(): Promise<boolean> {
    return await this._rateCalculatorSection.isVisible();
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this._monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter reading.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this._previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter reading.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this._currentReadInput.fill(value);
  }

  /**
   * Retrieves the value from the Estimated Electric use (kWh) input field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this._estimatedElectricUseInput.inputValue();
  }

  /**
   * Selects the service type radio button.
   * @param type 'E' for Electric, 'EG' for Electric and Gas.
   */
  async selectServiceType(type: 'E' | 'EG'): Promise<void> {
    if (type === 'E') {
      await this._serviceTypeElectricRadio.check();
    } else if (type === 'EG') {
      await this._serviceTypeElectricGasRadio.check();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculateButton(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickResetButton(): Promise<void> {
    await this._resetButton.click();
  }
}