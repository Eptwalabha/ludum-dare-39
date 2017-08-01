enum TILE {
    FLOOR,
    WALL
}

enum MOVE {
    UP,
    RIGHT,
    DOWN,
    LEFT,
    STOP
}

class GameState extends Phaser.State {

    private tiles: Phaser.Group;
    private robot: Robot;
    private level: Level;
    zoom: number = 32;
    private data;
    private entities: Array<GameEntity>;
    private tick_duration: number;
    private tick_running: boolean = false;
    private tick_acc: number = 0;
    entity_factory: EntityFactory;
    collision_engine: CWorld;
    private score = 0;
    private graphics: Phaser.Graphics;
    group: Phaser.Group;

    private ui: Phaser.Group;
    private power: Phaser.Sprite;
    private shake_camera = 0;
    group_fg: Phaser.Group;
    private origin: Phaser.Point;
    private pause_all;

    init(data) {
        this.data = data;
        this.tick_duration = 150;
        this.collision_engine = new CWorld();
        this.entity_factory = new EntityFactory(this);
    }

    preload () {
        this.game.load.json('messages', 'assets/json/messages.json');
        this.game.load.json('layouts', 'assets/json/layouts.json');
        this.game.load.json('levels', 'assets/json/levels.json');
        this.game.load.atlas('game-atlas', 'assets/atlas/game.png', 'assets/atlas/game.json');
    }

    create () {
        this.game.stage.backgroundColor = "#fff";
        this.camera.flash(0x000000);

        let self = this;
        this.collision_engine.onCollisionStart = function (a: CBody, b: CBody) {
            self.collisionStart(a, b);
        };
        this.entities = [];
        this.group = this.game.add.group();
        this.group_fg = this.game.add.group();
        this.ui = this.game.add.group();

        this.buildLevel();
        this.buildRobot();

        this.graphics = this.game.add.graphics(0, 0);
        this.group.add(this.graphics);

        if (this.level.width * this.zoom > 450) {
            this.zoom = 450 / this.level.width;
        }
        if (this.level.height * this.zoom > 400) {
            this.zoom = 400 / this.level.height;
        }
        var offset_x = (500 - this.level.width * this.zoom) / 2 + .5 * this.zoom;
        var offset_y = (500 - this.level.height * this.zoom) / 2 + .5 * this.zoom;
        this.origin = new Phaser.Point(offset_x, offset_y);
        this.origin.clone(this.group.position);

        var text_style = {
            font: "24px Arial",
            fill: '#ccc',
            fontWeight: 'bold'
        };
        var text = this.game.add.text(250, 24, this.level.getName(), text_style, this.ui);
        var battery = this.game.add.sprite(32, 32, "game-atlas");
        battery.frameName = "ui-battery.png";
        battery.anchor.set(0.5, 0.5);
        this.power = this.game.add.sprite(64, 32, "game-atlas");
        this.power.frameName = "ui-power.png";
        this.power.anchor.set(0, 0.5);
        this.power.scale.x = this.robot.power;
        this.ui.add(battery);
        text.anchor.set(0, 0);

        this.group.add(this.group_fg);
        this.group.scale.set(this.zoom, this.zoom);

        this.pause_all = false;
        this.camera.fade(0xffffff, 300);
    }

    update() {

        if (this.pause_all) {
            return;
        }

        this.cameraEffect(this.game.time.elapsedMS);
        if (!this.tick_running && this.checkPlayerMove()) {
            this.tickBegins();
        }
        this.updateLevel(this.game.time.elapsedMS);
        this.updateEntities(this.game.time.elapsedMS);
        this.collision_engine.run();
        this.cleanDeadEntities();
        this.updatePowerBar();
        if (this.robot.power <= 0) {
            this.gameOver();
        }
    }

    render () {
        var self = this;
        // this.graphics.clear();
        // this.collision_engine.debug(this.graphics, this.zoom / 32);
        this.entities.forEach(function(entity) {
            entity.preRender(self.game.time.elapsedMS);
        });
    }

