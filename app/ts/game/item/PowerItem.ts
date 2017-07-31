class PowerItem extends GameEntity {
    amount;

    constructor (x: number, y: number, amount: number, state: GameState) {
        super(x, y, 0, 0.6, state);
        this.amount = amount;
    }

    update(ts: number) {
    }

    interactWith (entity: GameEntity) {
        if (entity instanceof Robot) {
            entity.heal(this.amount);
            this.dead = true;
        }
    }
}