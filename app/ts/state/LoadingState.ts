class LoadingState extends Phaser.State {

    preload() {
        this.game.load.image('black-strip', 'assets/images/black-strip.png');
        this.game.load.image('splash-screen', 'assets/images/splash-screen.png');
        this.game.load.image('menu-background', 'assets/images/menu-background.png');
        this.game.load.image('menu-selector', 'assets/images/menu-selector.png');
        this.game.load.image('menu-start', 'assets/images/menu-start.png');
        this.game.load.image('menu-continue', 'assets/images/menu-continue.png');
        this.game.load.image('menu-levels', 'assets/images/menu-levels.png');
        this.game.load.image('menu-robot', 'assets/images/menu-robot.png');
        this.game.load.image('bg-bulb', 'assets/images/bg-bulb.png');
        this.game.load.image('bg-battery', 'assets/images/bg-battery.png');
        this.game.load.image('bg-accu', 'assets/images/bg-accu.png');
        this.game.load.image('ld39', 'assets/images/ld39.png');
        this.game.load.image('robot', 'assets/images/robot.png');
        this.game.load.image('tile-floor', 'assets/images/to-do.png');
        this.game.load.image('tile-wall', 'assets/images/to-do.png');
        this.game.load.json('messages', 'assets/json/messages.json');
    }

    loadUpdate() {
    }

    create() {
        // this.game.state.start('game-over');
        // this.game.state.start('menu');
        this.continueGame(0);
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