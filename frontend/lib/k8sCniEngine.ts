/**
 * NetVision Kubernetes CNI & eBPF Cilium Mesh Engine (Version 9.4)
 * Simulates Pod-to-Pod container networking, eBPF host routing,
 * kube-proxy bypass, CiliumNetworkPolicy L3/L4/L7 enforcement, and Calico BGP peering.
 */

export interface K8sPod {
  id: string;
  name: string;
  namespace: string;
  ip: string;
  node: string;
  labels: Record<string, string>;
  status: 'Running' | 'Pending';
}

export interface K8sNetworkPolicy {
  name: string;
  namespace: string;
  appliedTo: string;
  ingressRule: string;
  action: 'ALLOW' | 'DENY';
}

export interface CniMeshState {
  cniPlugin: 'CILIUM_EBPF' | 'CALICO_BGP' | 'FLANNEL_VXLAN';
  kubeProxyMode: 'eBPF Direct Redirection' | 'IPVS / BGP Node Mesh' | 'iptables NAT Overlay';
  datapathLatencyMs: number;
  podCount: number;
  activePolicies: number;
  pods: K8sPod[];
  policies: K8sNetworkPolicy[];
  packetDropCount: number;
  forwardingEvents: string[];
}

export class K8sCniEngine {
  public static getInitialState(): CniMeshState {
    return {
      cniPlugin: 'CILIUM_EBPF',
      kubeProxyMode: 'eBPF Direct Redirection',
      datapathLatencyMs: 0.04,
      podCount: 4,
      activePolicies: 3,
      pods: [
        {
          id: 'pod-1',
          name: 'frontend-web-7d4f9b',
          namespace: 'production',
          ip: '10.244.1.15',
          node: 'worker-node-01',
          labels: { app: 'frontend', tier: 'public' },
          status: 'Running',
        },
        {
          id: 'pod-2',
          name: 'payment-gateway-5c8a1e',
          namespace: 'production',
          ip: '10.244.2.40',
          node: 'worker-node-02',
          labels: { app: 'payment', tier: 'secure' },
          status: 'Running',
        },
        {
          id: 'pod-3',
          name: 'postgres-db-0',
          namespace: 'production',
          ip: '10.244.3.90',
          node: 'worker-node-03',
          labels: { app: 'database', tier: 'data' },
          status: 'Running',
        },
        {
          id: 'pod-4',
          name: 'untrusted-scraper-99x',
          namespace: 'sandbox',
          ip: '10.244.1.88',
          node: 'worker-node-01',
          labels: { app: 'scraper', tier: 'untrusted' },
          status: 'Running',
        },
      ],
      policies: [
        {
          name: 'allow-frontend-to-payment',
          namespace: 'production',
          appliedTo: 'app: payment',
          ingressRule: 'From: app=frontend, Port: 8080/TCP',
          action: 'ALLOW',
        },
        {
          name: 'isolate-database-tier',
          namespace: 'production',
          appliedTo: 'app: database',
          ingressRule: 'From: app=payment ONLY, Port: 5432/TCP',
          action: 'ALLOW',
        },
        {
          name: 'default-deny-untrusted',
          namespace: 'sandbox',
          appliedTo: 'all-pods',
          ingressRule: 'Deny all cross-namespace egress to production',
          action: 'DENY',
        },
      ],
      packetDropCount: 0,
      forwardingEvents: [
        '⚡ Cilium BPF TC filter attached to eth0 (veth pair bypass active)',
        '🔒 L3/L4 Endpoint identity maps synchronized across 3 worker nodes',
        '🚀 eBPF sock_ops bypassing TCP stack for local Pod-to-Pod RPCs',
      ],
    };
  }

  public static simulateTraffic(
    state: CniMeshState,
    fromPodId: string,
    toPodId: string
  ): { newState: CniMeshState; log: string; success: boolean } {
    const fromPod = state.pods.find((p) => p.id === fromPodId);
    const toPod = state.pods.find((p) => p.id === toPodId);

    if (!fromPod || !toPod) {
      return { newState: state, log: 'Error: Pod not found', success: false };
    }

    // Untrusted scraper trying to reach database directly
    if (fromPod.labels.tier === 'untrusted' && toPod.labels.tier === 'data') {
      const updated = {
        ...state,
        packetDropCount: state.packetDropCount + 1,
        forwardingEvents: [
          `🚫 [DROP] eBPF policy filter dropped unauthorized packet from ${fromPod.name} (${fromPod.ip}) -> ${toPod.name} (${toPod.ip})`,
          ...state.forwardingEvents.slice(0, 5),
        ],
      };
      return {
        newState: updated,
        log: `eBPF Cilium dropped packet at ingress TC hook. Violation of policy 'default-deny-untrusted'. Zero packet leakage to PostgreSQL DB.`,
        success: false,
      };
    }

    // Frontend reaching payment
    if (fromPod.labels.tier === 'public' && toPod.labels.tier === 'secure') {
      const updated = {
        ...state,
        forwardingEvents: [
          `✅ [PASS] Direct eBPF sock_ops bypass: ${fromPod.name} -> ${toPod.name}:8080 (0.038ms latency)`,
          ...state.forwardingEvents.slice(0, 5),
        ],
      };
      return {
        newState: updated,
        log: `Packet successfully routed via Cilium eBPF host-routing bypass. Policy 'allow-frontend-to-payment' validated in 32 nanoseconds.`,
        success: true,
      };
    }

    // Payment reaching database
    if (fromPod.labels.tier === 'secure' && toPod.labels.tier === 'data') {
      const updated = {
        ...state,
        forwardingEvents: [
          `✅ [PASS] Policy 'isolate-database-tier' matched: ${fromPod.name} -> ${toPod.name}:5432`,
          ...state.forwardingEvents.slice(0, 5),
        ],
      };
      return {
        newState: updated,
        log: `Mutual Pod identity verified via Cilium security ID. Secure SQL transaction transmitted.`,
        success: true,
      };
    }

    const updated = {
      ...state,
      forwardingEvents: [
        `ℹ️ [FORWARD] Routed packet ${fromPod.ip} -> ${toPod.ip} via ${state.cniPlugin}`,
        ...state.forwardingEvents.slice(0, 5),
      ],
    };
    return {
      newState: updated,
      log: `Standard pod transit completed across overlay/direct network.`,
      success: true,
    };
  }
}
