class EntityFactory {

    private world: CWorld;
    private game_state: GameState;

    constructor (game_state: GameState) {
        this.game_state = game_state;
        this.world = this.game_state.collision_engine;
    }

    spawnBullet (parent: Foe, direction: number, speed: number, ttlMS: number = 2000) {
        var bullet: Bullet = new Bullet(parent, direction, speed, ttlMS, this.game_state);
        bullet.body = new CircleBody(parent.position.x, parent.position.y, 0.2);
        bullet.body.group = MASK.BULLET;
        bullet.body.mask = MASK.WALL | MASK.PLAYER;
        bullet.body.entity = bullet;
        bullet.setSprite('bullet.png');
        this.game_state.addNewEntity(bullet);
    }

    spawnBulletWave(parent: Foe, number: number, speed: number, ttlMS: number = 2000) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawnBullet(parent, angle * i, speed, ttlMS);
        }
    }

    spawnTBBullet (parent: Foe, direction: number, distance: number = 1, ttl: number = 5) {
        var bullet: TBBullet = new TBBullet(parent, direction, distance, ttl, this.game_state);
        bullet.body = new CircleBody(parent.position.x, parent.position.y, 0.3);
        bullet.body.group = MASK.BULLET;
        bullet.body.mask = MASK.WALL | MASK.PLAYER;
        bullet.body.entity = bullet;
        bullet.setSprite('tb-bullet.png');
        this.game_state.addNewEntity(bullet);
    }

    spawnTBBulletWave(parent: Foe, number: number, distance: number = 1, ttl: number = 5) {
        let angle = (Math.PI * 2) / number;
        for (var i = 0; i < number; ++i) {
            this.spawnTBBullet(parent, angle * i, distance, ttl);
        }
    }

    spawnTile (x: number, y: number, body: CBody, wall: boolean = false, key?: string) {
        var tile: GameEntity;
        if (wall) {
            tile = new Wall(x, y, this.game_state);
            key = key ? key : "wall-" + this.game_state.rnd.between(1, 3) + ".png";
        } else {
            tile = new Floor(x, y, this.game_state);
            key = key ? key : "floor-" + this.game_state.rnd.between(1, 3) + ".png";
        }
        if (body) {
            tile.body = body;
            tile.body.entity = tile;
        }
        tile.setSprite(key);
        this.game_state.addNewEntity(tile);
    }

    spawnPowerItem (x: number, y: number, amount: number) {
        var power_item: PowerItem = new PowerItem(x, y, amount, this.game_state);
        var s = power_item.size;
        power_item.body = new BoxBody(x - s / 2, y - s / 2, s, s);
        power_item.body.group = MASK.PICKUP_ITEM;
        power_item.body.mask = MASK.PLAYER;
        power_item.body.entity = power_item;
        var key = "accumulator";
        if (amount > 30) key = "battery";
        if (amount > 50) key = "car-battery";
        power_item.setSprite(key + '.png');
        this.game_state.addNewEntity(power_item);
    }

    spawnItemFromSpec (spec: IItem) {
        var position = spec.position;
        var power = 50;
        var options = spec.options ? spec.options : {};
        switch (spec.type) {
            case "energy":
                var power: number = options.amount ? options.amount : 50;
                this.spawnPowerItem(position.x, position.y, power);
                break;
            default:
                this.spawnPowerItem(position.x, position.y, 50);
                break;
        }
        this.spawnPowerItem(position.x, position.y, power);
    }

    spawnFoeFromSpec (spec: IFoe) {
        var options = spec.options ? spec.options : [];
        var position = spec.position;
        this.spawnFoe(position.x, position.y, spec.type, options);
    }

    spawnFoe (x: number, y: number, type: string, options: any = []) {
        var foe: Foe = null;
        var key = "foe.png";
        switch (type) {
            case "pinky-tb":
                foe = new PinkyBTFoe(x, y, 1, 0, -1, this, this.game_state);
                key = "foe-pinky.png";
                break;
            case "pinky-tb-left":
                foe = new PinkyBTFoe(x, y, 9, 4, 0, this, this.game_state);
                key = "foe-pinky.png";
                break;
            case "pinky":
                foe = new PinkyFoe(x, y, 500, Math.PI / 4, 0, this, this.game_state);
                key = "foe-pinky.png";
                break;
            case "dark-tb":
                foe = new DarkBTFoe(x, y, 5, 5, this, this.game_state);
                key = "foe.png";
                break;
            case "dark":
                foe = new DarkFoe(x, y, 1000, 6, this, this.game_state);
                key = "foe.png";
                break;
            default:
                foe = new PinkyBTFoe(x, y, 1, 0, -1, this, this.game_state);
                key = "foe-pinky.png";
                break;
        }
        foe.setSprite(key);
        this.game_state.addNewEntity(foe);
    }

    private spawnFoeTBSpat (x: number, y: number, options: any): Foe {
        return new Foe(x, y, this, this.game_state);
    }

}