class MenuState extends Phaser.State {

    level: number;
    seeds: Array<number>;

    private main_menu: Phaser.Group;
    private level_menu: Phaser.Group;
    private background1: Phaser.Group;
    private background2: Phaser.Group;
    private current_menu = 0;
    private repeat_in = 0;
    private nbr_menu = 1;
    private selector: Phaser.Sprite;

    private bulbs: Array<Phaser.Sprite>;

    create () {

        this.game.stage.backgroundColor = "#fff";
        this.camera.flash(0x000000);

        this.background1 = this.game.add.group();
        this.background2 = this.game.add.group();
        this.main_menu = this.game.add.group();
        this.level_menu = this.game.add.group();


        var robot = this.game.add.sprite(0, 0, "menu-robot");
        robot.anchor.set(0.5, 0.5);
        this.background2.add(robot);
        this.background2.position.set(350, 250);


        this.bulbs = [];

        var nbr_per_line = 6;
        var nbr_line = 5;
        var width = 600;
        var space_x = width / nbr_per_line;
        for (var i = 0; i < nbr_per_line; ++i) {
            for (var j = 0; j < nbr_line; ++j) {
                var offset = j % 2 ? 0 - space_x / 2 : 0;
                var x = i * space_x + offset;
                var y = 116 + j * 64;
                var image = this.game.rnd.pick(['bg-bulb', 'bg-bulb', 'bg-battery', 'bg-accu']);
                var battery = this.game.add.sprite(x, y, image);
                battery.anchor.set(0.5, 0.5);
                battery.data.left = (j % 2 === 0);
                this.bulbs.push(battery);
                this.background1.add(battery);
            }
        }

        var line_t = this.game.add.sprite(250, 0, 'black-strip');
        line_t.scale.set(500, 1);
        line_t.anchor.set(0.5, 0);
        var line_b = this.game.add.sprite(250, 400, 'black-strip');
        line_b.scale.set(500, 1);
        line_b.anchor.set(0.5, 0);

        this.background1.add(line_t);
        this.background1.add(line_b);

        var ld39 = this.game.add.sprite(430, 80, 'ld39');
        ld39.angle = 30;
        ld39.anchor.set(0.5, 0.5);
        this.game.add.tween(ld39.scale)
            .to({x: 0.8, y: 0.8}, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        this.background1.add(ld39);

        var game_already_played = true;
        if (game_already_played) {
            var btn_start = this.game.add.sprite(64, 0, "menu-start");
            this.main_menu.add(btn_start);
            this.nbr_menu = 1;
        } else {
            var btn_resume = this.game.add.sprite(64, 0, "menu-continue");
            var btn_level = this.game.add.sprite(64, 64, "menu-levels");
            this.main_menu.add(btn_resume);
            this.main_menu.add(btn_level);
            this.nbr_menu = 2;
        }

        this.selector = this.game.add.sprite(32, 0, "menu-selector");
        this.selector.anchor.set(0.5, 0.5);

        this.game.add.tween(this.selector)
            .to({x: 40}, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        this.main_menu.add(this.selector);
        this.main_menu.position.set(64, 300);
        this.current_menu = 0;
        this.updateSelectorPosition();

        this.camera.fade(0xffffff, 300);
    }

    update () {

        var ts = this.game.time.elapsedMS;

        this.bulbs.forEach(function (bulb) {
            if (bulb.data.left) {
                bulb.position.x -= ts * 500 / 20000;
                if (bulb.position.x <= -50) {
                    bulb.position.x += 600;
                }
            } else {
                bulb.position.x += ts * 500 / 20000;
                if (bulb.position.x >= 550) {
                    bulb.position.x -= 600;
                }
            }
        });

        if (this.repeat_in > 0) {
            this.repeat_in -= ts;
        }

        if (this.repeat_in <= 0) {
            var menu = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                menu = -1;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                menu = 1;
            }

            if (menu !== 0) {
                this.current_menu += menu;
                this.repeat_in += 500;
                this.updateSelectorPosition();
            }
        }

        if (!this.game.input.keyboard.isDown(Phaser.Keyboard.UP) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.repeat_in = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            if (this.current_menu === 0) {
                this.continueGame(0);
            } else {
                this.displayLevels();
            }
        }
    }

    continueGame (level) {

        var startGame = function () {
            var game_data = {
                level: level,
                level_seeds: this.seeds
            };
            this.game.state.start('game', true, false, game_data);
        };
        this.camera.fade(0x000000, 300);
        this.camera.onFadeComplete.add(startGame, this);

    }

    displayLevels () {

    }

    updateSelectorPosition () {
        if (this.current_menu < 0) {
            this.current_menu = this.nbr_menu - 1;
        }
        this.current_menu %= this.nbr_menu;
        this.selector.position.y = this.current_menu * 64 + 32;
    }

}