interface CQuad {
    dimensions: Phaser.Point,
    cell_dimensions: Phaser.Point
    position: Phaser.Point,
    grid: Phaser.Point
}

interface BBox {
    x: number,
    y: number,
    w: number,
    h: number,
}

class CWorld {

    bodies: {};
    quads: Array<Array<number>>;
    quad_def: CQuad;

    onCollisionStart = function (a: CBody, b: CBody) {};

    private next_id: number;

    constructor () {

        this.quad_def = {
            dimensions: new Phaser.Point(),
            cell_dimensions: new Phaser.Point(),
            grid: new Phaser.Point(),
            position: new Phaser.Point()
        };
        this.setLevelDimension(10, 10);

        this.next_id = 0;
        this.bodies = [];
        this.resetQuads();
    }

    setLevelDimension (width: number, height: number) {
        this.quad_def.cell_dimensions.x = 3;
        this.quad_def.cell_dimensions.y = 3;
        this.quad_def.grid.x = Math.floor((width + this.quad_def.cell_dimensions.x) / this.quad_def.cell_dimensions.x) + 1;
        this.quad_def.grid.y = Math.floor((height + this.quad_def.cell_dimensions.y) / this.quad_def.cell_dimensions.y) + 1;
        this.quad_def.dimensions.x = this.quad_def.cell_dimensions.x * this.quad_def.grid.x;
        this.quad_def.dimensions.y = this.quad_def.cell_dimensions.y * this.quad_def.grid.y;
        this.quad_def.position.x = - (this.quad_def.dimensions.x - width) / 2;
        this.quad_def.position.y = - (this.quad_def.dimensions.y - height) / 2;
        this.resetQuads();
        this.updateAllBodies();
    }

    private resetQuads () {
        this.quads = [];
        for (var i = 0, size = (this.quad_def.grid.x * this.quad_def.grid.y); i < size; ++i) {
            this.quads[i] = [];
        }
    }

    private updateAllBodies () {
        for (var body_id in this.bodies) {
            if (!this.bodies.hasOwnProperty(body_id)) continue;
            this.updatePosition(this.bodies[body_id]);
        }
    }

    getQuadIds (bbox: BBox) {
        let quads: Array<number> = [];
        var x = bbox.x - this.quad_def.position.x;
        var y = bbox.y - this.quad_def.position.y;
        if (x < 0 || x > this.quad_def.dimensions.x || y < 0 || y > this.quad_def.dimensions.y) {
            return [0];
        }
        var x2 = Math.floor(x / this.quad_def.cell_dimensions.x);
        var y2 = Math.floor(y / this.quad_def.cell_dimensions.y);
        var x3 = Math.floor((x + bbox.w) / this.quad_def.cell_dimensions.x);
        var y3 = Math.floor((y + bbox.h) / this.quad_def.cell_dimensions.y);
        for (var i = 0, size_i = x3 - x2 + 1; i < size_i; ++i) {
            for (var j = 0, size_j = y3 - y2 + 1; j < size_j; ++j) {
                var quad_id = this.getQuadId(x2 + 1, y2 + j);
                if (quad_id === undefined) quad_id = 0;
                quads.push(quad_id);
            }
        }
        return quads;
    }

    getQuadId (x, y) {
        if (x >= 0 && y >= 0 && x < this.quad_def.grid.x && y < this.quad_def.grid.y) {
            return y * this.quad_def.grid.y + x;
        }
        return 0;
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
        this.removeBodyFromQuad(body);
        delete this.bodies[body.id];
    }

    removeBodyFromQuad (body: CBody) {
        for (var i = 0; i < body.quads.length; ++i) {
            var quad_id = body.quads[i];
            var index = this.quads[quad_id].indexOf(body.id);
            if (index !== -1) {
                this.quads[quad_id].splice(index, 1);
            }
        }
    }

    updatePosition(body: CBody) {
        var new_quads = this.getQuadIds(body.getBoundingBox());
        this.removeBodyFromQuad(body);
        body.quads = new_quads;
        // console.log(new_quads);
        for (var i = 0; i < new_quads.length; ++i) {
            if (this.quads[new_quads[i]] !== undefined) {
                if (this.quads[new_quads[i]].indexOf(body.id) === -1) {
                    this.quads[new_quads[i]].push(body.id);
                }
            }
        }
    }

    debug (graphics: Phaser.Graphics, scale: number) {
        graphics.lineStyle(1, 0x000000, 1);
        for (var id in this.bodies) {
            if (!this.bodies.hasOwnProperty(id)) continue;
            let body: CBody = this.bodies[id];
            if (body instanceof CircleBody) {
                graphics.drawCircle(body.x * scale, body.y * scale, body.radius * 2 * scale);
            }
            if (body instanceof BoxBody) {
                graphics.drawRect(body.x * scale, body.y * scale, body.width * scale, body.height * scale);
            }
        }
        // graphics.lineStyle(1, 0xaa0000, 1);
        // for (var i = 0; i < this.quads.length; ++i) {
        //     var x = (i % this.quad_def.grid.x) * this.quad_def.cell_dimensions.x + this.quad_def.position.x;
        //     var y = Math.floor((i / this.quad_def.grid.x)) * this.quad_def.cell_dimensions.y + this.quad_def.position.y;
        //     graphics.drawRect(
        //         x * scale,
        //         y * scale,
        //         this.quad_def.cell_dimensions.x * scale,
        //         this.quad_def.cell_dimensions.x * scale
        //     );
        // }
    }

    run () {
        let self = this;
        for (var i = 0, size = (this.quad_def.grid.x * this.quad_def.grid.y); i < size; ++i) {
            if (this.quads[i].length > 1) self.checkCollisionFor(this.quads[i]);
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
                if ((bodyA && bodyB) && CWorld.compatibleMask(bodyA, bodyB) && CWorld.checkCollision(bodyA, bodyB)) {
                    this.onCollisionStart(bodyA, bodyB);
                }
            }
        }
    }

    static checkCollision(bodyA: CBody, bodyB: CBody): boolean {
        if (bodyA.type === bodyB.type) {
            if (bodyA.type === CBODY_TYPE.BOX) {
                return CWorld.checkCollisionBoxToBox(bodyA as BoxBody, bodyB as BoxBody);
            } else {
                return CWorld.checkCollisionCircleToCircle(bodyA as CircleBody, bodyB as CircleBody);
            }
        } else {
            if (bodyA.type === CBODY_TYPE.BOX) {
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