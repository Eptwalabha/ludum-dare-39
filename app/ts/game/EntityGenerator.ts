
class EntityGenerator {

    static COLLISION_MASK = {
        WALL: 0b0001,
        PLAYER: 0b0010,
        FOE: 0b0100,
        BULLET: 0b1000
    };

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
        bullet.body = new CircleBody(parent.position.x, parent.position.y, 0.2);
        bullet.body.group = EntityGenerator.COLLISION_MASK.BULLET;
        bullet.body.mask = EntityGenerator.COLLISION_MASK.WALL | EntityGenerator.COLLISION_MASK.PLAYER;
        bullet.body.entity = bullet;
        this.game_state.collision_world.addBody(bullet.body);
        this.game_state.addNewEntity(bullet);
    }

    spawn_tb_bullet_wave(parent: Foe, number: number, distance: number) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawn_tb_bullet(parent, angle * i, distance);
        }
    }
}