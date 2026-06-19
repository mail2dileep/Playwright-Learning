import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly electricUsageDropdownLocator: Locator;
  private readonly gasUsageDropdownLocator: Locator;
  private readonly serviceTypeElectricOnlyRadioLocator: Locator;
  private readonly serviceTypeElectricGasRadioLocator: Locator;
  private readonly cityLimitsYesRadioLocator: Locator;
  private readonly cityLimitsNoRadioLocator: Locator;
  private readonly trashCartSmallRadioLocator: Locator;
  private readonly trashCartMediumRadioLocator: Locator;
  private readonly trashCartLargeRadioLocator: Locator;
  private readonly trashCartNoneRadioLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.electricUsageDropdownLocator = page.getByLabel('Average estimated electric usage (kWh):\nhelp info');
    this.gasUsageDropdownLocator = page.getByLabel('Average estimated gas usage (CCF):\nhelp info');
    this.serviceTypeElectricOnlyRadioLocator = page.locator('#serviceType01');
    this.serviceTypeElectricGasRadioLocator = page.locator('#serviceType02');
    this.cityLimitsYesRadioLocator = page.locator('#citylimits01');
    this.cityLimitsNoRadioLocator = page.locator('#citylimits02');
    this.trashCartSmallRadioLocator = page.locator('#trashcart01');
    this.trashCartMediumRadioLocator = page.locator('#trashcart02');
    this.trashCartLargeRadioLocator = page.locator('#trashcart03');
    this.trashCartNoneRadioLocator = page.locator('#trashcart04');
  }

  /**
   * Navigates to the Rate Estimator Residential page.
   * @param url The URL to navigate to.
   */
  async navigateToRateEstimatorResidentialPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Returns the Locator for the Electric Usage dropdown.
   */
  getElectricUsageDropdown(): Locator {
    return this.electricUsageDropdownLocator;
  }

  /**
   * Returns the Locator for the Gas Usage dropdown.
   */
  getGasUsageDropdown(): Locator {
    return this.gasUsageDropdownLocator;
  }

  /**
   * Returns the Locator for the "Electric Only" service type radio button.
   */
  getServiceTypeElectricOnlyRadio(): Locator {
    return this.serviceTypeElectricOnlyRadioLocator;
  }

  /**
   * Returns the Locator for the "Electric & Gas" service type radio button.
   */
  getServiceTypeElectricGasRadio(): Locator {
    return this.serviceTypeElectricGasRadioLocator;
  }

  /**
   * Returns the Locator for the "City Limits Yes" radio button.
   */
  getCityLimitsYesRadio(): Locator {
    return this.cityLimitsYesRadioLocator;
  }

  /**
   * Returns the Locator for the "City Limits No" radio button.
   */
  getCityLimitsNoRadio(): Locator {
    return this.cityLimitsNoRadioLocator;
  }

  /**
   * Returns the Locator for the "Small" trash cart radio button.
   */
  getTrashCartSmallRadio(): Locator {
    return this.trashCartSmallRadioLocator;
  }

  /**
   * Returns the Locator for the "Medium" trash cart radio button.
   */
  getTrashCartMediumRadio(): Locator {
    return this.trashCartMediumRadioLocator;
  }

  /**
   * Returns the Locator for the "Large" trash cart radio button.
   */
  getTrashCartLargeRadio(): Locator {
    return this.trashCartLargeRadioLocator;
  }

  /**
   * Returns the Locator for the "None" trash cart radio button.
   */
  getTrashCartNoneRadio(): Locator {
    return this.trashCartNoneRadioLocator;
  }

  // TODO: Locators for "Calculate/Reset buttons" were not found in the catalog and thus cannot be implemented.
}