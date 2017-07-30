class CircleBody extends CBody {
    radius: number;

    constructor (x: number, y: number, radius: number) {
        super(x, y, CBODY_TYPE.CIRCLE);
        this.radius = radius;
    }
}