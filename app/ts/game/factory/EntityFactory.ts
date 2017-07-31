class EntityFactory {

    private world: CWorld;
    private game_state: GameState;

    constructor (game_state: GameState) {
        this.game_state = game_state;
        this.world = this.game_state.collision_engine;
    }

    spawn_bullet (parent: Foe, direction: number, speed: number, ttlMS: number = 2000) {
        var bullet: Bullet = new Bullet(parent, direction, speed, ttlMS);
        bullet.body = new CircleBody(parent.position.x, parent.position.y, 0.15);
        bullet.body.group = MASK.BULLET;
        bullet.body.mask = MASK.WALL | MASK.PLAYER;
        bullet.body.entity = bullet;
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
        this.game_state.addNewEntity(bullet);
    }

    spawn_tb_bullet_wave(parent: Foe, number: number, distance: number = 1, ttl: number = 5) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawn_tb_bullet(parent, angle * i, distance, ttl);
        }
    }

    spawn_power_item (x: number, y: number, amount: number) {
        var power_item: PowerItem = new PowerItem(x, y, amount);
        var s = power_item.size;
        power_item.body = new BoxBody(x - s / 2, y - s / 2, s, s);
        power_item.body.group = MASK.PICKUP_ITEM;
        power_item.body.mask = MASK.PLAYER;
        power_item.body.entity = power_item;
        this.game_state.addNewEntity(power_item);
    }

    spawnItemFromSpec (spec: IItem) {
        var position = spec.position;
        var power = 50;
        var options = spec.options ? spec.options : {};
        switch (spec.type) {
            case "energy":
                var power: number = options.amount ? options.amount : 50;
                this.spawn_power_item(position.x, position.y, power);
                break;
            default:
                this.spawn_power_item(position.x, position.y, 50);
                break;
        }
        this.spawn_power_item(position.x, position.y, power);
    }

    spawnFoeFromSpec (spec: IFoe) {
        var options = spec.options ? spec.options : [];
        var position = spec.position;
        this.spawnFoe(position.x, position.y, spec.type, options);
    }

    spawnFoe (x: number, y: number, type: string, options: any = []) {
        var foe: Foe = null;
        switch (type) {
            default:
                foe = this.spawnFoeTBSpat(x, y, options);
                break;
        }
        this.game_state.addNewEntity(foe);
    }

    private spawnFoeTBSpat (x: number, y: number, options: any): Foe {
        return new Foe(x, y, this);
    }

}