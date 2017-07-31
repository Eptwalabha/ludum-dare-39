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
    private entity_generator: EntityFactory;
    collision_world: CWorld;
    private score = 0;
    private graphics: Phaser.Graphics;

    init(data) {
        this.data = data;
        this.tiles = this.game.add.group();
        this.tick_duration = 150;
        this.game.stage.backgroundColor = "#fff";
    }

    create () {
        this.level = new Level(20, 20);
        this.entities = [];
        this.collision_world = new CWorld();
        this.entity_generator = new EntityFactory(this);
        this.robot = new Robot(10, 10, this.collision_world);
        let self = this;
        this.collision_world.onCollisionStart = function (a: CBody, b: CBody) {
            self.collisionStart(a, b);
        };
        this.level.setDimensions(20, 20);
        this.level.buildRandom(this.data.level, this.data.level_rnd, this.collision_world);

        this.game.rnd.sow([3, 2, 1]);
        let nbr_foe = 10;
        for (var i = 0; i < nbr_foe; ++i) {
            var x = this.game.rnd.between(0, this.level.width - 1);
            var y = this.game.rnd.between(0, this.level.height - 1);
            var foe: Foe = new Foe(x, y, this.entity_generator);
            this.entities.push(foe);
        }
        this.graphics = this.game.add.graphics(0, 0);
    }

    update() {

        if (!this.tick_running && this.checkPlayerMove()) {
            this.tickBegins();
        }
        this.updateLevel(this.game.time.elapsedMS);
        this.updateEntities(this.game.time.elapsedMS);
        this.collision_world.run();
        this.cleanDeadEntities();
        if (this.robot.power <= 0) {
            this.game.state.start('game', true, false, this.data);
        }
    }

    render () {
        // this.level.debug(this.game, this.zoom);
        //
        this.robot.debug(this.game, this.zoom);
        // var self = this;
        // this.entities.forEach(function(entity) {
        //     entity.debug(self.game, self.zoom);
        // });
        this.graphics.clear();
        this.collision_world.debug(this.graphics, this.zoom);
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
                    self.collision_world.removeBody(self.entities[index].body);
                }
                self.entities.splice(index, 1);
            }
        });
    }

    private collisionStart (bodyA: CBody, bodyB: CBody) {
        if (bodyA.entity instanceof Bullet || bodyA.entity instanceof TBBullet) {
            bodyA.entity.dead = true;
        }
        if (bodyB.entity instanceof Bullet || bodyB.entity instanceof TBBullet) {
            bodyB.entity.dead = true;
        }
    }
}