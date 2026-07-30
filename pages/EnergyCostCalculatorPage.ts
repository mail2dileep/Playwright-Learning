import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricAndGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricAndGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous meter read input field.
   * @param value The previous meter read value.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the current meter read input field.
   * @param value The current meter read value.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricAndGasServiceRadioButton.check();
  }

  /**
   * Clicks the 'How to Read Your Bill' button/link.
   */
  async clickHowToReadYourBillLink(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button/link.
   */
  async clickHowToFindUsageLink(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if a prominent element of the calculator section is visible.
   * @returns A boolean indicating if the calculator section appears visible.
   */
  async isCalculatorSectionVisible(): Promise<boolean> {
    return await this.monthDropdown.isVisible();
  }

  /**
   * Checks if the 'Electric only' service option is visible.
   * @returns A boolean indicating if the option is visible.
   */
  async isElectricServiceOptionPresent(): Promise<boolean> {
    return await this.electricServiceRadioButton.isVisible();
  }

  /**
   * Checks if the 'Electric and Gas' service option is visible.
   * @returns A boolean indicating if the option is visible.
   */
  async isElectricAndGasServiceOptionPresent(): Promise<boolean> {
    return await this.electricAndGasServiceRadioButton.isVisible();
  }

  /**
   * Checks if the 'How to Read Your Bill' link is visible.
   * @returns A boolean indicating if the link is visible.
   */
  async isHowToReadYourBillLinkVisible(): Promise<boolean> {
    return await this.howToReadYourBillButton.isVisible();
  }

  /**
   * Checks if the 'How to Find Usage' link is visible.
   * @returns A boolean indicating if the link is visible.
   */
  async isHowToFindUsageLinkVisible(): Promise<boolean> {
    return await this.howToFindUsageButton.isVisible();
  }

  /**
   * Retrieves the currently selected value from the month dropdown.
   * @returns The value of the selected month.
   */
  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the value from the previous meter read input field.
   * @returns The value in the previous read input field.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the current meter read input field.
   * @returns The value in the current read input field.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The estimated electric use value.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) value.
   * @returns The estimated gas use value.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }
}