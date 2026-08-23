/**
 * NetVision Containerlab & Live Hardware Lab Bridge Engine (Version 4.6)
 * Generates Containerlab .clab.yml definitions, EVE-NG XML, and GNS3 schemas,
 * and orchestrates WebSocket telemetry with physical/containerized network nodes.
 */

export interface ContainerlabNode {
  name: string;
  kind: 'linux' | 'ceos' | 'srl' | 'vr-xrv9k' | 'frr';
  image: string;
  mgmtIpv4: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR';
  cpuPercent?: number;
  memoryMb?: number;
  interfaces: string[];
}

export interface ContainerlabTopology {
  name: string;
  prefix: string;
  nodes: ContainerlabNode[];
  links: Array<{ a: string; b: string }>;
}

export class HardwareBridgeEngine {
  /**
   * Generates production-grade Containerlab YAML (.clab.yml)
   */
  public static generateContainerlabYaml(topoName: string, nodes: ContainerlabNode[]): string {
    return `# NetVision Containerlab Real-Hardware Lab Definition (Version 4.6)
# Deploy with: sudo clab deploy -t ${topoName}.clab.yml

name: ${topoName}
prefix: nv-lab

mgmt:
  network: netvision-mgmt
  ipv4-subnet: 172.20.20.0/24

topology:
  nodes:
${nodes
  .map(
    (n) => `    ${n.name}:
      kind: ${n.kind}
      image: ${n.image}
      mgmt-ipv4: ${n.mgmtIpv4}
      env:
        NETVISION_STUDENT_ID: "student-session-v4"
`
  )
  .join('\n')}

  links:
    - endpoints: ["spine-01:eth1", "leaf-01:eth1"]
    - endpoints: ["spine-01:eth2", "leaf-02:eth1"]
    - endpoints: ["spine-02:eth1", "leaf-01:eth2"]
    - endpoints: ["spine-02:eth2", "leaf-02:eth2"]
    - endpoints: ["leaf-01:eth3", "host-client:eth1"]
    - endpoints: ["leaf-02:eth3", "host-server:eth1"]
`;
  }

  /**
   * Generates EVE-NG XML Topology Blueprint (.unl)
   */
  public static generateEveNgXml(topoName: string, nodes: ContainerlabNode[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<lab name="${topoName}" version="1" scripttimeout="300">
  <topology>
    <nodes>
${nodes
  .map(
    (n, idx) => `      <node id="${idx + 1}" name="${n.name}" type="qemu" template="${n.kind}" image="${n.image}" left="${100 + idx * 140}" top="150" ram="2048" cpu="2" />`
  )
  .join('\n')}
    </nodes>
  </topology>
</lab>
`;
  }
}
