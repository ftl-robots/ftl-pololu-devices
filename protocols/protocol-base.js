class ProtocolBase {
    constructor() {
        this.d_protocolType = 'Base';
        this.d_enabled = false;
    }

    get protocolType() {
        return this.d_protocolType;
    }

    enable() {
        throw new Error('Abstract enable() called');
    }

    disable() {
        throw new Error('Abstract disable() called');
    }

    /**
     * 
     * @param {Number} speed Speed to drive forward at (0-255)
     */
    forward(speed) {
        throw new Error('Abstract forward() called');
    }

    /**
     * 
     * @param {Number} speed Speed to drive backward at (0-255)
     */
    reverse(speed) {
        throw new Error('Abstract reverse() called');
    }

    /**
     * 
     * @param {Number} speed Speed to drive at (-255 to 255)
     */
    drive(speed) {
        throw new Error('Abstract drive() called');
    }

    /**
     * 
     * @param {Number} val (0 = full coast, 32 = full brake) 
     */
    brake(val) {
        throw new Error('Abstract brake() called');
    }
}

module.exports = ProtocolBase;