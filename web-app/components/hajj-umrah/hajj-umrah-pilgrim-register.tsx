'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Plus, Edit, Trash2, Save, X, Upload, FileText, 
  Camera, Calendar, Phone, Mail, MapPin, Heart, Sun, Moon,
  CheckCircle2, AlertCircle, Clock, UploadCloud, Image, File, Download,
  ChevronDown, ChevronUp, Shield, Activity, Briefcase, Eye, IdCard
} from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

interface PilgrimDocument {
  id: string;
  type: 'passport' | 'visa' | 'health_certificate' | 'vaccination' | 'insurance' | 'consent' | 'photo' | 'other';
  fileName: string;
  fileUrl?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadDate?: string;
  verifiedDate?: string;
  notes?: string;
}

interface Pilgrim {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportType: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuePlace: string;
  issuingAuthority: string;
  fatherName: string;
  motherName: string;
  previousPassportNumber: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  region: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  destination: 'Hajj' | 'Umrah';
  season: string;
  groupId?: string;
  groupName?: string;
  status: 'registered' | 'documents_pending' | 'requirements_met' | 'medical_cleared' | 'visa_approved' | 'ready' | 'deployed';
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
  documents: PilgrimDocument[];
}

interface PilgrimFormData {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportType: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuePlace: string;
  issuingAuthority: string;
  fatherName: string;
  motherName: string;
  previousPassportNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  destination: 'Hajj' | 'Umrah';
  season: string;
  groupId: string;
}

interface HajjUmrahPilgrimRegisterProps {
  openNewRegistration?: boolean;
}

