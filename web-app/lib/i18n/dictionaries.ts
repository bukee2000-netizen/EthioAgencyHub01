import type { SupportedLanguageCode } from '@/config/languages';

export type Dictionary = {
  common: {
    dashboard: string; employees: string; documents: string; travel: string;
    hajjUmrah: string; institutions: string; agents: string; administration: string;
    reporting: string; settings: string; signIn: string; signOut: string;
    language: string; billing: string; register: string; search: string;
    save: string; cancel: string; delete: string; edit: string; view: string;
    download: string; upload: string; export: string; filter: string;
    status: string; type: string; date: string; actions: string; all: string;
    active: string; pending: string; approved: string; rejected: string;
    submit: string; confirm: string; back: string; next: string; close: string;
  };
  travel: {
    commandCenter: string; schedule: string; tickets: string;
    todayDepartures: string; departurePrep: string; arrival: string;
    bookFlight: string; checkIn: string; boarded: string; noShow: string;
  };
  documents: {
    upload: string; visa: string; mols: string; missingReport: string;
    crossMatch: string; documentType: string; expiryDate: string;
  };
  agents: {
    overview: string; contracts: string; cvPipeline: string;
    financials: string; training: string; inCountryStaff: string;
  };
  billing: {
    title: string; subtitle: string; monthly: string; quarterly: string; yearly: string;
  };
};

const en: Dictionary = {
  common: {
    dashboard: 'Dashboard', employees: 'Employees', documents: 'Documents',
    travel: 'Travel', hajjUmrah: 'Hajj & Umrah', institutions: 'Institutions',
    agents: 'Agents', administration: 'Administration', reporting: 'Reporting',
    settings: 'Settings', signIn: 'Sign in', signOut: 'Sign out',
    language: 'Language', billing: 'Billing', register: 'Register',
    search: 'Search', save: 'Save', cancel: 'Cancel', delete: 'Delete',
    edit: 'Edit', view: 'View', download: 'Download', upload: 'Upload',
    export: 'Export', filter: 'Filter', status: 'Status', type: 'Type',
    date: 'Date', actions: 'Actions', all: 'All', active: 'Active',
    pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    submit: 'Submit', confirm: 'Confirm', back: 'Back', next: 'Next',
    close: 'Close',
  },
  travel: {
    commandCenter: 'Command Center', schedule: 'Schedule', tickets: 'Tickets',
    todayDepartures: "Today's Departures", departurePrep: 'Departure Prep',
    arrival: 'Arrival', bookFlight: 'Book Flight', checkIn: 'Check In',
    boarded: 'Boarded', noShow: 'No Show',
  },
  documents: {
    upload: 'Upload Documents', visa: 'Visa Management', mols: 'MOLS Processing',
    missingReport: 'Missing Reports', crossMatch: 'Cross-Match',
    documentType: 'Document Type', expiryDate: 'Expiry Date',
  },
  agents: {
    overview: 'Overview', contracts: 'Contracts', cvPipeline: 'CV Pipeline',
    financials: 'Financials', training: 'Training & Support',
    inCountryStaff: 'In-Country Staff',
  },
  billing: {
    title: 'Subscription plans', subtitle: 'Plans priced in Ethiopian Birr',
    monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly',
  },
};

const am: Dictionary = {
  common: {
    dashboard: 'ዳሽቦርድ', employees: 'ሰራተኞች', documents: 'ሰነዶች',
    travel: 'ጉዞ', hajjUmrah: 'ሐጅ እና ዑምራ', institutions: 'ተቋማት',
    agents: 'ወኪሎች', administration: 'አስተዳደር', reporting: 'ሪፖርት',
    settings: 'ቅንጅቶች', signIn: 'ግባ', signOut: 'ውጣ',
    language: 'ቋንቋ', billing: 'ክፍያ', register: 'ምዝገባ',
    search: 'ፈልግ', save: 'አስቀምጥ', cancel: 'ሰርዝ', delete: 'ሰርዝ',
    edit: 'አስተካክል', view: 'እይ', download: 'አውርድ', upload: 'ጫን',
    export: 'ላክ', filter: 'አጣራ', status: 'ሁኔታ', type: 'አይነት',
    date: 'ቀን', actions: 'ተግባራት', all: 'ሁሉም', active: 'ንቁ',
    pending: 'በመጠባበቅ ላይ', approved: 'ጸድቋል', rejected: 'ውድቅ ሆኗል',
    submit: 'ላክ', confirm: 'አረጋግጥ', back: 'ተመለስ', next: 'ቀጣይ',
    close: 'ዝጋ',
  },
  travel: {
    commandCenter: 'የትእዛዝ ማዕከል', schedule: 'መርሐግብር', tickets: 'ቲኬቶች',
    todayDepartures: 'የዛሬ መነሻዎች', departurePrep: 'የመነሻ ዝግጅት',
    arrival: 'መድረስ', bookFlight: 'በረራ ቀጠሮ', checkIn: 'ፍተሻ',
    boarded: 'ተሳፍሯል', noShow: 'አልተገኘም',
  },
  documents: {
    upload: 'ሰነዶች ጫን', visa: 'ቪዛ አስተዳደር', mols: 'MOLS ሂደት',
    missingReport: 'የጎደሉ ሪፖርቶች', crossMatch: 'ማስተካከያ',
    documentType: 'የሰነድ አይነት', expiryDate: 'የማለቂያ ቀን',
  },
  agents: {
    overview: 'አጠቃላይ እይታ', contracts: 'ኮንትራቶች', cvPipeline: 'CV ቧንቧ',
    financials: 'ፋይናንስ', training: 'ስልጠና እና ድጋፍ',
    inCountryStaff: 'የአገር ውስጥ ሰራተኞች',
  },
  billing: {
    title: 'የደንበኝነት ምዝገባ እቅዶች', subtitle: 'በኢትዮጵያ ብር የሚከፈል',
    monthly: 'ወርሃዊ', quarterly: 'ሩብ ዓመት', yearly: 'ዓመታዊ',
  },
};

