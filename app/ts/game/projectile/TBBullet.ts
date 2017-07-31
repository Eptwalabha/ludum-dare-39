class TBBullet extends TurnBasedGameEntity {

    normal: Phaser.Point;
    ttl: number;
    parent: GameEntity;
    origin: Phaser.Point;
    destination: Phaser.Point;

    constructor (parent: GameEntity, direction: number, distance: number, ttl: number, state: GameState) {
        super(parent.position.x, parent.position.y, 0, 0.4, state);
        this.ttl = ttl;

        this.normal = new Phaser.Point(
            Math.cos(direction) * distance,
            Math.sin(direction) * distance
        );
        this.parent = parent;
        this.origin = new Phaser.Point(parent.position.x, parent.position.y);
        this.destination = new Phaser.Point();
    }

    beginTick(): void {
        this.ttl -= 1;
    }

    updateTick(ts: number, percent: number): void {
        this.position.x = this.origin.x + this.normal.x * percent;
        this.position.y = this.origin.y + this.normal.y * percent;
        if (this.body) {
            this.body.moveTo(this.position.x, this.position.y);
        }
        if (this.ttl === 0) {
            this.dead = true;
        }
    }

    endTick(): void {
        this.position.x = this.origin.x + this.normal.x;
        this.position.y = this.origin.y + this.normal.y;
        this.position.clone(this.origin);
    }

    update(ts: number) {
    }

    interactWith (entity: GameEntity) {
        if (entity instanceof Robot) {
            entity.dealDamage(entity.power, 0);
            this.dead = true;
        }
        if (entity instanceof Wall) {
            this.dead = true;
        }
    }
}