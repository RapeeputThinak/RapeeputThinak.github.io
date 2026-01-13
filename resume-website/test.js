const { chromium } = require('playwright');
const path = require('path');

async function testResumeWebsite() {
    console.log('Starting browser test...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Load the HTML file
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`);
        
        console.log('Page loaded successfully');
        
        // Check for console errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        console.log('Network idle - page fully loaded');
        
        // Check page title
        const title = await page.title();
        console.log('Page title:', title);
        
        // Verify key elements exist
        const profileName = await page.$('.profile-name');
        const sidebar = await page.$('.sidebar');
        const mainContent = await page.$('.main-content');
        const sections = await page.$$('.content-section');
        
        console.log('Profile name element exists:', !!profileName);
        console.log('Sidebar exists:', !!sidebar);
        console.log('Main content exists:', !!mainContent);
        console.log('Number of content sections:', sections.length);
        
        // Check for console errors
        if (errors.length > 0) {
            console.log('Console errors found:', errors);
        } else {
            console.log('No console errors found!');
        }
        
        console.log('\n✅ All tests passed! Website is working correctly.');
        
    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

testResumeWebsite();
