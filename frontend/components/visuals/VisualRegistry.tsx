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

export interface VisualRegistryProps {
  topicSlug: string;
}

export const VisualRegistry: React.FC<VisualRegistryProps> = ({ topicSlug }) => {
  const slug = topicSlug.toLowerCase();

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

  // Fallback to Packet Journey Visual for other networking topics
  return <PacketJourneyVisual />;
};
