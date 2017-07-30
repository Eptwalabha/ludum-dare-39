class CWorld {

    bodies: Array<CBody>;
    quads: Array<Array<Array<number>>>;

    onCollisionStart = function (a: CBody, b: CBody) {};

    private next_id: number;

    constructor () {
        this.next_id = 0;
        this.bodies = [];
        this.resetQuads();
    }

    resetQuads () {
        this.quads = [];
        for (var i = 0; i < 10; ++i) {
            this.quads[i] = [];
            for (var j = 0; j < 10; ++j) {
                this.quads[i][j] = [];
            }
        }
    }

    addBody (body: CBody) {
        if (body.id === null) {
            body.id = this.getNewId();
        }
        if (!this.bodies[body.id]) {
            this.bodies[body.id] = body;
        }
        this.updatePosition(body);
        body.world = this;
    }

    removeBody (body: CBody) {
        // TODO remove from quads
        // TODO remove from bodies' list
    }

    updatePosition(body: CBody) {
        // TODO set quadrant
    }

    run () {
        let self = this;
        for (var i = 0; i < 10; ++i) {
            for (var j = 0; j < 10; ++j) {
                if (this.quads[i][j].length > 1) self.checkCollisionFor(this.quads[i][j]);
            }
        }
    }

    getNewId() {
        return this.next_id++;
    }

    checkCollisionFor(ids: Array<number>) {
        for (var i = 0; i < ids.length; ++i) {
            let bodyA: CBody = this.bodies[ids[i]];
            for (var j = i + 1; j < ids.length; ++j) {
                let bodyB: CBody = this.bodies[ids[j]];
                if (CWorld.compatibleMask(bodyA, bodyB) && CWorld.checkCollision(bodyA, bodyB)) {
                    this.onCollisionStart(bodyA, bodyB);
                }
            }
        }
    }

    static checkCollision(bodyA: CBody, bodyB: CBody): boolean {
        let ta = bodyA.type;
        let tb = bodyB.type;
        if (ta === tb) {
            if (ta === CBODY_TYPE.BOX) {
                return CWorld.checkCollisionBoxToBox(bodyA as BoxBody, bodyB as BoxBody);
            } else {
                return CWorld.checkCollisionCircleToCircle(bodyA as CircleBody, bodyB as CircleBody);
            }
        } else {
            if (ta === CBODY_TYPE.BOX) {
                return CWorld.checkCollisionBoxToCircle(bodyA as BoxBody, bodyB as CircleBody);
            } else {
                return CWorld.checkCollisionBoxToCircle(bodyB as BoxBody, bodyA as CircleBody);
            }
        }
    }

    static compatibleMask (bodyA: CBody, bodyB: CBody): boolean {
        return ((bodyA.group & bodyB.mask) !== 0) && ((bodyB.group & bodyA.mask) !== 0);
    }

    static checkCollisionBoxToCircle(box: BoxBody, circle: CircleBody) {
        let c_dist_x = Math.abs(circle.x - (box.x + box.hw));
        let c_dist_y = Math.abs(circle.y - (box.y + box.hh));

        if (c_dist_x > (box.hw + circle.radius)) return false;
        if (c_dist_y > (box.hh + circle.radius)) return false;

        if (c_dist_x <= box.hw) return true;
        if (c_dist_y <= box.hh) return true;

        let cornerDistance_sq = Math.pow((c_dist_x - box.hw), 2) + Math.pow((c_dist_y - box.hh), 2);

        return (cornerDistance_sq <= (circle.radius * circle.radius));
    }

    static checkCollisionCircleToCircle(circleA: CircleBody, circleB: CircleBody) {
        let dist_x = Math.abs(circleA.x - circleB.x);
        let dist_y = Math.abs(circleA.y - circleB.y);
        return (dist_x * dist_x + dist_y * dist_y) <= (circleA.radius * circleA.radius + circleB.radius * circleB.radius);
    }

    static checkCollisionBoxToBox(boxA: BoxBody, boxB: BoxBody) {
        return  (boxA.x + boxA.width > boxB.x && boxA.x < boxB.x + boxB.width) &&
                (boxA.y + boxA.height > boxB.y && boxA.y < boxB.y + boxB.height);
    }
}