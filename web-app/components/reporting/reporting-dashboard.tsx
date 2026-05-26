'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, TrendingUp, Users, FileCheck, Plane } from 'lucide-react';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

interface OverviewData {
  employees: { total: number; byStatus: Record<string, number> };
  documents: { total: number; byType: Record<string, number>; verified: number };
  travel: { scheduled: number; departed: number };
  pilgrims: { total: number };
  agents: { total: number; active: number };
}

export function ReportingDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reporting/overview')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setData(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const employeeStatusData = data?.employees?.byStatus ? Object.entries(data.employees.byStatus).map(([status, count]) => ({
    name: status.replace(/_/g, ' '),
    value: count
  })) : [];

  const documentTypeData = data?.documents?.byType ? Object.entries(data.documents.byType).map(([type, count]) => ({
    name: type,
    value: count
  })) : [];

  const monthlyTrend = [
    { month: 'Jan', employees: 12, documents: 45, travels: 8 },
    { month: 'Feb', employees: 19, documents: 52, travels: 12 },
    { month: 'Mar', employees: 25, documents: 68, travels: 15 },
    { month: 'Apr', employees: 18, documents: 48, travels: 10 },
    { month: 'May', employees: 22, documents: 55, travels: 14 }
  ];

  const travelData = data?.travel ? [
    { name: 'Scheduled', value: data.travel.scheduled || 0 },
    { name: 'Departed', value: data.travel.departed || 0 }
  ] : [];

  const handleExport = async (type: string) => {
    try {
      const res = await fetch(`/api/reporting/export?type=${type}&format=csv`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-export.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Employees</p>
              <p className="mt-1 text-2xl font-bold">{data?.employees?.total || 0}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3"><Users className="h-5 w-5 text-blue-600" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Verified Documents</p>
              <p className="mt-1 text-2xl font-bold">{data?.documents?.verified || 0}</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3"><FileCheck className="h-5 w-5 text-emerald-600" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Scheduled Travels</p>
              <p className="mt-1 text-2xl font-bold">{data?.travel?.scheduled || 0}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3"><Plane className="h-5 w-5 text-amber-600" /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Agents</p>
              <p className="mt-1 text-2xl font-bold">{data?.agents?.active || 0}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Employee Status Distribution</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={employeeStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}>
                  {employeeStatusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Document Types</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={documentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Monthly Trend</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="employees" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="documents" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="travels" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Export Reports</h3>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {['employees', 'documents', 'travels', 'pilgrims'].map(type => (
            <button key={type} onClick={() => handleExport(type)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-medium hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}