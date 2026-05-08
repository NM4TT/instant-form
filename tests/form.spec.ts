import { test, expect } from '@playwright/test';

test.describe('Form Flow', () => {
  test('should load the form and navigate steps with sections', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page.locator('main h1').first()).toContainText('The AI Perspective Survey');
    
    // Check first section title (using the span in the progress bar area)
    await expect(page.locator('span:text("The Impact of Innovation")')).toBeVisible();
    // Check progress percentage (1/3 * 100 = 33%)
    await expect(page.locator('text=33%')).toBeVisible();
    
    // Fill first page
    await page.click('button:text("★") >> nth=3'); // 4th star
    await page.selectOption('select[id="daily_usage"]', 'Daily');

    // Go to next page
    await page.click('button[aria-label="Next"]');
    // Check progress percentage (2/3 * 100 = 67%)
    await expect(page.locator('text=67%')).toBeVisible();
    
    await expect(page.locator('label', { hasText: 'Rank your concerns regarding AI' })).toBeVisible();
    await page.fill('input[id="general_sentiment"]', 'I hope AI helps us solve climate change...');

    // Go to Summary page
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('h2')).toContainText('Verify Your Thoughts');
    await expect(page.locator('text=99%')).toBeVisible();
    
    // Check summary content
    await expect(page.locator('text=★★★★')).toBeVisible();
    await expect(page.locator('text=Daily')).toBeVisible();
    await expect(page.locator('text=Job Displacement → Data Privacy → AI Hallucinations → Loss of Human Creativity')).toBeVisible();
    await expect(page.locator('text=I hope AI helps us solve climate change...')).toBeVisible();

    // Final Submit
    await page.click('button[aria-label="Submit"]');
    await expect(page.locator('h2')).toContainText('Insight Received');
    await expect(page.locator('text=Thank you for contributing to this research')).toBeVisible();
  });

  test('should use dynamic About page name from YAML', async ({ page }) => {
    await page.goto('/');
    
    // Handle mobile menu if viewport is small
    const mobileMenuButton = page.locator('button[aria-label="Toggle Menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
    }

    // Check link name
    const aboutLink = page.locator('a', { hasText: 'About This Survey' }).filter({ visible: true });
    await expect(aboutLink).toBeVisible();

    await aboutLink.click();
    await expect(page.locator('main h1').first()).toContainText('About This Survey');
  });

  test('should be stateless and reset on reload', async ({ page }) => {
    await page.goto('/');
    // Fill something on second page to ensure we stay or check if it persists
    // Actually simpler to just fill something on first page and reload
    // Navigate to page 2.
    await page.click('button[aria-label="Next"]');
    await page.fill('input[id="general_sentiment"]', 'Temporary Data');
    
    await page.reload();
    
    // After reload we should be back at page 1
    await expect(page.locator('span:text("The Impact of Innovation")')).toBeVisible();
    // Navigate back to page 2 to check value
    await page.click('button[aria-label="Next"]');
    const value = await page.inputValue('input[id="general_sentiment"]');
    expect(value).toBe('');
  });

  test('about page should be accessible', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('main h1').first()).toContainText('About This Survey');
  });

  test('404 page should be accessible and dynamic', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('main h1').first()).toContainText('Survey Not Found');
    await expect(page.locator('text=The requested survey is currently unavailable')).toBeVisible();
  });
});
