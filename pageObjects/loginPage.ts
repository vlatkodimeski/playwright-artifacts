import { Page, BrowserContext, expect } from "@playwright/test"
import { loginLocators } from "../locators/loginLocators";
import { registrationLocators } from "../locators/registrationLocators";

export class LoginPage {
    page: Page;
    worker: any;

    constructor(page: Page, worker: any) {
        this.worker = worker;
        this.page = page;
    }
   
    async clickSignInButton(): Promise<void> {
        await this.page.locator(loginLocators.clickSignInButtonClick).click();
    }
    async populateSignInDetails(userName: string, passWord: string): Promise<void> { 
        await this.page.locator(registrationLocators.usernameInput).fill(userName);
        await this.page.locator(registrationLocators.passwordInput).fill(passWord);
    }
    async startPlayingSignInButtonClick(): Promise<void> {
        await this.page.locator(loginLocators.startPlayingLoginClick).click();
    }
    async expectcloudFlareLoginInterceptorToBeVisible(): Promise<void> {
        await expect(this.page.locator(loginLocators.cloudFlareInterceptorLogin)).toBeVisible();
    }

}