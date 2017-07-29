class MenuState extends Phaser.State {

    level: number;
    seeds: Array<number>;

    create() {

        var self = this;
        this.level = this.game.rnd.integer();
        this.game.stage.backgroundColor = "#ffffff";
        var menu = this.game.add.group();
        var menu_start = new Phaser.Text(this.game, 0, 0, 'start', {fill: "#ff0000"});
        var menu_quit = new Phaser.Text(this.game, 0, 30, 'quit', {fill: "#ff00ff"});

        menu_start.data = {
            fill: {
                color: "#ff0000",
                over: "#f0f0f0"
            },
            action: function () {
                var game_data = {
                    level: self.level,
                    level_rnd: new Phaser.RandomDataGenerator(self.seeds)
                };
                self.game.state.start('game', true, false, game_data);
            }
        };
        menu_quit.data = {
            fill: {
                color: "#ff00ff",
                over: "#00ffff"
            },
            action: function () {
                // self.game.state.start('opitions', true, false, {'level': self.level});
            }
        };

        menu.position.set(100, 200);
        menu.inputEnableChildren = true;

        menu.add(menu_start);
        menu.add(menu_quit);

        menu.onChildInputOver.add(MenuState.over, this);
        menu.onChildInputOut.add(MenuState.out, this);
        menu.onChildInputDown.add(MenuState.down, this);

        // TODO remove for final version
        var game_data = {
            level: this.level,
            level_rnd: new Phaser.RandomDataGenerator(this.seeds)
        };
        this.game.state.start('game', true, false, game_data);
    }

    static over(text: Phaser.Text) {
        text.fill = text.data.fill.over ? text.data.fill.over : "#00ff00";
    }

    static out(text: Phaser.Text) {
        text.fill = text.data.fill.color ? text.data.fill.color : "#ff0000";
    }

    static down(text: Phaser.Text) {
        if (text.data.action) {
            text.data.action();
        }
    }
}