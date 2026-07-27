import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly monthDropdown: Locator;
    private readonly previousMeterReadInput: Locator;
    private readonly currentMeterReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricOnlyRadioButton: Locator;
    private readonly electricGasRadioButton: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;
    private readonly resetButton: Locator;
    private readonly calculateButton: Locator;

    constructor(private page: Page) {
        this.monthDropdown = page.getByLabel('Month');
        this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
        this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricOnlyRadioButton = page.locator('#e');
        this.electricGasRadioButton = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Selects the 'Electric only' service type option.
     */
    async selectServiceTypeElectricOnly(): Promise<void> {
        await this.electricOnlyRadioButton.click();
    }

    /**
     * Enters a value into the Previous Meter Read field.
     * @param value The value to enter.
     */
    async enterPreviousMeterRead(value: string): Promise<void> {
        await this.previousMeterReadInput.fill(value);
    }

    /**
     * Enters a value into the Current Meter Read field.
     * @param value The value to enter.
     */
    async enterCurrentMeterRead(value: string): Promise<void> {
        await this.currentMeterReadInput.fill(value);
    }

    /**
     * Clicks the Calculate button.
     */
    async clickCalculateButton(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Retrieves the current value of the Estimated Electric Use (kWh) field.
     * @returns A promise that resolves to the string value of the input.
     */
    async getEstimatedElectricUseValue(): Promise<string> {
        return this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Checks if the Current Meter Read input field is enabled.
     * @returns A promise that resolves to true if the field is enabled, false otherwise.
     */
    async isCurrentMeterReadInputEnabled(): Promise<boolean> {
        return this.currentMeterReadInput.isEnabled();
    }

    /**
     * Checks if the Estimated Gas Use (Ccf) input field is enabled.
     * @returns A promise that resolves to true if the field is enabled, false otherwise.
     */
    async isEstimatedGasUseInputEnabled(): Promise<boolean> {
        // Note: The locator catalog indicates 'gasconsumption' is disabled by default.
        // This method will reflect its current state after any interactions.
        return this.estimatedGasUseInput.isEnabled();
    }

    /**
     * Returns the locator for the Current Meter Read input field.
     * This method is provided to allow assertions on the locator in the test spec.
     * @returns The Locator object for the Current Meter Read input.
     */
    public getCurrentMeterReadInputLocator(): Locator {
        return this.currentMeterReadInput;
    }
}
