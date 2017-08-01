class LoadingState extends Phaser.State {

    preload() {
        this.game.load.json('messages', 'assets/json/messages.json');
    }

    create() {
        this.stage.smoothed = false;
        this.game.state.start('menu');
        // this.continueGame(9);
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