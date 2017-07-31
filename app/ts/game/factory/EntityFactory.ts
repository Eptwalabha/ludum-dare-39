class EntityFactory {

    private world: CWorld;
    private game_state: GameState;

    constructor (game_state: GameState) {
        this.game_state = game_state;
        this.world = this.game_state.collision_world;
    }

    spawn_bullet (parent: Foe, direction: number, speed: number, ttlMS: number = 2000) {
        var bullet: Bullet = new Bullet(parent, direction, speed, ttlMS);
        bullet.body = new CircleBody(parent.position.x, parent.position.y, 0.15);
        bullet.body.group = MASK.BULLET;
        bullet.body.mask = MASK.WALL | MASK.PLAYER;
        bullet.body.entity = bullet;
        this.world.addBody(bullet.body);
        this.game_state.addNewEntity(bullet);
    }

    spawn_bullet_wave(parent: Foe, number: number, speed: number, ttlMS: number = 2000) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawn_bullet(parent, angle * i, speed, ttlMS);
        }
    }

    spawn_tb_bullet (parent: Foe, direction: number, distance: number = 1, ttl: number = 5) {
        var bullet: TBBullet = new TBBullet(parent, direction, distance, ttl);
        bullet.body = new CircleBody(parent.position.x, parent.position.y, 0.2);
        bullet.body.group = MASK.BULLET;
        bullet.body.mask = MASK.WALL | MASK.PLAYER;
        bullet.body.entity = bullet;
        this.world.addBody(bullet.body);
        this.game_state.addNewEntity(bullet);
    }

    spawn_tb_bullet_wave(parent: Foe, number: number, distance: number = 1, ttl: number = 5) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawn_tb_bullet(parent, angle * i, distance, ttl);
        }
    }
}