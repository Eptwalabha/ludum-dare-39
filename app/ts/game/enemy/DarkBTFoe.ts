class DarkBTFoe extends Foe {

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
    }

    beginTick(): void {
        this.trigger -= 1;
        if (this.trigger === 0) {
            this.entity_generator.spawnTBBulletWave(this, this.nbr_bullet, .5, 15);
            this.trigger = this.frequency;
        }
    }

    updateTick(ts: number, percent: number): void {
    }

    endTick(): void {
    }
}