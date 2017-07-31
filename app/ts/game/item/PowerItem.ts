class PowerItem extends GameEntity {
    amount;

    constructor (x: number, y: number, amount: number) {
        super(x, y, '#eae83f', 0.6);
        this.amount = amount;
    }

    update(ts: number) {
    }

    interactWith (entity: GameEntity) {
        if (entity instanceof Robot) {
            this.dead = true;
        }
    }
}