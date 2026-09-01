import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
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

    constructor(private page: Page) {
        this.monthSelect = page.getByLabel('Month');
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
     * Navigates to the rate calculator page.
     * @param url The URL of the rate calculator page.
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Selects a month from the dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthSelect.selectOption({ value: monthValue });
    }

    /**
     * Retrieves the currently selected month value from the dropdown.
     * @returns The value attribute of the selected option or null if none is selected.
     */
    async getSelectedMonthValue(): Promise<string | null> {
        return this.monthSelect.inputValue();
    }

    /**
     * Enters the previous meter reading.
     * @param value The previous meter read value.
     */
    async enterPreviousRead(value: string): Promise<void> {
        await this.previousReadInput.fill(value);
    }

    /**
     * Retrieves the value of the previous meter read input field.
     * @returns The value of the previous meter read as a string.
     */
    async getPreviousReadValue(): Promise<string> {
        return this.previousReadInput.inputValue();
    }

    /**
     * Enters the current meter reading.
     * @param value The current meter read value.
     */
    async enterCurrentRead(value: string): Promise<void> {
        await this.currentReadInput.fill(value);
    }

    /**
     * Retrieves the value of the current meter read input field.
     * @returns The value of the current meter read as a string.
     */
    async getCurrentReadValue(): Promise<string> {
        return this.currentReadInput.inputValue();
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
     * Clicks the 'Calculate' button to compute the rates.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the 'Reset' button to clear the form.
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
     * Retrieves the estimated electric use value.
     * @returns The estimated electric use (kWh) as a string.
     */
    async getEstimatedElectricUse(): Promise<string> {
        return this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the estimated gas use value.
     * @returns The estimated gas use (Ccf) as a string.
     */
    async getEstimatedGasUse(): Promise<string> {
        return this.estimatedGasUseInput.inputValue();
    }

    /**
     * Checks if the estimated gas use input field is disabled.
     * @returns True if disabled, false otherwise.
     */
    async isEstimatedGasUseDisabled(): Promise<boolean> {
        return this.estimatedGasUseInput.isDisabled();
    }

    /**
     * Checks if the electric service radio button is selected.
     * @returns True if selected, false otherwise.
     */
    async isElectricServiceSelected(): Promise<boolean> {
        return this.electricServiceRadio.isChecked();
    }

    /**
     * Checks if the electric and gas service radio button is selected.
     * @returns True if selected, false otherwise.
     */
    async isElectricAndGasServiceSelected(): Promise<boolean> {
        return this.electricAndGasServiceRadio.isChecked();
    }
}