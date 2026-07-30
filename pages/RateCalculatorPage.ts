import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceRadio: Locator;
    private readonly electricGasServiceRadio: Locator;
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
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // This input is disabled as per catalog
        this.electricServiceRadio = page.locator('#e');
        this.electricGasServiceRadio = page.locator('#eg');
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
     * Enters the previous meter read value.
     * @param read The previous read value as a string.
     */
    async enterPreviousRead(read: string): Promise<void> {
        await this.previousReadInput.fill(read);
    }

    /**
     * Enters the current meter read value.
     * @param read The current read value as a string.
     */
    async enterCurrentRead(read: string): Promise<void> {
        await this.currentReadInput.fill(read);
    }

    /**
     * Selects the 'Electric Only' service type radio button.
     */
    async selectElectricServiceType(): Promise<void> {
        await this.electricServiceRadio.check();
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     */
    async selectElectricGasServiceType(): Promise<void> {
        await this.electricGasServiceRadio.check();
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

    /**
     * Returns the Locator for the Month dropdown.
     * This is used for assertions in the test spec.
     * @returns Locator for the Month dropdown.
     */
    getMonthDropdownLocator(): Locator {
        return this.monthDropdown;
    }

    /**
     * Returns the Locator for the Previous Read input field.
     * This is used for assertions in the test spec.
     * @returns Locator for the Previous Read input.
     */
    getPreviousReadInputLocator(): Locator {
        return this.previousReadInput;
    }

    /**
     * Returns the Locator for the Current Read input field.
     * This is used for assertions in the test spec.
     * @returns Locator for the Current Read input.
     */
    getCurrentReadInputLocator(): Locator {
        return this.currentReadInput;
    }

    /**
     * Returns the Locator for the Estimated Electric use (kWh) input field.
     * This is used for assertions in the test spec.
     * @returns Locator for Estimated Electric use input.
     */
    getEstimatedElectricUseInputLocator(): Locator {
        return this.estimatedElectricUseInput;
    }

    /**
     * Returns the Locator for the Estimated Gas use (Ccf) input field.
     * Note: This field is expected to be disabled as per the locator catalog.
     * This is used for assertions in the test spec.
     * @returns Locator for Estimated Gas use input.
     */
    getEstimatedGasUseInputLocator(): Locator {
        return this.estimatedGasUseInput;
    }

    /**
     * Returns the Locator for the Calculate button.
     * This is used for assertions in the test spec.
     * @returns Locator for the Calculate button.
     */
    getCalculateButtonLocator(): Locator {
        return this.calculateButton;
    }
}
