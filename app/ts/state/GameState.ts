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
    private zoom: number = 20;
    private data;
    private entities: Array<GameEntity>;
    private tick_duration: number;
    private tick_running: boolean = false;
    private tick_acc: number = 0;
    private entity_factory: EntityFactory;
    collision_engine: CWorld;
    private score = 0;
    private graphics: Phaser.Graphics;
    private group: Phaser.Group;

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
    }

    create () {
        this.game.stage.backgroundColor = "#fff";
        this.camera.flash(0x000000);

        let self = this;
        this.collision_engine.onCollisionStart = function (a: CBody, b: CBody) {
            self.collisionStart(a, b);
        };
        this.entities = [];
        this.buildLevel();
        this.buildRobot();

        this.group = this.game.add.group();
        this.graphics = this.game.add.graphics(0, 0);
        this.group.add(this.graphics);

        this.group.position.x = 100;
        this.camera.fade(0xffffff, 300);
    }

    update() {

        if (!this.tick_running && this.checkPlayerMove()) {
            this.tickBegins();
        }
        this.updateLevel(this.game.time.elapsedMS);
        this.updateEntities(this.game.time.elapsedMS);
        this.collision_engine.run();
        this.cleanDeadEntities();
        if (this.robot.power <= 0) {
            this.gameOver();
        }
    }

    render () {
        // this.level.debug(this.game, this.zoom);
        this.robot.debug(this.game, this.zoom);
        var self = this;
        this.entities.forEach(function(entity) {
            entity.debug(self.game, self.zoom);
        });
        this.graphics.clear();
        this.collision_engine.debug(this.graphics, this.zoom);
    }

    private buildLevel() {
        var layouts: ILayouts = this.game.cache.getJSON('layouts');
        var levels: ILevels = this.game.cache.getJSON('levels');
        this.level = new Level();
        if (this.data.level > levels.levels.length) {
            this.randomLevel();
        } else {
            var level_spec: ILevel = levels.levels[this.data.level];
            var layout: ILayout = layouts[level_spec.layout];
            this.level.buildFromSpec(level_spec, layout, this.collision_engine);
            this.buildFoes(level_spec);
            this.buildItems(level_spec);
        }
    }

    private randomLevel () {
        var rnd = new Phaser.RandomDataGenerator(this.data.level_seeds);
        this.level.buildRandom(20, 20, rnd, this.collision_engine);
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
                var foe: Foe = new Foe(p.x, p.y, this.entity_factory);
                this.entities.push(foe);
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
                this.entity_factory.spawn_power_item(p.x, p.y, 50);
            }
        }
    }

    private buildRobot() {
        var start = this.level.getStartPoint();
        this.robot = new Robot(start, this.collision_engine);
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

    addNewEntity (entity: GameEntity) {
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
}