import { Injectable, Logger } from '@nestjs/common';
import { SandboxStatus } from '@prisma/client';
import {
  ISandboxProvider,
  SandboxExecutionResult,
  SandboxResourceLimits,
} from './sandbox-provider.interface';

@Injectable()
export class SimulatedSandboxProvider implements ISandboxProvider {
  readonly providerName = 'SIMULATED';
  private readonly logger = new Logger(SimulatedSandboxProvider.name);

  async createEnvironment(
    userId: string,
    labId?: string,
    limits?: Partial<SandboxResourceLimits>
  ): Promise<{
    providerSessionId: string;
    status: SandboxStatus;
    expiresAt: Date;
    resourceLimits: SandboxResourceLimits;
    networkState: Record<string, any>;
  }> {
    const defaultLimits: SandboxResourceLimits = {
      ramMb: limits?.ramMb || 512,
      cpuCores: limits?.cpuCores || 0.5,
      timeoutSec: limits?.timeoutSec || 10,
      maxProcesses: limits?.maxProcesses || 50,
    };

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes lifetime

    const networkState = {
      hostname: 'lab-sandbox-node',
      interfaces: [
        { name: 'lo', ip: '127.0.0.1', netmask: '255.0.0.0', status: 'UP' },
        { name: 'eth0', ip: '192.168.1.50', netmask: '255.255.255.0', mac: '00:1A:2B:3C:4D:5E', status: 'UP' },
      ],
      gateway: '192.168.1.1',
      dnsServers: ['1.1.1.1', '8.8.8.8'],
      arpCache: [
        { ip: '192.168.1.1', mac: '00:11:22:33:44:55', interface: 'eth0' },
        { ip: '192.168.1.100', mac: 'AA:BB:CC:DD:EE:FF', interface: 'eth0' },
      ],
    };

    this.logger.log(`Created Simulated Network Sandbox Session for user ${userId} (Lab: ${labId || 'General Sandbox'})`);

    return {
      providerSessionId: `sim-sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: SandboxStatus.RUNNING,
      expiresAt,
      resourceLimits: defaultLimits,
      networkState,
    };
  }

  async executeCommand(
    sessionId: string,
    command: string,
    limits?: SandboxResourceLimits
  ): Promise<SandboxExecutionResult> {
    const startTime = Date.now();
    const cleanCmd = (command || '').trim();

    // Security Verification: Explicitly block malicious attempt keywords
    const forbiddenPatterns = [/sudo/i, /rm\s+-rf/i, /mkfs/i, /dd\s+if=/i, /chmod/i, /chown/i, /:>|>/i];
    for (const pat of forbiddenPatterns) {
      if (pat.test(cleanCmd)) {
        return {
          command: cleanCmd,
          output: `SECURITY VIOLATION: Execution of potentially destructive system command '${cleanCmd}' is strictly forbidden on NetVision sandbox.`,
          exitCode: 126,
          durationMs: Date.now() - startTime,
          isSimulated: true,
          timestamp: new Date().toISOString(),
        };
      }
    }

    let output = '';
    let exitCode = 0;

    const lowerCmd = cleanCmd.toLowerCase();

    if (lowerCmd === 'ipconfig' || lowerCmd === 'ipconfig /all') {
      output = `Windows IP Configuration\n\nEthernet adapter Local Area Connection:\n   Connection-specific DNS Suffix  . : netvision.lan\n   Link-local IPv6 Address . . . . . : fe80::a1b2:c3d4:e5f6%12\n   IPv4 Address. . . . . . . . . . . : 192.168.1.50\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1\n   DHCP Server . . . . . . . . . . . : 192.168.1.1\n   DNS Servers . . . . . . . . . . . : 1.1.1.1\n                                       8.8.8.8`;
    } else if (lowerCmd.startsWith('ping')) {
      const target = cleanCmd.split(' ')[1] || '192.168.1.1';
      output = `Pinging ${target} with 32 bytes of data:\nReply from ${target}: bytes=32 time=1ms TTL=64\nReply from ${target}: bytes=32 time=1ms TTL=64\nReply from ${target}: bytes=32 time=1ms TTL=64\nReply from ${target}: bytes=32 time=1ms TTL=64\n\nPing statistics for ${target}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\n    Minimum = 1ms, Maximum = 1ms, Average = 1ms`;
    } else if (lowerCmd === 'arp -a' || lowerCmd === 'ip neigh') {
      output = `Interface: 192.168.1.50 --- 0x2\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-11-22-33-44-55     dynamic\n  192.168.1.100         aa-bb-cc-dd-ee-ff     dynamic`;
    } else if (lowerCmd.startsWith('nslookup') || lowerCmd.startsWith('dig')) {
      const host = cleanCmd.split(' ')[1] || 'netvision.edu';
      output = `Server:  1.1.1.1\nAddress:  1.1.1.1#53\n\nNon-authoritative answer:\nName:    ${host}\nAddress: 104.21.48.12`;
    } else if (lowerCmd.startsWith('tracert') || lowerCmd.startsWith('traceroute')) {
      output = `Tracing route to 8.8.8.8 over a maximum of 30 hops:\n  1    1 ms    1 ms    1 ms  192.168.1.1\n  2    8 ms    7 ms    9 ms  10.0.0.1\n  3   18 ms   17 ms   19 ms  8.8.8.8\nTrace complete.`;
    } else if (lowerCmd === 'route print' || lowerCmd === 'ip route') {
      output = `IPv4 Route Table\nActive Routes:\nNetwork Destination        Netmask          Gateway       Interface  Metric\n          0.0.0.0          0.0.0.0      192.168.1.1    192.168.1.50      25\n      192.168.1.0    255.255.255.0        On-link      192.168.1.50     281`;
    } else if (lowerCmd === 'netstat' || lowerCmd === 'netstat -ano' || lowerCmd === 'ss') {
      output = `Active Connections\n  Proto  Local Address          Foreign Address        State           PID\n  TCP    192.168.1.50:52114     104.21.48.12:443       ESTABLISHED     3120\n  UDP    192.168.1.50:68        0.0.0.0:*                              842`;
    } else if (lowerCmd === 'ifconfig' || lowerCmd === 'ip addr') {
      output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.50  netmask 255.255.255.0  broadcast 192.168.1.255\n        ether 00:1a:2b:3c:4d:5e  txqueuelen 1000  (Ethernet)`;
    } else {
      output = `Simulated Environment: Executed command '${cleanCmd}'. Status: OK.\nResult: 0 packets dropped. Target state verified.`;
    }

    return {
      command: cleanCmd,
      output,
      exitCode,
      durationMs: Date.now() - startTime,
      isSimulated: true,
      timestamp: new Date().toISOString(),
    };
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    this.logger.log(`Terminated Simulated Sandbox Session ${sessionId}`);
    return true;
  }

  async getStatus(sessionId: string): Promise<SandboxStatus> {
    return SandboxStatus.RUNNING;
  }
}
