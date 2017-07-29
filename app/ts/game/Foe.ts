class Foe extends GameEntity {
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;

    constructor(x: number, y: number) {
        super(x, y, '#ff0000');
        this.origin = new Phaser.Point(x, y);
        this.destination = new Phaser.Point(x, y);
    }

    update (ts: number): void {
    }

    beginTick(): void {
    }

    updateTick(ts: number, percent: number): void {
        this.position.x = this.origin.x + (this.destination.x - this.origin.x) * percent;
        this.position.y = this.origin.y + (this.destination.y - this.origin.y) * percent;
    }

    endTick(): void {
        this.destination.clone(this.position);
        this.destination.clone(this.origin);
    }
}