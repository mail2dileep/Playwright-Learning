import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  
  // Locators
  public readonly monthSelect: Locator;
  public readonly previousReadInput: Locator;
  public readonly currentReadInput: Locator;
  public readonly estimatedElectricUseInput: Locator;
  public readonly estimatedGasUseInput: Locator;
  public readonly electricServiceRadio: Locator;
  public readonly electricGasServiceRadio: Locator;
  public readonly calculateButton: Locator;
  public readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Disabled by default
    this.electricServiceRadio = page.locator('#e'); // Radio button for Electric service type
    this.electricGasServiceRadio = page.locator('#eg'); // Radio button for Electric & Gas service type
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the specified URL. In an AEM context, this would typically be an authoring page.
   * @param url The URL of the page containing the Rate Calculator component.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the 'Month' dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters a value into the 'Enter Previous Read:' input field.
   * @param value The previous meter read value as a string.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Enter Current Read:' input field.
   * @param value The current meter read value as a string.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects a service type radio button.
   * @param type The service type to select: 'Electric' or 'Electric & Gas'.
   */
  async selectServiceType(type: 'Electric' | 'Electric & Gas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'Electric & Gas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error(`Unsupported service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to compute estimated usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear input fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Configures the Rate Calculator component's primary input fields.
   * This method encapsulates the 'editing component details' action.
   * @param monthValue The value attribute of the month option (e.g., 'm07').
   * @param prevRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType The service type ('Electric' or 'Electric & Gas').
   */
  async configureCalculatorDetails(
    monthValue: string,
    prevRead: string,
    currentRead: string,
    serviceType: 'Electric' | 'Electric & Gas'
  ): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(prevRead);
    await this.enterCurrentRead(currentRead);
    await this.selectServiceType(serviceType);
  }
}