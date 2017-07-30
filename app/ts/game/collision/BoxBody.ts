class BoxBody extends CBody {
    width: number;
    height: number;
    hw: number;
    hh: number;

    constructor (x, y, width: number, height: number) {
        super(x, y, CBODY_TYPE.BOX);
        this.width = width;
        this.height = height;
        this.hw = this.width / 2;
        this.hh = this.height / 2;
    }

    getBoundingBox() {
        return {
            x: this.x, y: this.y, w: this.width, h: this.height
        };
    }
}
