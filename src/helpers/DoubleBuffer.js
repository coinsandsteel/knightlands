class DoubleBuffer {
    constructor() {
        this._index = 0;
        this._buffers = [[], []];
    }

    get() {
        this._buffers[this._index++ % 2];
    }
}

export default DoubleBuffer;