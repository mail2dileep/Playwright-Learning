import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

// Requirement ID: MTX-4559
// Test Name: TC_002
// Objective: Validate the 'Manage Demo License' button functionality and visibility.

test.describe('MTX-4559 | TC_002 | Manage Demo License button', () => {
  test('Validate visibility and navigation for Manage Demo License', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    // Navigate to dashboard
    await dashboard.goto();

    // Step 1: Validate button visibility and basic positioning
    const isVisible = await dashboard.isManageDemoLicenseButtonVisible();
    expect(isVisible).toBeTruthy();

    const box = await dashboard.getManageDemoLicenseButtonBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
    }

    // Step 2: Click and validate transition to management screen or modal
    await dashboard.clickManageDemoLicense();
    const destination = await dashboard.waitForDemoLicenseView();
    expect(destination).not.toBeNull();

    const onManagement = await dashboard.isOnDemoLicenseManagement();
    expect(onManagement).toBeTruthy();
  });
});
