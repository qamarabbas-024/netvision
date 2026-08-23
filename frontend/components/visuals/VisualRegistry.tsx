'use client';

import React from 'react';
import { OSILayerVisual } from './OSILayerVisual';
import { TCPHandshakeVisual } from './TCPHandshakeVisual';
import { DNSLookupVisual } from './DNSLookupVisual';
import { ARPVisual } from './ARPVisual';
import { DHCPVisual } from './DHCPVisual';
import { SubnetVisual } from './SubnetVisual';
import { PacketJourneyVisual } from './PacketJourneyVisual';
import { RouterForwardingVisual } from './RouterForwardingVisual';
import { IPAddressingVisual } from './IPAddressingVisual';
import { ClientServerVisual } from './ClientServerVisual';
import { STPVisual } from './STPVisual';
import { OSPFVisual } from './OSPFVisual';
import { MultiAreaOSPFVisual } from './MultiAreaOSPFVisual';
import { IPv6Visual } from './IPv6Visual';
import { NetworkAutomationVisual } from './NetworkAutomationVisual';
import { BinaryConverterVisual } from './BinaryConverterVisual';
import { MediaInspectorVisual } from './MediaInspectorVisual';
import { PerformanceMetricsVisual } from './PerformanceMetricsVisual';
import { WirelessSpectrumVisual } from './WirelessSpectrumVisual';
import { MacBitParserVisual } from './MacBitParserVisual';
import { EthernetFrameVisual } from './EthernetFrameVisual';
import { SocketMultiplexerVisual } from './SocketMultiplexerVisual';
import { WiresharkPcapStudio } from './WiresharkPcapStudio';
import { ScapyPacketCrafter } from './ScapyPacketCrafter';
import { NetworkBufferPhysicsVisualizer } from '../simulation/NetworkBufferPhysicsVisualizer';
import { BgpEvpnFabricVisualizer } from '../simulation/BgpEvpnFabricVisualizer';
import { IacAutomationStudio } from '../simulation/IacAutomationStudio';
import { HardwareBridgeStudio } from '../simulation/HardwareBridgeStudio';

export interface VisualRegistryProps {
  topicSlug: string;
}

export const VisualRegistry: React.FC<VisualRegistryProps> = ({ topicSlug }) => {
  const slug = topicSlug.toLowerCase();

  if (
    slug.includes('binary') ||
    slug.includes('hex') ||
    slug.includes('bits-bytes') ||
    slug.includes('net-101-bits')
  ) {
    return <BinaryConverterVisual />;
  }

  if (
    slug.includes('physical-media') ||
    slug.includes('transceiver') ||
    slug.includes('media-inspector') ||
    slug.includes('network-devices-overview') ||
    slug.includes('network-devices') ||
    slug.includes('copper') ||
    slug.includes('fiber')
  ) {
    return <MediaInspectorVisual />;
  }

  if (
    slug.includes('mac-address') ||
    slug.includes('physical-identity') ||
    slug.includes('mac_bit_parser') ||
    slug.includes('level-0-mac-addresses')
  ) {
    return <MacBitParserVisual />;
  }

  if (
    slug.includes('ethernet-mac-addresses') ||
    slug.includes('ethernet-framing') ||
    slug.includes('ethernet_frame') ||
    slug.includes('802.3')
  ) {
    return <EthernetFrameVisual />;
  }

  if (
    slug.includes('wireshark') ||
    slug.includes('pcap') ||
    slug.includes('packet-capture') ||
    slug.includes('packet_capture') ||
    slug.includes('forensics')
  ) {
    return <WiresharkPcapStudio />;
  }

  if (slug.includes('physics') || slug.includes('buffer') || slug.includes('queue') || slug.includes('tail-drop') || slug.includes('red') || slug.includes('congestion') || slug.includes('qos')) {
    return <NetworkBufferPhysicsVisualizer />;
  }

  if (slug.includes('bgp') || slug.includes('evpn') || slug.includes('vxlan') || slug.includes('spine-leaf') || slug.includes('datacenter') || slug.includes('cloud-fabric')) {
    return <BgpEvpnFabricVisualizer />;
  }

  if (slug.includes('iac') || slug.includes('terraform') || slug.includes('ansible') || slug.includes('netdevops') || slug.includes('netmiko') || slug.includes('playbook') || slug.includes('infrastructure-as-code')) {
    return <IacAutomationStudio />;
  }

  if (slug.includes('containerlab') || slug.includes('eve-ng') || slug.includes('gns3') || slug.includes('clab') || slug.includes('hardware-bridge') || slug.includes('physical-lab')) {
    return <HardwareBridgeStudio />;
  }

  if (slug.includes('scapy') || slug.includes('packet-craft') || slug.includes('packet_craft') || slug.includes('crafting')) {
    return <ScapyPacketCrafter />;
  }

  if (slug.includes('automation') || slug.includes('programmability') || slug.includes('pipeline') || slug.includes('rest-api')) {
    return <NetworkAutomationVisual />;
  }
  if (slug.includes('multi-area') || slug.includes('multi_area') || slug.includes('redistribution')) {
    return <MultiAreaOSPFVisual />;
  }
  if (slug.includes('ipv6') || slug.includes('slaac') || slug.includes('compressor')) {
    return <IPv6Visual />;
  }
  if (slug.includes('ospf') || slug.includes('net-304') || slug.includes('link-state')) {
    return <OSPFVisual />;
  }
  if (slug.includes('stp') || slug.includes('spanning-tree') || slug.includes('net-302')) {
    return <STPVisual />;
  }
  if (slug.includes('osi')) {
    return <OSILayerVisual />;
  }
  if (slug.includes('tcp-ip') || slug === 'tcp' || slug.includes('handshake')) {
    return <TCPHandshakeVisual />;
  }
  if (slug.includes('dns')) {
    return <DNSLookupVisual />;
  }
  if (slug.includes('arp')) {
    return <ARPVisual />;
  }
  if (slug.includes('dhcp')) {
    return <DHCPVisual />;
  }
  if (slug.includes('port') || slug.includes('socket') || slug.includes('multiplex')) {
    return <SocketMultiplexerVisual />;
  }
  if (slug.includes('subnet')) {
    return <SubnetVisual />;
  }
  if (slug.includes('ipv4') || slug.includes('ip-addressing')) {
    return <IPAddressingVisual />;
  }
  if (slug.includes('routing')) {
    return <RouterForwardingVisual />;
  }
  if (slug.includes('http') || slug.includes('https')) {
    return <ClientServerVisual />;
  }
  if (slug.includes('performance') || slug.includes('metrics') || slug.includes('latency')) {
    return <PerformanceMetricsVisual />;
  }
  if (
    slug.includes('wireless') ||
    slug.includes('wifi') ||
    slug.includes('spectrum') ||
    slug.includes('802.11') ||
    slug.includes('rf')
  ) {
    return <WirelessSpectrumVisual />;
  }

  // Fallback to Packet Journey Visual for other networking topics
  return <PacketJourneyVisual />;
};
