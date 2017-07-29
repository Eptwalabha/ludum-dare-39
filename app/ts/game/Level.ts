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

    buildRandom(level: number, rnd: Phaser.RandomDataGenerator) {
        console.log("building a lvl " + level + " map");
        this.map = [];
        for (var i = 0; i < this.height; ++i) {
            this.map[i] = [];
            for (var j = 0; j < this.width; ++j) {
                this.map[i][j] = rnd.pick([TILE.FLOOR, TILE.FLOOR, TILE.FLOOR, TILE.WALL]);
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
