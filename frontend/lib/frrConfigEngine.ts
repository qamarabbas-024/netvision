// Free Range Routing (FRR) Configuration and Daemon Generation Engine

export interface FrrRouterConfig {
  hostname: string;
  routerId: string;
  daemons: {
    zebra: boolean;
    bgpd: boolean;
    ospfd: boolean;
    isisd: boolean;
    bfdd: boolean;
  };
  ospf?: {
    area: string;
    networks: string[];
  };
  bgp?: {
    asn: number;
    neighbors: Array<{ ip: string; remoteAsn: number }>;
  };
  interfaces: Array<{
    name: string;
    ipv4: string;
    description: string;
  }>;
}

export function generateFrrConf(config: FrrRouterConfig): string {
  const ifaceConfigs = config.interfaces
    .map(
      (i) => `interface ${i.name}
 description ${i.description}
 ip address ${i.ipv4}
!`
    )
    .join('\n');

  let ospfBlock = '';
  if (config.daemons.ospfd && config.ospf) {
    ospfBlock = `router ospf
 ospf router-id ${config.routerId}
${config.ospf.networks.map((net) => ` network ${net} area ${config.ospf?.area}`).join('\n')}
!`;
  }

  let bgpBlock = '';
  if (config.daemons.bgpd && config.bgp) {
    bgpBlock = `router bgp ${config.bgp.asn}
 bgp router-id ${config.routerId}
 no bgp default ipv4-unicast
 neighbor LEAF_PEERS peer-group
${config.bgp.neighbors.map((n) => ` neighbor ${n.ip} remote-as ${n.remoteAsn}`).join('\n')}
 address-family ipv4 unicast
  redistribute connected
  neighbor LEAF_PEERS activate
 exit-address-family
!`;
  }

  return `frr version 9.1
frr defaults traditional
hostname ${config.hostname}
log syslog informational
no ipv6 forwarding
service integrated-vtysh-config
!
${ifaceConfigs}
!
${ospfBlock}
${bgpBlock}
line vty
!
`;
}

export function generateFrrDaemonsFile(daemons: FrrRouterConfig['daemons']): string {
  return `zebra=${daemons.zebra ? 'yes' : 'no'}
bgpd=${daemons.bgpd ? 'yes' : 'no'}
ospfd=${daemons.ospfd ? 'yes' : 'no'}
ospf6d=no
ripd=no
ripngd=no
isisd=${daemons.isisd ? 'yes' : 'no'}
pimd=no
ldpd=no
nhrpd=no
eigrpd=no
babeld=no
sharpd=no
pbrd=no
bfdd=${daemons.bfdd ? 'yes' : 'no'}
fabricd=no
vrrpd=no
`;
}
