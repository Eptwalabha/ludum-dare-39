class TBBullet extends TurnBasedGameEntity {

    normal: Phaser.Point;
    ttl: number;
    parent: GameEntity;
    origin: Phaser.Point;
    destination: Phaser.Point;

    constructor (parent: GameEntity, direction: number, distance: number, ttl: number) {
        super(parent.position.x, parent.position.y, '#cccccc', 0.4);
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
        // var x = this.origin.x + Math.cos(this.direction) * this.distance;
        // var y = this.origin.y + Math.sin(this.direction) * this.distance;
        // this.destination = new Phaser.Point(x, y);
    }

    updateTick(ts: number, percent: number): void {
        this.ttl -= 1;
        this.position.x = this.origin.x + this.normal.x * percent;
        this.position.y = this.origin.y + this.normal.y * percent;
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

}