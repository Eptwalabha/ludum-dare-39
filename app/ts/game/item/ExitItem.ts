class ExitItem extends GameEntity {

    constructor (x: number, y: number) {
        super(x, y, '#eae83f', 0.2);
    }

    update(ts: number) {
    }

    interactWith (entity: GameEntity) {
        if (entity instanceof Robot) {
            console.log("exit!");
        }
    }
}