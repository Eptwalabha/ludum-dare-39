class PinkyBTFoe extends Foe {

    private frequency: number;
    private trigger: number;
    private direction: number = 0;
    private rotate: number;

    constructor(x: number, y: number, frequency: number, direction: number, rotate: number, entity_generator: EntityFactory, state: GameState) {
        super(x, y, entity_generator, state);
        this.frequency = frequency;
        this.trigger = this.frequency;
        this.direction = direction;
        this.rotate = rotate;
        this.updateAngle();
    }

    updateAngle () {
        this.angle = Phaser.Math.wrapAngle(this.direction * Math.PI / 4);
    }

    update (ts: number): void {
    }

    beginTick(): void {
        this.trigger -= 1;
        if (this.trigger === 0) {
            this.entity_generator.spawnTBBullet(this, this.angle, 1, 15);
            this.trigger = this.frequency;
        }
        if (this.rotate !== 0) {
            this.direction = (this.direction + this.rotate) % 8;
            this.updateAngle();
        }
    }

    updateTick(ts: number, percent: number): void {
    }

    endTick(): void {
    }
}