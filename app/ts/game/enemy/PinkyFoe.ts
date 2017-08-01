class PinkyFoe extends Foe {

    private frequency: number;
    private trigger: number;
    private angle_per_second: number;

    constructor(x: number, y: number, frequency: number, rotation: number, angle: number, entity_generator: EntityFactory, state: GameState) {
        super(x, y, entity_generator, state);
        this.frequency = frequency;
        this.trigger = this.frequency;
        this.angle = angle;
        this.angle_per_second = rotation;
    }

    update (ts: number): void {
        var add = this.angle_per_second * (ts / 1000);
        this.angle = Phaser.Math.wrapAngle(this.angle + add);
        this.trigger -= ts;
        if (this.trigger <= 0) {
            this.trigger += this.frequency;
            this.entity_generator.spawnBullet(this, this.angle, 2, 5000);
        }
    }

    beginTick(): void {
    }

    updateTick(ts: number, percent: number): void {
    }

    endTick(): void {
    }
}