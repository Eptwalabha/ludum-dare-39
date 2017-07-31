/// <reference path="definitions/extra.d.ts" />

class SimpleGame {

    constructor() {
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
        var game = new Phaser.Game(500, 500, Phaser.AUTO, 'game-container');
        game.state.add('loading', new LoadingState());
        game.state.add('menu', new MenuState());
        game.state.add('game', new GameState());
        game.state.add('game-over', new GameOverState());
        game.state.start('loading');
    }
}

window.onload = () => {
    new SimpleGame();
};