/**
 * NetVision Global Multi-Cloud WAN Mesh Engine (Version 7.6)
 * Simulates enterprise cross-cloud backbones: AWS Cloud WAN Core Networks,
 * Azure Virtual WAN Hubs, and Google Cloud Network Connectivity Center (NCC).
 */

export interface CloudProviderHub {
  provider: 'AWS' | 'AZURE' | 'GCP';
  hubName: string;
  region: string;
  segment: 'PRODUCTION_CORE' | 'PCI_COMPLIANT';
  bgpAsn: number;
  activePrefixes: number;
  interconnectLatencyMs: number;
}

export class MultiCloudWanEngine {
  public static getInitialHubs(): CloudProviderHub[] {
    return [
      { provider: 'AWS', hubName: 'AWS Cloud WAN Core', region: 'us-east-1 (N. Virginia)', segment: 'PRODUCTION_CORE', bgpAsn: 64512, activePrefixes: 48, interconnectLatencyMs: 4.2 },
      { provider: 'AZURE', hubName: 'Azure Virtual WAN Hub', region: 'westeurope (Amsterdam)', segment: 'PRODUCTION_CORE', bgpAsn: 65515, activePrefixes: 36, interconnectLatencyMs: 72.1 },
      { provider: 'GCP', hubName: 'Google NCC Hub Spoke', region: 'asia-east1 (Taiwan)', segment: 'PRODUCTION_CORE', bgpAsn: 16550, activePrefixes: 29, interconnectLatencyMs: 142.5 },
    ];
  }
}
