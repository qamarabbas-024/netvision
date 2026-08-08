'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Users, BookOpen, Activity, Plus, ShieldX } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [usersList, setUsersList] = useState<Array<Record<string, any>>>([]);
  const [forbidden, setForbidden] = useState(false);

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
      } catch (err: any) {
        if (err.message && err.message.includes('403')) {
          setForbidden(true);
        }
      }
    }

    loadAdminData();
  }, [user]);

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
