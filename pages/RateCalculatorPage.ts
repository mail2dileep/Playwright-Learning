import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel("Month");
    this.previousMeterReadInput = page.getByLabel("Enter Previous Read:");
    this.currentMeterReadInput = page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this.electricServiceRadioButton = page.locator("#e");
    this.electricGasServiceRadioButton = page.locator("#eg");
    this.howToReadYourBillButton = page.locator("#howToReadYourBillBtn");
    this.howToFindUsageButton = page.locator("#howToFindUsageBtn");
    this.resetButton = page.locator("#rateCalCancelBtn");
    this.calculateButton = page.locator("#validateMoveInBtn");
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the specified service type radio button.
   * @param serviceType 'Electric' or 'Electric & Gas'
   */
  async selectServiceType(serviceType: 'Electric' | 'Electric & Gas'): Promise<void> {
    if (serviceType === 'Electric') {
      await this.electricServiceRadioButton.click();
    } else if (serviceType === 'Electric & Gas') {
      await this.electricGasServiceRadioButton.click();
    } else {
      throw new Error(`Invalid service type: ${serviceType}`);
    }
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthName The full name of the month (e.g., 'October').
   */
  async selectMonth(monthName: string): Promise<void> {
    // Find the value associated with the monthName from the catalog options
    let monthValue: string | undefined;
    switch (monthName) {
      case 'June': monthValue = 'm06'; break;
      case 'July': monthValue = 'm07'; break;
      case 'August': monthValue = 'm08'; break;
      case 'September': monthValue = 'm09'; break;
      case 'October': monthValue = 'm10'; break;
      case 'November': monthValue = 'm11'; break;
      case 'December': monthValue = 'm12'; break;
      case 'Janaury': monthValue = 'm01'; break;
      case 'February': monthValue = 'm02'; break;
      case 'March': monthValue = 'm03'; break;
      case 'April': monthValue = 'm04'; break;
      case 'May': monthValue = 'm05'; break;
      default: throw new Error(`Month '${monthName}' not found in dropdown options.`);
    }
    if (monthValue) {
      await this.monthDropdown.selectOption({ value: monthValue });
    }
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousMeterReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentMeterReadInput.fill(readValue);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Gets the selected month's value from the dropdown.
   * @returns The currently selected month's value (e.g., 'm10').
   */
  async getSelectedMonthValue(): Promise<string> {
    return this.monthDropdown.inputValue();
  }

  /**
   * Gets the value of the Estimated Electric use (kWh) field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the value of the Estimated Gas use (Ccf) field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the Electric Only service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return this.electricServiceRadioButton.isChecked();
  }

  /**
   * Checks if the Estimated Gas use (Ccf) input is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Gets the previous meter read value.
   * @returns The previous meter read value as a string.
   */
  async getPreviousMeterRead(): Promise<string> {
    return this.previousMeterReadInput.inputValue();
  }

  /**
   * Gets the current meter read value.
   * @returns The current meter read value as a string.
   */
  async getCurrentMeterRead(): Promise<string> {
    return this.currentMeterReadInput.inputValue();
  }
}
