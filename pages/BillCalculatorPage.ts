import { Page, Locator } from "@playwright/test";

export class BillCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly serviceTypeElectricRadio: Locator;
  private readonly serviceTypeElectricAndGasRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.serviceTypeElectricRadio = page.locator('#e'); // recommendedLocator: locator('#e')
    this.serviceTypeElectricAndGasRadio = page.locator('#eg'); // recommendedLocator: locator('#eg')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn'); // recommendedLocator: locator('#howToReadYourBillBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn'); // recommendedLocator: locator('#howToFindUsageBtn')
    this.resetButton = page.locator('#rateCalCancelBtn'); // recommendedLocator: locator('#rateCalCancelBtn')
    this.calculateButton = page.locator('#validateMoveInBtn'); // recommendedLocator: locator('#validateMoveInBtn')
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.serviceTypeElectricAndGasRadio.click();
  }

  /**
   * Enters a value into the 'Enter Current Read:' field, typically used for Electric meter reading.
   * @param read The current electric meter read value.
   */
  async enterCurrentElectricRead(read: string): Promise<void> {
    await this.currentElectricReadInput.fill(read);
  }

  /**
   * Enters a value into the 'Estimated Gas use (Ccf):' field. Based on the test step,
   * this field is treated as an input for Gas meter reading.
   * @param use The gas meter read value.
   */
  async enterEstimatedGasUse(use: string): Promise<void> {
    await this.estimatedGasUseInput.fill(use);
  }

  /**
   * Clicks the 'Calculate' button to compute the bill.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  // Public getters to expose locators for assertions in the test spec, following enterprise patterns.
  public get currentElectricReadInputLocator(): Locator {
    return this.currentElectricReadInput;
  }

  public get estimatedGasUseInputLocator(): Locator {
    return this.estimatedGasUseInput;
  }

  public get calculateButtonLocator(): Locator {
    return this.calculateButton;
  }

  public get serviceTypeElectricAndGasRadioLocator(): Locator {
    return this.serviceTypeElectricAndGasRadio;
  }
}
