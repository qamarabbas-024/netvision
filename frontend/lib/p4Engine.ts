/**
 * NetVision P4-16 Programmable Data Plane Engine (Version 7.5)
 * Simulates P4-16 custom parser, Match-Action tables, In-band Network
 * Telemetry (INT) header push/pop, and Behavioral Model (BMv2) execution.
 */

export interface P4HeaderField {
  name: string;
  bitWidth: number;
  valueHex: string;
}

export interface P4TableEntry {
  tableName: string;
  matchKey: string;
  actionName: string;
  actionParams: string;
}

export class P4Engine {
  public static getP4SampleCode(): string {
    return `control IngressPipeline(inout headers hdr, inout metadata meta) {
    action add_int_hop(bit<32> switch_id, bit<16> q_depth) {
        hdr.int_header.setValid();
        hdr.int_header.switch_id = switch_id;
        hdr.int_header.queue_depth = q_depth;
    }
    table forward_table {
        key = { hdr.ipv4.dst_addr: lpm; }
        actions = { add_int_hop; drop; }
        default_action = drop();
    }
    apply {
        forward_table.apply();
    }
}`;
  }

  public static getInitialTableEntries(): P4TableEntry[] {
    return [
      { tableName: 'forward_table', matchKey: '10.0.1.0/24', actionName: 'add_int_hop', actionParams: 'switch_id=0x01, q_depth=4' },
      { tableName: 'forward_table', matchKey: '10.0.2.0/24', actionName: 'add_int_hop', actionParams: 'switch_id=0x02, q_depth=12' },
    ];
  }
}
