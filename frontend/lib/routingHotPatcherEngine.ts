// Automated Zero-Downtime Routing Policy Hot-Patcher Engine

export interface RoutingHotPatch {
  patchId: string;
  targetDevice: string;
  protocol: 'BGP' | 'OSPF' | 'IS-IS' | 'SRv6';
  patchType: 'PREFIX_FILTER' | 'COMMUNITY_TAG' | 'MED_ADJUST' | 'COST_REWEIGHT';
  beforeDiff: string[];
  afterDiff: string[];
  gracefulRestartEnabled: boolean;
  rollbackTriggerLatencyMs: number;
}

export function generateHotPatchPlan(patchType: RoutingHotPatch['patchType']): RoutingHotPatch {
  if (patchType === 'PREFIX_FILTER') {
    return {
      patchId: 'PATCH-2026-BGP-081',
      targetDevice: 'border-gw-01',
      protocol: 'BGP',
      patchType: 'PREFIX_FILTER',
      beforeDiff: [
        'router bgp 65001',
        ' neighbor 198.51.100.1 prefix-list PL_TRANSIT_IN in',
        '-ip prefix-list PL_TRANSIT_IN permit 0.0.0.0/0 le 24',
      ],
      afterDiff: [
        '+ip prefix-list PL_TRANSIT_IN permit 0.0.0.0/0 le 22',
        '+ip prefix-list PL_TRANSIT_IN deny 10.0.0.0/8 le 32',
        '+ip prefix-list PL_TRANSIT_IN deny 172.16.0.0/12 le 32',
      ],
      gracefulRestartEnabled: true,
      rollbackTriggerLatencyMs: 12.0,
    };
  }

  return {
    patchId: 'PATCH-2026-OSPF-092',
    targetDevice: 'spine-rtr-02',
    protocol: 'OSPF',
    patchType: 'COST_REWEIGHT',
    beforeDiff: [
      'interface GigabitEthernet0/0/1',
      '- ip ospf cost 100',
    ],
    afterDiff: [
      'interface GigabitEthernet0/0/1',
      '+ ip ospf cost 10',
      '+ ip ospf bfd',
    ],
    gracefulRestartEnabled: true,
    rollbackTriggerLatencyMs: 5.0,
  };
}
