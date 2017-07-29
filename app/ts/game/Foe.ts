class Foe extends TurnBasedGameEntity {
    position: Phaser.Point;
    private origin: Phaser.Point;
    private destination: Phaser.Point;
    private entity_generator: EntityGenerator;
    private shooting_rate: number;
    private next_shooting: number;
    private shooting: number;
    private angle: number;

    constructor(x: number, y: number, entity_generator: EntityGenerator) {
        super(x, y, '#ff0000');
        this.entity_generator = entity_generator;
        this.origin = new Phaser.Point(x, y);
        this.destination = new Phaser.Point(x, y);
        this.shooting_rate = 1500;
        this.next_shooting = this.shooting_rate;
        this.shooting = 1;
        this.angle = Math.random() * Math.PI * 2;
    }

    update (ts: number): void {
        this.next_shooting -= ts;
        if (this.next_shooting <= 0) {
            this.entity_generator.spawn_bullet_wave(this, 8, 5);
            this.next_shooting += this.shooting_rate;
        }
        this.angle = Phaser.Math.wrapAngle(this.angle + (ts / 1000) * Math.PI / 3);
    }

    beginTick(): void {
        this.shooting -= 1;
        if (this.shooting === 0) {
            this.entity_generator.spawn_tb_bullet_wave(this, 5, 1.5);
            this.shooting = 3;
        }
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