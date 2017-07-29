/// <reference path="definitions/extra.d.ts" />

class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(500, 500, Phaser.AUTO, 'game-container', { create: this.create });
    }

    game: Phaser.Game;

    create() {
        var text = "Ouaich!";
        var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
        this.game.add.text(0, 0, text, style);
    }
}

window.onload = () => {
    var game = new SimpleGame();
};