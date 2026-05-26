'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Calendar, CheckCircle2, AlertCircle, FileText, Phone, 
  Mail, MapPin, Heart, Sun, Moon, Shield, Activity, Clock,
  ChevronRight, Search, Filter, Plus, Edit, Eye
} from 'lucide-react';

interface PilgrimDetail {
  id: string;
  name: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  destination: 'Hajj' | 'Umrah';
  season: string;
  groupId: string;
  groupName: string;
  status: string;
  registrationDate: string;
  documents: {
    passport: boolean;
    visa: boolean;
    healthCertificate: boolean;
    insurance: boolean;
    consent: boolean;
  };
  medical: {
    status: 'cleared' | 'pending' | 'rejected';
    lastCheckup: string;
    doctorName: string;
    notes?: string;
  };
  payment: {
    total: number;
    paid: number;
    pending: number;
    status: 'completed' | 'partial' | 'pending';
  };
}

export function HajjUmrahPilgrimDetail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPilgrim, setSelectedPilgrim] = useState<PilgrimDetail | null>(null);

  const pilgrims: PilgrimDetail[] = [
    {
      id: 'P001', name: 'Ahmed Hassan Mohammed', passportNumber: 'EP123456', passportExpiry: '2028-12-15', nationality: 'Ethiopian', gender: 'Male', age: 45, dateOfBirth: '1980-05-20', phone: '+251911234567', email: 'ahmed.h@example.com', address: 'Addis Ababa, Ethiopia', emergencyContact: 'Fatima Ahmed', emergencyPhone: '+251911234568', destination: 'Hajj', season: '2026', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'ready_for_travel', registrationDate: '2024-01-10',
      documents: { passport: true, visa: true, healthCertificate: true, insurance: true, consent: true },
      medical: { status: 'cleared', lastCheckup: '2024-02-15', doctorName: 'Dr. Mekonnen Belay' },
      payment: { total: 85000, paid: 85000, pending: 0, status: 'completed' }
    },
    {
      id: 'P002', name: 'Fatima Ibrahim Ali', passportNumber: 'EP234567', passportExpiry: '2029-03-20', nationality: 'Ethiopian', gender: 'Female', age: 38, dateOfBirth: '1987-08-12', phone: '+251912345678', email: 'fatima.i@example.com', address: 'Dire Dawa, Ethiopia', emergencyContact: 'Ibrahim Ali', emergencyPhone: '+251912345679', destination: 'Umrah', season: '2026', groupId: 'GRP-002', groupName: 'Ramadan Umrah 2026', status: 'visa_approved', registrationDate: '2024-01-15',
      documents: { passport: true, visa: true, healthCertificate: true, insurance: true, consent: true },
      medical: { status: 'cleared', lastCheckup: '2024-02-20', doctorName: 'Dr. Tigist Haile' },
      payment: { total: 45000, paid: 45000, pending: 0, status: 'completed' }
    },
    {
      id: 'P003', name: 'Ibrahim Mohamed Tessema', passportNumber: 'EP345678', passportExpiry: '2027-11-10', nationality: 'Ethiopian', gender: 'Male', age: 52, dateOfBirth: '1973-02-28', phone: '+251913456789', email: 'ibrahim.m@example.com', address: 'Hawassa, Ethiopia', emergencyContact: 'Amina Mohamed', emergencyPhone: '+251913456780', destination: 'Hajj', season: '2026', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'requirements_met', registrationDate: '2024-01-20',
      documents: { passport: true, visa: false, healthCertificate: true, insurance: true, consent: true },
      medical: { status: 'cleared', lastCheckup: '2024-01-25', doctorName: 'Dr. Solomon Kebede' },
      payment: { total: 85000, paid: 50000, pending: 35000, status: 'partial' }
    },
    {
      id: 'P004', name: 'Amina Ahmed Seid', passportNumber: 'EP456789', passportExpiry: '2028-08-05', nationality: 'Ethiopian', gender: 'Female', age: 35, dateOfBirth: '1990-11-15', phone: '+251914567890', email: 'amina.a@example.com', address: 'Adama, Ethiopia', emergencyContact: 'Ahmed Seid', emergencyPhone: '+251914567891', destination: 'Umrah', season: '2026', groupId: 'GRP-003', groupName: 'Umrah Business Group', status: 'medical_clearance', registrationDate: '2024-02-01',
      documents: { passport: true, visa: false, healthCertificate: true, insurance: false, consent: true },
      medical: { status: 'pending', lastCheckup: '2024-02-28', doctorName: 'Dr. Genet Damtew', notes: 'Additional tests required' },
      payment: { total: 45000, paid: 20000, pending: 25000, status: 'partial' }
    },
  ];

  const filteredPilgrims = pilgrims.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-slate-100 text-slate-700',
      documents_pending: 'bg-yellow-100 text-yellow-800',
      requirements_met: 'bg-blue-100 text-blue-800',
      medical_clearance: 'bg-indigo-100 text-indigo-800',
      visa_approved: 'bg-purple-100 text-purple-800',
      ready_for_travel: 'bg-emerald-100 text-emerald-800',
      deployed: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-purple-200 bg-purple-50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              Pilgrim Details
            </h1>
            <p className="mt-2 text-slate-600">View and manage individual pilgrim profiles, documents, and status</p>
          </div>
          <Link href="/hajj-umrah" className="flex items-center gap-2 text-purple-600 hover:text-purple-800">
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Overview
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-800">{pilgrims.length}</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Total Pilgrims</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800">2</p>
          <p className="text-sm font-medium text-green-700 mt-1">Approved</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-800">1</p>
          <p className="text-sm font-medium text-yellow-700 mt-1">Pending</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-800">1</p>
          <p className="text-sm font-medium text-blue-700 mt-1">In Progress</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, passport, or group..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pilgrims List */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-ink">All Pilgrims</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredPilgrims.map((pilgrim) => (
              <div 
                key={pilgrim.id} 
                className={`p-4 hover:bg-slate-50 cursor-pointer ${selectedPilgrim?.id === pilgrim.id ? 'bg-purple-50' : ''}`}
                onClick={() => setSelectedPilgrim(pilgrim)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                      pilgrim.destination === 'Hajj' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {pilgrim.gender === 'Male' ? 'M' : 'F'}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{pilgrim.name}</p>
                      <p className="text-sm text-slate-500">{pilgrim.passportNumber} • {pilgrim.age} years</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(pilgrim.status)}`}>
                      {pilgrim.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{pilgrim.groupName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilgrim Detail Card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {selectedPilgrim ? (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`h-16 w-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold ${
                  selectedPilgrim.destination === 'Hajj' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {selectedPilgrim.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="mt-3 text-xl font-bold text-ink">{selectedPilgrim.name}</h3>
                <p className="text-sm text-slate-500">{selectedPilgrim.passportNumber}</p>
                <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(selectedPilgrim.status)}`}>
                  {selectedPilgrim.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-ink border-b border-slate-100 pb-2">Personal Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Age:</span> <span className="font-medium">{selectedPilgrim.age}</span></div>
                  <div><span className="text-slate-500">Gender:</span> <span className="font-medium">{selectedPilgrim.gender}</span></div>
                  <div><span className="text-slate-500">DOB:</span> <span className="font-medium">{selectedPilgrim.dateOfBirth}</span></div>
                  <div><span className="text-slate-500">Nationality:</span> <span className="font-medium">{selectedPilgrim.nationality}</span></div>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Address:</span> <span className="font-medium">{selectedPilgrim.address}</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Phone:</span> <span className="font-medium">{selectedPilgrim.phone}</span>
                </div>
                {selectedPilgrim.email && (
                  <div className="text-sm">
                    <span className="text-slate-500">Email:</span> <span className="font-medium">{selectedPilgrim.email}</span>
                  </div>
                )}
              </div>

              {/* Trip Info */}
              <div className="space-y-3 mt-4">
                <h4 className="font-semibold text-ink border-b border-slate-100 pb-2">Trip Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Type:</span> <span className={`font-medium ${selectedPilgrim.destination === 'Hajj' ? 'text-amber-600' : 'text-blue-600'}`}>{selectedPilgrim.destination}</span></div>
                  <div><span className="text-slate-500">Season:</span> <span className="font-medium">{selectedPilgrim.season}</span></div>
                  <div><span className="text-slate-500">Group:</span> <span className="font-medium">{selectedPilgrim.groupId}</span></div>
                  <div><span className="text-slate-500">Registered:</span> <span className="font-medium">{selectedPilgrim.registrationDate}</span></div>
                </div>
              </div>

              {/* Documents Status */}
              <div className="space-y-3 mt-4">
                <h4 className="font-semibold text-ink border-b border-slate-100 pb-2">Documents</h4>
                <div className="space-y-2">
                  {Object.entries(selectedPilgrim.documents).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {value ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Status */}
              <div className="space-y-3 mt-4">
                <h4 className="font-semibold text-ink border-b border-slate-100 pb-2">Medical Status</h4>
                <div className="text-sm">
                  <span className="text-slate-500">Status:</span> <span className={`font-medium ${
                    selectedPilgrim.medical.status === 'cleared' ? 'text-green-600' : 
                    selectedPilgrim.medical.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{selectedPilgrim.medical.status}</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Doctor:</span> <span className="font-medium">{selectedPilgrim.medical.doctorName}</span>
                </div>
                {selectedPilgrim.medical.notes && (
                  <div className="text-sm">
                    <span className="text-slate-500">Notes:</span> <span className="font-medium">{selectedPilgrim.medical.notes}</span>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="space-y-3 mt-4">
                <h4 className="font-semibold text-ink border-b border-slate-100 pb-2">Payment</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="text-slate-500">Total</p>
                    <p className="font-bold text-ink">{selectedPilgrim.payment.total.toLocaleString()} ETB</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-slate-500">Paid</p>
                    <p className="font-bold text-green-600">{selectedPilgrim.payment.paid.toLocaleString()} ETB</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <p className="text-slate-500">Pending</p>
                    <p className="font-bold text-yellow-600">{selectedPilgrim.payment.pending.toLocaleString()} ETB</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50">
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Select a pilgrim to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}