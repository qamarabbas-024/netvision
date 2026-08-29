// Autonomous Voice-Guided NetOps SRE Diagnostic Engine

export interface VoiceDialogueTurn {
  id: number;
  speaker: 'user' | 'sre_ai';
  text: string;
  timestamp: string;
  intent?: 'DIAGNOSE_OUTAGE' | 'BGP_LEAK' | 'ROCE_DEADLOCK' | 'FIX_LINK';
  actionTaken?: string;
}

export function synthesizeSreSpeech(text: string, onEnd?: () => void) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }
}

export function generateSreAiResponse(userPrompt: string): { responseText: string; actionTaken: string } {
  const q = userPrompt.toLowerCase();

  if (q.includes('bgp') || q.includes('route leak') || q.includes('as65001')) {
    return {
      responseText: 'Detected anomalous BGP route leak on AS65001. Egress route filters missing. I have generated an automated RPKI ROA validation route-map.',
      actionTaken: 'Applied BGP Route-Map: RM_RPKI_STRICT_IN to Peer-Group LEAF_PEERS',
    };
  }

  if (q.includes('loss') || q.includes('latency') || q.includes('drop')) {
    return {
      responseText: 'Interface eth1 on Core-R1 reports 14.8% packet drop due to MTU mismatch. Adjusting MTU from 1500 to 9000 bytes for Jumbo Frame compatibility.',
      actionTaken: 'Set MTU: 9000 on Core-R1:eth1 (Loss restored to 0.00%)',
    };
  }

  return {
    responseText: 'NetOps telemetry nominal across all spine-leaf switches. Running deep eBPF packet trace on current ingress stream.',
    actionTaken: 'Spawned eBPF XDP probe hook on all active data plane interfaces.',
  };
}
