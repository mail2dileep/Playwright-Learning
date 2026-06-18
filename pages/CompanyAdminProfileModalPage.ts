import { Page, Locator } from '@playwright/test';

export class CompanyAdminProfileModalPage {
  private readonly page: Page;

  // Trigger candidates to open the Company Admin Profile modal
  private readonly openTriggerCandidates: Locator[];

  // Modal candidates
  private readonly modalCandidates: Locator[];

  // Field candidates
  private readonly nameInputCandidates: Locator[];
  private readonly emailInputCandidates: Locator[];

  // Action button candidates
  private readonly saveButtonCandidates: Locator[];

  // Success/transition indicators
  private readonly successCandidates: Locator[];

  constructor(page: Page) {
    this.page = page;

    // Potential triggers to open the modal (buttons/links)
    this.openTriggerCandidates = [
      page.getByRole('button', { name: /company admin profile|admin profile|add admin|edit admin|manage admin/i }),
      page.getByRole('link', { name: /company admin profile|admin profile|add admin|edit admin|manage admin/i }),
      page.locator('[data-testid="open-admin-profile"], [data-testid="admin-profile-trigger"]'),
      page.locator('button:has-text("Company Admin Profile"), button:has-text("Admin Profile"), a:has-text("Admin Profile"), a:has-text("Company Admin")')
    ];

    // Modal dialog candidates
    this.modalCandidates = [
      page.getByRole('dialog', { name: /company admin profile|admin profile|company admin/i }),
      page.locator('[role="dialog"]:visible'),
      page.locator('.ant-modal:visible, .modal:visible, .modal-dialog:visible')
    ];

    // Name input candidates
    this.nameInputCandidates = [
      page.getByLabel(/^name$/i),
      page.locator('input[placeholder*="Name" i]'),
      page.locator('input[name*="name" i], #adminName, [data-testid="admin-name"]')
    ];

    // Email input candidates
    this.emailInputCandidates = [
      page.getByLabel(/^email$/i),
      page.locator('input[type="email"]'),
      page.locator('input[placeholder*="Email" i]'),
      page.locator('input[name*="email" i], #adminEmail, [data-testid="admin-email"]')
    ];

    // Save/Continue action candidates
    this.saveButtonCandidates = [
      page.getByRole('button', { name: /save|continue/i }),
      page.locator('[data-testid="save-admin-profile"], [data-testid="continue-admin-profile"]')
    ];

    // Success or transition indicators after saving
    this.successCandidates = [
      page.getByText(/saved|success|profile updated/i).first(),
      page.getByRole('heading', { name: /next|details|summary|company/i }).first(),
      page.locator('[data-testid="toast-success"], .ant-message-success, .toast-success')
    ];
  }

  // Navigation
  async navigateTo(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  // Open the Admin Profile modal via best-effort triggers
  async openCompanyAdminProfileModal(): Promise<void> {
    await this.clickFirstAvailable(this.openTriggerCandidates, { timeout: 5000 });
    await this.waitForModalToOpen();
  }

  // Fill admin details
  async enterAdminDetails(name: string, email: string): Promise<void> {
    const nameInput = await this.getFirstAvailable(this.nameInputCandidates, true, 5000);
    await nameInput.fill(name);

    const emailInput = await this.getFirstAvailable(this.emailInputCandidates, true, 5000);
    await emailInput.fill(email);
  }

  // Click Save or Continue in the modal
  async clickSaveOrContinueButton(): Promise<void> {
    await this.clickFirstAvailable(this.saveButtonCandidates, { timeout: 5000 });
  }

  // State helpers
  async isModalDisplayed(): Promise<boolean> {
    const modal = await this.getVisibleModal(false);
    return modal !== null && await modal.isVisible();
  }

  async waitForModalToOpen(timeout: number = 5000): Promise<void> {
    const deadline = Date.now() + timeout;
    let lastError: unknown = undefined;
    while (Date.now() < deadline) {
      const modal = await this.getVisibleModal(false);
      if (modal) {
        try {
          await modal.waitFor({ state: 'visible', timeout: 250 });
          return;
        } catch (e) {
          lastError = e;
        }
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Company Admin Profile modal did not appear within ${timeout}ms. Last error: ${String(lastError)}`);
  }

  async waitForModalToClose(timeout: number = 5000): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const anyVisible = await this.isAnyModalVisible();
      if (!anyVisible) return;
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Company Admin Profile modal did not close within ${timeout}ms.`);
  }

  async isModalClosed(): Promise<boolean> {
    return !(await this.isAnyModalVisible());
  }

  async getNameFieldValue(): Promise<string> {
    const nameInput = await this.getFirstAvailable(this.nameInputCandidates, true, 5000);
    return nameInput.inputValue();
  }

  async getEmailFieldValue(): Promise<string> {
    const emailInput = await this.getFirstAvailable(this.emailInputCandidates, true, 5000);
    return emailInput.inputValue();
  }

  async hasSuccessIndicator(timeout: number = 3000): Promise<boolean> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      for (const cand of this.successCandidates) {
        try {
          if (await cand.first().isVisible()) return true;
        } catch {
          // ignore
        }
      }
      await this.page.waitForTimeout(100);
    }
    return false;
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Internal helpers
  private async clickFirstAvailable(candidates: Locator[], options?: { timeout?: number }): Promise<void> {
    const timeout = options?.timeout ?? 3000;
    const deadline = Date.now() + timeout;
    let lastError: unknown = undefined;

    while (Date.now() < deadline) {
      for (const cand of candidates) {
        const target = cand.first();
        try {
          if (await target.isVisible()) {
            await target.click({ timeout: 500 });
            return;
          }
        } catch (e) {
          lastError = e;
        }
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Unable to click any matching element within ${timeout}ms. Last error: ${String(lastError)}`);
  }

  private async getFirstAvailable(candidates: Locator[], requireVisible: boolean = true, timeout: number = 3000): Promise<Locator> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      for (const cand of candidates) {
        const target = cand.first();
        try {
          if (!requireVisible) {
            const count = await target.count();
            if (count > 0) return target;
          } else {
            if (await target.isVisible()) return target;
          }
        } catch {
          // ignore and continue
        }
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error('No matching element found for provided candidates.');
  }

  private async getVisibleModal(throwOnNone: boolean = false): Promise<Locator | null> {
    for (const m of this.modalCandidates) {
      try {
        const modal = m.first();
        if (await modal.isVisible()) return modal;
      } catch {
        // ignore and continue
      }
    }
    if (throwOnNone) {
      throw new Error('Company Admin Profile modal not visible');
    }
    return null;
  }

  private async isAnyModalVisible(): Promise<boolean> {
    for (const m of this.modalCandidates) {
      try {
        if (await m.first().isVisible()) return true;
      } catch {
        // ignore
      }
    }
    return false;
  }
}
