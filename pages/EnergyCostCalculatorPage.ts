import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
    private readonly page: Page;
    // Public locators are exposed for direct assertions in the test layer, 
    // adhering to the Playwright POM pattern where assertions reside in test specs.
    public readonly rateCalculatorContainer: Locator;
    public readonly monthDropdown: Locator;
    public readonly previousReadInputField: Locator;
    public readonly currentReadInputField: Locator;
    // Estimated fields are defined for completeness, but not directly asserted for visibility in this spec.
    private readonly estimatedElectricUseField: Locator;
    private readonly estimatedGasUseField: Locator;
    public readonly electricServiceTypeRadio: Locator;
    public readonly electricGasServiceTypeRadio: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;
    public readonly resetButton: Locator;
    public readonly calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Inferring main container from 'parentContainer: "calculator_current"' in the Locator Catalog.
        // This ID locator is used to verify the overall calculator section visibility.
        this.rateCalculatorContainer = page.locator('#calculator_current');
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInputField = page.getByLabel('Enter Previous Read:');
        this.currentReadInputField = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricServiceTypeRadio = page.locator('#e');
        this.electricGasServiceTypeRadio = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Navigates to the specified URL.
     * @param url The URL to navigate to.
     */
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Selects an option from the month dropdown.
     * @param monthValue The value attribute of the month option to select (e.g., 'm06' for June).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
    }

    /**
     * Enters a value into the 'Enter Previous Read:' input field.
     * @param value The value to enter.
     */
    async enterPreviousRead(value: string): Promise<void> {
        await this.previousReadInputField.fill(value);
    }

    /**
     * Enters a value into the 'Enter Current Read:' input field.
     * @param value The value to enter.
     */
    async enterCurrentRead(value: string): Promise<void> {
        await this.currentReadInputField.fill(value);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectServiceTypeElectric(): Promise<void> {
        await this.electricServiceTypeRadio.check();
    }

    /**
     * Selects the 'Electric/Gas' service type radio button.
     */
    async selectServiceTypeElectricGas(): Promise<void> {
        await this.electricGasServiceTypeRadio.check();
    }

    /**
     * Clicks the 'Calculate' button.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the 'Reset' button.
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }
}