    private buildLevel() {
        var layouts: ILayouts = this.game.cache.getJSON('layouts');
        var levels: ILevels = this.game.cache.getJSON('levels');
        this.level = new Level();
        if (this.data.level < levels.levels.length) {
            var level_spec: ILevel = levels.levels[this.data.level];
            var layout: ILayout = layouts[level_spec.layout];
            this.level.buildFromSpec(level_spec, layout, this);
            this.buildFoes(level_spec);
            this.buildItems(level_spec);
        } else {
            this.randomLevel();
        }
    }

    private randomLevel () {
        var rnd = new Phaser.RandomDataGenerator(this.data.level_seeds);
        this.level.buildRandom(20, 20, rnd, this);
        this.game.rnd.sow([3, 2, 1]);
        let nbr_foe = 1;
        for (var i = 0; i < nbr_foe; ++i) {
            var p = new Phaser.Point();
            var fail = 100;
            var ok = false;
            do {
                p.x = this.game.rnd.between(0, this.level.width - 1);
                p.y = this.game.rnd.between(0, this.level.height - 1);
                fail--;
                ok = this.level.getTileNatureAt(p) === TILE.FLOOR;
            } while (!ok && fail >= 0);
            if (ok) {
                this.entity_factory.spawnFoe(p.x, p.y, "");
            }
        }
        let nbr_power = 10;
        for (i = 0; i < nbr_power; ++i) {
            var p = new Phaser.Point();
            var fail = 100;
            var ok = false;
            do {
                p.x = this.game.rnd.between(0, this.level.width - 1);
                p.y = this.game.rnd.between(0, this.level.height - 1);
                fail--;
                ok = this.level.getTileNatureAt(p) === TILE.FLOOR;
            } while (!ok && fail >= 0);
            if (ok) {
                this.entity_factory.spawnPowerItem(p.x, p.y, 50);
            }
        }
    }

    private buildRobot() {
        var start = this.level.getStartPoint();
        this.robot = new Robot(start, this);
        this.robot.power_loss_rate = this.level.power_loss_rate;
    }

    private buildFoes (level_spec: ILevel) {
        var foes: Array<IFoe> = level_spec.foes ? level_spec.foes : [];
        for (var i = 0; i < foes.length; ++i) {
            this.entity_factory.spawnFoeFromSpec(foes[i]);
        }
    }

    private buildItems (level_spec: ILevel) {
        var items: Array<IItem> = level_spec.items ? level_spec.items : [];
        for (var i = 0; i < items.length; ++i) {
            this.entity_factory.spawnItemFromSpec(items[i]);
        }
    }

