import { ProtocolPlugin } from './ProtocolPlugin';
import { Packet } from '../core/Packet';
import { Node } from '../core/Node';
export declare class TCPProtocolPlugin implements ProtocolPlugin {
    id: string;
    name: string;
    protocolName: string;
    layer: 'Layer4';
    processPacket(packet: Packet, node: Node): Packet | null;
}
