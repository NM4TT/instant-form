import { test, expect } from '@playwright/test';

test.describe('Validation Enforcements', () => {
  test('should block navigation if required star rating is not filled', async ({ page }) => {
    await page.goto('/');
    
    // Attempt to go to next page without filling anything
    await page.click('button[aria-label="Next"]');
    
    // Should show error message
    await expect(page.locator('text=Please fill all required fields correctly.')).toBeVisible();
    
    // Now fill only the dropdown (question_2)
    await page.selectOption('select[id="question_2"]', 'Option 1');
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('text=Please fill all required fields correctly.')).toBeVisible();

    // Now fill the star rating (question_1)
    await page.click('button:text("★") >> nth=2'); // 3rd star
    
    // Error message should ideally disappear or at least navigation should work now
    await page.click('button[aria-label="Next"]');
    
    // We should be on the next page (Ranking question is question_3)
    await expect(page.locator('label', { hasText: 'The instructions for ordering items by priority' })).toBeVisible();
  });

  test('should block navigation if required ranking is not interacted with', async ({ page }) => {
    await page.goto('/');
    
    // Fill first page
    await page.click('button:text("★") >> nth=2');
    await page.selectOption('select[id="question_2"]', 'Option 1');
    await page.click('button[aria-label="Next"]');
    
    // We are on second page with Ranking
    await expect(page.locator('label', { hasText: 'The instructions for ordering items by priority' })).toBeVisible();
    
    // Attempt to go to next page without interacting with ranking
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('text=Please fill all required fields correctly.')).toBeVisible();
    
    // Move an item in ranking
    await page.click('button[aria-label="Move Down"] >> nth=0');
    
    // Fill the text question (question_4)
    await page.fill('input[id="question_4"]', 'Some response');
    
    // Now it should proceed to page 3 (Mask and Matrix)
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('label', { hasText: 'Enter your phone number' })).toBeVisible();

    // Attempt to go to summary without filling page 3
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('text=Please fill all required fields correctly.')).toBeVisible();

    // Fill phone number (question_5)
    await page.fill('input[id="question_5"]', '1234567890');
    // Check if mask applied (it should show formatted value)
    const maskValue = await page.inputValue('input[id="question_5"]');
    expect(maskValue).toBe('(123) 456-7890');

    // Still can't proceed without matrix
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('text=Please fill all required fields correctly.')).toBeVisible();

    // Fill matrix (question_6) - Select "Excellent" for all rows
    await page.check('input[name="question_6_Speed"][value="Excellent"]');
    await page.check('input[name="question_6_Design"][value="Excellent"]');
    await page.check('input[name="question_6_Ease of Use"][value="Excellent"]');

    // Now it should proceed to summary
    await page.click('button[aria-label="Next"]');
    await expect(page.locator('h2')).toContainText('Verify Your Thoughts');
  });
});
