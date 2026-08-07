import { ProtocolPlugin } from './ProtocolPlugin';
import { Packet } from '../core/Packet';
import { Node } from '../core/Node';

export class TCPProtocolPlugin implements ProtocolPlugin {
  public id = 'plugin-tcp';
  public name = 'TCP Transmission Control Protocol Plugin';
  public protocolName = 'TCP';
  public layer: 'Layer4' = 'Layer4';

  public processPacket(packet: Packet, node: Node): Packet | null {
    if (packet.flags.includes('SYN')) {
      packet.payload = 'TCP SYN Handshake Request [Seq=100 Ack=0]';
    } else if (packet.flags.includes('SYN-ACK')) {
      packet.payload = 'TCP SYN-ACK Handshake Response [Seq=101 Ack=101]';
    } else if (packet.flags.includes('ACK')) {
      packet.payload = 'TCP ACK Handshake Established [Seq=101 Ack=101]';
    }
    return packet;
  }
}
