import { Page, BrowserContext, expect } from "@playwright/test"
import { gameLocators } from "../locators/gameLocators";

export class GamePage {
    page: Page;
    worker: any;

    constructor(page: Page, worker: any) {
        this.worker = worker;
        this.page = page;
    }
   
    async casinoClick(): Promise<void> {
        await this.page.locator(gameLocators.casinoClick).click();
    }
    async searchGame(game: string): Promise<void> {
        await this.page.locator(gameLocators.searchGame).clear();
        await this.page.locator(gameLocators.searchGame).fill(game);
        await this.page.locator(gameLocators.searchGame).click();
    }
    async selectGameForPlay(): Promise<void> {
        await this.page.locator(gameLocators.selectGame).click();
    }
    async expectGameplayComponentToBeVisible(): Promise<void> {
        await expect(this.page.locator(gameLocators.gamePlayComponent)).toBeVisible();
    }
}