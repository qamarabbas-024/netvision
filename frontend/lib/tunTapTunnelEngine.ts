// Linux TUN/TAP Device Virtual Network Tunnel Bridge Engine

export interface TunTapDevice {
  name: string;
  mode: 'tun' | 'tap';
  ipAddress: string;
  netmask: string;
  mtu: number;
  status: 'UP' | 'DOWN';
  rxPackets: number;
  txPackets: number;
  wsConnected: boolean;
}

export function generateTunTapSetupScript(device: TunTapDevice, serverUrl = 'wss://tunnel.netvision.io/ws'): string {
  if (device.mode === 'tun') {
    return `#!/bin/bash
# NetVision TUN (Layer-3 IP Tunnel) Provisioning Script
set -e

DEV_NAME="${device.name}"
IP_ADDR="${device.ipAddress}"
NETMASK="${device.netmask}"
MTU="${device.mtu}"

echo "[*] Creating TUN interface $DEV_NAME..."
sudo ip tuntap add mode tun dev $DEV_NAME
sudo ip addr add $IP_ADDR/$NETMASK dev $DEV_NAME
sudo ip link set dev $DEV_NAME mtu $MTU
sudo ip link set dev $DEV_NAME up

echo "[*] Launching NetVision WebSocket bridge daemon..."
netvision-bridge-agent --dev $DEV_NAME --mode tun --remote "${serverUrl}"
`;
  }

  return `#!/bin/bash
# NetVision TAP (Layer-2 Ethernet Bridge) Provisioning Script
set -e

DEV_NAME="${device.name}"
MTU="${device.mtu}"

echo "[*] Creating TAP interface $DEV_NAME..."
sudo ip tuntap add mode tap dev $DEV_NAME
sudo ip link set dev $DEV_NAME mtu $MTU
sudo ip link set dev $DEV_NAME up

echo "[*] Adding $DEV_NAME to local Linux bridge br0..."
sudo ip link add name br0 type bridge || true
sudo ip link set dev $DEV_NAME master br0
sudo ip link set dev br0 up

echo "[*] Launching NetVision WebSocket Layer-2 bridge daemon..."
netvision-bridge-agent --dev $DEV_NAME --mode tap --remote "${serverUrl}"
`;
}
