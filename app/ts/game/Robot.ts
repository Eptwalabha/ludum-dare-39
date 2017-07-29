class Robot extends TurnBasedGameEntity {
    power: number;
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;
    private power_loss_rate = 3;

    constructor(x: number, y: number) {
        super(x, y, '#00ff00');
        this.origin = new Phaser.Point(x, y);
        this.destination = new Phaser.Point(x, y);
        this.power = 100;
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

    update(ts: number): void {
        this.power -= this.power_loss_rate * (ts / 1000);
    }

    move(direction: MOVE, level: Level) {

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

        return level.getTileNatureAt(this.destination) === TILE.FLOOR;
    }
}