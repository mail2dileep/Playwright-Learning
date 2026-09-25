import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly electricServiceRadioButton: Locator;
    private readonly electricAndGasServiceRadioButton: Locator;
    private readonly calculateButton: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly resetButton: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators based on recommendedLocator from catalog
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.electricServiceRadioButton = page.locator('#e'); // Using id as per recommendedLocator
        this.electricAndGasServiceRadioButton = page.locator('#eg'); // Using id as per recommendedLocator
        this.calculateButton = page.locator('#validateMoveInBtn');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    }

    // Actions
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption({ value: monthValue });
    }

    async enterPreviousRead(read: string): Promise<void> {
        await this.previousReadInput.fill(read);
    }

    async enterCurrentRead(read: string): Promise<void> {
        await this.currentReadInput.fill(read);
    }

    async selectElectricService(): Promise<void> {
        await this.electricServiceRadioButton.check();
    }

    async selectElectricAndGasService(): Promise<void> {
        await this.electricAndGasServiceRadioButton.check();
    }

    async clickCalculateButton(): Promise<void> {
        await this.calculateButton.click();
    }

    async clickResetButton(): Promise<void> {
        await this.resetButton.click();
    }

    async clickHowToReadYourBill(): Promise<void> {
        await this.howToReadYourBillButton.click();
    }

    async clickHowToFindUsage(): Promise<void> {
        await this.howToFindUsageButton.click();
    }

    // Getters for verification (assertions in test spec)
    async getMonthSelectedValue(): Promise<string> {
        return this.monthDropdown.inputValue();
    }

    async getPreviousReadValue(): Promise<string> {
        return this.previousReadInput.inputValue();
    }

    async getCurrentReadValue(): Promise<string> {
        return this.currentReadInput.inputValue();
    }

    async getEstimatedElectricUse(): Promise<string> {
        return this.estimatedElectricUseInput.inputValue();
    }

    async getEstimatedGasUse(): Promise<string> {
        return this.estimatedGasUseInput.inputValue();
    }

    async isElectricServiceSelected(): Promise<boolean> {
        return this.electricServiceRadioButton.isChecked();
    }

    async isElectricAndGasServiceSelected(): Promise<boolean> {
        return this.electricAndGasServiceRadioButton.isChecked();
    }

    // Composite actions/workflows
    async performElectricCalculation(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
        await this.selectMonth(monthValue);
        await this.enterPreviousRead(previousRead);
        await this.enterCurrentRead(currentRead);
        // Ensure Electric service is selected, it might be default but good to explicitly set for the workflow
        await this.selectElectricService();
        await this.clickCalculateButton();
    }

    async performElectricAndGasCalculation(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
        await this.selectMonth(monthValue);
        await this.enterPreviousRead(previousRead);
        await this.enterCurrentRead(currentRead);
        await this.selectElectricAndGasService();
        await this.clickCalculateButton();
    }
}
