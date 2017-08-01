class DarkFoe extends Foe {

    private frequency: number;
    private trigger: number;
    private nbr_bullet: number;

    constructor(x: number, y: number, frequency: number, nbr: number, entity_generator: EntityFactory, state: GameState) {
        super(x, y, entity_generator, state);
        this.frequency = frequency;
        this.trigger = this.frequency;
        this.nbr_bullet = nbr;
    }

    update (ts: number): void {
        this.trigger -= ts;
        if (this.trigger <= 0) {
            this.entity_generator.spawnBulletWave(this, this.nbr_bullet, 5);
            this.trigger += this.frequency;
        }
    }

    beginTick(): void {
    }

    updateTick(ts: number, percent: number): void {
    }

    endTick(): void {
    }
}