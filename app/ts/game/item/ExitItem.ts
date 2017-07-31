class ExitItem extends GameEntity {

    constructor (x: number, y: number, state: GameState) {
        super(x, y, 0, 0.2, state);
    }

    update(ts: number) {
    }

    interactWith (entity: GameEntity) {
        if (entity instanceof Robot) {
            this.state.reachEndOfTheLevel(this);
        }
    }
}