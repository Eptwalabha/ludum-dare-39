class Robot extends TurnBasedGameEntity {
    power: number;
    cooldown: number = 0;
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;
    power_loss_rate = 10;

    constructor(start: Phaser.Point, state: GameState) {
        super(start.x, start.y, 0, .9, state);
        this.origin = new Phaser.Point(start.x, start.y);
        this.destination = new Phaser.Point(start.x, start.y);
        this.power = 100;
        this.body = new CircleBody(start.x, start.y, .4);
        this.body.group = MASK.PLAYER;
        this.body.mask = MASK.WALL | MASK.BULLET | MASK.PICKUP_ITEM | MASK.EXIT_LEVEL;
        this.body.entity = this;
        this.setSprite("robot.png");
        state.collision_engine.addBody(this.body);
        this.state.addNewEntity(this);
    }

    beginTick(): void {
    }

    updateTick(ts: number, percent: number): void {
        if (this.power <= 0) return;
        this.position.x = this.origin.x + (this.destination.x - this.origin.x) * percent;
        this.position.y = this.origin.y + (this.destination.y - this.origin.y) * percent;
        this.body.x = this.position.x;
        this.body.y = this.position.y;
    }

    endTick(): void {
        if (this.power <= 0) {
            this.sprite.frameName = "dead-robot.png";
            return;
        }
        this.destination.clone(this.position);
        this.destination.clone(this.origin);
        this.body.moveTo(this.position.x, this.position.y);
    }

    update(ts: number): void {
        this.power -= this.power_loss_rate * (ts / 1000);
        if (this.cooldown > 0) {
            this.cooldown -= ts;
        }
    }

    dealDamage (amount: number, cooldown: number) {
        if (this.cooldown <= 0) {
            this.power -= amount;
            this.state.playerHit(amount);
            this.cooldown = cooldown;
        }
    }

    heal (amount: number) {
        this.power += amount;
        this.state.playerHealed(amount);
        if (this.power > 100) this.power = 100;
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

    debug (graphics: Phaser.Graphics, scale: number) {
        if (this.cooldown > 0) {
            graphics.lineStyle(1, 0xff5555, 1);
            graphics.drawCircle(this.position.x * scale, this.position.y * scale, this.size * scale);
        } else {
            super.debug(graphics, scale);
        }
    }

    interactWith (entity: GameEntity) {
    }
}