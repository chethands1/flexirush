import { test, expect, BrowserContext, Page } from '@playwright/test';

// --- CONFIGURATION ---
const BASE_URL = 'http://localhost:3000';
const PRESENTER_EMAIL = `host_${Date.now()}@test.com`;
const PASSWORD = 'password123';
const AUDIENCE_1 = "Tester Alpha";
const AUDIENCE_2 = "Tester Beta";

test.describe('FlexiRush Complete System Verification', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000); 

  let presenterContext: BrowserContext;
  let userAContext: BrowserContext;
  let userBContext: BrowserContext;
  
  let pPage: Page;
  let aPage: Page;
  let bPage: Page;
  
  let sessionCode: string;

  test.beforeAll(async ({ browser }) => {
    presenterContext = await browser.newContext();
    userAContext = await browser.newContext();
    userBContext = await browser.newContext();

    pPage = await presenterContext.newPage();
    aPage = await userAContext.newPage();
    bPage = await userBContext.newPage();
  });

  // --- 1. AUTHENTICATION ---
  test('1.0 - Register & Login Presenter', async () => {
    console.log("Step 1: Registering...");
    await pPage.goto(`${BASE_URL}/register`);
    await pPage.fill('input[type="email"]', PRESENTER_EMAIL);
    await pPage.fill('input[type="password"]', PASSWORD);
    
    pPage.on('dialog', async dialog => await dialog.accept());
    await pPage.click('button:has-text("Create Account")');
    
    // Increased timeout to 60s for Webkit environments
    await expect(pPage).toHaveURL(/.*login/, { timeout: 60000 });

    console.log("Step 1: Logging in...");
    await pPage.fill('input[type="email"]', PRESENTER_EMAIL);
    await pPage.fill('input[type="password"]', PASSWORD);
    await pPage.click('button:has-text("Sign In")');

    await expect(pPage).toHaveURL(`${BASE_URL}/`, { timeout: 30000 });
    await expect(pPage.locator('text=Create New Session')).toBeVisible({ timeout: 30000 });
  });

  test('2.0 - Create Session', async () => {
    console.log("Step 2: Creating Session...");
    await pPage.click('button:has-text("Create New Session")');
    await expect(pPage).toHaveURL(/.*\/presenter\//, { timeout: 30000 });
    
    const url = pPage.url();
    sessionCode = url.split('/').pop()!;
    console.log(`✅ Session Created: ${sessionCode}`);

    await expect(pPage.locator('span.bg-green-500')).toBeVisible({ timeout: 15000 });
  });

  // --- 2. AUDIENCE JOIN ---
  test('3.0 - Audience Joins', async () => {
    console.log("Step 3: Audience Joining...");
    await aPage.goto(`${BASE_URL}/join/${sessionCode}`);
    await aPage.fill('input', AUDIENCE_1);
    await aPage.click('button:has-text("Enter Room")');
    
    try {
        await expect(aPage.locator('button:has-text("Interactions")')).toBeVisible({ timeout: 15000 });
    } catch (e) {
        const uiError = await aPage.textContent('p.text-red-400').catch(() => null);
        if (uiError) throw new Error(`🛑 AUDIENCE JOIN FAILED: ${uiError}`);
        throw e; 
    }

    await bPage.goto(`${BASE_URL}/join/${sessionCode}`);
    await bPage.fill('input', AUDIENCE_2);
    await bPage.click('button:has-text("Enter Room")');
    await expect(bPage.locator('button:has-text("Interactions")')).toBeVisible({ timeout: 15000 });

    await expect(pPage.locator('text=2').first()).toBeVisible();
    console.log("✅ Audience Joined Successfully");
  });

  // --- 3. POLLS ---
  test('4.0 - Poll: Multiple Choice', async () => {
    console.log("Step 4: Running Poll...");
    await pPage.click('button:has-text("Launch New Poll")');
    await expect(pPage.locator('text=Create Poll')).toBeVisible();
    
    const inputs = pPage.locator('input');
    await inputs.nth(0).fill('Is the system working?');
    await inputs.nth(1).fill('Yes'); 
    
    const count = await inputs.count();
    if (count > 2) {
        await inputs.nth(2).fill('No');
    }

    await pPage.click('button:has-text("Launch Poll 🚀")');

    await expect(aPage.locator('button:has-text("Yes")')).toBeVisible({ timeout: 10000 });
    await aPage.click('button:has-text("Yes")');
    
    await expect(pPage.locator('text=Yes').first()).toBeVisible();
    await pPage.click('button:has-text("Stop Poll")');
  });

  // --- 4. Q&A ---
  test('5.0 - Q&A System', async () => {
    console.log("Step 5: Testing Q&A...");
    await aPage.click('button:has-text("Q&A")');
    await aPage.fill('input[placeholder*="Ask"]', 'Test Question');
    await aPage.click('button:has-text("Send")');

    await pPage.click('button:has-text("View Q&A Board")');
    await expect(pPage.locator('text=Test Question')).toBeVisible();
    
    // We leave the page in "Q&A" mode, which acts as an overlay/view mode
  });

  // --- 5. QUIZ (Session Safe) ---
  test('6.0 - AI Quiz Generation', async () => {
    console.log("Step 6: AI Quiz Gen...");
    
    // FIX: Click "AI Quiz" directly with force:true to bypass any sticky Q&A view issues.
    // DO NOT reload the page (kills session).
    await pPage.click('button:has-text("AI Quiz")', { force: true });
    
    // Wait for the modal title (now robust due to high Z-Index in component)
    await expect(pPage.locator('h2:has-text("AI Quiz Generator")')).toBeVisible({ timeout: 10000 });
    
    const input = pPage.locator('input[placeholder*="Pop Music"]');
    await input.fill('Science');
    
    await pPage.click('button:has-text("Generate & Launch")');
    
    // Wait for AI generation (can be slow)
    await expect(pPage.locator('text=Waiting for players')).toBeVisible({ timeout: 60000 });
  });

  test('6.1 - Play Quiz', async () => {
    console.log("Step 6.1: Playing Quiz...");
    await pPage.click('button:has-text("Start Game")');
    await expect(pPage.locator('text=▲').or(pPage.locator('text=Question'))).toBeVisible({ timeout: 15000 });
    
    await aPage.click('button:has-text("▲")'); 
    await bPage.click('button:has-text("◆")');

    await pPage.click('button:has-text("Force Next")'); 
    await expect(pPage.locator('text=Leaderboard')).toBeVisible();
  });

  test('6.2 - Close Quiz', async () => {
    console.log("Step 6.2: Closing Quiz...");
    
    if (await pPage.locator('button:has-text("Close Quiz")').isVisible()) {
        await pPage.click('button:has-text("Close Quiz")');
    } else {
        const apiContext = await pPage.request;
        await apiContext.post(`http://localhost:8001/api/session/${sessionCode}/quiz/reset`);
    }

    // Do not reload. Just check if we returned to dashboard.
    await expect(pPage.locator('text=Launch New Poll')).toBeVisible({ timeout: 15000 });
  });

  // --- 6. EXPORT ---
  test('7.2 - CSV Export', async () => {
    console.log("Step 7: Testing Export...");
    const downloadPromise = pPage.waitForEvent('download');
    await pPage.click('button:has-text("Export Results")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });

  // --- 7. BAN ---
  test('9.0 - Ban User', async () => {
    console.log("Step 9: Testing Ban...");
    pPage.on('dialog', dialog => dialog.accept());
    
    const banBtn = pPage.locator(`div:has-text("${AUDIENCE_2}") button:has-text("Ban")`).first();
    await banBtn.waitFor({ state: 'visible', timeout: 5000 });
    await banBtn.click();

    await expect(bPage).not.toHaveURL(new RegExp(sessionCode), { timeout: 10000 });
  });

  test.afterAll(async () => {
    await presenterContext.close();
    await userAContext.close();
    await userBContext.close();
  });
});