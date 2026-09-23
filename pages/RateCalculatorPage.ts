import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
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
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricServiceRadioButton = page.locator('#e');
        this.electricGasServiceRadioButton = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
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
        await this.monthDropdown.selectOption(monthValue);
    }

    /**
     * Enters a value into the previous meter read input field.
     * @param readValue The previous meter read value as a string.
     */
    async enterPreviousRead(readValue: string): Promise<void> {
        await this.previousReadInput.fill(readValue);
    }

    /**
     * Enters a value into the current meter read input field.
     * @param readValue The current meter read value as a string.
     */
    async enterCurrentRead(readValue: string): Promise<void> {
        await this.currentReadInput.fill(readValue);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectServiceTypeElectric(): Promise<void> {
        await this.electricServiceRadioButton.click();
    }

    /**
     * Selects the 'Electric/Gas' service type radio button.
     */
    async selectServiceTypeElectricGas(): Promise<void> {
        await this.electricGasServiceRadioButton.click();
    }

    /**
     * Clicks the 'Calculate' button to compute usage.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the 'Reset' button to clear all form fields.
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Retrieves the estimated electric use value from the input field.
     * @returns The estimated electric use as a string.
     */
    async getEstimatedElectricUse(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the estimated gas use value from the input field.
     * @returns The estimated gas use as a string.
     */
    async getEstimatedGasUse(): Promise<string> {
        return await this.estimatedGasUseInput.inputValue();
    }

    /**
     * Checks if the estimated gas use input field is disabled.
     * @returns True if the field is disabled, false otherwise.
     */
    async isEstimatedGasUseInputDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }

    /**
     * Retrieves the value from the previous meter read input field.
     * @returns The previous read value as a string.
     */
    async getPreviousReadValue(): Promise<string> {
        return await this.previousReadInput.inputValue();
    }

    /**
     * Retrieves the value from the current meter read input field.
     * @returns The current read value as a string.
     */
    async getCurrentReadValue(): Promise<string> {
        return await this.currentReadInput.inputValue();
    }

    /**
     * Retrieves the value of the currently selected month in the dropdown.
     * @returns The value attribute of the selected month as a string.
     */
    async getSelectedMonthValue(): Promise<string> {
        return await this.monthDropdown.inputValue();
    }

    /**
     * Checks if the 'Electric' service type radio button is selected.
     * @returns True if the radio button is checked, false otherwise.
     */
    async isElectricServiceTypeSelected(): Promise<boolean> {
        return await this.electricServiceRadioButton.isChecked();
    }

    /**
     * Checks if the 'Electric/Gas' service type radio button is selected.
     * @returns True if the radio button is checked, false otherwise.
     */
    async isElectricGasServiceTypeSelected(): Promise<boolean> {
        return await this.electricGasServiceRadioButton.isChecked();
    }
}