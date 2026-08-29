// OpenConfig YANG and gNMI Telemetry Parser Engine

export interface YangPathNode {
  name: string;
  fullPath: string;
  type: 'container' | 'list' | 'leaf';
  dataType?: string;
  description: string;
  value?: string | number | boolean;
  children?: YangPathNode[];
}

export interface GnmiTelemetrySample {
  timestamp: number;
  path: string;
  value: number | string;
  unit?: string;
}

export const OPENCONFIG_INTERFACES_TREE: YangPathNode = {
  name: 'openconfig-interfaces:interfaces',
  fullPath: '/interfaces',
  type: 'container',
  description: 'Top-level container for all network device interfaces',
  children: [
    {
      name: 'interface[name=eth0]',
      fullPath: '/interfaces/interface[name=eth0]',
      type: 'list',
      description: 'Interface instance eth0',
      children: [
        {
          name: 'config',
          fullPath: '/interfaces/interface[name=eth0]/config',
          type: 'container',
          description: 'Configuration parameters',
          children: [
            { name: 'name', fullPath: '/interfaces/interface[name=eth0]/config/name', type: 'leaf', dataType: 'string', value: 'eth0', description: 'Interface identifier' },
            { name: 'enabled', fullPath: '/interfaces/interface[name=eth0]/config/enabled', type: 'leaf', dataType: 'boolean', value: true, description: 'Administrative state' },
          ],
        },
        {
          name: 'state',
          fullPath: '/interfaces/interface[name=eth0]/state',
          type: 'container',
          description: 'Operational state and telemetry',
          children: [
            { name: 'oper-status', fullPath: '/interfaces/interface[name=eth0]/state/oper-status', type: 'leaf', dataType: 'enum', value: 'UP', description: 'Operational status' },
            {
              name: 'counters',
              fullPath: '/interfaces/interface[name=eth0]/state/counters',
              type: 'container',
              description: 'Interface traffic counters',
              children: [
                { name: 'in-octets', fullPath: '/interfaces/interface[name=eth0]/state/counters/in-octets', type: 'leaf', dataType: 'uint64', value: 489201948, description: 'Total inbound bytes' },
                { name: 'out-octets', fullPath: '/interfaces/interface[name=eth0]/state/counters/out-octets', type: 'leaf', dataType: 'uint64', value: 129482019, description: 'Total outbound bytes' },
                { name: 'in-errors', fullPath: '/interfaces/interface[name=eth0]/state/counters/in-errors', type: 'leaf', dataType: 'uint32', value: 0, description: 'Inbound CRC errors' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function generateGnmiSubscribeRequest(path: string, mode: 'STREAM' | 'ONCE' | 'POLL' = 'STREAM'): string {
  return JSON.stringify(
    {
      subscribe: {
        subscription: [
          {
            path: {
              elem: path.split('/').filter(Boolean).map((p) => ({ name: p })),
            },
            mode,
            sample_interval: 1000000000, // 1 second in nanoseconds
            suppress_redundant: true,
          },
        ],
        use_aliases: false,
        encoding: 'JSON_IETF',
      },
    },
    null,
    2
  );
}
