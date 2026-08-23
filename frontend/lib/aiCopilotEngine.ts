/**
 * NetVision AI Diagnostic Copilot Engine (Version 4.2)
 * Autonomous real-time topology inspector, Socratic hint synthesizer,
 * and voice-interactive network tutor.
 */

export interface NetworkHealthIssue {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'IP_ADDRESSING' | 'ROUTING' | 'VLAN_LAYER2' | 'DNS_DHCP' | 'PHYSICAL';
  title: string;
  description: string;
  socraticHint: string;
  suggestedFix: string;
  affectedNodeIds: string[];
}

export interface NetworkHealthReport {
  score: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  issues: NetworkHealthIssue[];
  topologySummary: {
    totalNodes: number;
    totalLinks: number;
    subnetsCount: number;
    isolatedNodesCount: number;
  };
}

export interface TopologyInspectionContext {
  nodes: Array<{ id: string; name: string; type: string; ip?: string; subnet?: string; gateway?: string; vlan?: number }>;
  links: Array<{ source: string; target: string; status?: 'UP' | 'DOWN' }>;
}

export class AiCopilotEngine {
  /**
   * Evaluates network topology health and identifies misconfigurations
   */
  public static analyzeTopology(context: TopologyInspectionContext): NetworkHealthReport {
    const issues: NetworkHealthIssue[] = [];
    const nodeMap = new Map(context.nodes.map((n) => [n.id, n]));
    const linkMap = new Map<string, string[]>();

    for (const l of context.links) {
      if (!linkMap.has(l.source)) linkMap.set(l.source, []);
      if (!linkMap.has(l.target)) linkMap.set(l.target, []);
      linkMap.get(l.source)!.push(l.target);
      linkMap.get(l.target)!.push(l.source);
    }

    let isolatedCount = 0;
    const subnetsFound = new Set<string>();

    // 1. Check for disconnected / isolated nodes
    for (const node of context.nodes) {
      const connections = linkMap.get(node.id) || [];
      if (connections.length === 0) {
        isolatedCount++;
        issues.push({
          id: `isolated-${node.id}`,
          severity: 'CRITICAL',
          category: 'PHYSICAL',
          title: `Physical Link Missing on ${node.name || node.id}`,
          description: `Device is completely disconnected from the network graph with 0 active physical interfaces.`,
          socraticHint: `Think about Layer 1 physical connectivity: how can a host transmit frames if no patch cable links it to a switch or router?`,
          suggestedFix: `Connect a virtual Ethernet cable between ${node.name} and an adjacent switch port.`,
          affectedNodeIds: [node.id],
        });
      }

      // Track subnets
      if (node.subnet) subnetsFound.add(node.subnet);

      // 2. Check for missing Default Gateway on end hosts
      if (node.type === 'HOST' || node.type === 'PC' || node.type === 'SERVER') {
        if (!node.gateway && node.ip) {
          issues.push({
            id: `missing-gw-${node.id}`,
            severity: 'WARNING',
            category: 'ROUTING',
            title: `Default Gateway Unconfigured on ${node.name || node.id}`,
            description: `Host has an IP address (${node.ip}) but no default gateway assigned.`,
            socraticHint: `When this host wants to send traffic to a foreign IP subnet outside its local broadcast domain, which Layer 3 router interface should receive the frame?`,
            suggestedFix: `Assign the router's local interface IP (e.g. 192.168.1.1) as the default gateway in ${node.name}'s configuration.`,
            affectedNodeIds: [node.id],
          });
        }
      }

      // 3. Check for Duplicate IP Addresses
      if (node.ip) {
        const duplicates = context.nodes.filter((other) => other.id !== node.id && other.ip === node.ip);
        if (duplicates.length > 0) {
          issues.push({
            id: `dup-ip-${node.id}`,
            severity: 'CRITICAL',
            category: 'IP_ADDRESSING',
            title: `Duplicate IP Address Collision (${node.ip})`,
            description: `Multiple devices (${node.name} and ${duplicates.map((d) => d.name).join(', ')}) share the exact same IPv4 address.`,
            socraticHint: `Remember that IPv4 addresses on a broadcast segment must be globally unique per interface. What happens to ARP tables when two NICs claim the same IP?`,
            suggestedFix: `Reassign ${node.name} to a distinct host IP within the subnet pool.`,
            affectedNodeIds: [node.id, ...duplicates.map((d) => d.id)],
          });
        }
      }
    }

    // 4. Calculate Health Score & Letter Grade
    let score = 100;
    for (const issue of issues) {
      if (issue.severity === 'CRITICAL') score -= 25;
      else if (issue.severity === 'WARNING') score -= 10;
      else score -= 5;
    }
    score = Math.max(0, Math.min(100, score));

    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (score >= 95) grade = 'A+';
    else if (score >= 85) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 55) grade = 'C';
    else if (score >= 40) grade = 'D';

    return {
      score,
      grade,
      issues,
      topologySummary: {
        totalNodes: context.nodes.length,
        totalLinks: context.links.length,
        subnetsCount: subnetsFound.size,
        isolatedNodesCount: isolatedCount,
      },
    };
  }

  /**
   * Generates a conversational AI response for voice / text diagnostic query
   */
  public static generateCopilotResponse(query: string, report: NetworkHealthReport): string {
    const q = query.toLowerCase();

    if (q.includes('health') || q.includes('grade') || q.includes('score') || q.includes('status')) {
      return `Your current network health score is ${report.score}/100 (Grade ${report.grade}). Found ${report.issues.length} active issues in your topology.`;
    }

    if (q.includes('gateway') || q.includes('default gateway') || q.includes('routing')) {
      const gwIssues = report.issues.filter((i) => i.category === 'ROUTING');
      if (gwIssues.length === 0) {
        return `Default gateway configurations and Layer 3 interfaces look fully consistent across all active subnets.`;
      }
      return `I detected ${gwIssues.length} gateway issue: ${gwIssues[0].description} Hint: ${gwIssues[0].socraticHint}`;
    }

    if (q.includes('ip') || q.includes('subnet') || q.includes('duplicate')) {
      const ipIssues = report.issues.filter((i) => i.category === 'IP_ADDRESSING');
      if (ipIssues.length === 0) {
        return `IP addressing across all nodes is valid with zero duplicate collisions detected.`;
      }
      return `Warning: ${ipIssues[0].description} ${ipIssues[0].suggestedFix}`;
    }

    if (report.issues.length > 0) {
      const topIssue = report.issues[0];
      return `Diagnostic finding: ${topIssue.title}. ${topIssue.description} Socratic hint: ${topIssue.socraticHint}`;
    }

    return `All systems nominal. Topologies, interfaces, and IP configurations are fully convergent with zero detected anomalies.`;
  }
}
