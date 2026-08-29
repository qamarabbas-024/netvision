'use client';

import React from 'react';
import { OSILayerVisual } from './OSILayerVisual';
import { TCPHandshakeVisual } from './TCPHandshakeVisual';
import { DNSLookupVisual } from './DNSLookupVisual';
import { ARPVisual } from './ARPVisual';
import { DHCPVisual } from './DHCPVisual';
import { SubnetVisual } from './SubnetVisual';
import { PacketJourneyVisual } from './PacketJourneyVisual';
import { RouterForwardingVisual } from './RouterForwardingVisual';
import { IPAddressingVisual } from './IPAddressingVisual';
import { ClientServerVisual } from './ClientServerVisual';
import { STPVisual } from './STPVisual';
import { OSPFVisual } from './OSPFVisual';
import { MultiAreaOSPFVisual } from './MultiAreaOSPFVisual';
import { IPv6Visual } from './IPv6Visual';
import { NetworkAutomationVisual } from './NetworkAutomationVisual';
import { BinaryConverterVisual } from './BinaryConverterVisual';
import { MediaInspectorVisual } from './MediaInspectorVisual';
import { PerformanceMetricsVisual } from './PerformanceMetricsVisual';
import { WirelessSpectrumVisual } from './WirelessSpectrumVisual';
import { MacBitParserVisual } from './MacBitParserVisual';
import { EthernetFrameVisual } from './EthernetFrameVisual';
import { SocketMultiplexerVisual } from './SocketMultiplexerVisual';
import { WiresharkPcapStudio } from './WiresharkPcapStudio';
import { ScapyPacketCrafter } from './ScapyPacketCrafter';
import { NetworkBufferPhysicsVisualizer } from '../simulation/NetworkBufferPhysicsVisualizer';
import { BgpEvpnFabricVisualizer } from '../simulation/BgpEvpnFabricVisualizer';
import { IacAutomationStudio } from '../simulation/IacAutomationStudio';
import { HardwareBridgeStudio } from '../simulation/HardwareBridgeStudio';
import { CyberDefenseStudio } from '../simulation/CyberDefenseStudio';
import { ChaosEngineeringStudio } from '../simulation/ChaosEngineeringStudio';
import { ProctoredExamStudio } from '../certification/ProctoredExamStudio';
import { GlobalInternetDigitalTwinStudio } from '../simulation/GlobalInternetDigitalTwinStudio';
import { CloudTransitVpcStudio } from '../simulation/CloudTransitVpcStudio';
import { SdwanTrafficStudio } from '../simulation/SdwanTrafficStudio';
import { Wifi7RfPhysicsStudio } from '../simulation/Wifi7RfPhysicsStudio';
import { PenetrationTestingStudio } from '../simulation/PenetrationTestingStudio';
import { ZeroTrustPolicyStudio } from '../simulation/ZeroTrustPolicyStudio';
import { EbpfStudio } from '../simulation/EbpfStudio';
import { QuantumCryptoStudio } from '../simulation/QuantumCryptoStudio';
import { SatelliteMeshStudio } from '../simulation/SatelliteMeshStudio';
import { AutonomousAiOpsStudio } from '../simulation/AutonomousAiOpsStudio';
import { GlobalNocCommandStudio } from '../simulation/GlobalNocCommandStudio';
import { MultimodalImportStudio } from '../tools/MultimodalImportStudio';
import { MultiplayerCanvasStudio } from '../simulation/MultiplayerCanvasStudio';
import { Srv6PolicyStudio } from '../simulation/Srv6PolicyStudio';
import { TsnDeterministicStudio } from '../simulation/TsnDeterministicStudio';
import { ThreatIntelligenceStudio } from '../simulation/ThreatIntelligenceStudio';
import { EncryptedDnsStudio } from '../simulation/EncryptedDnsStudio';
import { DwdmPhotonicStudio } from '../simulation/DwdmPhotonicStudio';
import { NetworkGraphRagStudio } from '../simulation/NetworkGraphRagStudio';
import { SonicNosStudio } from '../simulation/SonicNosStudio';
import { MptcpQuicStudio } from '../simulation/MptcpQuicStudio';
import { AutonomousOrchestratorStudio } from '../simulation/AutonomousOrchestratorStudio';
import { RoceLosslessStudio } from '../simulation/RoceLosslessStudio';
import { UltraEthernetStudio } from '../simulation/UltraEthernetStudio';
import { QuantumRoutingStudio } from '../simulation/QuantumRoutingStudio';
import { OranStudio } from '../simulation/OranStudio';
import { P4DataPlaneStudio } from '../simulation/P4DataPlaneStudio';
import { MultiCloudWanStudio } from '../simulation/MultiCloudWanStudio';
import { ConfidentialNetStudio } from '../simulation/ConfidentialNetStudio';
import { AnycastDdosStudio } from '../simulation/AnycastDdosStudio';
import { DepinMeshStudio } from '../simulation/DepinMeshStudio';
import { PlanetaryTwinStudio } from '../simulation/PlanetaryTwinStudio';
import { SaginMultiTierStudio } from '../simulation/SaginMultiTierStudio';
import { NeuromorphicPacketStudio } from '../simulation/NeuromorphicPacketStudio';
import { SubseaAcousticStudio } from '../simulation/SubseaAcousticStudio';
import { WasmSmartNicStudio } from '../simulation/WasmSmartNicStudio';
import { HollowCoreFiberStudio } from '../simulation/HollowCoreFiberStudio';
import { OpticalMemsStudio } from '../simulation/OpticalMemsStudio';
import { BgpAutoRemediationStudio } from '../simulation/BgpAutoRemediationStudio';
import { IndustrialSlicingStudio } from '../simulation/IndustrialSlicingStudio';
import { ZkpNetworkStudio } from '../simulation/ZkpNetworkStudio';
import { InterplanetaryBundleStudio } from '../simulation/InterplanetaryBundleStudio';
import { PostQuantumTlsStudio } from '../simulation/PostQuantumTlsStudio';
import { SelfEvolvingTopologyStudio } from '../simulation/SelfEvolvingTopologyStudio';
import { TerahertzWirelessStudio } from '../simulation/TerahertzWirelessStudio';
import { K8sCniMeshStudio } from '../simulation/K8sCniMeshStudio';
import { IdsSignatureStudio } from '../simulation/IdsSignatureStudio';
import { QuantumCoProcStudio } from '../simulation/QuantumCoProcStudio';
import { HolographicMatrixStudio } from '../simulation/HolographicMatrixStudio';
import { SubnetAutoGenesisStudio } from '../simulation/SubnetAutoGenesisStudio';
import { OrbitalDatacenterStudio } from '../simulation/OrbitalDatacenterStudio';
import { DnaStorageStudio } from '../simulation/DnaStorageStudio';
import { MultiverseHypervisorStudio } from '../simulation/MultiverseHypervisorStudio';
import { UniversalSingularityStudio } from '../simulation/UniversalSingularityStudio';
import { ContainerlabStudio } from '../simulation/ContainerlabStudio';
import { FrrRoutingStudio } from '../simulation/FrrRoutingStudio';
import { EveNgExportStudio } from '../simulation/EveNgExportStudio';
import { OpenConfigYangStudio } from '../simulation/OpenConfigYangStudio';
import { TunTapTunnelStudio } from '../simulation/TunTapTunnelStudio';
import { PcapReplayStudio } from '../simulation/PcapReplayStudio';
import { VoiceSreStudio } from '../simulation/VoiceSreStudio';
import { IntentBasedNetStudio } from '../simulation/IntentBasedNetStudio';
import { RcaMultiAgentStudio } from '../simulation/RcaMultiAgentStudio';
import { RoutingHotPatcherStudio } from '../simulation/RoutingHotPatcherStudio';

