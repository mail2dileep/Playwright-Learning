import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;

    // Locators
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceRadio: Locator;
    private readonly electricAndGasServiceRadio: Locator;
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
        this.electricServiceRadio = page.locator('#e');
        this.electricAndGasServiceRadio = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Selects a month from the dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
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
    async selectElectricService(): Promise<void> {
        await this.electricServiceRadio.click();
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     */
    async selectElectricAndGasService(): Promise<void> {
        await this.electricAndGasServiceRadio.click();
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

    // --- Getter methods for assertions in test spec ---
    /**
     * Returns the Locator for the Estimated Electric use (kWh) input field.
     * This allows the test spec to perform assertions on its state or value.
     */
    getEstimatedElectricUseLocator(): Locator {
        return this.estimatedElectricUseInput;
    }

    /**
     * Returns the Locator for the Estimated Gas use (Ccf) input field.
     * This allows the test spec to perform assertions on its state or value.
     */
    getEstimatedGasUseLocator(): Locator {
        return this.estimatedGasUseInput;
    }

    /**
     * Returns the Locator for the Month dropdown.
     */
    getMonthDropdownLocator(): Locator {
        return this.monthDropdown;
    }

    /**
     * Returns the Locator for the 'Enter Previous Read:' input field.
     */
    getPreviousReadInputLocator(): Locator {
        return this.previousReadInput;
    }

    /**
     * Returns the Locator for the 'Enter Current Read:' input field.
     */
    getCurrentReadInputLocator(): Locator {
        return this.currentReadInput;
    }

    /**
     * Returns the Locator for the 'Electric Only' service radio button.
     */
    getElectricServiceRadioLocator(): Locator {
        return this.electricServiceRadio;
    }

    /**
     * Returns the Locator for the 'Electric and Gas' service radio button.
     */
    getElectricAndGasServiceRadioLocator(): Locator {
        return this.electricAndGasServiceRadio;
    }
}