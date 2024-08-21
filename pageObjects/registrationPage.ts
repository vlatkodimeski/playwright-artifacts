import { Page, BrowserContext, expect } from "@playwright/test"
import { registrationLocators } from "../locators/registrationLocators";
import { faker } from "@faker-js/faker";
import { getSetOfDigits, makeid } from "../helpers/helpers.fieldGenerators";

export class RegitrationPage {
    page: Page;
    worker: any;

    constructor(page: Page, worker: any) {
        this.worker = worker;
        this.page = page;
    }
   
    async navigateToWebUi(casino: string){
        await this.page.goto(casino);  
    }
    async registerButtonClick(): Promise<void> {
        await this.page.locator(registrationLocators.registerButtonClick).click();
    }
    async populatePlayerDetails(): Promise<void> {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName(); 
        await this.page.locator(registrationLocators.usernameInput).fill(firstName + "-" + getSetOfDigits(3));
        await this.page.locator(registrationLocators.passwordInput).fill(makeid(10) + "!");
        await this.page.locator(registrationLocators.emailInput).fill(firstName + "." + lastName + getSetOfDigits(3) + "@gmail.com");
    }
    async agreeTAndcClick(): Promise<void> {
        await this.page.locator(registrationLocators.agreeTAndC).click();
    }
    async startPlayingButtonClick(): Promise<void> {
        await this.page.locator(registrationLocators.startPlayingClick).click();
    }
    async expectcloudFlareInterceptorToBeVisible(): Promise<void> {
        await expect(this.page.locator(registrationLocators.cloudFlareInterceptorRegistration)).toBeVisible();
    }
    async closePopUpNotification(): Promise<void> {
        const button = this.page.locator("#onesignal-slidedown-cancel-button");
        await button.waitFor({ state: 'visible' });
        const isButtonVisibleAndEnabled = await button.isVisible() && await button.isEnabled();
      
        if (isButtonVisibleAndEnabled) {
          await button.click();
        }
      }
}