/**
 * NetVision Global Internet Digital Twin Engine (Version 5.0)
 * Simulates the global Tier-1 Internet backbone, Autonomous Systems (AS),
 * major Internet Exchange Points (IXPs), undersea fiber cables, and root DNS clusters.
 */

export interface GlobalTransitNode {
  id: string;
  asNumber: number;
  name: string;
  country: string;
  tier: 'TIER_1_CARRIER' | 'IXP' | 'CLOUD_HYPERSCALER' | 'DNS_ROOT';
  coordinates: { lat: number; lng: number };
  prefixCount: number;
}

export interface UnderseaCable {
  id: string;
  name: string;
  endpoints: [string, string];
  capacityTbps: number;
  latencyMs: number;
  status: 'ONLINE' | 'SEVERED' | 'CONGESTED';
}

export class InternetDigitalTwinEngine {
  public static getGlobalTopology() {
    const nodes: GlobalTransitNode[] = [
      { id: 'as-lumen', asNumber: 3356, name: 'Lumen / Level3 Global IP', country: 'USA', tier: 'TIER_1_CARRIER', coordinates: { lat: 38.9, lng: -77.0 }, prefixCount: 945000 },
      { id: 'as-telia', asNumber: 1299, name: 'Arelion / Telia Carrier', country: 'Sweden', tier: 'TIER_1_CARRIER', coordinates: { lat: 59.3, lng: 18.0 }, prefixCount: 938000 },
      { id: 'as-ntt', asNumber: 2914, name: 'NTT Communications', country: 'Japan', tier: 'TIER_1_CARRIER', coordinates: { lat: 35.6, lng: 139.6 }, prefixCount: 941000 },
      { id: 'ixp-decix', asNumber: 0, name: 'DE-CIX Frankfurt IXP', country: 'Germany', tier: 'IXP', coordinates: { lat: 50.1, lng: 8.6 }, prefixCount: 0 },
      { id: 'ixp-equinix', asNumber: 0, name: 'Equinix Ashburn IXP', country: 'USA', tier: 'IXP', coordinates: { lat: 39.0, lng: -77.4 }, prefixCount: 0 },
      { id: 'dns-k-root', asNumber: 25152, name: 'K-Root DNS Cluster (RIPE)', country: 'UK', tier: 'DNS_ROOT', coordinates: { lat: 51.5, lng: -0.1 }, prefixCount: 1 },
    ];

    const cables: UnderseaCable[] = [
      { id: 'cable-marea', name: 'MAREA Transatlantic (Virginia Beach <-> Bilbao)', endpoints: ['as-lumen', 'as-telia'], capacityTbps: 200, latencyMs: 38, status: 'ONLINE' },
      { id: 'cable-faulkner', name: 'Pacific Express (Tokyo <-> Silicon Valley)', endpoints: ['as-ntt', 'as-lumen'], capacityTbps: 160, latencyMs: 95, status: 'ONLINE' },
      { id: 'cable-euro-ring', name: 'Trans-European Core Fiber Ring', endpoints: ['as-telia', 'ixp-decix'], capacityTbps: 400, latencyMs: 12, status: 'ONLINE' },
    ];

    return { nodes, cables };
  }
}
