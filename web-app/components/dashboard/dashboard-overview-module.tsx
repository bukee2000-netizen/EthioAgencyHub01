'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Bell, Calendar, Users, FileText, Building2, RefreshCw, Plane, UserPlus, Briefcase, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function DashboardOverviewModule() {
  const [stats, setStats] = useState({
    totalEmployees: 0, travelReady: 0, deployed: 0,
    pendingDocuments: 0, departuresToday: 0, tasksDue: 0,
    registered: 0, documentReview: 0, interviewUploaded: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, empRes] = await Promise.all([
        fetch('/api/employees/stats'),
        fetch('/api/employees?limit=1')
      ]);
      const statsData = await statsRes.json();
      const empData = await empRes.json();

      const s = statsData.success ? (statsData.data || statsData.stats || {}) : {};
      const totalEmps = s.total || s.totalEmployees || 0;

      setStats({
        totalEmployees: totalEmps,
        registered: s.registered || 0,
        documentReview: s.documentReview || s.pendingDocuments || 0,
        interviewUploaded: s.interviewUploaded || 0,
        travelReady: s.travelReady || 0,
        deployed: s.deployed || 0,
        pendingDocuments: s.pendingDocuments || s.documentReview || 0,
        departuresToday: s.departuresToday || 0,
        tasksDue: s.tasksDue || 0
      });
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { label: 'Register New Employee', href: '/employee-management/registration', icon: UserPlus, color: 'bg-brand-600', count: '-' },
    { label: 'Generate CV', href: '/employee-management/cv-generator', icon: FileText, color: 'bg-purple-600', count: '-' },
    { label: 'Book Travel', href: '/travel', icon: Plane, color: 'bg-blue-600', count: '-' },
    { label: 'View Documents', href: '/documents', icon: FileText, color: 'bg-green-600', count: '-' },
    { label: 'CV Database', href: '/employee-management/cv-database', icon: Users, color: 'bg-amber-600', count: '-' },
    { label: 'View Profiles', href: '/employee-management/profiles', icon: Briefcase, color: 'bg-teal-600', count: '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
        <button onClick={fetchData} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Employees', value: stats.totalEmployees, icon: Users, bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-200' },
          { label: 'Pending Docs', value: stats.pendingDocuments, icon: AlertCircle, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
          { label: 'Travel Ready', value: stats.travelReady, icon: Plane, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
          { label: 'Deployed', value: stats.deployed, icon: Globe, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border ${item.border} ${item.bg} p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <item.icon className={`h-5 w-5 ${item.text} mb-2`} />
            <p className={`text-2xl font-bold ${item.text}`}>{loading ? '...' : item.value}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg ${link.color} p-2 text-white group-hover:scale-105 transition-transform`}>
                <link.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{link.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
