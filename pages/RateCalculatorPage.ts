import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators defined based on the provided Locator Catalog and priority rules
  private readonly manageMyAccountAriaLabelLink: Locator; // priority 2
  private readonly usernameInput: Locator; // priority 3
  private readonly passwordInput: Locator; // priority 3
  private readonly electricUsageDropdown: Locator; // priority 3
  private readonly gasUsageDropdown: Locator; // priority 3

  // Priority 4 locators (id-based)
  private readonly linkCqGen43: Locator;
  private readonly loginButton: Locator;
  private readonly myHomeButton: Locator;
  private readonly myBusinessButton: Locator;
  private readonly constructionRenovationButton: Locator;
  private readonly workWithUsButton: Locator;
  private readonly customerSupportButton: Locator;
  private readonly aboutUsButton: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly cityLimitsYesRadio: Locator;
  private readonly cityLimitsNoRadio: Locator;
  private readonly trashCartSmallRadio: Locator;
  private readonly trashCartMediumRadio: Locator;
  private readonly trashCartLargeRadio: Locator;
  private readonly trashCartNoneRadio: Locator;

  // Priority 5 locators
  private readonly searchPlaceholderInput: Locator;

  // Priority 99 locators (text-based), disambiguated using .filter where necessary due to identical recommendedLocator string for distinct elements
  private readonly skipToMainContentLink: Locator;
  private readonly espanolLink: Locator;
  private readonly contactUsHeaderLink: Locator; // One of multiple 'Contact Us' links
  private readonly manageMyAccountTextLink: Locator; // 'Manage My Account' with href='#'
  private readonly enrollMyAccountLink: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly waysToPayLink: Locator;
  private readonly customerAssistanceProgramsLink: Locator;
  private readonly reconnectMyServicesLink: Locator;
  private readonly understandMyBillLink: Locator;
  private readonly outageCenterHeaderLink: Locator; // One of multiple 'Outage Center' links
  private readonly guideToReadBillLink: Locator;
  private readonly sanAntonioCityLimitsLink: Locator;
  private readonly sanAntonioCityTrashPickupLink: Locator;
  private readonly seeDetailsLink: Locator;

  // Footer links (disambiguated using href patterns)
  private readonly footerManageMyAccountLink: Locator;
  private readonly footerSignUpForMMALink: Locator;
  private readonly footerMyHomeBillingAcctLink: Locator;
  private readonly footerSmartGridLink: Locator;
  private readonly footerOutageCenterLink: Locator;
  private readonly footerMyHomeLink: Locator;
  private readonly footerSTEPMyHomeLink: Locator; // Sustainable Tomorrow Energy Plan (STEP) for My Home
  private readonly footerDoingBusinessWithUsLink: Locator;
  private readonly footerWiFiThermostatRewardsLink: Locator;
  private readonly footerSolarLink: Locator;
  private readonly footerEfficiencyProgramsLink: Locator;
  private readonly footerMyBusinessLink: Locator;
  private readonly footerConstructionRenovationLink: Locator;
  private readonly footerSTEPMyBusinessLink: Locator; // Sustainable Tomorrow Energy Plan (STEP) for My Business
  private readonly footerRequestServicesForMyBusinessLink: Locator;
  private readonly footerCommercialDemandResponseLink: Locator;
  private readonly footerAboutCPSEnergyLink: Locator;
  private readonly footerOurHistoryLink: Locator;
  private readonly footerCommunityLink: Locator;
  private readonly footerAgencyPartnerPortalLink: Locator;
  private readonly footerWorkWithUsFooterLink: Locator; // One of multiple 'Work With Us' links
  private readonly footerNewsroomLink: Locator;
  private readonly footerContactUsFooterLink: Locator; // One of multiple 'Contact Us' links
  private readonly footerScheduleCallbackLink: Locator;
  private readonly footerPrivacyPolicyLink: Locator;
  private readonly footerAccessibilityLink: Locator;
  private readonly footerEmployeeAccessLink: Locator;

  // Undefined recommendedLocator, inferred from tag and href
  private readonly externalLinkGeneric1: Locator; // href: https://www.cpsenergy.com/en/my-home/savings-programs.html
  private readonly externalLinkGeneric2: Locator; // href: https://www.cpsenergy.com/en/customer-support/customer-assist-programs.html
  private readonly externalLinkGeneric3: Locator; // href: https://www.cpsenergy.com/en/about-us/who-we-are/financial-information/fuel-charges.html
  private readonly facebookLink: Locator;
  private readonly twitterLink: Locator;
  private readonly youtubeLink: Locator;
  private readonly instagramLink: Locator;
  private readonly linkedInLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Priority 2 & 3 Locators
    this.manageMyAccountAriaLabelLink = page.getByLabel('Manage My Account');
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.electricUsageDropdown = page.getByLabel('Average estimated electric usage (kWh):\nhelp info');
    this.gasUsageDropdown = page.getByLabel('Average estimated gas usage (CCF):\nhelp info');

    // Priority 4 Locators
    this.linkCqGen43 = page.locator('#cq-gen43');
    this.loginButton = page.locator('#mmalgbtn');
    this.myHomeButton = page.locator('#my-home');
    this.myBusinessButton = page.locator('#my-business');
    this.constructionRenovationButton = page.locator('#construction-and-renovation');
    this.workWithUsButton = page.locator('#work-with-us');
    this.customerSupportButton = page.locator('#customer-support');
    this.aboutUsButton = page.locator('#about-us');
    this.electricServiceTypeRadio = page.locator('#serviceType01');
    this.electricGasServiceTypeRadio = page.locator('#serviceType02');
    this.cityLimitsYesRadio = page.locator('#citylimits01');
    this.cityLimitsNoRadio = page.locator('#citylimits02');
    this.trashCartSmallRadio = page.locator('#trashcart01');
    this.trashCartMediumRadio = page.locator('#trashcart02');
    this.trashCartLargeRadio = page.locator('#trashcart03');
    this.trashCartNoneRadio = page.locator('#trashcart04');

    // Priority 5 Locators
    this.searchPlaceholderInput = page.getByPlaceholder('Search');

    // Priority 99 Locators, disambiguated where necessary
    this.skipToMainContentLink = page.getByText('Skip to main content');
    this.espanolLink = page.getByText('Español');

    // Disambiguating 'Contact Us' links by href
    this.contactUsHeaderLink = page.getByText('Contact Us').filter({ has: page.locator('a[href="/content/corporate/en/customer-support/contact-us.html"]:not([href*="footerlink"])') }).first();

    // Disambiguating 'Manage My Account' links by href
    this.manageMyAccountTextLink = page.getByText('Manage My Account').filter({ has: page.locator('a[href="#"]').first() });
    this.enrollMyAccountLink = page.getByText('Enroll My Account');
    this.forgotPasswordLink = page.getByText('Forgot Password?');
    this.waysToPayLink = page.getByText('Ways to Pay');
    this.customerAssistanceProgramsLink = page.getByText('Customer Assistance Programs');
    this.reconnectMyServicesLink = page.getByText('Reconnect My Services');
    this.understandMyBillLink = page.getByText('Understand My Bill');

    // Disambiguating 'Outage Center' links by href
    this.outageCenterHeaderLink = page.getByText('Outage Center').filter({ has: page.locator('a[href="https://www.cpsenergy.com/en/customer-support/outage-center.html"]').first() });

    this.guideToReadBillLink = page.getByText('guide to help you read your bill');
    this.sanAntonioCityLimitsLink = page.getByText('San Antonio city limits');
    this.sanAntonioCityTrashPickupLink = page.getByText('San Antonio city trash pickup');
    this.seeDetailsLink = page.getByText('See details');

    // Footer links, disambiguated by href patterns
    this.footerManageMyAccountLink = page.getByText('Manage My Account').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerSignUpForMMALink = page.getByText('Sign Up For MMA');
    this.footerMyHomeBillingAcctLink = page.getByText('My Home Billing Acct');
    this.footerSmartGridLink = page.getByText('Smart Grid');
    this.footerOutageCenterLink = page.getByText('Outage Center').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerMyHomeLink = page.getByText('My Home').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerSTEPMyHomeLink = page.getByText('Sustainable Tomorrow Energy Plan (STEP)').filter({ has: page.locator('a[href*="/my-home/savenow.html"]').first() });
    this.footerDoingBusinessWithUsLink = page.getByText('Doing Business with Us');
    this.footerWiFiThermostatRewardsLink = page.getByText('WiFi Thermostat Rewards');
    this.footerSolarLink = page.getByText('Solar');
    this.footerEfficiencyProgramsLink = page.getByText('Efficiency Programs');
    this.footerMyBusinessLink = page.getByText('My Business').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerConstructionRenovationLink = page.getByText('Construction & Renovation').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerSTEPMyBusinessLink = page.getByText('Sustainable Tomorrow Energy Plan (STEP)').filter({ has: page.locator('a[href*="/my-business/savenow.html"]').first() });
    this.footerRequestServicesForMyBusinessLink = page.getByText('Request Services for My Business');
    this.footerCommercialDemandResponseLink = page.getByText('Commercial Demand Response');
    this.footerAboutCPSEnergyLink = page.getByText('About CPS Energy');
    this.footerOurHistoryLink = page.getByText('Our History');
    this.footerCommunityLink = page.getByText('Community');
    this.footerAgencyPartnerPortalLink = page.getByText('Agency Partner Portal');
    this.footerWorkWithUsFooterLink = page.getByText('Work With Us').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerNewsroomLink = page.getByText('Newsroom');
    this.footerContactUsFooterLink = page.getByText('Contact Us').filter({ has: page.locator('a[href*="footerlink"]').first() });
    this.footerScheduleCallbackLink = page.getByText('Schedule a callback');
    this.footerPrivacyPolicyLink = page.getByText('Privacy Policy');
    this.footerAccessibilityLink = page.getByText('Accessibility');
    this.footerEmployeeAccessLink = page.getByText('Employee Access');

    // Inferred locators (recommendedLocator was null, but sufficient metadata exists)
    this.externalLinkGeneric1 = page.locator('a[href="https://www.cpsenergy.com/en/my-home/savings-programs.html"]');
    this.externalLinkGeneric2 = page.locator('a[href="https://www.cpsenergy.com/en/customer-support/customer-assist-programs.html"]');
    this.externalLinkGeneric3 = page.locator('a[href="https://www.cpsenergy.com/en/about-us/who-we-are/financial-information/fuel-charges.html"]');
    this.facebookLink = page.locator('a[href="http://www.facebook.com/CPSEnergy"]');
    this.twitterLink = page.locator('a[href="http://twitter.com/cpsenergy"]');
    this.youtubeLink = page.locator('a[href="http://www.youtube.com/user/CPSEnergyvideo"]');
    this.instagramLink = page.locator('a[href="https://www.instagram.com/cpsenergy/"]');
    this.linkedInLink = page.locator('a[href="https://www.linkedin.com/company/cps-energy"]');
  }

  /**
   * Clicks the 'guide to help you read your bill' link and returns the URL of the opened popup.
   * @returns A Promise that resolves to the URL of the new page, or null if no popup opened.
   */
  async clickHowToReadYourBillLink(): Promise<string | null> {
    // Playwright's page.waitForEvent('popup') ensures we capture the new tab/window
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.guideToReadBillLink.click(),
    ]);
    // Wait for the new page to load its state
    await popup.waitForLoadState();
    return popup.url();
  }
}