interface ILevel {
    layout: string,
    sprite_sheet?: string,
    items?: Array<IItem>,
    foes?: Array<IFoe>,
    start?: { x: number, y: number },
    end?: { x: number, y: number }
}

interface IRoomLayout {
    layer: Array<Array<number>>,
    start: { x: number, y: number },
    end: { x: number, y: number }
}

interface IItem {
    type: string,
    position: { x: number, y: number }
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

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    private reset () {
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

    debug(game: Phaser.Game, scale: number) {
        for (var i = 0; i < this.height; ++i) {
            for (var j = 0; j < this.width; ++j) {
                var floor = new Phaser.Rectangle(i * scale - scale/2, j * scale - scale/2, scale, scale);
                if (this.map[i][j] === TILE.FLOOR) {
                    game.debug.geom(floor, '#9bb9ef');
                } else {
                    game.debug.geom(floor, '#0011ff');
                }
            }
        }
    }

    buildRandom(level: number, rnd: Phaser.RandomDataGenerator, word: CWorld) {
        console.log("building a lvl " + level + " map");
        this.map = [];
        let tiles: Array<TILE> = [TILE.WALL];
        let ratio: number = 6;
        for (var i = 0; i < ratio; ++i) tiles.push(TILE.FLOOR);

        for (var i = 0; i < this.height; ++i) {
            this.map[i] = [];
            for (var j = 0; j < this.width; ++j) {
                let tile: TILE = rnd.pick(tiles);
                this.map[i][j] = tile;
                if (tile === TILE.WALL) {
                    let box: BoxBody = new BoxBody(i - 0.5, j - 0.5, 1, 1);
                    box.group = EntityGenerator.COLLISION_MASK.WALL;
                    box.mask = EntityGenerator.COLLISION_MASK.PLAYER | EntityGenerator.COLLISION_MASK.BULLET;
                    word.addBody(box);
                }
            }
        }
    }

    setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getTileNatureAt(destination: Phaser.Point) {
        try {
            return this.map[destination.x][destination.y];
        } catch (e) {
            return null;
        }
    }
}
