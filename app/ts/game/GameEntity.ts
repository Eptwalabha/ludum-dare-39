abstract class GameEntity {

    position: Phaser.Point;
    circle: Phaser.Circle;
    color: string;
    dead: boolean;
    size: number;
    body: CBody;

    constructor (x, y, color, size = 1) {
        this.color = color;
        this.position = new Phaser.Point(x, y);
        this.circle = new Phaser.Circle(this.position.x, this.position.y, size);
        this.dead = false;
        this.size = size;
    }

    // abstract beginTick(): void;
    // abstract updateTick(ts: number, percent: number): void;
    // abstract endTick(): void;

    abstract update(ts: number);

    debug (game: Phaser.Game, scale: number) {
        this.circle.x = this.position.x * scale;
        this.circle.y = this.position.y * scale;
        this.circle.diameter = scale * this.size;
        game.debug.geom(this.circle, this.color);
    }
}
