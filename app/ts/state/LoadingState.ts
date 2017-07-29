class LoadingState extends Phaser.State {

    preload() {
        this.game.load.image('splash-screen', 'assets/images/splash-screen.png');
        this.game.load.image('menu-background', 'assets/images/menu-background.png');
        this.game.load.image('robot', 'assets/images/robot.png');
        this.game.load.image('tile-floor', 'assets/images/to-do.png');
        this.game.load.image('tile-wall', 'assets/images/to-do.png');
    }

    create() {
        this.game.state.start('menu');
    }
}