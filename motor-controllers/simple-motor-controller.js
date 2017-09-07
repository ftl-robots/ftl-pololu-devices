const { Interfaces, DeviceInterface, Constants } = require('ftl-robot-host');
const PololuProtocol = require('./protocols/pololu-protocol');
const PololuCompactProtocol = require('./protocols/pololu-compact-protocol');

const PROTOCOL_IMPLEMENTATIONS = {
    'compact': PololuCompactProtocol,
    'pololu' : PololuProtocol
};

class SimpleMotorController extends DeviceInterface {
    constructor (id, interfaceImpl, config) {
        super(id, interfaceImpl, config);
        this.d_type = "PololuSimpleMotorController";

        // Make sure the interface implementation corresponds
        // to a serial device
        if (!(interfaceImpl instanceof Interfaces.SERIAL)) {
            throw new Error('Invalid interface provided. Expected a SERIAL interface');
        }

        // Set up the defaults
        this.d_deviceId = -1;
        this.d_protocol = 'compact'; // valid choices are compact, pololu
        this.d_protocolImpl = null;

        if (config.deviceId !== undefined) {
            this.d_deviceId = config.deviceId;
        }

        if (config.protocol) {
            if (PROTOCOL_IMPLEMENTATIONS[config.protocol] === undefined) {
                throw new Error('Invalid protocol provided in config: ' + config.protocol);
            }
            this.d_protocol = config.protocol;
        }

        // Sanity check
        if (this.d_protocol !== 'compact' && this.d_deviceId === -1) {
            throw new Error('Non compact protocol selected, but no device ID set');
        }

        if (this.d_protocol === 'compact') {
            this.d_protocolImpl = new PololuCompactProtocol(interfaceImpl);
        }
        else if (this.d_protocol === 'pololu') {
            this.d_protocolImpl = new PololuProtocol(interfaceImpl, this.d_deviceId);
        }
    }

    write(portType, channel, value) {
        // we only respond to the PWM port type
        if (portType === Constants.PortTypes.PWM) {
            // coerce the value
            if (value < -255) {
                value = -255;
            }
            if (value > 255) {
                value = 255;
            }

            this.d_protocolImpl.drive(value);
        }
    }

    read() {
        // Not implemented
        return null;
    }

    enable() {
        this.d_protocolImpl.enable();
    }

    disable() {
        this.d_protocolImpl.disable();
    }
}

module.exports = SimpleMotorController;