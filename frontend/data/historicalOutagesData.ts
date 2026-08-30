export interface HistoricalOutageScenario {
  id: string;
  slug: string;
  year: string;
  title: string;
  company: string;
  impactDuration: string;
  severity: 'CRITICAL' | 'MAJOR' | 'HIGH';
  category: 'BGP_ROUTING' | 'DNS_RECURSION' | 'MTU_BLACKHOLE' | 'STP_LOOP';
  summary: string;
  rootCause: string;
  initialSymptoms: string[];
  topologyNodes: { name: string; ip: string; role: string }[];
  diagnosticCommandHint: string;
  solutionCommand: string;
  verificationCriteria: string;
}

export const HISTORICAL_OUTAGES: HistoricalOutageScenario[] = [
  {
    id: 'outage-meta-2021',
    slug: 'meta-2021-bgp-dns-disconnect',
    year: '2021',
    title: 'Global Autonomous BGP Withdrawal & DNS Blackhole',
    company: 'Meta / Facebook Global Backbone',
    impactDuration: '6 Hours (Global)',
    severity: 'CRITICAL',
    category: 'BGP_ROUTING',
    summary: 'A configuration change triggered an automated backbone maintenance script that accidentally withdrew all BGP routes to authoritative DNS nameservers, rendering global domains unreachable.',
    rootCause: 'BGP withdrawal of prefix 129.134.0.0/16 and 185.89.218.0/24 caused global tier-1 ISPs to drop routes to nameservers a.ns.facebook.com and b.ns.facebook.com.',
    initialSymptoms: [
      'DNS queries return SERVFAIL globally',
      'BGP Looking Glass shows zero advertised routes for AS32934',
      'Out-of-band data center console access severed',
    ],
    topologyNodes: [
      { name: 'Border-Router-AS32934', ip: '129.134.0.1', role: 'Edge BGP Speaker' },
      { name: 'Core-Backbone-Spine', ip: '10.0.254.1', role: 'IS-IS Interior Mesh' },
      { name: 'Auth-DNS-Server-A', ip: '129.134.30.12', role: 'Authoritative Nameserver' },
    ],
    diagnosticCommandHint: 'show ip bgp summary',
    solutionCommand: 'router bgp 32934 \n network 129.134.0.0/16 \n neighbor 198.32.176.1 activate',
    verificationCriteria: 'BGP session state transitions to ESTABLISHED; DNS resolves with 0% packet loss.',
  },
  {
    id: 'outage-cloudflare-2019',
    slug: 'cloudflare-2019-route-leak',
    year: '2019',
    title: 'Autonomous System Route Leak & Traffic Choke',
    company: 'Cloudflare / DQE / Verizon',
    impactDuration: '110 Minutes',
    severity: 'CRITICAL',
    category: 'BGP_ROUTING',
    summary: 'A small regional ISP accidentally leaked Cloudflare more-specific /24 routes to an upstream carrier without prefix limit filtering, redirecting massive global traffic through a low-bandwidth bottleneck.',
    rootCause: 'Lack of Maximum-Prefix limits and missing RPKI ROV route origin validation on transit peer.',
    initialSymptoms: [
      'Massive 98% packet drop across global CDN edge',
      'BGP AS-Path prepending ignored due to longest-prefix match (/24 over /20)',
      '15,000ms latency spike',
    ],
    topologyNodes: [
      { name: 'Cloudflare-Edge-AS13335', ip: '104.16.0.0/12', role: 'Anycast CDN Edge' },
      { name: 'Transit-Carrier-Router', ip: '198.32.160.1', role: 'Tier 1 Transit' },
      { name: 'Regional-ISP-Bottleneck', ip: '192.0.2.1', role: 'Leaked Route Source' },
    ],
    diagnosticCommandHint: 'show ip route 104.16.12.1',
    solutionCommand: 'neighbor 198.32.160.1 route-map FILTER-LEAKS in \n maximum-prefix 50000 80 restart 10',
    verificationCriteria: 'Traffic bypasses leaked transit path; latency normalizes below 1.2ms.',
  },
  {
    id: 'outage-aws-kinesis-2020',
    slug: 'aws-kinesis-dns-storm-2020',
    year: '2020',
    title: 'Front-End Fleet DNS Cascading Thread Exhaustion',
    company: 'Amazon Web Services (US-East-1)',
    impactDuration: '17 Hours',
    severity: 'MAJOR',
    category: 'DNS_RECURSION',
    summary: 'Adding small capacity to the front-end fleet exceeded maximum OS thread limits on micro-services, causing internal DNS resolution servers to collapse under cascading retry storms.',
    rootCause: 'Operating system thread exhaustion in internal DNS caching layer under high connection churn.',
    initialSymptoms: [
      'API calls to kinesis.us-east-1.amazonaws.com timing out',
      'Socket connection backlog exhaustion (SYN_RECV saturation)',
      'Internal micro-service health check failover loop',
    ],
    topologyNodes: [
      { name: 'Front-End-LoadBalancer', ip: '10.100.1.1', role: 'Reverse Proxy' },
      { name: 'Internal-DNS-Resolver', ip: '10.100.0.2', role: 'Recursive Cache' },
      { name: 'Kinesis-Shard-Controller', ip: '10.100.50.10', role: 'Data Stream Core' },
    ],
    diagnosticCommandHint: 'systemctl status unbind-dns && ulimit -u',
    solutionCommand: 'sysctl -w fs.file-max=2097152 \n systemctl restart core-dns-cache',
    verificationCriteria: 'DNS query resolution drops below 2ms; socket backlog returns to 0.',
  },
];
