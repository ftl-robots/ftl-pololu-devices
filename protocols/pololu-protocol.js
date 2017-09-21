const ProtocolBase = require('./protocol-base');

class PololuProtocol extends ProtocolBase {
    constructor(serialDevice, deviceId) {
        super();
        this.d_protocolType = 'Pololu';
        this.d_serialDevice = serialDevice;
        this.d_deviceId = deviceId;
    }

    enable() {
        var buf = Buffer.from([0xAA, this.d_deviceId, 0x03]);
        this.d_serialDevice.write(buf);
        this.d_enabled = true;
    }

    disable() {
        var buf = Buffer.from([0xAA, this.d_deviceId, 0x60]);
        this.d_serialDevice.write(buf);
        this.d_enabled = false;
    }

    forward(speed) {
        if (!this.d_enabled) {
            throw new Error('Not enabled!');
        }

        if (speed < 0) {
            speed = 0;
        }

        if (speed > 255) {
            speed = 255;
        }

        var speedVal = (speed / 255) * 3200;
        var byte1 = speedVal & 0x1F;
        var byte2 = (speedVal >> 5) & 0x7F;

        var buf = Buffer.from([0xAA, this.d_deviceId, 0x05, byte1, byte2]);
        this.d_serialDevice.write(buf);
    }

    reverse(speed) {
        if (!this.d_enabled) {
            throw new Error('Not enabled!');
        }

        if (speed < 0) {
            speed = 0;
        }

        if (speed > 255) {
            speed = 255;
        }

        var speedVal = (speed / 255) * 3200;
        var byte1 = speedVal & 0x1F;
        var byte2 = (speedVal >> 5) & 0x7F;

        var buf = Buffer.from([0xAA, this.d_deviceId, 0x06, byte1, byte2]);
        this.d_serialDevice.write(buf);
    }

    drive(speed) {
        if (!this.d_enabled) {
            throw new Error('Not enabled!');
        }

        if (speed < -255) {
            speed = -255;
        }

        if (speed > 255) {
            speed = 255;
        }

        if (speed >= 0) {
            this.forward(speed);
        }
        else {
            this.reverse(-speed);
        }
    }

    brake(val) {
        if (!this.d_enabled) {
            throw new Error('Not enabled!');
        }

        if (val < 0) {
            val = 0;
        }
        if (val > 32) {
            val = 32;
        }

        var buf = Buffer.from([0xAA, this.d_deviceId, 0x12, val]);
        this.d_serialDevice.write(buf);
    }
}

module.exports = PololuProtocol;