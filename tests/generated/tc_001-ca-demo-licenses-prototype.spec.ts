import { test, expect } from '@playwright/test';
import { CADemoLicensesPage } from '../../pages/CADemoLicensesPage';

// Requirement ID: MTX-4559
// Test Name: TC_001
// Objective: Verify the navigation and accessibility of the CA Demo Licenses clickable prototype.

test.describe('MTX-4559 - TC_001 - CA Demo Licenses Prototype', () => {
  test('Verify prototype loads and primary flow navigation works', async ({ page }) => {
    const prototypeUrl = process.env.PROTOTYPE_URL || 'https://example.com/ca-demo-licenses-prototype';

    const proto = new CADemoLicensesPage(page);

    // Step 1: Access the clickable prototype URL
    await proto.open(prototypeUrl);

    // Assertions for Step 1: Prototype loads successfully without errors
    await expect.soft(await proto.isLoaded()).toBeTruthy();
    expect(proto.getConsoleErrors(), 'No console errors should be present on load').toHaveLength(0);

    // Capture initial state for later comparison
    const initialState = await proto.getCurrentState();

    // Step 2: Navigate through the primary user flow for CA Demo Licenses
    const visibleCtasBefore = await proto.getVisiblePrimaryCtas();
    const navResult = await proto.navigatePrimaryFlow(5);

    // Assertions for Step 2: Interactive elements respond correctly and lead to expected screens
    // At least one CTA should have been actionable in the primary flow
    expect(navResult.stepsTaken, 'At least one primary CTA should be clickable').toBeGreaterThan(0);

    // There should be at least one screen transition indicated by URL or heading change
    expect(navResult.transitions, 'Navigation should lead to a different screen at least once').toBeGreaterThan(0);

    // After interactions, no console errors should be present
    expect(proto.getConsoleErrors(), 'No console errors should occur during navigation').toHaveLength(0);

    // Additional soft checks for visibility of CTAs before navigation (informational)
    await test.step('Validate presence of primary CTAs on initial screen (informational)', async () => {
      await expect.soft(visibleCtasBefore.length, 'Primary CTAs should be detectable on the initial screen').toBeGreaterThan(0);
    });

    // Final state validations (informational)
    const finalState = await proto.getCurrentState();
    await test.step('Verify a change in URL or title occurred (informational)', async () => {
      const urlChanged = finalState.url !== initialState.url;
      const titleChanged = finalState.title !== initialState.title;
      await expect.soft(urlChanged || titleChanged).toBeTruthy();
    });
  });
});
