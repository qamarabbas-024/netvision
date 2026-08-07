"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolRegistry = void 0;
class ProtocolRegistry {
    static register(plugin) {
        this.plugins.set(plugin.protocolName.toUpperCase(), plugin);
    }
    static getPlugin(protocolName) {
        return this.plugins.get(protocolName.toUpperCase());
    }
    static getAllPlugins() {
        return Array.from(this.plugins.values());
    }
}
exports.ProtocolRegistry = ProtocolRegistry;
ProtocolRegistry.plugins = new Map();
