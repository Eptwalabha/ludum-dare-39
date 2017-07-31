abstract class TurnBasedGameEntity extends GameEntity {

    constructor (x: number, y: number, color: string, size, state: GameState) {
        super(x, y, color, size, state);
    }

    abstract beginTick(): void;
    abstract updateTick(ts: number, percent: number): void;
    abstract endTick(): void;
}
