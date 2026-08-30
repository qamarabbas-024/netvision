'use client';

import React from 'react';
import { NetworkDevice } from '@/types/network';
import { X, Activity, Server, Cpu, HardDrive, Radio } from 'lucide-react';

interface DeviceDetailsModalProps {
  device: NetworkDevice | null;
  onClose: () => void;
}

export const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ device, onClose }) => {
  if (!device) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-details-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="device-details-title" className="text-lg font-bold text-slate-100 font-mono">
                  {device.name}
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-[#06b6d4]/10 text-[#22d3ee] border border-[#06b6d4]/30">
                  {device.layer}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{device.label}</p>
            </div>
          </div>
          <button 
            id="close-device-details-btn"
            onClick={onClose}
            aria-label="Close device details"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          {/* Hardware Role & Description */}
          <div className="bg-[#0b1120] border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#10b981]" /> Hardware Role & Functional Specification
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{device.description}</p>
            <p className="text-xs text-slate-400 mt-2 italic">{device.role}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0b1120] border border-slate-800/80 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Load
              </div>
              <div className="text-base font-bold font-mono text-slate-100">{device.details.cpuUsage}</div>
            </div>
            <div className="bg-[#0b1120] border border-slate-800/80 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Memory Buffer
              </div>
              <div className="text-base font-bold font-mono text-slate-100">{device.details.memoryUsage}</div>
            </div>
            <div className="bg-[#0b1120] border border-slate-800/80 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-teal-400" /> Throughput
              </div>
              <div className="text-base font-bold font-mono text-slate-100">{device.details.throughput}</div>
            </div>
          </div>

          {/* Network Interfaces */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Active Interfaces ({device.interfaces.length})
            </h4>
            <div className="space-y-2 font-mono text-xs">
              {device.interfaces.map((iface, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#0b1120] border border-slate-800/80 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="font-semibold text-slate-200">{iface.name}</span>
                    {iface.ip && <span className="text-[#22d3ee]">[{iface.ip}]</span>}
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>MAC: {iface.mac}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{iface.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Routing Table or MAC Table if available */}
          {device.details.routingTable && device.details.routingTable.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Forwarding Information Base (FIB / Routing Table)
              </h4>
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#111c30] text-slate-400">
                    <tr>
                      <th className="p-2.5">Destination</th>
                      <th className="p-2.5">Next Hop / Gateway</th>
                      <th className="p-2.5">Interface</th>
                      <th className="p-2.5">Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#0b1120] text-slate-300">
                    {device.details.routingTable.map((route, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-[#34d399] font-medium">{route.destination}</td>
                        <td className="p-2.5">{route.gateway}</td>
                        <td className="p-2.5 text-cyan-400">{route.interface}</td>
                        <td className="p-2.5">{route.metric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {device.details.macTable && device.details.macTable.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                CAM / Layer 2 MAC Address Table
              </h4>
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#111c30] text-slate-400">
                    <tr>
                      <th className="p-2.5">MAC Address</th>
                      <th className="p-2.5">Switch Port</th>
                      <th className="p-2.5">VLAN ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#0b1120] text-slate-300">
                    {device.details.macTable.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-[#34d399] font-medium">{row.mac}</td>
                        <td className="p-2.5 text-cyan-400">{row.port}</td>
                        <td className="p-2.5">VLAN {row.vlan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0b1120] border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Operational Status: Healthy & Online</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
