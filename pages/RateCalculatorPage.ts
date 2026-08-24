import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly electricServiceRadio: Locator;
    private readonly electricAndGasServiceRadio: Locator;
    private readonly calculateButton: Locator;
    private readonly resetButton: Locator;
    private readonly estimatedElectricUsageInput: Locator;
    private readonly estimatedGasUsageInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.electricServiceRadio = page.locator('#e');
        this.electricAndGasServiceRadio = page.locator('#eg');
        this.calculateButton = page.locator('#validateMoveInBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.estimatedElectricUsageInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUsageInput = page.getByLabel('Estimated Gas use (Ccf):');
    }

    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
    }

    async enterPreviousRead(readValue: string): Promise<void> {
        await this.previousReadInput.fill(readValue);
    }

    async enterCurrentRead(readValue: string): Promise<void> {
        await this.currentReadInput.fill(readValue);
    }

    async selectServiceType(type: 'electric' | 'electricAndGas'): Promise<void> {
        switch (type) {
            case 'electric':
                await this.electricServiceRadio.check();
                break;
            case 'electricAndGas':
                await this.electricAndGasServiceRadio.check();
                break;
            default:
                throw new Error(`Unsupported service type: ${type}`);
        }
    }

    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    async getSelectedMonthValue(): Promise<string> {
        return await this.monthDropdown.inputValue();
    }

    async getPreviousReadValue(): Promise<string> {
        return await this.previousReadInput.inputValue();
    }

    async getCurrentReadValue(): Promise<string> {
        return await this.currentReadInput.inputValue();
    }

    async getEstimatedElectricUsage(): Promise<string> {
        return await this.estimatedElectricUsageInput.inputValue();
    }

    async getEstimatedGasUsage(): Promise<string> {
        return await this.estimatedGasUsageInput.inputValue();
    }

    async getElectricServiceRadioStatus(): Promise<boolean> {
        return await this.electricServiceRadio.isChecked();
    }

    async getElectricAndGasServiceRadioStatus(): Promise<boolean> {
        return await this.electricAndGasServiceRadio.isChecked();
    }

    async calculateElectricBill(month: string, prevRead: string, currentRead: string): Promise<void> {
        await this.selectMonth(month);
        await this.enterPreviousRead(prevRead);
        await this.enterCurrentRead(currentRead);
        await this.selectServiceType('electric');
        await this.clickCalculate();
    }

    async calculateElectricAndGasBill(month: string, prevRead: string, currentRead: string): Promise<void> {
        await this.selectMonth(month);
        await this.enterPreviousRead(prevRead);
        await this.enterCurrentRead(currentRead);
        await this.selectServiceType('electricAndGas');
        await this.clickCalculate();
    }
}