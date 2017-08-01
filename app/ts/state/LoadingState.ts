class LoadingState extends Phaser.State {

    preload() {
        this.game.load.json('layouts', 'assets/json/layouts.json');
        this.game.load.json('levels', 'assets/json/levels.json');
        this.game.load.json('messages', 'assets/json/messages.json');
        this.game.load.atlas('menu-atlas', 'assets/atlas/menu.png', 'assets/atlas/menu.json');
        this.game.load.atlas('game-atlas', 'assets/atlas/game.png', 'assets/atlas/game.json');
        this.game.load.atlas('game-over-atlas', 'assets/atlas/gameover.png', 'assets/atlas/gameover.json');
    }

    create() {
        this.game.stage.backgroundColor = "#fff";
        this.game.stage.smoothed = false;
        this.camera.flash(0x000000);
        // this.game.state.start('menu');
        this.continueGame(9);
        this.game.state.start('game-over');
    }

    // TODO à virer
    continueGame (level) {
        var game_data = {
            level: level,
            level_seeds: [1, 2, 3]
        };
        this.game.state.start('game', true, false, game_data);
    }
}