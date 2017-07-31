abstract class TurnBasedGameEntity extends GameEntity {

    constructor (x: number, y: number, angle: number, size, state: GameState) {
        super(x, y, angle, size, state);
    }

    abstract beginTick(): void;
    abstract updateTick(ts: number, percent: number): void;
    abstract endTick(): void;
}
