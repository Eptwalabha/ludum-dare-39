interface ILevels {
    levels: Array<ILevel>
}

interface ILevel {
    layout: string,
    name?: string,
    sprite_sheet?: string,
    power_loss?: number;
    items?: Array<IItem>,
    foes?: Array<IFoe>,
    start?: { x: number, y: number },
    exit?: { x: number, y: number }
}

interface ILayouts {
    [key: string] : ILayout
}

interface ILayout {
    layout: Array<string>,
    start: { x: number, y: number },
    exit: { x: number, y: number }
}

interface IItem {
    type: string,
    position: { x: number, y: number },
    options?: any
}

interface  IFoe {
    type: string,
    position: { x: number, y: number },
    angle?: number,
    options?: any
}

class Level {

    private map: Array<Array<TILE>>;
    width: number;
    height: number;
    private start_point: Phaser.Point;
    private exit_point: Phaser.Point;
    private name: string;
    power_loss_rate: number;

    constructor() {
        this.width = 10;
        this.height = 10;
        this.name = "no level name";
        this.reset();
        this.power_loss_rate = 5;
    }

    private reset () {
        this.start_point = new Phaser.Point();
        this.exit_point = new Phaser.Point();
        this.map = [];
        for (var i = 0; i < this.height; ++i) {
            this.map[i] = [];
            for (var j = 0; j < this.width; ++j) {
                this.map[i][j] = TILE.FLOOR;
            }
        }
    }

    update(ts: number) {

    }

    debug(graphics: Phaser.Graphics, scale: number) {
        graphics.beginFill(0xdddddd);
        graphics.drawRect(-scale / 2, -scale / 2, this.width * scale, this.height * scale);
        graphics.endFill();
        graphics.lineStyle(1, 0xcccccc, 1);
        for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
                graphics.drawRect(x * scale - scale/2, y * scale - scale/2, scale, scale);
            }
        }
        for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
                if (this.map[y][x] !== TILE.WALL) continue;
                graphics.beginFill(0x000000);
                graphics.drawRect(x * scale - scale/2, y * scale - scale/2, scale, scale);
                graphics.endFill();
            }
        }
        graphics.lineStyle(1, 0x000000, 1);
    }

    buildRandom(width: number, height: number, rnd: Phaser.RandomDataGenerator, state: GameState) {
        this.setDimensions(width, height);
        this.name = "seed = " + rnd.state();
        this.map = [];
        let tiles: Array<TILE> = [TILE.WALL];
        let ratio: number = 6;
        for (var i = 0; i < ratio; ++i) tiles.push(TILE.FLOOR);

        for (var i = 0; i < this.height; ++i) {
            this.map[i] = [];
            for (var j = 0; j < this.width; ++j) {
                this.map[i][j] = rnd.pick(tiles);
            }
        }
        var position_set = false;
        var max = width * height;
        var attempt = 0;
        var pos = new Phaser.Point();
        do {
            pos.x = rnd.between(0, width);
            pos.y = rnd.between(0, height);
            position_set = this.getTileNatureAt(pos) === TILE.FLOOR;
            attempt++
        } while (!position_set || attempt < max);
        pos.clone(this.start_point);

        this.buildLevelCollision(state, state.collision_engine);
    }

    buildFromSpec (spec: ILevel, layout: ILayout, state: GameState) {
        if (spec.power_loss) this.power_loss_rate = spec.power_loss;
        this.width = layout.layout[0].length;
        this.height = layout.layout.length;
        this.name = spec.name ? spec.name : "unicorn";
        state.collision_engine.setLevelDimension(this.width, this.height);
        this.map = [];
        for (var y = 0; y < this.height; ++y) {
            this.map[y] = [];
            for (var x = 0; x < this.width; ++x) {
                this.map[y][x] = layout.layout[y][x] === "0" ? TILE.WALL : TILE.FLOOR;
            }
        }
        this.start_point.x = spec.start ? spec.start.x : layout.start.x;
        this.start_point.y = spec.start ? spec.start.y : layout.start.y;
        this.exit_point.x = spec.exit ? spec.exit.x : layout.exit.x;
        this.exit_point.y = spec.exit ? spec.exit.y : layout.exit.y;
        this.buildLevelCollision(state, state.collision_engine);
    }

    private buildLevelCollision (state: GameState, world: CWorld) {
        for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
                if (this.map[y][x] === TILE.WALL) {
                    let box: BoxBody = new BoxBody(x - 0.5, y - 0.5, 1, 1);
                    box.group = MASK.WALL;
                    box.mask = MASK.PLAYER | MASK.BULLET;
                    box.entity = new Wall(x, y, state);
                    state.collision_engine.addBody(box);
                }
            }
        }

        let exit: BoxBody = new BoxBody(this.exit_point.x - .1, this.exit_point.y - .1, .2, .2);
        exit.group = MASK.EXIT_LEVEL;
        exit.mask = MASK.PLAYER;
        exit.entity = new ExitItem(this.exit_point.x, this.exit_point.y, state);
        world.addBody(exit);
    }

    setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getTileNatureAt(destination: Phaser.Point) {
        try {
            return this.map[destination.y][destination.x];
        } catch (e) {
            return null;
        }
    }

    getStartPoint() {
        return this.start_point;
    }

    getName() {
        return this.name;
    }
}
