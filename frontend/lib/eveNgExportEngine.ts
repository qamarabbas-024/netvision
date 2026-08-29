// EVE-NG (.unl XML) and GNS3 (.gns3 JSON) Topology Conversion Engine

export interface EmulatorNode {
  id: number;
  name: string;
  type: 'qemu' | 'iol' | 'dynamips' | 'docker';
  template: string;
  image: string;
  cpu: number;
  ram: number;
  left: number;
  top: number;
}

export interface EmulatorLink {
  sourceNodeId: number;
  sourcePort: number;
  targetNodeId: number;
  targetPort: number;
}

export function generateEveNgXml(
  labName: string,
  nodes: EmulatorNode[],
  links: EmulatorLink[]
): string {
  const nodeXml = nodes
    .map(
      (n) => `      <node id="${n.id}" name="${n.name}" type="${n.type}" template="${n.template}" image="${n.image}" cpu="${n.cpu}" ram="${n.ram}" left="${n.left}" top="${n.top}" />`
    )
    .join('\n');

  const networkXml = links
    .map(
      (l, idx) => `      <network id="${idx + 1}" type="bridge" name="Net-${l.sourceNodeId}-${l.targetNodeId}" left="${nodes.find(n => n.id === l.sourceNodeId)?.left || 100}" top="${nodes.find(n => n.id === l.sourceNodeId)?.top || 100}" />`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<lab name="${labName}" version="1" scripttimeout="300">
  <topology>
    <nodes>
${nodeXml}
    </nodes>
    <networks>
${networkXml}
    </networks>
  </topology>
</lab>
`;
}

export function generateGns3Json(
  labName: string,
  nodes: EmulatorNode[],
  links: EmulatorLink[]
): string {
  const gns3Nodes = nodes.map((n) => ({
    node_id: `node-${n.id}`,
    name: n.name,
    node_type: n.type === 'docker' ? 'docker' : 'qemu',
    x: n.left,
    y: n.top,
    properties: {
      image: n.image,
      ram: n.ram,
      cpus: n.cpu,
    },
  }));

  const gns3Links = links.map((l, idx) => ({
    link_id: `link-${idx + 1}`,
    nodes: [
      { node_id: `node-${l.sourceNodeId}`, adapter_number: l.sourcePort, port_number: 0 },
      { node_id: `node-${l.targetNodeId}`, adapter_number: l.targetPort, port_number: 0 },
    ],
  }));

  return JSON.stringify(
    {
      name: labName,
      type: 'topology',
      version: '2.2.44',
      project_id: 'netvision-export-01',
      topology: {
        nodes: gns3Nodes,
        links: gns3Links,
      },
    },
    null,
    2
  );
}
