/**
 * NetVision Cyber-Defense & Red/Blue Team Security Engine (Version 4.7)
 * Simulates volumetric SYN floods, ARP cache poisoning (MITM),
 * DNS spoofing, and applies enterprise Blue-Team cryptographic mitigations.
 */

export type AttackVectorType = 'SYN_FLOOD' | 'ARP_POISONING' | 'DNS_SPOOFING' | 'VLAN_HOPPING';

export interface ThreatScenario {
  id: AttackVectorType;
  name: string;
  threatActor: string;
  targetService: string;
  attackMechanism: string;
  defaultPps: number;
  mitigationName: string;
  mitigationTechnology: string;
  defenseExplanation: string;
}

export const THREAT_SCENARIOS: ThreatScenario[] = [
  {
    id: 'SYN_FLOOD',
    name: 'TCP SYN Flood (Volumetric DoS)',
    threatActor: 'Botnet (Mirai Cluster)',
    targetService: 'Web Application Server (TCP/443)',
    attackMechanism: 'Dispatches high-frequency TCP SYN packets with forged source IPs, exhausting kernel half-open connection backlog tables.',
    defaultPps: 25000,
    mitigationName: 'Cryptographic SYN Cookies',
    mitigationTechnology: 'Linux Kernel syncookies & TCP Intercept',
    defenseExplanation: 'Encodes connection state into initial sequence number (ISN=CryptoHash(SrcIP, DstIP, Timestamp)), eliminating server half-open memory allocation until final ACK arrival.',
  },
  {
    id: 'ARP_POISONING',
    name: 'ARP Cache Poisoning & MITM',
    threatActor: 'Internal Rogue Workstation',
    targetService: 'Default Gateway (192.168.1.1)',
    attackMechanism: 'Broadcasts forged Gratuitous ARP replies mapping Default Gateway IP to attacker MAC (00:DE:AD:BE:EF:01), intercepting all subnet egress traffic.',
    defaultPps: 150,
    mitigationName: 'Dynamic ARP Inspection (DAI)',
    mitigationTechnology: 'Cisco DAI + DHCP Snooping Binding Table',
    defenseExplanation: 'Switch inspects ARP reply payloads against the hardware-verified DHCP snooping database, instantly discarding non-matching forged MAC/IP pairs on untrusted ports.',
  },
  {
    id: 'DNS_SPOOFING',
    name: 'DNS Cache Poisoning (Kaminsky Attack)',
    threatActor: 'Remote Exploit Script',
    targetService: 'Recursive Resolving DNS Server',
    attackMechanism: 'Floods nameserver with forged DNS replies guessing 16-bit Transaction IDs and UDP source ports to redirect domain traffic to phishing servers.',
    defaultPps: 5000,
    mitigationName: 'DNSSEC Validation',
    mitigationTechnology: 'RRSIG & DNSKEY Cryptographic Chains',
    defenseExplanation: 'Resolver cryptographically validates the RRSIG digital signature against the root trust anchor, rejecting any tampered or unauthenticated DNS resource records.',
  },
  {
    id: 'VLAN_HOPPING',
    name: '802.1Q VLAN Double-Tagging Hop',
    threatActor: 'Untrusted Guest Port',
    targetService: 'Internal Management VLAN (VLAN 99)',
    attackMechanism: 'Sends frames with outer Native VLAN 1 tag and inner Target VLAN 99 tag. Switch strips outer tag and forwards frame directly into private VLAN 99 trunk.',
    defaultPps: 80,
    mitigationName: 'Native VLAN Tagging & Explicit Trunking',
    mitigationTechnology: '802.1Q Explicit Native Tagging & DTP Disable',
    defenseExplanation: 'Forces explicit tagging on Native VLAN and configures dedicated unused native VLANs, preventing single-tag stripping leakage.',
  },
];
