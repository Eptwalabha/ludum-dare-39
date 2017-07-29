class Robot {
    power: number;
    moving: boolean;
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;
    private speed: number;
    private acc_move: number;
    private circle: Phaser.Circle;

    constructor(x: number, y: number) {
        this.position = new Phaser.Point(x, y);
        this.origin = new Phaser.Point(x, y);
        this.destination = new Phaser.Point(x, y);
        this.moving = false;
        this.power = 100;
        this.speed = 100;
        this.circle = new Phaser.Circle(this.position.x, this.position.y, 1);
    }

    update(ts: number) {
        if (this.moving) {
            this.acc_move += ts;
            var p = this.acc_move === 0 ? 0 : this.acc_move / this.speed;
            if (p >= 1) {
                this.moving = false;
                this.destination.clone(this.position);
                this.destination.clone(this.origin);
            } else {
                this.position.x = this.origin.x + (this.destination.x - this.origin.x) * p;
                this.position.y = this.origin.y + (this.destination.y - this.origin.y) * p;
            }
        }
    }

    move(direction: MOVE, level: Level) {

        if (this.moving || direction === MOVE.STOP) {
            return;
        }

        this.origin.clone(this.destination);

        switch (direction) {
            case MOVE.LEFT:
                this.destination.x -= 1;
                break;
            case MOVE.RIGHT:
                this.destination.x += 1;
                break;
            case MOVE.UP:
                this.destination.y -= 1;
                break;
            case MOVE.DOWN:
                this.destination.y += 1;
                break;
        }

        if (level.getTileNatureAt(this.destination) === TILE.FLOOR) {
            this.moving = true;
            this.acc_move = 0;
            return true;
        }
        return false;
    }


    debug (game: Phaser.Game, scale: number) {
        this.circle.x = this.position.x * scale;
        this.circle.y = this.position.y * scale;
        this.circle.diameter = scale;
        game.debug.geom(this.circle, "#ff0000");
    }

    tick() {
        
    }
}