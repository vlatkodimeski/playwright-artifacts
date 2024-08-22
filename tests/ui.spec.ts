import { gamdom } from "../fixtures/gamdom.fixture";
import { expect } from "@playwright/test";
import { baseUrl, loginDetails } from "../defaults/config.enums";

gamdom.describe("ui fixture", () => {
  let gameToPlay: string = 'Coins Of Alkemor';
  
  gamdom.use({
    geolocation: { longitude: 14.3754, latitude: 35.9375 },
    permissions: ['geolocation'],
  });
  gamdom.beforeEach(async ({ registration, context }) => {
    await context.setGeolocation({ longitude: 14.3754, latitude: 35.9375 });
    await registration.navigateToWebUi(baseUrl.Ui);
  });

  gamdom('Player can register', async ({ context, registration }) => {
    await context.setGeolocation({ longitude: 14.3754, latitude: 35.9375 });
    await registration.registerButtonClick();
    await registration.closePopUpNotification();
    await registration.populatePlayerDetails();
    await registration.agreeTAndcClick();
    await registration.startPlayingButtonClick();
    await registration.expectcloudFlareInterceptorToBeVisible();
});

  gamdom.skip('Player can login to the Ui with valid credentials', async ({ login, registration }) => {
    await login.clickSignInButton();
    await registration.closePopUpNotification();
    await login.populateSignInDetails(loginDetails.userName, loginDetails.passWord);
    await login.startPlayingSignInButtonClick();
    await login.expectcloudFlareLoginInterceptorToBeVisible();
});
  
  gamdom.skip('Player can open game while logged out', async ({ game }) => {
    await game.casinoClick();
    await game.searchGame(gameToPlay)
    await game.selectGameForPlay()
    await game.expectGameplayComponentToBeVisible();
});






});


