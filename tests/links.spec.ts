import { test, expect } from '@playwright/test';

test.describe('Links', () => {
	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await expect(page.locator('.page')).toBeVisible({ timeout: 3000 });
	});

	test('renders all link cards', async ({ page }) => {
		const links = page.locator('.link-card');
		await expect(links).toHaveCount(7);
	});

	test('links have correct href attributes', async ({ page }) => {
		const githubLink = page.locator('.link-card', { hasText: 'GitHub' });
		await expect(githubLink).toHaveAttribute('href', 'https://github.com/stussysenik');
	});

	test('links open in new tab', async ({ page }) => {
		const firstLink = page.locator('.link-card').first();
		await expect(firstLink).toHaveAttribute('target', '_blank');
		await expect(firstLink).toHaveAttribute('rel', /noopener/);
	});

	test('profile card shows name', async ({ page }) => {
		await expect(page.locator('.name')).toContainText('Stüssy Senik');
	});

	test('profile card shows location', async ({ page }) => {
		await expect(page.locator('.location')).toContainText('NYC / PRAGUE');
	});
});
