import { ProtocolPlugin } from './ProtocolPlugin';
import { Packet } from '../core/Packet';
import { Node } from '../core/Node';
export declare class DNSProtocolPlugin implements ProtocolPlugin {
    id: string;
    name: string;
    protocolName: string;
    layer: 'Layer7';
    processPacket(packet: Packet, node: Node): Packet | null;
}
