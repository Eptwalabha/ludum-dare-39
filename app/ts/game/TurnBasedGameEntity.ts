abstract class TurnBasedGameEntity extends GameEntity {

    constructor (x: number, y: number, color: string, size = 1) {
        super(x, y, color, size);
    }

    abstract beginTick(): void;
    abstract updateTick(ts: number, percent: number): void;
    abstract endTick(): void;
}
