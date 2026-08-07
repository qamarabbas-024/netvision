"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Port = void 0;
class Port {
    constructor(id, name, macAddress, ipAddress = '0.0.0.0', subnetMask = '255.255.255.0') {
        this.id = id;
        this.name = name;
        this.macAddress = macAddress;
        this.ipAddress = ipAddress;
        this.subnetMask = subnetMask;
        this.isConnected = false;
    }
}
exports.Port = Port;
