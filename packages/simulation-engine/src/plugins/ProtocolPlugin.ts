import { Packet } from '../core/Packet';
import { Node } from '../core/Node';

export interface ProtocolPlugin {
  id: string;
  name: string;
  protocolName: string;
  layer: 'Layer2' | 'Layer3' | 'Layer4' | 'Layer7';

  processPacket(packet: Packet, node: Node): Packet | null;
  onPacketCreate?(packet: Packet): Packet;
}

export class ProtocolRegistry {
  private static plugins: Map<string, ProtocolPlugin> = new Map();

  public static register(plugin: ProtocolPlugin) {
    this.plugins.set(plugin.protocolName.toUpperCase(), plugin);
  }

  public static getPlugin(protocolName: string): ProtocolPlugin | undefined {
    return this.plugins.get(protocolName.toUpperCase());
  }

  public static getAllPlugins(): ProtocolPlugin[] {
    return Array.from(this.plugins.values());
  }
}
