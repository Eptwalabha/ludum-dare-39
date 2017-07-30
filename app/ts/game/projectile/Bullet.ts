class Bullet extends GameEntity {

    normal: Phaser.Point;
    speed: number;
    ttl: number;
    parent: GameEntity;

    constructor(parent: GameEntity, direction: number, speed: number, ttl: number) {
        super(parent.position.x, parent.position.y, '#000000', 0.3);
        this.speed = speed;
        this.ttl = ttl;
        var x = Math.cos(direction);
        var y = Math.sin(direction);
        this.normal = new Phaser.Point(x, y);
        this.parent = parent;
    }

    update(ts: number) {
        if (this.ttl < 0) {
            this.dead = true;
        }
        this.ttl -= ts;
        this.position.x += this.normal.x * (ts / 1000) * this.speed;
        this.position.y += this.normal.y * (ts / 1000) * this.speed;
        if (this.body) {
            this.body.x = this.position.x;
            this.body.y = this.position.y;
        }
    }
}