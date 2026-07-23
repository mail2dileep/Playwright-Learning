import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;
  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadField: Locator;
  private readonly currentMeterReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricOnlyServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadField = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyServiceTypeRadio = page.locator('#e'); // radioGroup: servicetype, currentValue: E
    this.electricGasServiceTypeRadio = page.locator('#eg'); // radioGroup: servicetype, currentValue: EG
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous electric meter read field.
   * @param read The previous meter read value.
   */
  async enterPreviousElectricMeterRead(read: string): Promise<void> {
    await this.previousMeterReadField.fill(read);
  }

  /**
   * Enters a value into the current electric meter read field.
   * @param read The current meter read value.
   */
  async enterCurrentElectricMeterRead(read: string): Promise<void> {
    await this.currentMeterReadField.fill(read);
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyServiceTypeRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricGasServiceTypeRadio.check();
  }

  /**
   * Clicks the Calculate button to trigger the calculation.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  // Getter for locators to be used in assertions in the test spec
  public get PreviousMeterReadField(): Locator {
    return this.previousMeterReadField;
  }

  public get CurrentMeterReadField(): Locator {
    return this.currentMeterReadField;
  }

  public get EstimatedElectricUseField(): Locator {
    return this.estimatedElectricUseField;
  }

  public get EstimatedGasUseField(): Locator {
    return this.estimatedGasUseField;
  }

  public get ElectricOnlyServiceTypeRadio(): Locator {
    return this.electricOnlyServiceTypeRadio;
  }

  public get ElectricGasServiceTypeRadio(): Locator {
    return this.electricGasServiceTypeRadio;
  }
}