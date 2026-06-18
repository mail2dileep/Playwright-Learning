import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  private readonly btnManageDemoLicense: Locator;
  private readonly demoLicensePageHeader: Locator;
  private readonly demoLicenseModal: Locator;

  constructor(page: Page) {
    this.page = page;

    // Core UI elements
    this.btnManageDemoLicense = page.getByRole('button', { name: /^Manage Demo License$/ });

    // Destination views (either a full page view or a modal/dialog)
    this.demoLicensePageHeader = page.getByRole('heading', { name: /Demo License/i });
    this.demoLicenseModal = page.getByRole('dialog', { name: /Demo License/i });
  }

  // Navigation to Dashboard (relies on baseURL in Playwright config)
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  // Visibility helpers
  async isManageDemoLicenseButtonVisible(): Promise<boolean> {
    return await this.btnManageDemoLicense.isVisible();
  }

  // Geometry info for layout/position validations
  async getManageDemoLicenseButtonBox(): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const box = await this.btnManageDemoLicense.boundingBox();
    if (!box) return null;
    const { x, y, width, height } = box;
    return { x, y, width, height };
  }

  // User interactions
  async clickManageDemoLicense(): Promise<void> {
    await this.btnManageDemoLicense.click();
  }

  // Wait for the Demo License management destination (either a page or a modal)
  async waitForDemoLicenseView(timeout: number = 10000): Promise<'page' | 'modal' | null> {
    try {
      const result = await Promise.race([
        this.demoLicensePageHeader.waitFor({ state: 'visible', timeout }).then(() => 'page' as const),
        this.demoLicenseModal.waitFor({ state: 'visible', timeout }).then(() => 'modal' as const),
      ]);
      return result ?? null;
    } catch {
      return null;
    }
  }

  async isOnDemoLicenseManagement(): Promise<boolean> {
    const pageVisible = await this.demoLicensePageHeader.isVisible().catch(() => false);
    const modalVisible = await this.demoLicenseModal.isVisible().catch(() => false);
    return pageVisible || modalVisible;
  }
}

export default DashboardPage;
