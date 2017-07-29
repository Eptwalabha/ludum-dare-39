class EntityGenerator {

    private game_state: GameState;

    constructor (game_state: GameState) {
        this.game_state = game_state;
    }

    spawn_bullet (parent: Foe, direction: number, speed: number) {
        var bullet: Bullet = new Bullet(parent, direction, speed, 2000);
        this.game_state.addNewEntity(bullet);
    }

    spawn_bullet_wave(parent: Foe, number: number, speed: number) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawn_bullet(parent, angle * i, speed);
        }
    }

    spawn_tb_bullet (parent: Foe, direction: number, distance: number) {
        var bullet: TBBullet = new TBBullet(parent, direction, distance, 5);
        this.game_state.addNewEntity(bullet);
    }

    spawn_tb_bullet_wave(parent: Foe, number: number, distance: number) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawn_tb_bullet(parent, angle * i, distance);
        }
    }
}