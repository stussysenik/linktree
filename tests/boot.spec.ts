import { test, expect } from '@playwright/test';

test.describe('Boot Sequence', () => {
	test('shows boot screen on load', async ({ page }) => {
		await page.goto('/');
		const bootScreen = page.locator('.boot-screen');
		await expect(bootScreen).toBeVisible();
	});

	test('skip boot on click', async ({ page }) => {
		await page.goto('/');
		const bootScreen = page.locator('.boot-screen');
		await expect(bootScreen).toBeVisible();

		await page.click('.boot-screen');
		await expect(bootScreen).not.toBeVisible({ timeout: 2000 });
	});

	test('skip boot on Escape key', async ({ page }) => {
		await page.goto('/');
		const bootScreen = page.locator('.boot-screen');
		await expect(bootScreen).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(bootScreen).not.toBeVisible({ timeout: 2000 });
	});

	test('shows main content after boot', async ({ page }) => {
		await page.goto('/');
		await page.click('.boot-screen');

		await expect(page.locator('.page')).toBeVisible({ timeout: 3000 });
	});

	test('auto-skip with prefers-reduced-motion', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');

		// Boot screen should not appear, main content visible immediately
		await expect(page.locator('.page')).toBeVisible({ timeout: 3000 });
	});
});
