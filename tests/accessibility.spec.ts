import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await expect(page.locator('.page')).toBeVisible({ timeout: 3000 });
	});

	test('skip link is present and functional', async ({ page }) => {
		const skipLink = page.locator('.skip-link');
		await expect(skipLink).toHaveAttribute('href', '#links');

		// Focus the skip link
		await page.keyboard.press('Tab');
		await expect(skipLink).toBeFocused();
	});

	test('all link cards have aria-labels', async ({ page }) => {
		const links = page.locator('.link-card');
		const count = await links.count();

		for (let i = 0; i < count; i++) {
			const label = await links.nth(i).getAttribute('aria-label');
			expect(label).toBeTruthy();
		}
	});

	test('decorative elements are hidden from assistive tech', async ({ page }) => {
		// CRT overlay and matrix canvas should not be visible since reduced-motion is on
		await expect(page.locator('.crt-overlay')).toHaveCount(0);
		await expect(page.locator('.matrix-rain')).toHaveCount(0);
	});

	test('keyboard navigation through links', async ({ page }) => {
		// Tab through to first link
		const firstLink = page.locator('.link-card').first();

		// Tab multiple times to reach the first link card
		for (let i = 0; i < 10; i++) {
			await page.keyboard.press('Tab');
			if (await firstLink.evaluate((el) => el === document.activeElement)) {
				break;
			}
		}

		// At least one link should be focusable
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});

	test('page has correct meta tags', async ({ page }) => {
		const title = await page.title();
		expect(title).toContain('Stüssy Senik');

		const description = await page.getAttribute('meta[name="description"]', 'content');
		expect(description).toBeTruthy();

		const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');
		expect(themeColor).toBe('#0a0a0f');
	});

	test('no matrix rain with reduced motion', async ({ page }) => {
		await expect(page.locator('canvas.matrix-rain')).toHaveCount(0);
	});
});
