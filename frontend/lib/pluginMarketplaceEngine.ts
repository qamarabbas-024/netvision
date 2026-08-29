// Global Community Protocol Plugin Registry & Marketplace Engine

export interface ProtocolPluginPackage {
  id: string;
  name: string;
  category: 'TRANSPORT' | 'SECURITY' | 'IOT' | 'QUANTUM' | 'DEVOPS';
  author: string;
  version: string;
  description: string;
  downloads: number;
  rating: number;
  sha256: string;
  installed: boolean;
}

export const COMMUNITY_PLUGIN_CATALOG: ProtocolPluginPackage[] = [
  {
    id: 'plugin-masque-tunnel',
    name: 'MASQUE HTTP/3 Datagram Proxy',
    category: 'TRANSPORT',
    author: 'IETF-WASM-WG',
    version: '1.4.2',
    description: 'RFC 9298 CONNECT-IP & CONNECT-UDP datagram encapsulation over HTTP/3 QUIC.',
    downloads: 14200,
    rating: 4.9,
    sha256: '9a72f8...e41c',
    installed: true,
  },
  {
    id: 'plugin-coap-cbor',
    name: 'CoAP / CBOR IoT Lightweight Dissector',
    category: 'IOT',
    author: 'IoT-OpenMesh',
    version: '2.1.0',
    description: 'Ultra-low overhead RFC 7252 CoAP parser with concise binary object representation.',
    downloads: 8940,
    rating: 4.8,
    sha256: '3b18d2...a889',
    installed: false,
  },
  {
    id: 'plugin-bb84-qkd',
    name: 'BB84 Quantum Key Exchange Simulator',
    category: 'QUANTUM',
    author: 'QuantumNet-Lab',
    version: '0.9.5',
    description: 'Photon polarization basis reconciliation and Eavesdropping QBER detector.',
    downloads: 12450,
    rating: 5.0,
    sha256: '7c40e1...f092',
    installed: false,
  },
];
