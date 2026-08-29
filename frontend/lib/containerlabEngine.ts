// Containerlab (clab) Topology YAML Generation and Validation Engine

export interface ClabNode {
  name: string;
  kind: 'arista_ceos' | 'cisco_8000' | 'nokia_srlinux' | 'linux' | 'frr';
  image: string;
  mgmtIpv4: string;
  interfaces: string[];
}

export interface ClabLink {
  endpoints: [string, string];
}

export interface ContainerlabTopology {
  name: string;
  prefix?: string;
  mgmt: {
    network: string;
    ipv4Subnet: string;
  };
  topology: {
    nodes: Record<string, {
      kind: string;
      image: string;
      mgmt_ipv4?: string;
      env?: Record<string, string>;
    }>;
    links: Array<{
      endpoints: [string, string];
    }>;
  };
}

export function generateContainerlabYaml(
  labName: string,
  nodes: ClabNode[],
  links: ClabLink[]
): string {
  const nodeEntries = nodes
    .map((n) => {
      return `    ${n.name}:
      kind: ${n.kind}
      image: ${n.image}
      mgmt-ipv4: ${n.mgmtIpv4}`;
    })
    .join('\n');

  const linkEntries = links
    .map((l) => `    - endpoints: ["${l.endpoints[0]}", "${l.endpoints[1]}"]`)
    .join('\n');

  return `name: ${labName || 'netvision-clab'}

mgmt:
  network: netvision-mgmt
  ipv4-subnet: 172.20.20.0/24

topology:
  nodes:
${nodeEntries}

  links:
${linkEntries}
`;
}

export function getSampleClabTopology(): { nodes: ClabNode[]; links: ClabLink[] } {
  return {
    nodes: [
      {
        name: 'spine1',
        kind: 'arista_ceos',
        image: 'ceos:4.30.0F',
        mgmtIpv4: '172.20.20.11',
        interfaces: ['eth1', 'eth2'],
      },
      {
        name: 'spine2',
        kind: 'arista_ceos',
        image: 'ceos:4.30.0F',
        mgmtIpv4: '172.20.20.12',
        interfaces: ['eth1', 'eth2'],
      },
      {
        name: 'leaf1',
        kind: 'nokia_srlinux',
        image: 'ghcr.io/nokia/srlinux:23.10.1',
        mgmtIpv4: '172.20.20.21',
        interfaces: ['e1-1', 'e1-2', 'e1-3'],
      },
      {
        name: 'leaf2',
        kind: 'cisco_8000',
        image: 'cisco-8000v:7.9.1',
        mgmtIpv4: '172.20.20.22',
        interfaces: ['Gi0/0/0/0', 'Gi0/0/0/1', 'Gi0/0/0/2'],
      },
      {
        name: 'srv1',
        kind: 'linux',
        image: 'alpine:latest',
        mgmtIpv4: '172.20.20.31',
        interfaces: ['eth1'],
      },
    ],
    links: [
      { endpoints: ['spine1:eth1', 'leaf1:e1-1'] },
      { endpoints: ['spine1:eth2', 'leaf2:Gi0/0/0/0'] },
      { endpoints: ['spine2:eth1', 'leaf1:e1-2'] },
      { endpoints: ['spine2:eth2', 'leaf2:Gi0/0/0/1'] },
      { endpoints: ['leaf1:e1-3', 'srv1:eth1'] },
    ],
  };
}
