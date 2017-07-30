class Robot extends TurnBasedGameEntity {
    power: number;
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;
    private power_loss_rate = 10;

    constructor(x: number, y: number, world: CWorld) {
        super(x, y, '#00ff00', .9);
        this.origin = new Phaser.Point(x, y);
        this.destination = new Phaser.Point(x, y);
        this.power = 100;
        this.body = new CircleBody(x, y, .4);
        this.body.group = EntityGenerator.COLLISION_MASK.PLAYER;
        this.body.mask = EntityGenerator.COLLISION_MASK.WALL | EntityGenerator.COLLISION_MASK.BULLET;
        world.addBody(this.body);
    }

    beginTick(): void {
    }

    updateTick(ts: number, percent: number): void {
        this.position.x = this.origin.x + (this.destination.x - this.origin.x) * percent;
        this.position.y = this.origin.y + (this.destination.y - this.origin.y) * percent;
        this.body.x = this.position.x;
        this.body.y = this.position.y;
    }

    endTick(): void {
        this.destination.clone(this.position);
        this.destination.clone(this.origin);
        this.body.moveTo(this.position.x, this.position.y);
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

    debug (game: Phaser.Game, scale: number) {
        super.debug(game, scale);

        game.debug.rectangle(
            new Phaser.Rectangle(
                this.position.x * scale - 11,
                this.position.y * scale - 12,
                22,
                6),
            '#000000', true
        );
        game.debug.rectangle(
            new Phaser.Rectangle(
                this.position.x * scale - 10,
                this.position.y * scale - 11,
                20 * this.power / 100,
                4
            ),
            '#00ff00', true
        );
    }
}