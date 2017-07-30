enum CBODY_TYPE {
    CIRCLE,
    BOX
}

abstract class CBody {

    type: CBODY_TYPE;
    world: CWorld;
    x: number;
    y: number;
    id: number = null;
    mask: number;
    group: number;
    entity: any;

    constructor (x: number, y: number, type: CBODY_TYPE) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.mask = 0x0000;
        this.group = 0x0000;
        this.entity = null;
    }

    moveTo (x: number, y: number) {
        this.x = x;
        this.y = y;
        if (this.world) {
            this.world.updatePosition(this);
        }
    }
}