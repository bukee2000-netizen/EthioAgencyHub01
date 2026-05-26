'use client';

import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Trash2, Edit2 } from 'lucide-react';

export function TasksModule() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Process Passport Applications',
      description: 'Verify and process pending passport applications from last week',
      assignee: 'Getnet Kabede',
      priority: 'high',
      dueDate: '2024-02-16',
      status: 'pending',
      completedAt: null
    },
    {
      id: 2,
      title: 'Update MOLS Documents',
      description: 'Submit Ministry of Labor & Social Affairs requirements update',
      assignee: 'Senait Assefa',
      priority: 'critical',
      dueDate: '2024-02-15',
      status: 'pending',
      completedAt: null
    },
    {
      id: 3,
      title: 'Generate Monthly Report',
      description: 'Create comprehensive month-end agency performance report',
      assignee: 'Yohannes Tefera',
      priority: 'medium',
      dueDate: '2024-02-20',
      status: 'in-progress',
      completedAt: null
    },
    {
      id: 4,
      title: 'Verify Travel Documents',
      description: 'Review and approve flight booking documentation for Riyadh flights',
      assignee: 'Marta Desalegn',
      priority: 'high',
      dueDate: '2024-02-17',
      status: 'completed',
      completedAt: '2024-02-14'
    },
    {
      id: 5,
      title: 'System Backup',
      description: 'Execute full system backup and verify integrity',
      assignee: 'Admin',
      priority: 'low',
      dueDate: '2024-02-18',
      status: 'pending',
      completedAt: null
    },
  ]);

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: t.status === 'completed' ? 'pending' : 'completed',
            completedAt: t.status === 'completed' ? null : new Date().toISOString().split('T')[0]
          }
        : t
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'line-through text-slate-400';
      case 'in-progress': return 'text-blue-600 font-semibold';
      case 'pending': return 'text-ink';
      default: return 'text-ink';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Tasks</h2>
        <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 shadow-sm">
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-slate-600">Total Tasks</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{tasks.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-slate-600">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{tasks.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-slate-600">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-cyan-700">{tasks.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-slate-600">Completed</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow shadow-sm"
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-1 flex-shrink-0 flex-none"
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300 hover:text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${getStatusColor(task.status)}`}>
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span className="text-xs text-slate-600">
                    👤 {task.assignee}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-600">
                    <Calendar className="h-3 w-3" />
                    {task.dueDate}
                  </span>
                  {task.completedAt && (
                    <span className="text-xs text-emerald-600 font-medium">
                      ✓ Completed {task.completedAt}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Edit2 className="h-4 w-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
