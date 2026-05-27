'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, FileText, Shield } from 'lucide-react';

export function AuditTrailModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [auditTrail] = useState([
    {
      id: 1,
      timestamp: '2024-02-15 16:45:30',
      type: 'Data Access',
      description: 'Admin viewed employee personal information',
      user: 'Yohannes Tefera',
      resource: 'Employee #156',
      changes: null,
      severity: 'info'
    },
    {
      id: 2,
      timestamp: '2024-02-15 15:22:18',
      type: 'Data Modification',
      description: 'Employee status updated',
      user: 'Getnet Kabede',
      resource: 'Employee #148',
      changes: { from: 'DOCUMENT_REVIEW', to: 'INTERVIEW_UPLOADED' },
      severity: 'warning'
    },
    {
      id: 3,
      timestamp: '2024-02-15 14:55:12',
      type: 'Data Deletion',
      description: 'Document record permanently deleted',
      user: 'Admin',
      resource: 'Document #892',
      changes: null,
      severity: 'critical'
    },
    {
      id: 4,
      timestamp: '2024-02-15 14:10:45',
      type: 'Configuration Change',
      description: 'System settings updated',
      user: 'Admin',
      resource: 'System Settings',
      changes: { field: 'max_upload_size', from: '50MB', to: '100MB' },
      severity: 'warning'
    },
    {
      id: 5,
      timestamp: '2024-02-15 13:35:22',
      type: 'Data Export',
      description: 'Employee data exported to CSV',
      user: 'Senait Assefa',
      resource: 'Employee List',
      changes: { count: 156, format: 'CSV' },
      severity: 'info'
    },
  ]);

  const filteredTrail = auditTrail.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '⚠️';
      case 'warning': return '⚡';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">Audit Trail</h2>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-5 w-5" />
            Export Audit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center">
          <p className="text-xs font-medium text-slate-600">Total Events</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">{auditTrail.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-4 text-center">
          <p className="text-xs font-medium text-slate-600">Critical</p>
          <p className="mt-2 text-3xl font-bold text-red-700">{auditTrail.filter(a => a.severity === 'critical').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 text-center">
          <p className="text-xs font-medium text-slate-600">Warnings</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{auditTrail.filter(a => a.severity === 'warning').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 p-4 text-center">
          <p className="text-xs font-medium text-slate-600">Info</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">{auditTrail.filter(a => a.severity === 'info').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 text-center">
          <p className="text-xs font-medium text-slate-600">Unique Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-700">{new Set(auditTrail.map(a => a.user)).size}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="Data Access">Data Access</option>
          <option value="Data Modification">Data Modification</option>
          <option value="Data Deletion">Data Deletion</option>
          <option value="Configuration Change">Configuration Change</option>
          <option value="Data Export">Data Export</option>
        </select>
      </div>

      {/* Audit Trail Timeline */}
      <div className="space-y-3">
        {filteredTrail.map((entry, idx) => (
          <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{getSeverityIcon(entry.severity)}</span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getSeverityColor(entry.severity)}`}>
                    {entry.type}
                  </span>
                  <span className="text-xs text-slate-500">{entry.timestamp}</span>
                </div>
                <p className="font-medium text-ink">{entry.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">User: </span>
                    <span className="font-medium text-ink">{entry.user}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Resource: </span>
                    <span className="font-medium text-ink">{entry.resource}</span>
                  </div>
                  {entry.changes && (
                    <div>
                      <span className="text-slate-600">Changes: </span>
                      <span className="font-mono text-xs text-brand-600">
                        {Object.entries(entry.changes).map(([k, v]) => `${k}=${v}`).join(' | ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition flex-shrink-0">
                <Eye className="h-4 w-4 text-slate-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrail.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No audit entries found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
