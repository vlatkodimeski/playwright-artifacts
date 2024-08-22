import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
    //timeout: 90 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 30000
    },
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 0 : 0,
    workers: process.env.CI ? 2 : 1,
    reporter: [
      ['html', { open: 'never' }],
      ['junit', { outputFile: `./reports/junit.xml` }],
      ['allure-playwright']
  ],
    use: {
        actionTimeout: 30000,
        trace: "retain-on-failure",
        headless: process.env.CI ? true : true,
        screenshot: { mode: 'only-on-failure', fullPage: true },
        geolocation: { longitude: 14.3754, latitude: 35.9375 }, // Coordinates for Malta
        // locale: 'en-MT', // Locale for Malta
        // timezoneId: 'Europe/Malta', // Timezone for Malta
        permissions: ['geolocation'], // Allow geolocation permissions
        contextOptions: {
          geolocation: { longitude: 14.3754, latitude: 35.9375 },
          permissions: ['geolocation'],
          locale: 'en-MT',
        }
    },

  projects: [
    {
      name: `chromeMobile`,
      use: {
        trace: 'retain-on-failure',
        ...devices['Pixel 5'],
        browserName: 'chromium',
        launchOptions: {
          slowMo: 200
        }
      }
    },
    // {
    //   name: `Firefox`,
    //   use: {
    //     browserName: `firefox`,
    //     viewport: { width: 1720, height: 850 },
    //     ignoreHTTPSErrors: true,
    //     headless: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 200
    //     }
    //   }
    // },

    
  ],

  
});
