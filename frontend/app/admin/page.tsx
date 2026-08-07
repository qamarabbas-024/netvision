'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Users, BookOpen, Activity, Plus } from 'lucide-react';

export default function AdminPage() {
  const usersList = [
    { id: 'usr-1', name: 'Alex Rivers', email: 'alex@university.edu', role: 'STUDENT', joined: 'Aug 01, 2026', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Dr. Robert Vance', email: 'vance@mit.edu', role: 'TEACHER', joined: 'Aug 02, 2026', status: 'ACTIVE' },
    { id: 'usr-3', name: 'Elena Rostova', email: 'elena@cyber.io', role: 'ADMIN', joined: 'Aug 03, 2026', status: 'ACTIVE' },
  ];

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex items-center gap-4">
                  <Users className="w-8 h-8 text-[#00f0ff]" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">100,240</span>
                    <span className="text-xs text-zinc-400">Total Registered Learners</span>
                  </div>
                </Card>

                <Card className="p-6 flex items-center gap-4">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">6 Courses / 95 Lessons</span>
                    <span className="text-xs text-zinc-400">Published Content</span>
                  </div>
                </Card>

                <Card className="p-6 flex items-center gap-4">
                  <Activity className="w-8 h-8 text-emerald-400" />
                  <div>
                    <span className="text-2xl font-bold font-mono text-white block">99.98%</span>
                    <span className="text-xs text-zinc-400">Simulation Engine Uptime</span>
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
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-mono text-xs">{u.id}</TableCell>
                        <TableCell>
                          <div className="font-bold text-white text-xs">{u.name}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{u.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'ADMIN' ? 'rose' : u.role === 'TEACHER' ? 'purple' : 'cyan'}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{u.joined}</TableCell>
                        <TableCell>
                          <Badge variant="emerald">{u.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit User</Button>
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
