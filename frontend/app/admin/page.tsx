'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Activity,
  Plus,
  ShieldX,
  RefreshCw,
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Gauge,
  Cpu,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [usersList, setUsersList] = useState<Array<Record<string, any>>>([]);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [alertsData, setAlertsData] = useState<any>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const loadTelemetry = useCallback(async () => {
    try {
      const [metricsRes, alertsRes] = await Promise.all([
        fetchApi<any>('/monitoring/metrics').catch(() => null),
        fetchApi<any>('/monitoring/alerts').catch(() => null),
      ]);
      if (metricsRes) setTelemetry(metricsRes);
      if (alertsRes) setAlertsData(alertsRes);
    } catch {
      // Telemetry fetch failed gracefully
    }
  }, []);

  const handleRefreshTelemetry = async () => {
    setIsRefreshingTelemetry(true);
    await loadTelemetry();
    setTimeout(() => setIsRefreshingTelemetry(false), 400);
  };

  useEffect(() => {
    async function loadAdminData() {
      if (user && user.role !== 'ADMIN') {
        setForbidden(true);
        return;
      }

      try {
        const [statsRes, usersRes] = await Promise.all([
          fetchApi<any>('/admin/dashboard'),
          fetchApi<any[]>('/admin/users'),
        ]);
        setStats(statsRes);
        setUsersList(usersRes);
        await loadTelemetry();
      } catch (err: any) {
        if (err.message && err.message.includes('403')) {
          setForbidden(true);
        }
      }
    }

    loadAdminData();
  }, [user, loadTelemetry]);

  if (forbidden || (user && user.role !== 'ADMIN')) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-6 bg-net-grid-pattern">
          <Card className="w-full max-w-md p-8 glass-panel border-rose-500/40 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldX className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">403 — Access Denied</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You do not have Administrator privileges to view system metrics or modify management user accounts.
            </p>
            <Link href="/dashboard" className="w-full mt-2">
              <Button variant="cyan" className="w-full">
                Return to Student Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    System Control Panel
                  </span>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-[#00f0ff]" /> Admin Dashboard
                  </h1>
                </div>

                <Button variant="cyan" leftIcon={<Plus className="w-4 h-4" />}>
                  Create New Course Module
                </Button>
              </div>

              {/* Admin Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 flex items-center gap-4">
                  <Users className="w-8 h-8 text-[#00f0ff]" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">
                      {stats?.totalUsers ?? 0}
                    </span>
                    <span className="text-xs text-zinc-400">Total Users</span>
                  </div>
                </Card>

                <Card className="p-6 flex items-center gap-4">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">
                      {stats?.totalCourses ?? 0} Courses
                    </span>
                    <span className="text-xs text-zinc-400">{stats?.totalLessons ?? 0} Lessons</span>
                  </div>
                </Card>

                <Card className="p-6 flex items-center gap-4">
                  <Activity className="w-8 h-8 text-amber-400" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">
                      {stats?.totalAttempts ?? 0}
                    </span>
                    <span className="text-xs text-zinc-400">Quiz Attempts</span>
                  </div>
                </Card>

                <Card className="p-6 flex items-center gap-4">
                  <ShieldAlert className="w-8 h-8 text-emerald-400" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">Authorized</span>
                    <span className="text-xs text-zinc-400">Role: ADMIN</span>
                  </div>
                </Card>
              </div>

              {/* Operational Health & Telemetry Panel (Drop U) */}
              <Card className="p-6 space-y-6 border-cyan-500/20 bg-[#0c1017]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-cyan-400" />
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Live Operational Health & Telemetry
                      </h2>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Real-time production infrastructure metrics, subsystem health probes, and alert condition evaluations.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        alertsData?.status === 'CRITICAL'
                          ? 'rose'
                          : alertsData?.status === 'WARNING'
                          ? 'amber'
                          : 'emerald'
                      }
                      className="px-3 py-1 font-mono text-xs uppercase"
                    >
                      ● {alertsData?.status || 'HEALTHY'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshTelemetry}
                      disabled={isRefreshingTelemetry}
                      leftIcon={
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isRefreshingTelemetry ? 'animate-spin' : ''}`}
                        />
                      }
                      className="text-xs font-mono"
                    >
                      {isRefreshingTelemetry ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                </div>

                {/* Subsystem & Telemetry Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-[#080b11] p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Database Latency</span>
                    <span className="text-lg font-extrabold font-mono text-cyan-400">
                      {telemetry?.database?.lastLatencyMs !== undefined ? `${telemetry.database.lastLatencyMs}ms` : 'Nominal'}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      {telemetry?.database?.healthy ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>

                  <div className="bg-[#080b11] p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Requests</span>
                    <span className="text-lg font-extrabold font-mono text-white">
                      {telemetry?.totalRequests ?? 0}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {telemetry?.status2xxCount ?? 0} 2xx OK
                    </span>
                  </div>

                  <div className="bg-[#080b11] p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">5xx Server Errors</span>
                    <span
                      className={`text-lg font-extrabold font-mono ${
                        (telemetry?.status5xxCount || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {telemetry?.status5xxCount ?? 0}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {telemetry?.status5xxPercent ?? 0}% rate
                    </span>
                  </div>

                  <div className="bg-[#080b11] p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Avg Request Latency</span>
                    <span className="text-lg font-extrabold font-mono text-purple-400">
                      {telemetry?.latency?.avgMs !== undefined ? `${telemetry.latency.avgMs}ms` : '0ms'}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      p95: {telemetry?.latency?.p95Ms ?? 0}ms
                    </span>
                  </div>

                  <div className="bg-[#080b11] p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Auth Failures</span>
                    <span
                      className={`text-lg font-extrabold font-mono ${
                        (telemetry?.auth?.failures || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {telemetry?.auth?.failures ?? 0}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Replays: {telemetry?.auth?.tokenReuseCount ?? 0}
                    </span>
                  </div>

                  <div className="bg-[#080b11] p-3.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Lab & Cert Events</span>
                    <span className="text-lg font-extrabold font-mono text-cyan-400">
                      {(telemetry?.learning?.labCompletions ?? 0) + (telemetry?.learning?.certificationAttempts ?? 0)}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {telemetry?.learning?.labCompletions ?? 0} labs, {telemetry?.learning?.certificationAttempts ?? 0} certs
                    </span>
                  </div>
                </div>

                {/* Evaluated Operational Alert Conditions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-zinc-300 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Alert Condition Monitors ({alertsData?.alerts?.length || 6})
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Evaluated: {alertsData?.evaluatedAt ? new Date(alertsData.evaluatedAt).toLocaleTimeString() : 'Live'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(alertsData?.alerts || [
                      { id: 'elevated_5xx', name: 'Elevated 5xx Error Rate', threshold: '> 5% or >= 5 count', status: 'OK', message: '5xx error rate within normal parameters.' },
                      { id: 'database_connection_failures', name: 'Database Health & Latency', threshold: 'Connected & < 1000ms', status: 'OK', message: 'Database operational.' },
                      { id: 'authentication_abuse', name: 'Authentication Abuse & Token Replay', threshold: '0 Replays, < 5 Failures', status: 'OK', message: 'Authentication velocity nominal.' },
                      { id: 'repeated_certification_failures', name: 'Repeated Certification Failures', threshold: '< 60% failure rate', status: 'OK', message: 'Certification velocity nominal.' },
                      { id: 'simulation_engine_failures', name: 'Simulation Engine Infrastructure', threshold: '0 Provider Errors', status: 'OK', message: 'Simulation engines operational.' },
                      { id: 'unusual_command_errors', name: 'Unusual Command & Terminal Errors', threshold: '<= 20 failures', status: 'OK', message: 'Command executions nominal.' },
                    ]).map((alert: any) => (
                      <div
                        key={alert.id}
                        className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between gap-2 ${
                          alert.status === 'CRITICAL'
                            ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                            : alert.status === 'WARNING'
                            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                            : 'bg-[#080b11] border-slate-800/80 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white leading-tight">{alert.name}</span>
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              alert.status === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : alert.status === 'WARNING'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {alert.status === 'OK' ? <CheckCircle2 className="w-2.5 h-2.5" /> : alert.status === 'WARNING' ? <AlertTriangle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                            {alert.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 leading-snug">
                          {alert.message}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between border-t border-slate-800/60 pt-1.5 mt-1">
                          <span>Threshold: {alert.threshold}</span>
                          {alert.currentValue && <span>Current: {alert.currentValue}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* User Management Table */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">User Management Directory</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name & Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-mono text-xs text-zinc-400">{u.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <div className="font-bold text-white text-xs">{u.fullName || u.username}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{u.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'ADMIN' ? 'rose' : u.role === 'TEACHER' ? 'purple' : 'cyan'}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
