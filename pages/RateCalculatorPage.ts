import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthSelect: Locator;
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
        // Locators based on Catalog and recommendedLocator priority
        this.monthSelect = page.getByLabel('Month'); // recommendedLocator: getByLabel('Month')
        this.previousReadInput = page.getByLabel('Enter Previous Read:'); // recommendedLocator: getByLabel('Enter Previous Read:')
        this.currentReadInput = page.getByLabel('Enter Current Read:'); // recommendedLocator: getByLabel('Enter Current Read:')
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):'); // recommendedLocator: getByLabel('Estimated Electric use (kWh):')
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // recommendedLocator: getByLabel('Estimated Gas use (Ccf):')
        this.electricServiceRadio = page.locator('#e'); // recommendedLocator: locator('#e')
        this.electricAndGasServiceRadio = page.locator('#eg'); // recommendedLocator: locator('#eg')
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn'); // recommendedLocator: locator('#howToReadYourBillBtn')
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn'); // recommendedLocator: locator('#howToFindUsageBtn')
        this.resetButton = page.locator('#rateCalCancelBtn'); // recommendedLocator: locator('#rateCalCancelBtn')
        this.calculateButton = page.locator('#validateMoveInBtn'); // recommendedLocator: locator('#validateMoveInBtn')
    }

    /**
     * Navigates to the rate calculator page.
     * @param url The URL of the page to navigate to.
     */
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Selects a month from the dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
     */
    async selectMonth(monthValue: string): Promise<void> {
        // Available options from catalog: m06, m07, m08, m09, m10, m11, m12, m01, m02, m03, m04, m05
        await this.monthSelect.selectOption(monthValue);
    }

    /**
     * Enters the previous meter read value.
     * @param readValue The previous meter read value.
     */
    async enterPreviousRead(readValue: string): Promise<void> {
        await this.previousReadInput.fill(readValue);
    }

    /**
     * Enters the current meter read value.
     * @param readValue The current meter read value.
     */
    async enterCurrentRead(readValue: string): Promise<void> {
        await this.currentReadInput.fill(readValue);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectElectricService(): Promise<void> {
        await this.electricServiceRadio.check();
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     */
    async selectElectricAndGasService(): Promise<void> {
        await this.electricAndGasServiceRadio.check();
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
     * Clicks the 'Reset' button to clear form fields. 
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Clicks the 'Calculate' button to compute estimated usage.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Retrieves the selected month's value from the dropdown.
     * @returns The value of the selected month.
     */
    async getMonthValue(): Promise<string> {
        return this.monthSelect.inputValue();
    }

    /**
     * Retrieves the value from the 'Estimated Electric use (kWh)' input field.
     * @returns The estimated electric usage in kWh.
     */
    async getEstimatedElectricUse(): Promise<string> {
        return this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the value from the 'Estimated Gas use (Ccf)' input field.
     * @returns The estimated gas usage in Ccf.
     */
    async getEstimatedGasUse(): Promise<string> {
        return this.estimatedGasUseInput.inputValue();
    }

    /**
     * Checks if the 'Estimated Gas use (Ccf)' input field is enabled.
     * @returns True if the field is enabled, false otherwise.
     */
    async isEstimatedGasUseEnabled(): Promise<boolean> {
        return this.estimatedGasUseInput.isEnabled();
    }
}
