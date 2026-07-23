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
    }

    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption({ value: monthValue });
    }

    async enterPreviousRead(value: string): Promise<void> {
        await this.previousReadInput.fill(value);
    }

    async enterCurrentRead(value: string): Promise<void> {
        await this.currentReadInput.fill(value);
    }

    async selectElectricServiceType(): Promise<void> {
        await this.electricServiceTypeRadio.click();
    }

    async selectElectricAndGasServiceType(): Promise<void> {
        await this.electricAndGasServiceTypeRadio.click();
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

    getMonthDropdownLocator(): Locator {
        return this.monthDropdown;
    }

    getPreviousReadInputLocator(): Locator {
        return this.previousReadInput;
    }

    getCurrentReadInputLocator(): Locator {
        return this.currentReadInput;
    }

    getEstimatedElectricUseInputLocator(): Locator {
        return this.estimatedElectricUseInput;
    }

    getEstimatedGasUseInputLocator(): Locator {
        return this.estimatedGasUseInput;
    }

    getElectricServiceTypeRadioLocator(): Locator {
        return this.electricServiceTypeRadio;
    }

    getElectricAndGasServiceTypeRadioLocator(): Locator {
        return this.electricAndGasServiceTypeRadio;
    }

    getResetButtonLocator(): Locator {
        return this.resetButton;
    }

    getCalculateButtonLocator(): Locator {
        return this.calculateButton;
    }
}
