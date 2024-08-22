import { test as base } from '@playwright/test';
import { RegitrationPage } from '../pageObjects/registrationPage';
import { LoginPage } from '../pageObjects/loginPage';
import { GamePage } from '../pageObjects/gamePage';
import { PostIssueService } from "../helpers/postIssue.service";

export type gamdomFixtures = {
    registration: RegitrationPage;
	login: LoginPage;
	game: GamePage;
	api: PostIssueService
};

export const gamdom = base.extend<gamdomFixtures>({
    
    registration: async ({ page }, use, worker) => {
		const registration = new RegitrationPage(page, worker);
		await use(registration);
	},
	login: async ({ page }, use, worker) => {
		const login = new LoginPage(page, worker);
		await use(login);
	},
	game: async ({ page }, use, worker) => {
		const game = new GamePage(page, worker);
		await use(game);
	},
	api: async ({ request }, use, worker) => {
		const api = new PostIssueService(request, worker);
		await use(api);
	},

})