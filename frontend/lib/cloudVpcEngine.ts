/**
 * NetVision Multi-Region Cloud VPC & Transit Gateway Engine (Version 5.1)
 * Simulates enterprise multi-region cloud networks (AWS Transit Gateway,
 * Hub-and-Spoke VPC peering, Cross-Region Inter-VPC routing, and NACLs).
 */

export interface CloudVpc {
  id: string;
  name: string;
  region: string;
  cidrBlock: string;
  role: 'PROD_APP' | 'STAGE_APP' | 'SHARED_SERVICES' | 'DATABASE';
  subnets: Array<{ name: string; cidr: string; az: string }>;
  tgwAttachmentId: string;
}

export interface TransitGateway {
  id: string;
  name: string;
  asn: number;
  region: string;
  routeTableEntries: Array<{ destinationCidr: string; targetAttachment: string; routeType: 'PROPAGATED' | 'STATIC' }>;
}

export interface InterVpcPacket {
  id: string;
  sourceVpc: string;
  destVpc: string;
  sourceIp: string;
  destIp: string;
  transitHops: string[];
  latencyMs: number;
  naclEvaluated: boolean;
  status: 'PERMITTED' | 'DROPPED_NACL' | 'BLACKHOLE_NO_ROUTE';
}

export class CloudVpcEngine {
  public static getCloudArchitecture() {
    const vpcs: CloudVpc[] = [
      {
        id: 'vpc-prod',
        name: 'VPC-Production (US-East)',
        region: 'us-east-1',
        cidrBlock: '10.100.0.0/16',
        role: 'PROD_APP',
        subnets: [
          { name: 'App-Private-Subnet-1A', cidr: '10.100.1.0/24', az: 'us-east-1a' },
          { name: 'App-Private-Subnet-1B', cidr: '10.100.2.0/24', az: 'us-east-1b' },
        ],
        tgwAttachmentId: 'tgw-attach-prod',
      },
      {
        id: 'vpc-services',
        name: 'VPC-Shared-Services',
        region: 'us-east-1',
        cidrBlock: '10.200.0.0/16',
        role: 'SHARED_SERVICES',
        subnets: [
          { name: 'Auth-KMS-Subnet-1A', cidr: '10.200.10.0/24', az: 'us-east-1a' },
        ],
        tgwAttachmentId: 'tgw-attach-services',
      },
      {
        id: 'vpc-db',
        name: 'VPC-Database-Cluster',
        region: 'us-east-1',
        cidrBlock: '10.50.0.0/16',
        role: 'DATABASE',
        subnets: [
          { name: 'RDS-Primary-Subnet', cidr: '10.50.1.0/24', az: 'us-east-1a' },
          { name: 'RDS-Replica-Subnet', cidr: '10.50.2.0/24', az: 'us-east-1b' },
        ],
        tgwAttachmentId: 'tgw-attach-db',
      },
    ];

    const tgw: TransitGateway = {
      id: 'tgw-hub-01',
      name: 'Global-Transit-Gateway-Hub',
      asn: 64512,
      region: 'us-east-1',
      routeTableEntries: [
        { destinationCidr: '10.100.0.0/16', targetAttachment: 'tgw-attach-prod', routeType: 'PROPAGATED' },
        { destinationCidr: '10.200.0.0/16', targetAttachment: 'tgw-attach-services', routeType: 'PROPAGATED' },
        { destinationCidr: '10.50.0.0/16', targetAttachment: 'tgw-attach-db', routeType: 'PROPAGATED' },
      ],
    };

    return { vpcs, tgw };
  }

  public static routeCrossVpcTraffic(srcVpcId: string, dstVpcId: string): InterVpcPacket {
    return {
      id: `pkt-cloud-${Date.now()}`,
      sourceVpc: 'VPC-Production (10.100.1.50)',
      destVpc: 'VPC-Database-Cluster (10.50.1.10)',
      sourceIp: '10.100.1.50',
      destIp: '10.50.1.10',
      transitHops: [
        'VPC-Production Route Table (0.0.0.0/0 -> tgw-hub-01)',
        'Global Transit Gateway Hub (Lookup 10.50.0.0/16)',
        'TGW Attachment -> VPC-Database-Cluster',
        'Inbound Subnet NACL Rule #100 (ALLOW TCP 5432)',
      ],
      latencyMs: 1.8,
      naclEvaluated: true,
      status: 'PERMITTED',
    };
  }
}
