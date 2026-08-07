import { ProtocolPlugin } from './ProtocolPlugin';
import { Packet } from '../core/Packet';
import { Node } from '../core/Node';

export class DNSProtocolPlugin implements ProtocolPlugin {
  public id = 'plugin-dns';
  public name = 'DNS Domain Name System Protocol Plugin';
  public protocolName = 'DNS';
  public layer: 'Layer7' = 'Layer7';

  public processPacket(packet: Packet, node: Node): Packet | null {
    packet.payload = 'DNS A-Record Query: netvision.edu -> 172.16.0.5';
    return packet;
  }
}