export interface VisualRegistryProps {
  topicSlug: string;
}

export const VisualRegistry: React.FC<VisualRegistryProps> = ({ topicSlug }) => {
  const slug = topicSlug.toLowerCase();

  if (slug.includes('hot-patch') || slug.includes('hotpatch') || slug.includes('graceful-restart')) {
    return <RoutingHotPatcherStudio />;
  }

  if (slug.includes('rca') || slug.includes('root-cause') || slug.includes('multi-agent')) {
    return <RcaMultiAgentStudio />;
  }

  if (slug.includes('intent') || slug.includes('ibn') || slug.includes('intent-net')) {
    return <IntentBasedNetStudio />;
  }

  if (slug.includes('voice') || slug.includes('voice-sre') || slug.includes('speech-ai')) {
    return <VoiceSreStudio />;
  }

  if (slug.includes('pcap') || slug.includes('packet-capture') || slug.includes('wireshark')) {
    return <PcapReplayStudio />;
  }

  if (slug.includes('tuntap') || slug.includes('tun-tap') || slug.includes('hardware-bridge')) {
    return <TunTapTunnelStudio />;
  }

  if (slug.includes('openconfig') || slug.includes('yang') || slug.includes('gnmi')) {
    return <OpenConfigYangStudio />;
  }

  if (slug.includes('eve-ng') || slug.includes('gns3') || slug.includes('unl')) {
    return <EveNgExportStudio />;
  }

  if (slug.includes('frr') || slug.includes('frrouting') || slug.includes('vtysh')) {
    return <FrrRoutingStudio />;
  }

  if (slug.includes('containerlab') || slug.includes('clab') || slug.includes('nos-emulation')) {
    return <ContainerlabStudio />;
  }

  if (
    slug.includes('binary') ||
    slug.includes('hex') ||
    slug.includes('bits-bytes') ||
    slug.includes('net-101-bits')
  ) {
    return <BinaryConverterVisual />;
  }

  if (
    slug.includes('physical-media') ||
    slug.includes('transceiver') ||
    slug.includes('media-inspector') ||
    slug.includes('network-devices-overview') ||
    slug.includes('network-devices') ||
    slug.includes('copper') ||
    slug.includes('fiber')
  ) {
    return <MediaInspectorVisual />;
  }

  if (
    slug.includes('mac-address') ||
    slug.includes('physical-identity') ||
    slug.includes('mac_bit_parser') ||
    slug.includes('level-0-mac-addresses')
  ) {
    return <MacBitParserVisual />;
  }

  if (
    slug.includes('ethernet-mac-addresses') ||
    slug.includes('ethernet-framing') ||
    slug.includes('ethernet_frame') ||
    slug.includes('802.3')
  ) {
    return <EthernetFrameVisual />;
  }

  if (
    slug.includes('wireshark') ||
    slug.includes('pcap') ||
    slug.includes('packet-capture') ||
    slug.includes('packet_capture') ||
    slug.includes('forensics')
  ) {
    return <WiresharkPcapStudio />;
  }

  if (slug.includes('physics') || slug.includes('buffer') || slug.includes('queue') || slug.includes('tail-drop') || slug.includes('red') || slug.includes('congestion') || slug.includes('qos')) {
    return <NetworkBufferPhysicsVisualizer />;
  }

  if (slug.includes('bgp') || slug.includes('evpn') || slug.includes('vxlan') || slug.includes('spine-leaf') || slug.includes('datacenter') || slug.includes('cloud-fabric')) {
    return <BgpEvpnFabricVisualizer />;
  }

  if (slug.includes('iac') || slug.includes('terraform') || slug.includes('ansible') || slug.includes('netdevops') || slug.includes('netmiko') || slug.includes('playbook') || slug.includes('infrastructure-as-code')) {
    return <IacAutomationStudio />;
  }

  if (slug.includes('containerlab') || slug.includes('eve-ng') || slug.includes('gns3') || slug.includes('clab') || slug.includes('hardware-bridge') || slug.includes('physical-lab')) {
    return <HardwareBridgeStudio />;
  }

  if (slug.includes('cyber') || slug.includes('security') || slug.includes('ddos') || slug.includes('mitm') || slug.includes('arp-spoofing') || slug.includes('syn-flood') || slug.includes('dnssec') || slug.includes('firewall') || slug.includes('ids') || slug.includes('red-blue')) {
    return <CyberDefenseStudio />;
  }

  if (slug.includes('chaos') || slug.includes('outage') || slug.includes('flapping') || slug.includes('jitter') || slug.includes('blackhole') || slug.includes('split-brain') || slug.includes('resilience') || slug.includes('chaos-monkey')) {
    return <ChaosEngineeringStudio />;
  }

  if (slug.includes('proctor') || slug.includes('proctoring') || slug.includes('exam') || slug.includes('high-stakes') || slug.includes('anti-cheat') || slug.includes('tamper') || slug.includes('credential-mint')) {
    return <ProctoredExamStudio />;
  }

  if (slug.includes('internet') || slug.includes('digital-twin') || slug.includes('global-map') || slug.includes('tier-1') || slug.includes('ixp') || slug.includes('undersea') || slug.includes('root-dns') || slug.includes('v5')) {
    return <GlobalInternetDigitalTwinStudio />;
  }

  if (slug.includes('vpc') || slug.includes('tgw') || slug.includes('transit-gateway') || slug.includes('cloud-network') || slug.includes('aws') || slug.includes('azure') || slug.includes('cross-cloud')) {
    return <CloudTransitVpcStudio />;
  }

  if (slug.includes('sdwan') || slug.includes('sd-wan') || slug.includes('fec') || slug.includes('sla') || slug.includes('path-selection') || slug.includes('mpls') || slug.includes('broadband')) {
    return <SdwanTrafficStudio />;
  }

  if (slug.includes('wifi7') || slug.includes('wifi') || slug.includes('wireless-rf') || slug.includes('802.11be') || slug.includes('mlo') || slug.includes('4096-qam') || slug.includes('beamforming') || slug.includes('cellular-5g')) {
    return <Wifi7RfPhysicsStudio />;
  }

  if (slug.includes('pentest') || slug.includes('nmap') || slug.includes('scanner') || slug.includes('xmas') || slug.includes('smbghost') || slug.includes('cve') || slug.includes('exploit') || slug.includes('port-scan')) {
    return <PenetrationTestingStudio />;
  }

  if (slug.includes('zerotrust') || slug.includes('zero-trust') || slug.includes('ztna') || slug.includes('microsegmentation') || slug.includes('spiffe') || slug.includes('beyondcorp') || slug.includes('mtls') || slug.includes('device-posture')) {
    return <ZeroTrustPolicyStudio />;
  }

  if (slug.includes('ebpf') || slug.includes('xdp') || slug.includes('bpf') || slug.includes('kernel') || slug.includes('tc') || slug.includes('kprobe') || slug.includes('observability')) {
    return <EbpfStudio />;
  }

  if (slug.includes('pqc') || slug.includes('post-quantum-tls') || slug.includes('ml-kem') || slug.includes('fips203') || slug.includes('v9.1')) {
    return <PostQuantumTlsStudio />;
  }

  if (slug.includes('quantum') || slug.includes('kyber') || slug.includes('dilithium') || slug.includes('post-quantum') || slug.includes('encryption') || slug.includes('cryptography')) {
    return <QuantumCryptoStudio />;
  }

  if (slug.includes('interplanetary') || slug.includes('dtn') || slug.includes('bundle-protocol') || slug.includes('rfc5050') || slug.includes('mars-relay') || slug.includes('v9.0') || slug.includes('v9')) {
    return <InterplanetaryBundleStudio />;
  }

  if (slug.includes('satellite') || slug.includes('starlink') || slug.includes('leo') || slug.includes('isl') || slug.includes('space') || slug.includes('laser-link') || slug.includes('orbital')) {
    return <SatelliteMeshStudio />;
  }

  if (slug.includes('aiops') || slug.includes('self-healing') || slug.includes('gnmi') || slug.includes('openconfig') || slug.includes('telemetry') || slug.includes('closed-loop') || slug.includes('rca') || slug.includes('autonomous-network')) {
    return <AutonomousAiOpsStudio />;
  }

  if (slug.includes('noc') || slug.includes('command-center') || slug.includes('video-wall') || slug.includes('enterprise') || slug.includes('multi-tenant') || slug.includes('lms') || slug.includes('soc2') || slug.includes('v6')) {
    return <GlobalNocCommandStudio />;
  }

  if (slug.includes('import') || slug.includes('ocr') || slug.includes('multimodal') || slug.includes('chat-import') || slug.includes('pdf-export') || slug.includes('diploma')) {
    return <MultimodalImportStudio />;
  }

  if (slug.includes('multiplayer') || slug.includes('collab') || slug.includes('webrtc') || slug.includes('p2p') || slug.includes('peer') || slug.includes('presence')) {
    return <MultiplayerCanvasStudio />;
  }

  if (slug.includes('srv6') || slug.includes('segment-routing') || slug.includes('srh') || slug.includes('usid') || slug.includes('te-policy') || slug.includes('sr-mpls')) {
    return <Srv6PolicyStudio />;
  }

  if (slug.includes('tsn') || slug.includes('802.1qbv') || slug.includes('time-sensitive') || slug.includes('gcl') || slug.includes('deterministic') || slug.includes('industrial-iot') || slug.includes('automotive')) {
    return <TsnDeterministicStudio />;
  }

  if (slug.includes('threat-intel') || slug.includes('stix') || slug.includes('taxii') || slug.includes('mitre') || slug.includes('att&ck') || slug.includes('ioc') || slug.includes('flowspec') || slug.includes('soc')) {
    return <ThreatIntelligenceStudio />;
  }

  if (slug.includes('doh') || slug.includes('dot') || slug.includes('ech') || slug.includes('encrypted-dns') || slug.includes('dnssec') || slug.includes('privacy') || slug.includes('sni')) {
    return <EncryptedDnsStudio />;
  }

  if (slug.includes('dwdm') || slug.includes('optical') || slug.includes('photonics') || slug.includes('roadm') || slug.includes('edfa') || slug.includes('coherent') || slug.includes('800g') || slug.includes('wavelength')) {
    return <DwdmPhotonicStudio />;
  }

  if (slug.includes('graphrag') || slug.includes('nl-query') || slug.includes('graph') || slug.includes('cypher') || slug.includes('topology-search') || slug.includes('spof') || slug.includes('ai-query')) {
    return <NetworkGraphRagStudio />;
  }

  if (slug.includes('sonic') || slug.includes('sai') || slug.includes('nos') || slug.includes('asic') || slug.includes('broadcom') || slug.includes('switch-state') || slug.includes('orchagent')) {
    return <SonicNosStudio />;
  }

  if (slug.includes('mptcp') || slug.includes('quic') || slug.includes('http3') || slug.includes('multipath') || slug.includes('subflow') || slug.includes('connection-migration') || slug.includes('0-rtt')) {
    return <MptcpQuicStudio />;
  }

  if (slug.includes('orchestrator') || slug.includes('intent') || slug.includes('fabric-architect') || slug.includes('sovereign') || slug.includes('v7') || slug.includes('autonomous-fabric')) {
    return <AutonomousOrchestratorStudio />;
  }

  if (slug.includes('roce') || slug.includes('rdma') || slug.includes('pfc') || slug.includes('dcqcn') || slug.includes('lossless') || slug.includes('gpu-cluster') || slug.includes('allreduce')) {
    return <RoceLosslessStudio />;
  }

  if (slug.includes('uec') || slug.includes('ultra-ethernet') || slug.includes('packet-spray') || slug.includes('inc') || slug.includes('collective-reduction')) {
    return <UltraEthernetStudio />;
  }

  if (slug.includes('qkd') || slug.includes('quantum-routing') || slug.includes('entanglement') || slug.includes('bb84') || slug.includes('bell-state') || slug.includes('quantum-repeater') || slug.includes('quantum-internet')) {
    return <QuantumRoutingStudio />;
  }

  if (slug.includes('oran') || slug.includes('open-ran') || slug.includes('ric') || slug.includes('xapp') || slug.includes('rapp') || slug.includes('gnodeb') || slug.includes('beamforming') || slug.includes('5g-ran')) {
    return <OranStudio />;
  }

  if (slug.includes('p4') || slug.includes('p4-16') || slug.includes('bmv2') || slug.includes('int-telemetry') || slug.includes('programmable-data-plane') || slug.includes('match-action')) {
    return <P4DataPlaneStudio />;
  }

  if (slug.includes('multi-cloud') || slug.includes('cloud-wan') || slug.includes('vwan') || slug.includes('ncc') || slug.includes('aws-wan') || slug.includes('azure-vwan') || slug.includes('gcp-ncc')) {
    return <MultiCloudWanStudio />;
  }

  if (slug.includes('confidential') || slug.includes('enclave') || slug.includes('sev-snp') || slug.includes('sgx') || slug.includes('tdx') || slug.includes('nitro-tpm') || slug.includes('attestation')) {
    return <ConfidentialNetStudio />;
  }

  if (slug.includes('anycast') || slug.includes('ddos') || slug.includes('scrubbing') || slug.includes('volumetric') || slug.includes('syn-flood') || slug.includes('mitigation')) {
    return <AnycastDdosStudio />;
  }

  if (slug.includes('depin') || slug.includes('libp2p') || slug.includes('gossipsub') || slug.includes('dht') || slug.includes('kademlia') || slug.includes('web3-mesh') || slug.includes('peer-routing')) {
    return <DepinMeshStudio />;
  }

  if (slug.includes('planetary-twin') || slug.includes('digital-reality') || slug.includes('planetary-noc') || slug.includes('v8') || slug.includes('universal-matrix') || slug.includes('global-twin')) {
    return <PlanetaryTwinStudio />;
  }

  if (slug.includes('sagin') || slug.includes('space-air-ground') || slug.includes('haps') || slug.includes('ntn') || slug.includes('non-terrestrial') || slug.includes('v8.1')) {
    return <SaginMultiTierStudio />;
  }

  if (slug.includes('neuromorphic') || slug.includes('snn') || slug.includes('spiking') || slug.includes('lif-neuron') || slug.includes('loihi') || slug.includes('low-power') || slug.includes('v8.2')) {
    return <NeuromorphicPacketStudio />;
  }

  if (slug.includes('subsea') || slug.includes('submarine') || slug.includes('das') || slug.includes('acoustic-sensing') || slug.includes('otdr') || slug.includes('transatlantic') || slug.includes('v8.3')) {
    return <SubseaAcousticStudio />;
  }

  if (slug.includes('wasm') || slug.includes('smartnic') || slug.includes('wasi') || slug.includes('dpu') || slug.includes('bluefield') || slug.includes('pensando') || slug.includes('bytecode') || slug.includes('v8.4')) {
    return <WasmSmartNicStudio />;
  }

  if (slug.includes('hollow-core') || slug.includes('hcf') || slug.includes('nanf') || slug.includes('speed-of-light') || slug.includes('hft-latency') || slug.includes('fiber-physics') || slug.includes('v8.5')) {
    return <HollowCoreFiberStudio />;
  }

  if (slug.includes('optical-mems') || slug.includes('silicon-photonics') || slug.includes('ocs') || slug.includes('photonic-switch') || slug.includes('mzi') || slug.includes('all-optical') || slug.includes('v8.6')) {
    return <OpticalMemsStudio />;
  }

  if (slug.includes('bgp-leak') || slug.includes('rfc9234') || slug.includes('auto-remediation') || slug.includes('bgp-otc') || slug.includes('rpki-roa') || slug.includes('v8.7')) {
    return <BgpAutoRemediationStudio />;
  }

  if (slug.includes('slicing') || slug.includes('urllc') || slug.includes('private-5g') || slug.includes('embb') || slug.includes('mmtc') || slug.includes('s-nssai') || slug.includes('v8.8')) {
    return <IndustrialSlicingStudio />;
  }

  if (slug.includes('zkp') || slug.includes('zk-snark') || slug.includes('groth16') || slug.includes('zero-knowledge') || slug.includes('compliance-proof') || slug.includes('v8.9')) {
    return <ZkpNetworkStudio />;
  }

  if (slug.includes('self-evolving') || slug.includes('topology-morph') || slug.includes('genetic-network') || slug.includes('autonomous-mesh') || slug.includes('v9.2')) {
    return <SelfEvolvingTopologyStudio />;
  }

  if (slug.includes('terahertz') || slug.includes('thz') || slug.includes('ris') || slug.includes('metamaterial') || slug.includes('sub-thz') || slug.includes('wireless-backhaul') || slug.includes('v9.3')) {
    return <TerahertzWirelessStudio />;
  }

  if (slug.includes('k8s') || slug.includes('cni') || slug.includes('cilium') || slug.includes('calico') || slug.includes('pod-network') || slug.includes('kubernetes') || slug.includes('v9.4')) {
    return <K8sCniMeshStudio />;
  }

  if (slug.includes('ids') || slug.includes('ips') || slug.includes('snort') || slug.includes('suricata') || slug.includes('hyperscan') || slug.includes('threat-signature') || slug.includes('v9.5')) {
    return <IdsSignatureStudio />;
  }

  if (slug.includes('quantum-coprocessor') || slug.includes('qaoa') || slug.includes('hybrid-qpu') || slug.includes('cryo-qubit') || slug.includes('neuromorphic-quantum') || slug.includes('qpu')) {
    return <QuantumCoProcStudio />;
  }

  if (slug.includes('holographic') || slug.includes('telepresence') || slug.includes('volumetric') || slug.includes('light-field') || slug.includes('voxels') || slug.includes('spatial-streaming')) {
    return <HolographicMatrixStudio />;
  }

  if (slug.includes('subnet-genesis') || slug.includes('auto-genesis') || slug.includes('ai-subnet') || slug.includes('zero-touch-ipam') || slug.includes('v9.6')) {
    return <SubnetAutoGenesisStudio />;
  }

  if (slug.includes('orbital-datacenter') || slug.includes('space-compute') || slug.includes('orbital-mesh') || slug.includes('laser-oisl') || slug.includes('v9.7')) {
    return <OrbitalDatacenterStudio />;
  }

  if (slug.includes('dna-storage') || slug.includes('molecular-routing') || slug.includes('bio-network') || slug.includes('nucleotide') || slug.includes('microfluidic') || slug.includes('v9.8')) {
    return <DnaStorageStudio />;
  }

  if (slug.includes('multiverse-hypervisor') || slug.includes('cross-simulation') || slug.includes('parallel-universes') || slug.includes('timeline-merge') || slug.includes('v9.9')) {
    return <MultiverseHypervisorStudio />;
  }

  if (slug.includes('singularity') || slug.includes('v10.0') || slug.includes('v10') || slug.includes('universal-matrix') || slug.includes('master-nexus') || slug.includes('omnipresent-network')) {
    return <UniversalSingularityStudio />;
  }

  if (slug.includes('scapy') || slug.includes('packet-craft') || slug.includes('packet_craft') || slug.includes('crafting')) {
    return <ScapyPacketCrafter />;
  }

  if (slug.includes('automation') || slug.includes('programmability') || slug.includes('pipeline') || slug.includes('rest-api')) {
    return <NetworkAutomationVisual />;
  }
  if (slug.includes('multi-area') || slug.includes('multi_area') || slug.includes('redistribution')) {
    return <MultiAreaOSPFVisual />;
  }
  if (slug.includes('ipv6') || slug.includes('slaac') || slug.includes('compressor')) {
    return <IPv6Visual />;
  }
  if (slug.includes('ospf') || slug.includes('net-304') || slug.includes('link-state')) {
    return <OSPFVisual />;
  }
  if (slug.includes('stp') || slug.includes('spanning-tree') || slug.includes('net-302')) {
    return <STPVisual />;
  }
  if (slug.includes('osi')) {
    return <OSILayerVisual />;
  }
  if (slug.includes('tcp-ip') || slug === 'tcp' || slug.includes('handshake')) {
    return <TCPHandshakeVisual />;
  }
  if (slug.includes('dns')) {
    return <DNSLookupVisual />;
  }
  if (slug.includes('arp')) {
    return <ARPVisual />;
  }
  if (slug.includes('dhcp')) {
    return <DHCPVisual />;
  }
  if (slug.includes('port') || slug.includes('socket') || slug.includes('multiplex')) {
    return <SocketMultiplexerVisual />;
  }
  if (slug.includes('subnet')) {
    return <SubnetVisual />;
  }
  if (slug.includes('ipv4') || slug.includes('ip-addressing')) {
    return <IPAddressingVisual />;
  }
  if (slug.includes('routing')) {
    return <RouterForwardingVisual />;
  }
  if (slug.includes('http') || slug.includes('https')) {
    return <ClientServerVisual />;
  }
  if (slug.includes('performance') || slug.includes('metrics') || slug.includes('latency')) {
    return <PerformanceMetricsVisual />;
  }
  if (
    slug.includes('wireless') ||
    slug.includes('wifi') ||
    slug.includes('spectrum') ||
    slug.includes('802.11') ||
    slug.includes('rf')
  ) {
    return <WirelessSpectrumVisual />;
  }

  // Fallback to Packet Journey Visual for other networking topics
  return <PacketJourneyVisual />;
};
