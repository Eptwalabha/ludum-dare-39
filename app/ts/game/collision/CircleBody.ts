class CircleBody extends CBody {
    radius: number;
    constructor (x: number, y: number, radius: number) {
        super(x, y, CBODY_TYPE.CIRCLE);
        this.radius = radius;
    }

    getBoundingBox(): BBox {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            w: this.radius * 2,
            h: this.radius * 2
        };
    }
}