const om: Dictionary = {
  common: {
    dashboard: 'Gabatee', employees: 'Hojjettoota', documents: 'Galmee',
    travel: 'Imala', hajjUmrah: 'Hajjii fi Umraa', institutions: 'Dhaabbilee',
    agents: 'Bakka Bu\'oota', administration: 'Bulchiinsa', reporting: 'Gabaasa',
    settings: 'Qindaa\'ina', signIn: 'Seeni', signOut: 'Ba\'i',
    language: 'Afaan', billing: 'Kaffaltii', register: 'Galmeessi',
    search: 'Barbaadi', save: 'Qusi', cancel: 'Haqi', delete: 'Haqi',
    edit: 'Fooyyessi', view: 'Ilaali', download: 'Buusi', upload: 'Feedi',
    export: 'Ergi', filter: 'Calasi', status: 'Haala', type: 'Gosa',
    date: 'Guyyaa', actions: 'Gochaalee', all: 'Hunda', active: 'Sochooftuu',
    pending: 'Eegaa', approved: 'Mirkanaa\'e', rejected: 'Didame',
    submit: 'Ergi', confirm: 'Mirkaneessi', back: 'Duubi', next: 'Itti aanu',
    close: 'Cufi',
  },
  travel: {
    commandCenter: 'Buufata Ajaja', schedule: 'Karoora', tickets: 'Tikeetota',
    todayDepartures: 'Ba\'ii Har\'aa', departurePrep: 'Qophii Ba\'ii',
    arrival: 'Ga\'ii',     bookFlight: 'Balaliina Cophii', checkIn: 'Galmee Seenaa',
    boarded: 'Yaabbate', noShow: 'Hin Mul\'anne',
  },
  documents: {
    upload: 'Galmee Feedi', visa: 'Visa Bulchiinsa', mols: 'MOLS Hojiirraa',
    missingReport: 'Gabaasa Dhabamte', crossMatch: 'Madaallii',
    documentType: 'Gosa Galmee', expiryDate: 'Guyyaa Xumuraa',
  },
  agents: {
    overview: 'Yaala Waliigala', contracts: 'Waligaltee', cvPipeline: 'CV Tuubi',
    financials: 'Maallaqa', training: 'Leenjii fi Gargaarsa',
    inCountryStaff: 'Hojjettota Biyyaa Keessaa',
  },
  billing: {
    title: 'Karoora Galmee', subtitle: 'Gatiin Birrii Itoophiyaatiin',
    monthly: 'Ji\'aan', quarterly: 'Kurmaanaan', yearly: 'Waggaan',
  },
};

const ar: Dictionary = {
  common: {
    dashboard: 'لوحة التحكم', employees: 'الموظفون', documents: 'المستندات',
    travel: 'السفر', hajjUmrah: 'الحج والعمرة', institutions: 'المؤسسات',
    agents: 'الوكلاء', administration: 'الإدارة', reporting: 'التقارير',
    settings: 'الإعدادات', signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج',
    language: 'اللغة', billing: 'الفوترة', register: 'تسجيل',
    search: 'بحث', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف',
    edit: 'تعديل', view: 'عرض', download: 'تنزيل', upload: 'رفع',
    export: 'تصدير', filter: 'تصفية', status: 'الحالة', type: 'النوع',
    date: 'التاريخ', actions: 'الإجراءات', all: 'الكل', active: 'نشط',
    pending: 'قيد الانتظار', approved: 'موافق عليه', rejected: 'مرفوض',
    submit: 'إرسال', confirm: 'تأكيد', back: 'رجوع', next: 'التالي',
    close: 'إغلاق',
  },
  travel: {
    commandCenter: 'مركز القيادة', schedule: 'الجدول', tickets: 'التذاكر',
    todayDepartures: 'مغادرات اليوم', departurePrep: 'تحضير المغادرة',
    arrival: 'الوصول', bookFlight: 'حجز رحلة', checkIn: 'تسجيل الوصول',
    boarded: 'على متن الطائرة', noShow: 'لم يحضر',
  },
  documents: {
    upload: 'رفع المستندات', visa: 'إدارة التأشيرات', mols: 'معالجة MOLS',
    missingReport: 'تقارير المفقودة', crossMatch: 'المطابقة التقاطعية',
    documentType: 'نوع المستند', expiryDate: 'تاريخ الانتهاء',
  },
  agents: {
    overview: 'نظرة عامة', contracts: 'العقود', cvPipeline: 'خط أنابيب السير الذاتية',
    financials: 'المالية', training: 'التدريب والدعم',
    inCountryStaff: 'الموظفون في البلد',
  },
  billing: {
    title: 'خطط الاشتراك', subtitle: 'الأسعار بالبر الإثيوبي',
    monthly: 'شهري', quarterly: 'ربع سنوي', yearly: 'سنوي',
  },
};

export const dictionaries: Record<SupportedLanguageCode, Dictionary> = { en, am, om, ar };

export function getDictionary(code: SupportedLanguageCode): Dictionary {
  return dictionaries[code] ?? dictionaries.en;
}
