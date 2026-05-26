'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle, Search, User, FileType, Loader2, Cloud, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  employee: string;
  size: string;
  status: 'Verified' | 'In Review' | 'Processing';
  type: string;
  route: 'teledrive' | 'telegram';
}

interface Employee {
  id: string;
  name: string;
}

export function DocumentsUpload() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [uploads, setUploads] = useState<UploadedFile[]>([
    { id: '1', name: 'mekdes_tesfaye_passport.pdf', employee: 'Mekdes Tesfaye', size: '2.4 MB', status: 'Verified', type: 'Passport', route: 'teledrive' },
    { id: '2', name: 'hana_bekele_medical.jpg', employee: 'Hana Bekele', size: '1.8 MB', status: 'In Review', type: 'Medical Certificate', route: 'teledrive' },
    { id: '3', name: 'selamawit_visa_form.pdf', employee: 'Selamawit Alemu', size: '890 KB', status: 'Processing', type: 'Visa Form', route: 'teledrive' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const docTypes = ['Passport', 'Medical Certificate', 'Visa Form', 'Contract', 'ID Card', 'Profile Photo'];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees?limit=1000');
        const data = await res.json();
        if (data.success && data.data) {
          setEmployees(data.data.map((emp: any) => ({ id: emp.id, name: emp.name })));
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredUploads = uploads.filter(u =>
    u.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEmployee || !selectedDocType) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', selectedDocType.toLowerCase().replace(/\s+/g, '-'));
    formData.append('caption', `${selectedEmployee} - ${selectedDocType}`);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (data.success) {
        setUploadProgress(100);
        
        const newUpload: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          employee: selectedEmployee,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'In Review',
          type: selectedDocType,
          route: data.data?.route || 'teledrive'
        };

        setUploads([newUpload, ...uploads]);
        
        setTimeout(() => {
          setUploading(false);
          setSelectedEmployee('');
          setSelectedDocType('');
          setUploadProgress(0);
        }, 1000);
      } else {
        setUploadError(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const canUpload = selectedEmployee && selectedDocType;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Upload Documents</h1>
        <p className="mt-2 text-slate-500">
          Securely assign and upload required documents to Teledrive cloud storage.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Form Configuration */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-ink mb-6">New Document Upload</h3>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">1. Select Employee</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500" />
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-white cursor-pointer"
                  disabled={loadingEmployees}
                >
                  <option value="" disabled>{loadingEmployees ? 'Loading employees...' : 'Choose an employee...'}</option>
                  {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">2. Document Type</label>
              <div className="relative">
                <FileType className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500" />
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none bg-white cursor-pointer"
                >
                  <option value="" disabled>Choose document type...</option>
                  {docTypes.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                </select>
              </div>
            </div>
          </div>

          <label className="block sm:hidden text-sm font-semibold text-slate-700 mb-2">3. Upload File</label>
          <div 
            className={`relative rounded-2xl border-2 border-dashed ${canUpload ? 'border-brand-300 bg-brand-50/30 hover:border-brand-400 hover:bg-brand-50 transition-colors cursor-pointer' : 'border-slate-200 bg-slate-50/50 opacity-70 cursor-not-allowed'} p-10 text-center`}
            onClick={() => canUpload && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              disabled={!canUpload || uploading}
            />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-brand-600 animate-spin mb-4" />
                <p className="text-lg font-bold text-ink">Uploading to Teledrive...</p>
                <div className="mt-4 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className={`rounded-full p-4 ${canUpload ? 'bg-brand-100 text-brand-600 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                    <Cloud className="h-8 w-8" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-ink">
                  {canUpload ? 'Click or drag file to upload' : 'Select an employee & document type first'}
                </h4>
                <p className="text-sm font-medium text-slate-500 mt-2">
                  Supports PDF, JPG, PNG up to 50MB • Files sync to Teledrive cloud
                </p>
              </>
            )}
            
            {canUpload && !uploading && (
              <p className="text-xs font-semibold text-brand-600 mt-4 bg-brand-100 inline-block px-3 py-1 rounded-full">
                Target: {selectedDocType} for {selectedEmployee}
              </p>
            )}
          </div>

          {uploadError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {uploadError}
              <button onClick={() => setUploadError(null)} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Context Stats / Info Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 className="h-5 w-5" /></div>
              <p className="text-sm font-bold text-slate-700">Today's Uploads</p>
            </div>
            <p className="text-4xl font-extrabold text-ink">{uploads.length}</p>
            <p className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
              <span className="text-lg leading-none">+</span> synced to cloud
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-700 mb-4">Storage Status</p>
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="h-5 w-5 text-brand-600" />
              <p className="text-3xl font-extrabold text-slate-800">Teledrive</p>
            </div>
            <p className="text-sm text-slate-500 mb-4">300 ETB/month • Unlimited storage</p>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-brand-500" style={{ width: '12.4%' }}></div>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500 flex justify-between">
              <span>12.4% Used</span>
              <span>1 TB Limit</span>
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Cloud className="h-5 w-5" />
              <p className="text-sm font-semibold">Auto-sync enabled</p>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Files upload to local folder and auto-sync to Ethio Telecom cloud via Teledrive Desktop.
            </p>
          </div>
        </div>
      </div>

      {/* Uploads History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm mt-8">
        <div className="border-b border-slate-200 px-6 py-5 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-ink">Recent Uploads History</h3>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee name or file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Storage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUploads.map((upload) => (
              <tr key={upload.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <span className="font-medium text-ink">{upload.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{upload.employee}</td>
                <td className="px-6 py-4 text-slate-600">{upload.type}</td>
                <td className="px-6 py-4 text-slate-600">{upload.size}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    upload.status === 'Verified' ? 'bg-green-100 text-green-700' :
                    upload.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {upload.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    upload.route === 'teledrive' ? 'text-brand-600' : 'text-purple-600'
                  }`}>
                    <Cloud className="h-3 w-3" />
                    {upload.route === 'teledrive' ? 'Teledrive' : 'Telegram'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUploads.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No uploads found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}