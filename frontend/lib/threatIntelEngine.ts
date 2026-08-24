/**
 * NetVision Threat Intelligence & MITRE ATT&CK Engine (Version 6.4)
 * Simulates OASIS STIX 2.1/TAXII feeds, MITRE ATT&CK enterprise tactics,
 * and automated BGP Flowspec (RFC 5575) mitigation rule generation.
 */

export interface ThreatIoc {
  id: string;
  type: 'IP_ADDRESS' | 'DOMAIN' | 'FILE_HASH' | 'ASN';
  value: string;
  threatActor: string;
  mitreTactic: string;
  mitreTechniqueId: string;
  confidenceScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface MitreTacticCard {
  id: string;
  techniqueId: string;
  name: string;
  tactic: string;
  activeCount: number;
}

export class ThreatIntelEngine {
  public static getInitialIocs(): ThreatIoc[] {
    return [
      {
        id: 'ioc-1',
        type: 'IP_ADDRESS',
        value: '198.51.100.44',
        threatActor: 'APT29 (Cozy Bear)',
        mitreTactic: 'Command and Control',
        mitreTechniqueId: 'T1071.001',
        confidenceScore: 99,
        severity: 'CRITICAL',
      },
      {
        id: 'ioc-2',
        type: 'DOMAIN',
        value: 'c2-sync.malicious-network.cc',
        threatActor: 'Lazarus Group',
        mitreTactic: 'Exfiltration',
        mitreTechniqueId: 'T1048.003',
        confidenceScore: 94,
        severity: 'HIGH',
      },
      {
        id: 'ioc-3',
        type: 'ASN',
        value: 'AS65550 (Bulletproof Hosting)',
        threatActor: 'Volt Typhoon',
        mitreTactic: 'Initial Access',
        mitreTechniqueId: 'T1190',
        confidenceScore: 88,
        severity: 'HIGH',
      },
    ];
  }

  public static getMitreMatrix(): MitreTacticCard[] {
    return [
      { id: 'mitre-1', techniqueId: 'T1071.001', name: 'Web Protocols C2', tactic: 'Command and Control', activeCount: 14 },
      { id: 'mitre-2', techniqueId: 'T1048.003', name: 'DNS Tunneling Exfil', tactic: 'Exfiltration', activeCount: 6 },
      { id: 'mitre-3', techniqueId: 'T1498.001', name: 'Direct Network Flood', tactic: 'Impact / DoS', activeCount: 22 },
      { id: 'mitre-4', techniqueId: 'T1568.002', name: 'Domain Generation (DGA)', tactic: 'Defense Evasion', activeCount: 8 },
    ];
  }
}
