abstract class GameEntity {

    position: Phaser.Point;
    angle: number;
    dead: boolean;
    size: number;
    body: CBody;
    state: GameState;

    constructor (x, y, angle: number, size = 1, state: GameState) {
        this.angle = angle;
        this.position = new Phaser.Point(x, y);
        this.dead = false;
        this.size = size;
        this.state = state;
    }

    // abstract beginTick(): void;
    // abstract updateTick(ts: number, percent: number): void;
    // abstract endTick(): void;

    abstract update(ts: number);

    debug (graphics: Phaser.Graphics, scale: number) {
        graphics.lineStyle(1, 0x555555, 1);
        graphics.drawCircle(this.position.x * scale, this.position.y * scale, this.size * scale);
    }

    interactWith (entity: GameEntity): void {
    };
}
