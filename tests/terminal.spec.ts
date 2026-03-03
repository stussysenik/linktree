import { test, expect } from '@playwright/test';

test.describe('Terminal', () => {
	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await expect(page.locator('.page')).toBeVisible({ timeout: 3000 });

		// Open terminal
		await page.click('.terminal-header');
		await expect(page.locator('.terminal-body')).toBeVisible();
	});

	test('help command lists available commands', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('help');
		await input.press('Enter');

		await expect(page.locator('.terminal-body')).toContainText('Available commands');
	});

	test('whoami shows profile info', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('whoami');
		await input.press('Enter');

		await expect(page.locator('.terminal-body')).toContainText('Stüssy Senik');
	});

	test('ls lists links', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('ls');
		await input.press('Enter');

		await expect(page.locator('.terminal-body')).toContainText('GitHub');
	});

	test('neofetch shows system info', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('neofetch');
		await input.press('Enter');

		await expect(page.locator('.terminal-body')).toContainText('visitor@senik.dev');
	});

	test('sudo returns joke', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('sudo rm -rf /');
		await input.press('Enter');

		await expect(page.locator('.terminal-body')).toContainText('Nice try');
	});

	test('clear empties terminal', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('help');
		await input.press('Enter');
		await input.fill('clear');
		await input.press('Enter');

		// After clear, should not contain 'Available commands'
		await expect(page.locator('.terminal-body')).not.toContainText('Available commands');
	});

	test('unknown command shows error', async ({ page }) => {
		const input = page.locator('.terminal-input');
		await input.fill('nonexistent');
		await input.press('Enter');

		await expect(page.locator('.terminal-body')).toContainText('command not found');
	});
});
