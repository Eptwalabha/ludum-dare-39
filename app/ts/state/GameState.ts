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
    private entities: Array<Robot>;

    init(data) {

        this.data = data;
        this.mobile_entites = this.game.add.group();
        this.tiles = this.game.add.group();
        this.robot = new Robot(10, 10);
        this.level = new Level(20, 20);
        this.entities = [];
    }

    preload () {
        this.level.setDimensions(20, 20);
        this.level.buildRandom(this.data.level, this.data.level_rnd)
    }


    update() {

        if (this.checkPlayerMove()) {
            this.updateEntitiesTurn();
        }
        this.updateLevel(this.game.time.elapsedMS);
        this.updateEntities(this.game.time.elapsedMS);
    }

    render () {
        this.level.debug(this.game, this.zoom);
        this.robot.debug(this.game, this.zoom);
    }

    checkPlayerMove () {

        if (this.robot.moving) {
            return false;
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

    updateEntitiesTurn () {
        console.log("new turn");
        for (var i = 0; i < this.entities.length; ++i) {
            this.entities[i].tick();
        }
    }

    updateLevel (ts: number) {
        this.level.update(ts);
    }

    updateEntities (ts: number) {
        this.robot.update(ts);
    }
}