    checkPlayerMove () {

        if (this.robot.power <= 0) {
            return;
        }

        var move = MOVE.STOP;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            move = MOVE.LEFT;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            move = MOVE.RIGHT;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            move = MOVE.UP;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            move = MOVE.DOWN;
        }
        if (move !== MOVE.STOP) {
            return this.robot.move(move, this.level);
        }
    }

    updateLevel (ts: number) {
        this.level.update(ts);
    }

    updateEntities (ts: number) {
        if (this.tick_running) {
            this.tick_acc += ts;
            var p = this.tick_duration === 0 ? 1 : this.tick_acc / this.tick_duration;
            if (p >= 1) {
                this.tick_running = false;
                this.tickEnd();
            } else {
                this.robot.updateTick(ts, p);
                this.entities.forEach(function (entity) {
                    if (entity instanceof TurnBasedGameEntity) {
                        entity.updateTick(ts, p);
                    }
                });
            }
        }
        this.robot.update(ts);
        this.entities.forEach(function (entity) {
            entity.update(ts);
        });
    }

    tickBegins () {
        this.tick_acc = 0;
        this.tick_running = true;
        this.robot.beginTick();
        this.entities.forEach(function (entity) {
            if (entity instanceof TurnBasedGameEntity) {
                entity.beginTick();
            }
        });
    }

    tickEnd () {
        this.tick_running = false;
        this.robot.endTick();
        this.entities.forEach(function (entity) {
            if (entity instanceof TurnBasedGameEntity) {
                entity.endTick();
            }
        });
    }

    addNewEntity (entity: GameEntity, group?: Phaser.Group) {
        this.entities.push(entity);
        if (entity.body) {
            this.collision_engine.addBody(entity.body);
        }
    }

    private cleanDeadEntities() {
        let to_remove: Array<number> = [];
        var self = this;
        this.entities.forEach(function (entity, i) {
            if (entity.dead) {
                to_remove.push(i);
            }
        });
        to_remove.reverse().forEach(function (index) {
            if (self.entities[index]) {
                if (self.entities[index].body) {
                    self.collision_engine.removeBody(self.entities[index].body);
                }
                if (self.entities[index].sprite) {
                    self.entities[index].sprite.destroy();
                }
                self.entities.splice(index, 1);
            }
        });
    }

    private collisionStart (bodyA: CBody, bodyB: CBody) {
        if (bodyA.entity && !bodyA.entity.dead && bodyB.entity && !bodyB.entity.dead) {
            bodyA.entity.interactWith(bodyB.entity);
            bodyB.entity.interactWith(bodyA.entity);
        }
    }

    private gameOver () {
        var startGameOverState = function () {
            this.game.state.start('game-over', true, false, this.data);
        };
        this.camera.fade(0x000000, 300);
        this.camera.onFadeComplete.add(startGameOverState, this);
    }

    private updatePowerBar() {
        this.power.scale.x = this.robot.power * 1.5;
        if (this.robot.power < 15) {
            this.power.tint = 0xff0000;
        } else if (this.robot.power < 25) {
            this.power.tint = 0xc2912e;
        } else {
            this.power.tint = 0x00ff00;
        }
    }

    reachEndOfTheLevel(exit: GameEntity) {
        if (this.robot.power <= 0) {
            return;
        }

        this.pause_all = true;
        exit.sprite.destroy();

        var bulb = this.game.add.sprite(exit.position.x - .5, exit.position.y - .5, 'game-atlas');
        bulb.scale.set(1 / 32, 1 / 32);
        this.group_fg.add(bulb);
        bulb.frameName = "bulb-on.png";

        var y = exit.position.y - 2;
        this.game.add.tween(bulb.position)
            .to({y: y}, 1000, Phaser.Easing.Cubic.Out, true)
            .onComplete.add(function () {
                var game_data = {
                    level: this.data.level + 1,
                    level_seeds: [1, 2, 3]
                };
                this.camera.fade(0x000000, 300);
                this.camera.onFadeComplete.add(function () {
                    this.game.state.start('game', true, false, game_data);
                }, this);

            }, this);
    }

    playerHit(amount: number) {
        this.shake_camera = 200;
        this.spawnText("-" + amount, '#ff0000', 1);
    }

    playerHealed (amount: number) {
        this.spawnText("+" + amount, '#00ff00', -1);
    }

    spawnText (text, color, to_y) {
        var text_style = {
            font: "12px Consolas",
            fill: color,
            fontWeight: 'bold'
        };
        var x = this.robot.position.x;
        var y = this.robot.position.y;
        var stext = this.game.add.text(x, y, text, text_style, this.group_fg);
        stext.scale.set(1 / 32, 1 / 32);
        stext.anchor.set(0.5, 1);
        this.game.add.tween(stext)
            .to({y: y + to_y}, 500, Phaser.Easing.Sinusoidal.Out, true)
            .onComplete.add(function () {
                stext.destroy();
            }, this);

    }

    private cameraEffect(elapsedMS: number) {
        this.origin.clone(this.group.position);
        if (this.shake_camera > 0) {
            this.shake_camera -= elapsedMS;
            this.group.position.add(this.rnd.between(-2, 2), this.rnd.between(-2, 2));
        }
    }
}