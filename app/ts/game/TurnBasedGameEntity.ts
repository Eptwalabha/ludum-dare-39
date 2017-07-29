abstract class TurnBasedGameEntity extends GameEntity {

    constructor (x, y, color) {
        super(x, y, color);
    }

    abstract beginTick(): void;
    abstract updateTick(ts: number, percent: number): void;
    abstract endTick(): void;
}
