import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  readonly page: Page;
  // Private locators encapsulated within the Page Object
  private readonly _monthDropdown: Locator;
  private readonly _previousReadInput: Locator;
  private readonly _currentReadInput: Locator;
  private readonly _estimatedElectricUseInput: Locator;
  private readonly _estimatedGasUseInput: Locator;
  private readonly _electricServiceTypeRadio: Locator;
  private readonly _electricGasServiceTypeRadio: Locator;
  private readonly _howToReadYourBillButton: Locator;
  private readonly _howToFindUsageButton: Locator;
  private readonly _resetButton: Locator;
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators using recommended selectors from the catalog
    this._monthDropdown = page.getByLabel('Month');
    this._previousReadInput = page.getByLabel('Enter Previous Read:');
    this._currentReadInput = page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this._electricServiceTypeRadio = page.locator('#e'); // Based on id for radio group 'servicetype'
    this._electricGasServiceTypeRadio = page.locator('#eg'); // Based on id for radio group 'servicetype'
    this._howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this._howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this._resetButton = page.locator('#rateCalCancelBtn');
    this._calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the 'Month' dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this._monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the 'Enter Previous Read' input field.
   * @param value The previous meter read value to enter.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this._previousReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Enter Current Read' input field.
   * @param value The current meter read value to enter.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this._currentReadInput.fill(value);
  }

  /**
   * Selects a service type using the radio buttons.
   * @param type 'Electric' to select 'e' radio button, or 'Electric & Gas' to select 'eg' radio button.
   */
  async selectServiceType(type: 'Electric' | 'Electric & Gas'): Promise<void> {
    if (type === 'Electric') {
      await this._electricServiceTypeRadio.check();
    } else if (type === 'Electric & Gas') {
      await this._electricGasServiceTypeRadio.check();
    }
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this._howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this._howToFindUsageButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this._resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Retrieves the current input value of the 'Estimated Electric use (kWh)' field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return this._estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current input value of the 'Estimated Gas use (Ccf)' field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return this._estimatedGasUseInput.inputValue();
  }

  // Public methods to expose locators for assertions in the test spec
  // This allows Playwright's expect assertions to be used directly on these locators.
  public getMonthDropdownLocator(): Locator {
    return this._monthDropdown;
  }

  public getPreviousReadInputLocator(): Locator {
    return this._previousReadInput;
  }

  public getCurrentReadInputLocator(): Locator {
    return this._currentReadInput;
  }

  public getEstimatedElectricUseInputLocator(): Locator {
    return this._estimatedElectricUseInput;
  }

  public getEstimatedGasUseInputLocator(): Locator {
    return this._estimatedGasUseInput;
  }

  public getElectricServiceTypeRadioLocator(): Locator {
    return this._electricServiceTypeRadio;
  }

  public getElectricGasServiceTypeRadioLocator(): Locator {
    return this._electricGasServiceTypeRadio;
  }

  public getHowToReadYourBillButtonLocator(): Locator {
    return this._howToReadYourBillButton;
  }

  public getHowToFindUsageButtonLocator(): Locator {
    return this._howToFindUsageButton;
  }

  public getResetButtonLocator(): Locator {
    return this._resetButton;
  }

  public getCalculateButtonLocator(): Locator {
    return this._calculateButton;
  }
}