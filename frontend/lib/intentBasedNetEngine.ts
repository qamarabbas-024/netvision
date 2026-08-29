// Intent-Based Networking (IBN) Natural Language Policy Compiler Engine

export interface CompiledNetworkPolicy {
  intentSummary: string;
  securityZone: string;
  bandwidthGuaranteeGbps: number;
  redundancyTier: 'DUAL_HOMED' | 'MULTI_PATH_ECMP' | 'SINGLE';
  generatedAcls: string[];
  generatedBgpPolicy: string[];
  status: 'VALIDATED' | 'CONFLICT_DETECTED';
  conflictMessage?: string;
}

export function compileNaturalLanguageIntent(intentPrompt: string): CompiledNetworkPolicy {
  const text = intentPrompt.toLowerCase();

  let securityZone = 'GENERAL_WORKLOAD';
  let bandwidth = 10;
  let redundancy: CompiledNetworkPolicy['redundancyTier'] = 'MULTI_PATH_ECMP';

  if (text.includes('pci') || text.includes('database') || text.includes('isolate')) {
    securityZone = 'PCI_DSS_RESTRICTED';
  } else if (text.includes('ai') || text.includes('gpu') || text.includes('roce')) {
    securityZone = 'AI_TRAINING_LOSSLESS';
    bandwidth = 100;
  }

  const generatedAcls = [
    `ip access-list extended ACL_${securityZone}`,
    ` 10 permit tcp 10.100.0.0/16 eq 443 host 10.200.5.10`,
    ` 20 deny ip any host 10.200.5.10 log`,
    ` 30 permit ip 10.100.0.0/16 10.100.0.0/16`,
  ];

  const generatedBgpPolicy = [
    `route-map RM_${securityZone}_IN permit 10`,
    ` set community 65000:${securityZone === 'PCI_DSS_RESTRICTED' ? '999' : '100'}`,
    ` set local-preference ${securityZone === 'PCI_DSS_RESTRICTED' ? '200' : '100'}`,
  ];

  return {
    intentSummary: intentPrompt,
    securityZone,
    bandwidthGuaranteeGbps: bandwidth,
    redundancyTier: redundancy,
    generatedAcls,
    generatedBgpPolicy,
    status: 'VALIDATED',
  };
}
