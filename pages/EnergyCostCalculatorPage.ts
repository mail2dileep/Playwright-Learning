import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricityServiceRadio: Locator;
  private readonly electricityGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators from the Catalog, ordered by priority and relevance
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricityServiceRadio = page.locator('#e'); // Recommended: locator('#e')
    this.electricityGasServiceRadio = page.locator('#eg'); // Recommended: locator('#eg')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn'); // Recommended: locator('#howToReadYourBillBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn'); // Recommended: locator('#howToFindUsageBtn')
    this.resetButton = page.locator('#rateCalCancelBtn'); // Recommended: locator('#rateCalCancelBtn')
    this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended: locator('#validateMoveInBtn')
  }

  /**
   * Navigates the page to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Checks if the main Rate Calculator section is visible on the page.
   * This method uses a prominent element within the section to determine overall section visibility.
   * @returns A promise that resolves to true if the section is visible, false otherwise.
   */
  async isRateCalculatorSectionVisible(): Promise<boolean> {
    await this.calculateButton.waitFor({ state: 'visible' });
    return await this.calculateButton.isVisible();
  }

  // --- Getter methods for individual locators to be used for assertions in the test spec ---

  getMonthDropdown(): Locator {
    return this.monthDropdown;
  }

  getPreviousReadInput(): Locator {
    return this.previousReadInput;
  }

  getCurrentReadInput(): Locator {
    return this.currentReadInput;
  }

  getEstimatedElectricUseInput(): Locator {
    return this.estimatedElectricUseInput;
  }

  getEstimatedGasUseInput(): Locator {
    return this.estimatedGasUseInput;
  }

  getElectricityServiceTypeRadio(): Locator {
    return this.electricityServiceRadio;
  }

  getElectricityGasServiceTypeRadio(): Locator {
    return this.electricityGasServiceRadio;
  }

  getCalculateButton(): Locator {
    return this.calculateButton;
  }

  getResetButton(): Locator {
    return this.resetButton;
  }

  getHowToReadYourBillButton(): Locator {
    return this.howToReadYourBillButton;
  }

  getHowToFindUsageButton(): Locator {
    return this.howToFindUsageButton;
  }
}
