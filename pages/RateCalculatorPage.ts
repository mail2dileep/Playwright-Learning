import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUsageOutput: Locator;
  private readonly estimatedGasUsageOutput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUsageOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUsageOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e'); // Recommended: locator('#e')
    this.electricGasServiceRadio = page.locator('#eg'); // Recommended: locator('#eg')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn'); // Recommended: locator('#howToReadYourBillBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn'); // Recommended: locator('#howToFindUsageBtn')
    this.resetButton = page.locator('#rateCalCancelBtn'); // Recommended: locator('#rateCalCancelBtn')
    this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended: locator('#validateMoveInBtn')
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthLabel The visible text of the month to select (e.g., 'July').
   */
  async selectMonth(monthLabel: string): Promise<void> {
    await this.monthSelect.selectOption({ label: monthLabel });
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read value as a string.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read value as a string.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the service type (Electric or Electric and Gas).
   * @param type 'Electric' or 'ElectricAndGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'ElectricAndGas') {
      await this.electricGasServiceRadio.check();
    } else {
      throw new Error(`Invalid service type: ${type}. Must be 'Electric' or 'ElectricAndGas'.`);
    }
  }

  /**
   * Clicks the Calculate button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric usage value.
   * @returns The estimated electric usage as a string.
   */
  async getEstimatedElectricUsage(): Promise<string> {
    return await this.estimatedElectricUsageOutput.inputValue();
  }

  /**
   * Retrieves the estimated gas usage value.
   * @returns The estimated gas usage as a string.
   */
  async getEstimatedGasUsage(): Promise<string> {
    return await this.estimatedGasUsageOutput.inputValue();
  }

  /**
   * Checks if the estimated gas usage field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isGasUsageFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUsageOutput.isDisabled();
  }

  /**
   * Clicks the "How to Read Your Bill" button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the "How to Find Usage" button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}