export function HajjUmrahPilgrimRegister({ openNewRegistration = false }: HajjUmrahPilgrimRegisterProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [telegramConfigured, setTelegramConfigured] = useState(true);
  const [whatsappConfigured, setWhatsappConfigured] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(openNewRegistration);

  useEffect(() => {
    if (openNewRegistration) {
      setIsModalOpen(true);
    }
  }, [openNewRegistration]);

  useEffect(() => {
    checkTelegramConfig();
  }, []);

  const checkTelegramConfig = async () => {
    try {
      const res = await fetch('/api/telegram/upload', { method: 'GET' });
      const data = await res.json();
      setTelegramConfigured(data.success !== false);
    } catch {
      setTelegramConfigured(false);
    }

    try {
      const res = await fetch('/api/whatsapp/send', { method: 'GET' });
      setWhatsappConfigured(res.status !== 503);
    } catch {
      setWhatsappConfigured(false);
    }
  };

  const sendWhatsAppNotification = async (type: string, phone: string, name: string, data?: Record<string, string>) => {
    try {
      await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          templateType: type,
          pilgrimName: name,
          additionalData: data,
        }),
      });
    } catch (error) {
      console.error('WhatsApp notification error:', error);
      addToast({ title: 'Error', description: 'Failed to send WhatsApp notification.', type: 'error' });
    }
  };
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPilgrim, setSelectedPilgrim] = useState<Pilgrim | null>(null);
  const [editingPilgrimId, setEditingPilgrimId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'passport' | 'documents'>('info');
  const [documentUploadProgress, setDocumentUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

  const [formData, setFormData] = useState<PilgrimFormData>({
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: 'Ethiopian',
    passportNumber: '',
    passportType: 'Regular',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuePlace: '',
    issuingAuthority: '',
    fatherName: '',
    motherName: '',
    previousPassportNumber: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    region: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    destination: 'Hajj',
    season: '2026',
    groupId: '',
  });

  useEffect(() => {
    loadPilgrims();
  }, []);

  const loadPilgrims = () => {
    const mockPilgrims: Pilgrim[] = [
      {
        id: 'P001', firstName: 'Ahmed', lastName: 'Hassan Mohammed', gender: 'male', dateOfBirth: '1980-05-20', placeOfBirth: 'Addis Ababa', nationality: 'Ethiopian',
        passportNumber: 'EP123456', passportType: 'Regular', passportIssueDate: '2023-06-15', passportExpiryDate: '2028-06-14', passportIssuePlace: 'Addis Ababa', issuingAuthority: 'Immigration & Visa Service', fatherName: 'Mohammed Ahmed', motherName: 'Aisha Mohammed', previousPassportNumber: '', phone: '+251911234567', email: 'ahmed.h@example.com', address: 'Kolfe Keranio', city: 'Addis Ababa', region: 'Addis Ababa', emergencyContactName: 'Fatima Ahmed', emergencyContactPhone: '+251911234568', emergencyContactRelation: 'Wife', destination: 'Hajj', season: '2026', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'ready', registrationDate: '2024-01-10', createdAt: '2024-01-10', updatedAt: '2024-02-15',
        documents: [
          { id: 'D001', type: 'passport', fileName: 'passport_ahmed.pdf', status: 'verified', uploadDate: '2024-01-15', verifiedDate: '2024-01-16' },
          { id: 'D002', type: 'visa', fileName: 'visa_ahmed.pdf', status: 'verified', uploadDate: '2024-02-01', verifiedDate: '2024-02-02' },
          { id: 'D003', type: 'health_certificate', fileName: 'health_ahmed.pdf', status: 'verified', uploadDate: '2024-02-10', verifiedDate: '2024-02-11' },
        ]
      },
      {
        id: 'P002', firstName: 'Fatima', lastName: 'Ibrahim Ali', gender: 'female', dateOfBirth: '1987-08-12', placeOfBirth: 'Dire Dawa', nationality: 'Ethiopian',
        passportNumber: 'EP234567', passportType: 'Regular', passportIssueDate: '2023-09-20', passportExpiryDate: '2029-09-19', passportIssuePlace: 'Dire Dawa', issuingAuthority: 'Immigration & Visa Service', fatherName: 'Ibrahim Ali', motherName: 'Zainab Ali', previousPassportNumber: '', phone: '+251912345678', email: 'fatima.i@example.com', address: 'Sheger', city: 'Dire Dawa', region: 'Dire Dawa', emergencyContactName: 'Ibrahim Ali', emergencyContactPhone: '+251912345679', emergencyContactRelation: 'Husband', destination: 'Umrah', season: '2026', groupId: 'GRP-002', groupName: 'Ramadan Umrah 2026', status: 'visa_approved', registrationDate: '2024-01-15', createdAt: '2024-01-15', updatedAt: '2024-02-20',
        documents: [
          { id: 'D004', type: 'passport', fileName: 'passport_fatima.pdf', status: 'verified', uploadDate: '2024-01-20', verifiedDate: '2024-01-21' },
          { id: 'D005', type: 'visa', fileName: 'visa_fatima.pdf', status: 'uploaded', uploadDate: '2024-02-15' },
        ]
      },
      {
        id: 'P003', firstName: 'Ibrahim', lastName: 'Mohamed Tessema', gender: 'male', dateOfBirth: '1973-02-28', placeOfBirth: 'Hawassa', nationality: 'Ethiopian',
        passportNumber: 'EP345678', passportType: 'Regular', passportIssueDate: '2022-11-10', passportExpiryDate: '2027-11-09', passportIssuePlace: 'Addis Ababa', issuingAuthority: 'Immigration & Visa Service', fatherName: 'Mohamed Tessema', motherName: 'Hawa Mohamed', previousPassportNumber: '', phone: '+251913456789', email: 'ibrahim.m@example.com', address: 'Bole', city: 'Addis Ababa', region: 'Addis Ababa', emergencyContactName: 'Amina Mohamed', emergencyContactPhone: '+251913456780', emergencyContactRelation: 'Wife', destination: 'Hajj', season: '2026', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'requirements_met', registrationDate: '2024-01-20', createdAt: '2024-01-20', updatedAt: '2024-01-25',
        documents: [
          { id: 'D006', type: 'passport', fileName: 'passport_ibrahim.pdf', status: 'verified', uploadDate: '2024-01-25', verifiedDate: '2024-01-26' },
        ]
      },
      {
        id: 'P004', firstName: 'Amina', lastName: 'Ahmed Seid', gender: 'female', dateOfBirth: '1990-11-15', placeOfBirth: 'Adama', nationality: 'Ethiopian',         passportNumber: 'EP456789', passportType: 'Regular', passportIssueDate: '2023-08-05', passportExpiryDate: '2028-08-04', passportIssuePlace: 'Adama', issuingAuthority: 'Immigration & Visa Service', fatherName: 'Ahmed Seid', motherName: 'Khadija Ahmed', previousPassportNumber: '', phone: '+251914567890', email: 'amina.a@example.com', address: 'Central', city: 'Adama', region: 'Oromia', emergencyContactName: 'Ahmed Seid', emergencyContactPhone: '+251914567891', emergencyContactRelation: 'Father', destination: 'Umrah', season: '2026', groupId: 'GRP-003', groupName: 'Umrah Business Group', status: 'documents_pending', registrationDate: '2024-02-01', createdAt: '2024-02-01', updatedAt: '2024-02-01',
        documents: [
          { id: 'D007', type: 'passport', fileName: 'passport_amina.pdf', status: 'verified', uploadDate: '2024-02-01', verifiedDate: '2024-02-02' },
        ]
      },
    ];
    setPilgrims(mockPilgrims);
  };

  const filteredPilgrims = pilgrims.filter(p => 
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200',
      documents_pending: 'bg-yellow-100 text-yellow-800',
      requirements_met: 'bg-blue-100 text-blue-800',
      medical_cleared: 'bg-indigo-100 text-indigo-800',
      visa_approved: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      deployed: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200';
  };

  const handleOpenModal = (pilgrim?: Pilgrim) => {
    if (pilgrim) {
      setEditingPilgrimId(pilgrim.id);
      setFormData({
        firstName: pilgrim.firstName,
        lastName: pilgrim.lastName,
        gender: pilgrim.gender,
        dateOfBirth: pilgrim.dateOfBirth,
        placeOfBirth: pilgrim.placeOfBirth,
        nationality: pilgrim.nationality,
        passportNumber: pilgrim.passportNumber,
        passportType: pilgrim.passportType || 'Regular',
        passportIssueDate: pilgrim.passportIssueDate,
        passportExpiryDate: pilgrim.passportExpiryDate,
        passportIssuePlace: pilgrim.passportIssuePlace,
        issuingAuthority: pilgrim.issuingAuthority || '',
        fatherName: pilgrim.fatherName || '',
        motherName: pilgrim.motherName || '',
        previousPassportNumber: pilgrim.previousPassportNumber || '',
        phone: pilgrim.phone,
        email: pilgrim.email || '',
        address: pilgrim.address,
        city: pilgrim.city,
        region: pilgrim.region,
        emergencyContactName: pilgrim.emergencyContactName,
        emergencyContactPhone: pilgrim.emergencyContactPhone,
        emergencyContactRelation: pilgrim.emergencyContactRelation,
        destination: pilgrim.destination,
        season: pilgrim.season,
        groupId: pilgrim.groupId || '',
      });
    } else {
      setEditingPilgrimId(null);
      setFormData({
        firstName: '', lastName: '', gender: 'male', dateOfBirth: '',
        placeOfBirth: '', nationality: 'Ethiopian', passportNumber: '',
        passportType: 'Regular', passportIssueDate: '', passportExpiryDate: '',
        passportIssuePlace: '', issuingAuthority: '', fatherName: '', motherName: '', previousPassportNumber: '',
        phone: '', email: '', address: '', city: '', region: '',
        emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
        destination: 'Hajj', season: '2026', groupId: '',
      });
    }
    setIsModalOpen(true);
    setActiveTab('info');
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.passportNumber || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingPilgrimId) {
      setPilgrims(prev => prev.map(p => {
        if (p.id === editingPilgrimId) {
          return {
            ...p,
            ...formData,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }));
      setIsModalOpen(false);
      setEditingPilgrimId(null);
    } else {
      const newPilgrim: Pilgrim = {
        id: `P${String(pilgrims.length + 1).padStart(3, '0')}`,
        ...formData,
        groupName: formData.groupId ? groups.find(g => g.id === formData.groupId)?.name : undefined,
        status: 'registered',
        registrationDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
      };
      setPilgrims(prev => [...prev, newPilgrim]);
      
      sendWhatsAppNotification(
        'registration',
        formData.phone,
        `${formData.firstName} ${formData.lastName}`,
        {
          pilgrimId: newPilgrim.id,
          destination: formData.destination,
          season: formData.season,
          groupName: newPilgrim.groupName || 'Not assigned',
        }
      );
    }

    setIsModalOpen(false);
    setEditingPilgrimId(null);
  };

  const handleDelete = (pilgrimId: string) => {
    setPilgrims(prev => prev.filter(p => p.id !== pilgrimId));
    setIsDeleteConfirmOpen(false);
    setSelectedPilgrim(null);
  };

  const uploadToTelegram = async (pilgrimId: string, docType: string, file: File): Promise<{ success: boolean; fileId?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pilgrimId', pilgrimId);
      formData.append('docType', docType);

      const response = await fetch('/api/telegram/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      addToast({ title: 'Error', description: 'Failed to upload file. Please try again.', type: 'error' });
      return { success: false, error: 'Upload failed' };
    }
  };

  const handleDocumentUpload = async (pilgrimId: string, docType: string, file: File) => {
    setDocumentUploadProgress(prev => ({ ...prev, [docType]: 10 }));
    setIsUploading(prev => ({ ...prev, [docType]: true }));
    setUploadError(prev => ({ ...prev, [docType]: '' }));

    try {
      const result = await uploadToTelegram(pilgrimId, docType, file);

      if (result.success) {
        setDocumentUploadProgress(prev => ({ ...prev, [docType]: 100 }));

        const pilgrim = pilgrims.find(p => p.id === pilgrimId);
        
        setPilgrims(prev => prev.map(p => {
          if (p.id === pilgrimId) {
            const existingDoc = p.documents.find(d => d.type === docType);
            if (existingDoc) {
              return {
                ...p,
                documents: p.documents.map(d => 
                  d.type === docType 
                    ? { ...d, fileName: file.name, status: 'uploaded', uploadDate: new Date().toISOString().split('T')[0] }
                    : d
                ),
              };
            } else {
              return {
                ...p,
                documents: [...p.documents, {
                  id: `D${Date.now()}`,
                  type: docType as PilgrimDocument['type'],
                  fileName: file.name,
                  fileUrl: result.fileId,
                  status: 'uploaded',
                  uploadDate: new Date().toISOString().split('T')[0],
                }],
              };
            }
          }
          return p;
        }));

        if (pilgrim) {
          const docLabels: Record<string, string> = {
            passport: 'Passport',
            visa: 'Visa',
            health_certificate: 'Health Certificate',
            vaccination: 'Vaccination',
            insurance: 'Insurance',
            consent: 'Consent Form',
            photo: 'Photo',
          };
          sendWhatsAppNotification(
            'document_uploaded',
            pilgrim.phone,
            `${pilgrim.firstName} ${pilgrim.lastName}`,
            {
              documentType: docLabels[docType] || docType,
              documentName: file.name,
            }
          );
        }
      } else {
        setUploadError(prev => ({ ...prev, [docType]: result.error || 'Upload failed' }));
        setDocumentUploadProgress(prev => ({ ...prev, [docType]: 0 }));
      }
    } catch (error) {
      setUploadError(prev => ({ ...prev, [docType]: 'Upload failed' }));
      setDocumentUploadProgress(prev => ({ ...prev, [docType]: 0 }));
    } finally {
      setIsUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const groups = [
    { id: 'GRP-001', name: 'Hajj 2026 - Group A' },
    { id: 'GRP-002', name: 'Ramadan Umrah 2026' },
    { id: 'GRP-003', name: 'Umrah Business Group' },
    { id: 'GRP-004', name: 'Hajj 2026 - Group B' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-3">
              <Users className="h-7 w-7 text-purple-600" />
              Pilgrim Registration & Management
              {telegramConfigured && whatsappConfigured ? (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3" /> All Connected
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                  <AlertCircle className="h-3 w-3" /> Setup Pending
                </span>
              )}
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Register, edit, delete pilgrims and manage their documents. 
              Documents are securely stored in a private Telegram channel.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Register New Pilgrim
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, passport, phone, or group..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Pilgrims Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPilgrims.map((pilgrim) => (
          <div key={pilgrim.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  pilgrim.destination === 'Hajj' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {pilgrim.firstName[0]}{pilgrim.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-ink dark:text-ink-dark">{pilgrim.firstName} {pilgrim.lastName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{pilgrim.passportNumber}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(pilgrim.status)}`}>
                {pilgrim.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                {pilgrim.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-slate-400" />
                {pilgrim.city}, {pilgrim.region}
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                {pilgrim.destination === 'Hajj' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-500" />}
                {pilgrim.destination} - {pilgrim.season}
              </div>
              {pilgrim.groupName && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Users className="h-4 w-4 text-slate-400" />
                  {pilgrim.groupName}
                </div>
              )}
            </div>

            {/* Document Status */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Documents: {pilgrim.documents.length} uploaded</p>
              <div className="flex gap-1">
                {['passport', 'visa', 'health_certificate', 'vaccination', 'insurance'].map((docType) => {
                  const doc = pilgrim.documents.find(d => d.type === docType);
                  return (
                    <div 
                      key={docType}
                      className={`h-2 flex-1 rounded-full ${
                        doc?.status === 'verified' ? 'bg-green-500' :
                        doc?.status === 'uploaded' ? 'bg-blue-500' :
                        'bg-slate-200'
                      }`}
                      title={docType.replace('_', ' ')}
                    />
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => { setSelectedPilgrim(pilgrim); setIsViewModalOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              <button 
                onClick={() => handleOpenModal(pilgrim)}
                className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button 
                onClick={() => { setSelectedPilgrim(pilgrim); setIsDeleteConfirmOpen(true); }}
                className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View/Edit/New Modal */}
      {isModalOpen && (isViewModalOpen ? selectedPilgrim : true) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
            <div className="sticky top-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                  selectedPilgrim ? (selectedPilgrim?.destination === 'Hajj' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600') : 'bg-purple-100 text-purple-600'
                }`}>
                  {selectedPilgrim ? (selectedPilgrim?.firstName?.[0] || '') + (selectedPilgrim?.lastName?.[0] || '') : 'NP'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink dark:text-ink-dark">{selectedPilgrim ? `${selectedPilgrim?.firstName} ${selectedPilgrim?.lastName}` : 'New Pilgrim Registration'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPilgrim ? selectedPilgrim?.passportNumber : 'Fill in the details below'}</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setIsViewModalOpen(false); setSelectedPilgrim(null); }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700 px-6">
              <nav className="flex gap-6">
                {[
                  { id: 'info', label: 'Personal Info', icon: Users },
                  { id: 'passport', label: 'Passport Details', icon: IdCard },
                  { id: 'documents', label: 'Documents', icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id 
                        ? 'border-purple-500 text-purple-600' 
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-ink dark:text-ink-dark mb-4">Basic Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">First Name *</label>
                          <input 
                            type="text" 
                            value={isModalOpen ? formData.firstName : selectedPilgrim?.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Last Name *</label>
                          <input 
                            type="text" 
                            value={isModalOpen ? formData.lastName : selectedPilgrim?.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Gender</label>
                          <select 
                            value={isModalOpen ? formData.gender : selectedPilgrim?.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Date of Birth *</label>
                          <input 
                            type="date" 
                            value={isModalOpen ? formData.dateOfBirth : selectedPilgrim?.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Place of Birth</label>
                          <input 
                            type="text" 
                            value={isModalOpen ? formData.placeOfBirth : (selectedPilgrim?.placeOfBirth || '')}
                            onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nationality</label>
                          <input 
                            type="text" 
                            value={isModalOpen ? formData.nationality : selectedPilgrim?.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-ink dark:text-ink-dark mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone *</label>
                        <input 
                          type="tel" 
                          value={isModalOpen ? formData.phone : (selectedPilgrim?.phone || '')}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={isModalOpen ? formData.email : selectedPilgrim?.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Address</label>
                        <input 
                          type="text" 
                          value={isModalOpen ? formData.address : selectedPilgrim?.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">City</label>
                          <input 
                            type="text" 
                            value={isModalOpen ? formData.city : selectedPilgrim?.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Region</label>
                          <input 
                            type="text" 
                            value={isModalOpen ? formData.region : selectedPilgrim?.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-ink dark:text-ink-dark mb-4">Emergency Contact</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Name</label>
                        <input 
                          type="text" 
                          value={isModalOpen ? formData.emergencyContactName : selectedPilgrim?.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                        <input 
                          type="tel" 
                          value={isModalOpen ? formData.emergencyContactPhone : selectedPilgrim?.emergencyContactPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Relation</label>
                        <input 
                          type="text" 
                          value={isModalOpen ? formData.emergencyContactRelation : selectedPilgrim?.emergencyContactRelation}
                          onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-ink dark:text-ink-dark mb-4">Trip Information</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Destination</label>
                        <select 
                          value={isModalOpen ? formData.destination : selectedPilgrim?.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value as any })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        >
                          <option value="Hajj">Hajj</option>
                          <option value="Umrah">Umrah</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Season</label>
                        <select 
                          value={isModalOpen ? formData.season : selectedPilgrim?.season}
                          onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        >
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Group</label>
                        <select 
                          value={isModalOpen ? formData.groupId : selectedPilgrim?.groupId || ''}
                          onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm disabled:bg-slate-100"
                        >
                          <option value="">Select Group</option>
                          {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'passport' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <IdCard className="h-6 w-6 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Passport Information</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1">Passport Number *</label>
                        <input 
                          type="text" 
                          value={isModalOpen ? formData.passportNumber : selectedPilgrim?.passportNumber}
                          onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100"
                          placeholder="EP123456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Issue Date</label>
                          <input 
                            type="date" 
                            value={isModalOpen ? formData.passportIssueDate : selectedPilgrim?.passportIssueDate}
                            onChange={(e) => setFormData({ ...formData, passportIssueDate: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Expiry Date *</label>
                          <input 
                            type="date" 
                            value={isModalOpen ? formData.passportExpiryDate : selectedPilgrim?.passportExpiryDate}
                            onChange={(e) => setFormData({ ...formData, passportExpiryDate: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1">Issue Place</label>
                        <input type="text" value={isModalOpen ? formData.passportIssuePlace : selectedPilgrim?.passportIssuePlace}
                          onChange={(e) => setFormData({ ...formData, passportIssuePlace: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1">Passport Type</label>
                        <select value={isModalOpen ? formData.passportType : selectedPilgrim?.passportType || 'Regular'}
                          onChange={(e) => setFormData({ ...formData, passportType: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100">
                          <option value="Regular">Regular</option>
                          <option value="Diplomatic">Diplomatic</option>
                          <option value="Service">Service</option>
                          <option value="Provisional">Provisional</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1">Issuing Authority</label>
                        <input type="text" value={isModalOpen ? formData.issuingAuthority : selectedPilgrim?.issuingAuthority || ''}
                          onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100" placeholder="e.g., Immigration & Visa Service" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Father's Name (as in passport)</label>
                          <input type="text" value={isModalOpen ? formData.fatherName : selectedPilgrim?.fatherName || ''}
                            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Mother's Name (as in passport)</label>
                          <input type="text" value={isModalOpen ? formData.motherName : selectedPilgrim?.motherName || ''}
                            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                            disabled={!isModalOpen}
                            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1">Previous Passport Number (if renewal)</label>
                        <input type="text" value={isModalOpen ? formData.previousPassportNumber : selectedPilgrim?.previousPassportNumber || ''}
                          onChange={(e) => setFormData({ ...formData, previousPassportNumber: e.target.value })}
                          disabled={!isModalOpen}
                          className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm disabled:bg-purple-100" placeholder="e.g., ET987654" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Camera className="h-6 w-6 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Passport Photo Upload</h4>
                    </div>
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center">
                      <UploadCloud className="h-10 w-10 mx-auto text-blue-400 mb-3" />
                      <p className="text-sm text-blue-700 mb-2">Drag and drop or click to upload</p>
                      <p className="text-xs text-blue-500">JPG, PNG up to 5MB</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { if (el) fileInputRefs.current['photo'] = el; }}
                        onChange={(e) => e.target.files?.[0] && selectedPilgrim && handleDocumentUpload(selectedPilgrim.id, 'photo', e.target.files[0])}
                      />
                      <button 
                        onClick={() => fileInputRefs.current['photo']?.click()}
                        className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  {[
                    { type: 'passport', label: 'Passport', icon: IdCard, required: true },
                    { type: 'visa', label: 'Visa', icon: FileText, required: true },
                    { type: 'health_certificate', label: 'Health Certificate', icon: Activity, required: true },
                    { type: 'vaccination', label: 'Vaccination Record', icon: Shield, required: true },
                    { type: 'insurance', label: 'Travel Insurance', icon: Briefcase, required: true },
                    { type: 'consent', label: 'Consent Form', icon: FileText, required: false },
                  ].map((doc) => {
                    const pilgrimDoc = selectedPilgrim?.documents?.find(d => d.type === doc.type);
                    const progress = documentUploadProgress[doc.type] || 0;
                    const isCurrentlyUploading = progress > 0 && progress < 100;

                    return (
                      <div key={doc.type} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                            <doc.icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                          </div>
                          <div>
                            <p className="font-medium text-ink dark:text-ink-dark">{doc.label}</p>
                            {pilgrimDoc && (
                              <p className="text-sm text-slate-500 dark:text-slate-400">{pilgrimDoc.fileName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {pilgrimDoc ? (
                            <>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                pilgrimDoc.status === 'verified' ? 'bg-green-100 text-green-700' :
                                pilgrimDoc.status === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                                pilgrimDoc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {pilgrimDoc.status}
                              </span>
                              {pilgrimDoc.status === 'uploaded' && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Telegram
                                </span>
                              )}
                              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="Download from Telegram">
                                <Download className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              </button>
                            </>
                          ) : isCurrentlyUploading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-24">
                                <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                              <span className="text-xs text-purple-600">Uploading to Telegram...</span>
                            </div>
                          ) : uploadError[doc.type] ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-600">{uploadError[doc.type]}</span>
                              <button 
                                onClick={() => fileInputRefs.current[doc.type]?.click()}
                                className="text-xs text-purple-600 underline"
                              >
                                Retry
                              </button>
                            </div>
                          ) : (
                            <>
                              <input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                ref={(el) => { if (el) fileInputRefs.current[doc.type] = el; }}
                                onChange={(e) => e.target.files?.[0] && selectedPilgrim && handleDocumentUpload(selectedPilgrim.id, doc.type, e.target.files[0])}
                              />
                              <button 
                                onClick={() => fileInputRefs.current[doc.type]?.click()}
                                className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-100"
                              >
                                <Upload className="h-4 w-4" />
                                Upload to Telegram
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => { setIsModalOpen(false); setIsViewModalOpen(false); setSelectedPilgrim(null); }}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800"
              >
                Cancel
              </button>
              {isModalOpen && (
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedPilgrim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark mb-2">Delete Pilgrim?</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Are you sure you want to delete <strong>{selectedPilgrim?.firstName} {selectedPilgrim?.lastName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => selectedPilgrim && handleDelete(selectedPilgrim.id)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}