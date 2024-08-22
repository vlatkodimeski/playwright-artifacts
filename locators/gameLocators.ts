export enum gameLocators {
    casinoClick = "(//p[contains(text(), 'Casino')])[1]",
    searchGame = "(//input[@type='text' and @role='combobox' and contains(@placeholder, 'Search')])[1]",
    selectGame = "//img[contains(@src, 'game_code=bst_coinsofalkemor-holdandwin')]",
    gamePlayComponent2 = '#gameplayComponent',
    gamePlayComponent = "//span[text()='Click To Play']"
}
