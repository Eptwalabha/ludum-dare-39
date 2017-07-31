class Bullet extends GameEntity {

    normal: Phaser.Point;
    speed: number;
    ttl: number;
    parent: GameEntity;

    constructor(parent: GameEntity, direction: number, speed: number, ttl: number, state: GameState) {
        super(parent.position.x, parent.position.y, 0, 0.3, state);
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
            this.body.moveTo(this.position.x, this.position.y);
        }
    }

    interactWith (entity: GameEntity) {
        if (entity instanceof Robot) {
            entity.dealDamage(25, 100);
            this.dead = true;
        }
        if (entity instanceof Wall) {
            this.dead = true;
        }
    }
}