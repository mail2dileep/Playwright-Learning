import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceTypeRadio: Locator;
    private readonly electricAndGasServiceTypeRadio: Locator;
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
        this.electricServiceTypeRadio = page.locator('#e');
        this.electricAndGasServiceTypeRadio = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async selectMonth(monthValue: string): Promise<void> {
        // Options available: m06, m07, m08, m09, m10, m11, m12, m01, m02, m03, m04, m05
        await this.monthDropdown.selectOption(monthValue);
    }

    async enterPreviousRead(readValue: string): Promise<void> {
        await this.previousReadInput.fill(readValue);
    }

    async enterCurrentRead(readValue: string): Promise<void> {
        await this.currentReadInput.fill(readValue);
    }

    async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
        if (type === 'Electric') {
            await this.electricServiceTypeRadio.click();
        } else if (type === 'ElectricAndGas') {
            await this.electricAndGasServiceTypeRadio.click();
        } else {
            throw new Error(`Invalid service type: ${type}`);
        }
    }

    async clickHowToReadYourBill(): Promise<void> {
        await this.howToReadYourBillButton.click();
    }

    async clickHowToFindUsage(): Promise<void> {
        await this.howToFindUsageButton.click();
    }

    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    async getEstimatedElectricUse(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    async getEstimatedGasUse(): Promise<string> {
        return await this.estimatedGasUseInput.inputValue();
    }

    async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }

    async getPreviousReadValue(): Promise<string> {
        return await this.previousReadInput.inputValue();
    }

    async getCurrentReadValue(): Promise<string> {
        return await this.currentReadInput.inputValue();
    }
}
