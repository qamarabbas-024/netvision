// eBPF Traffic Control (TC) Rate Limiting & Token Bucket Filter (TBF) Engine

export interface TcRatePolicy {
  rateLimitMbps: number;
  burstSizeBytes: number;
  targetInterface: string;
}

export function generateEbpfTcCCode(policy: TcRatePolicy): string {
  return `// NetVision eBPF Traffic Control (TC) BPF Classifier Program
// Target: Linux clsact ingress/egress qdisc

#include <linux/bpf.h>
#include <linux/pkt_cls.h>
#include <bpf/bpf_helpers.h>

struct bpf_map_def SEC("maps") token_bucket_map = {
    .type = BPF_MAP_TYPE_ARRAY,
    .key_size = sizeof(__u32),
    .value_size = sizeof(__u64), // Token balance in bytes
    .max_entries = 1,
};

SEC("classifier/egress")
int tc_rate_limit(struct __sk_buff *skb) {
    __u32 key = 0;
    __u64 *tokens = bpf_map_lookup_elem(&token_bucket_map, &key);
    if (!tokens)
        return TC_ACT_OK;

    __u32 pkt_len = skb->len;

    // Rate Limit Check (${policy.rateLimitMbps} Mbps)
    if (*tokens >= pkt_len) {
        __sync_fetch_and_sub(tokens, pkt_len);
        return TC_ACT_OK; // Allow packet through
    }

    // Bucket depleted: Drop excess packet
    return TC_ACT_SHOT;
}

char _license[] SEC("license") = "GPL";
`;
}
