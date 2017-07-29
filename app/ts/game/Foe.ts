class Foe extends TurnBasedGameEntity {
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;
    private entity_generator: EntityGenerator;
    private shooting_rate: number;
    private next_shooting: number;
    private shooting: boolean;

    constructor(x: number, y: number, entity_generator: EntityGenerator) {
        super(x, y, '#ff0000');
        this.entity_generator = entity_generator;
        this.origin = new Phaser.Point(x, y);
        this.destination = new Phaser.Point(x, y);
        this.shooting_rate = 500;
        this.next_shooting = this.shooting_rate;
        this.shooting = true;
    }

    update (ts: number): void {
        if (this.shooting) {
            this.next_shooting -= ts;
            if (this.next_shooting <= 0) {
                this.entity_generator.spawn_bullet(this);
                this.next_shooting += this.shooting_rate;
            }
        }
    }

    beginTick(): void {
        this.shooting = !this.shooting;
        this.next_shooting = 0;
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