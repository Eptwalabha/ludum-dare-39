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

    private mobile_entites: Phaser.Group;
    private tiles: Phaser.Group;
    private robot: Robot;
    private level: Level;
    private zoom: number = 20;
    private data;
    private entities: Array<GameEntity>;
    private turn_based_entities: Array<TurnBasedGameEntity>;
    private tick_duration: number;
    private tick_running: boolean = false;
    private tick_acc: number = 0;
    private entity_generator: EntityGenerator;

    init(data) {
        this.data = data;
        this.mobile_entites = this.game.add.group();
        this.tiles = this.game.add.group();
        this.robot = new Robot(10, 10);
        this.level = new Level(20, 20);
        this.tick_duration = 150;
        this.entity_generator = new EntityGenerator();
        this.entities = [];
        this.turn_based_entities = [];

        for (var i = 0; i < 1; ++i) {
            var foe: Foe = new Foe(4 + i, 2, this.entity_generator);
            this.entities.push(foe);
            this.turn_based_entities.push(foe);
        }
    }

    preload () {
        this.level.setDimensions(20, 20);
        this.level.buildRandom(this.data.level, this.data.level_rnd)
    }

    create () {
    }

    update() {

        if (!this.tick_running && this.checkPlayerMove()) {
            this.tickBegins();
        }
        this.updateLevel(this.game.time.elapsedMS);
        this.updateEntities(this.game.time.elapsedMS);
    }

    render () {
        this.level.debug(this.game, this.zoom);

        this.robot.debug(this.game, this.zoom);
        var self = this;
        this.entities.forEach(function(entity) {
            entity.debug(self.game, self.zoom);
        })
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
                this.turn_based_entities.forEach(function (entity) {
                    entity.updateTick(ts, p);
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
        this.turn_based_entities.forEach(function (entity) {
            entity.beginTick();
        });
    }

    tickEnd () {
        this.tick_running = false;
        this.robot.endTick();
        this.turn_based_entities.forEach(function (entity) {
            entity.endTick();
        });
    }
}