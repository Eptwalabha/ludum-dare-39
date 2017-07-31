class GameOverState extends Phaser.State {
    private level_data;

    private foreground: Phaser.Group;
    private background: Phaser.Group;
    private batteries: Array<Phaser.Sprite>;

    init (current_level_data) {
        this.level_data = current_level_data;
    }

    preload () {
        this.game.load.image('empty-battery', 'assets/images/empty-battery.png');
        this.game.load.image('game-over-robot', 'assets/images/g-o-robot.png');
        this.game.load.image('game-over-text', 'assets/images/g-o-text.png');
        this.game.load.image('game-over-dialog', 'assets/images/g-o-dialog.png');
    }

    create() {
        this.game.stage.backgroundColor = "#fff";
        this.game.stage.smoothed = false;
        this.camera.flash(0x000000);
        this.batteries = [];
        var messages = this.game.cache.getJSON('messages');
        this.background = this.game.add.group();
        this.foreground = this.game.add.group();

        var nbr_per_line = 6;
        var nbr_line = 6;
        var width = 600;
        var height = 400;
        var space_x = width / nbr_per_line;
        var space_y = height / nbr_line;
        for (var i = 0; i < nbr_per_line; ++i) {
            for (var j = 0; j < nbr_line; ++j) {
                var offset = j % 2 ? 0 - space_x / 2 : 0;
                var x = i * space_x + offset;
                var y = 116 - 50 + j * space_y;
                var battery = this.game.add.sprite(x, y, 'empty-battery');
                battery.anchor.set(0.5, 0.5);
                battery.data.left = (j % 2 === 0);
                this.batteries.push(battery);
                this.background.add(battery);
            }
        }

        var line_t = this.game.add.sprite(250, 0, 'black-strip');
        line_t.scale.set(500, 1);
        line_t.anchor.set(0.5, 0);
        var line_b = this.game.add.sprite(250, 400, 'black-strip');
        line_b.scale.set(500, 1);
        line_b.anchor.set(0.5, 0);

        this.background.add(line_t);
        this.background.add(line_b);

        var img = this.game.add.sprite(250, 250, 'game-over-robot');
        img.anchor.set(0.5, 0.5);
        img.scale.set(2, 2);
        var run_out = this.game.add.sprite(250, 100, 'game-over-text');
        run_out.anchor.set(0.5, 0.5);
        run_out.scale.set(2, 2);
        var dialog = this.game.add.sprite(250, 400, 'game-over-dialog');
        dialog.anchor.set(0.5, 0.5);
        dialog.scale.set(2, 2);

        var text_style = {
            font: "16px Arial",
            fill: '#fff',
            align: 'center',
            fontWeight: 'bold'
        };
        var text = this.game.add.text(250, 400, this.game.rnd.pick(messages['game-over']), text_style);
        text.anchor.set(0.5, 0.5);

        this.camera.fade(0xffffff, 300);

    }

    update () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.playAgain();
        }

        var ts = this.game.time.elapsedMS;

        this.batteries.forEach(function (battery) {
            battery.position.y += ts * 500 / 20000;
            if (battery.position.y >= 450) {
                battery.position.y -= 400;
            }
        });
    }

    playAgain() {

        var startLevelAgain = function () {
            this.game.state.start('game', true, false, this.level_data);
        };
        this.camera.fade(0x000000, 300);
        this.camera.onFadeComplete.add(startLevelAgain, this);
    }
}