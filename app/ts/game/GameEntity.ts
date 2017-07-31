abstract class GameEntity {

    position: Phaser.Point;
    angle: number;
    dead: boolean;
    size: number;
    body: CBody;
    state: GameState;
    sprite: Phaser.Sprite;

    constructor (x, y, angle: number, size = 1, state: GameState) {
        this.angle = angle;
        this.position = new Phaser.Point(x, y);
        this.dead = false;
        this.size = size;
        this.state = state;
    }

    setSprite (key: string, layer: number = 1) {
        if (this.sprite) this.sprite.destroy();
        this.sprite = this.state.game.add.sprite(this.position.x, this.position.y, 'game-atlas');
        this.sprite.frameName = key;
        var size = 1 / 32;
        this.sprite.scale.set(size, size);
        this.sprite.anchor.set(0.5, 0.5);
        this.state.group_fg.add(this.sprite);
    }

    // abstract beginTick(): void;
    // abstract updateTick(ts: number, percent: number): void;
    // abstract endTick(): void;

    abstract update(ts: number);

    preRender (ts: number) {
        if (this.sprite) {
            this.sprite.position.x = this.position.x;
            this.sprite.position.y = this.position.y;
        }
    }

    debug (graphics: Phaser.Graphics, scale: number) {
        graphics.lineStyle(1, 0x555555, 1);
        graphics.drawCircle(this.position.x * scale, this.position.y * scale, this.size * scale);
    }

    interactWith (entity: GameEntity): void {
    };
}
