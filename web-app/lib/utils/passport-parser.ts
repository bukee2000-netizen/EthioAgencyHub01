// Passport OCR parsing utilities - Enhanced Version

export interface PassportData {
  surname?: string;
  givenNames?: string;
  nationality?: string;
  dateOfBirth?: string;
  sex?: string;
  passportNumber?: string;
  issuingCountry?: string;
  dateOfIssue?: string;
  dateOfExpiry?: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
}

/**
 * Normalize OCR text by fixing common OCR errors
 */
function normalizeText(text: string): string {
  return text
    .replace(/[|]/g, 'I')
    .replace(/0(?=\d{3})/g, 'O')
    .replace(/\b(surn|surnam|surna|surnme)\b/gi, 'surname')
    .replace(/\b(given|givn|givin)\b/gi, 'given names')
    .replace(/\b(nation|nationa)\b/gi, 'nationality')
    .replace(/\b(expir|expiry|expirat|expirtaion)\b/gi, 'expiry')
    .replace(/\b(issue|issu|isue)\b/gi, 'issue')
    .replace(/\b(passport|passprt|pasport)\b/gi, 'passport')
    .replace(/ETH[1Il]OplA/gi, 'ETHIOPIA')
    .replace(/\b(ETH[1Il]OPlAN)\b/gi, 'ETHIOPIAN')
    .trim();
}

/**
 * Flexible field extractor that tries multiple patterns
 */
function extractField(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 0) {
      return match[1].trim();
    }
  }
  return undefined;
}

/**
 * Parse passport OCR text and extract relevant data - Enhanced with multiple fallback patterns
 * Specifically tuned for Ethiopian passport format
 */
export function parsePassportData(ocrText: string): PassportData {
  const normalized = normalizeText(ocrText);
  const data: PassportData = {};

  // ---- SURNAME (Last Name) ----
  data.surname = extractField(normalized, [
    /(?:surname|sur name|family name|last name)\s*[:;#]\s*([A-Z][A-Za-z\s\-]{1,30})/i,
    /(?:surname|sur name|family name|last name)\s*(?:is|:)?\s*\n?\s*([A-Z][A-Za-z\s\-]{1,30})/i,
    /\n\s*([A-Z]{2,20})\s*\n\s*(?:[A-Z]{2,20})/,
    /Surname.*?\n.*?([A-Z]{2,20})(?=\s*\n|\s*Given)/i,
    // Ethiopian passport: "1. SURNAME" then value on next line
    /1\.\s*SURNAME\s*\n\s*([A-Z][A-Za-z\s\-]{1,30})/i,
    /SURNAME\s*\n\s*([A-Z][A-Za-z\s\-]{1,30})/i
  ]);

  // If still no surname, try to find all-caps name near top
  if (!data.surname) {
    const lines = normalized.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    for (const line of lines) {
      if (/^[A-Z]{2,20}$/.test(line) && !line.startsWith('P<')) {
        data.surname = line;
        break;
      }
    }
  }

  // ---- GIVEN NAMES (First Name) ----
  data.givenNames = extractField(normalized, [
    /(?:given names|given name|first name|prename|prenom)\s*[:;#]\s*([A-Z][A-Za-z\s\-]{1,40})/i,
    /(?:given names|given name|first name|prename|prenom)\s*(?:is|:)?\s*\n?\s*([A-Z][A-Za-z\s\-]{1,40})/i,
    /Given Names.*?\n.*?([A-Z]{2,20}(?:\s+[A-Z]{2,20})?)(?=\s*\n|\s*Nationality)/i,
    // Ethiopian passport: "2. GIVEN NAMES" then value on next line
    /2\.\s*GIVEN\s*NAMES?\s*\n\s*([A-Z][A-Za-z\s\-]{1,40})/i,
    /GIVEN\s*NAMES?\s*\n\s*([A-Z][A-Za-z\s\-]{1,40})/i
  ]);

  // ---- NATIONALITY ----
  data.nationality = extractField(normalized, [
    /(?:nationality|citizenship|nation)\s*[:;#]\s*([A-Z]{3,20})/i,
    /(?:nationality|citizenship|nation)\s*(?:is|:)?\s*\n?\s*([A-Z]{3,20})/i,
    /Ethiopian/i,
    /NATIONALITY\s*\n\s*([A-Z]{3,20})/i
  ]);
  if (data.nationality?.toLowerCase() === 'ethiopian') data.nationality = 'ETHIOPIAN';

  // ---- DATE OF BIRTH ----
  const dobRaw = extractField(normalized, [
    /(?:date of birth|dob|birth date|born)\s*[:;#]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(?:date of birth|dob|birth date|born)\s*[:;#]\s*(\d{4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,2})/i,
    /DOB.*?\n.*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(\d{2}[\/\.\-]\d{2}[\/\.\-]\d{4})\s*(?:\n|$|\s)/
  ]);
  if (dobRaw) data.dateOfBirth = formatDateToISO(dobRaw);

  // ---- SEX / GENDER ----
  const sexRaw = extractField(normalized, [
    /(?:sex|gender)\s*[:;#]\s*([MF])\b/i,
    /(?:sex|gender)\s*[:;#]\s*(Male|Female)\b/i,
    /\bSex\s*[:;#]?\s*\n?\s*([MF])\b/i
  ]);
  if (sexRaw) {
    const s = sexRaw.toUpperCase();
    data.sex = s === 'M' ? 'Male' : s === 'F' ? 'Female' : s;
  }

  // ---- PASSPORT NUMBER (Ethiopian: ET + 7 digits, e.g. ET1234567) ----
  data.passportNumber = extractField(normalized, [
    /(?:passport no|passport number|passport #|doc no|document number|pp no)\s*[:;#]\s*([A-Z]{1,2}\d{6,9})/i,
    /(?:passport no|passport number|passport #|doc no|document number|pp no)\s*[:;#]\s*([A-Z0-9]{6,12})/i,
    /\b(ET\d{6,9})\b/i,
    /\b(EP\d{6,9})\b/i,
    /\b(P\d{6,9})\b/i,
    /PASSPORT\s*NO\s*\.?\s*\n\s*([A-Z]{1,2}\d{6,9})/i,
    /Passport\s*No\s*[\.:]\s*\n\s*([A-Z]{1,2}\d{6,9})/i
  ]);

  // ---- EXPIRY DATE ----
  const expiryRaw = extractField(normalized, [
    /(?:date of expiry|expiry date|expires|valid until|valid thru)\s*[:;#]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(?:date of expiry|expiry date|expires|valid until|valid thru)\s*[:;#]\s*(\d{4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,2})/i,
    /Expiry.*?\n.*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i
  ]);
  if (expiryRaw) data.dateOfExpiry = formatDateToISO(expiryRaw);

  // ---- ISSUE DATE ----
  const issueRaw = extractField(normalized, [
    /(?:date of issue|issue date|issued|issued on)\s*[:;#]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /(?:date of issue|issue date|issued|issued on)\s*[:;#]\s*(\d{4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,2})/i
  ]);
  if (issueRaw) data.dateOfIssue = formatDateToISO(issueRaw);

  // ---- PLACE OF BIRTH ----
  data.placeOfBirth = extractField(normalized, [
    /(?:place of birth|birth place|pob|lieu de naissance)\s*[:;#]\s*([A-Z][A-Za-z\s]{2,30})/i,
    /(?:place of birth|birth place|pob|lieu de naissance)\s*\n\s*([A-Z][A-Za-z\s]{2,30})/i
  ]);

  // ---- FATHER'S NAME (Ethiopian passport field) ----
  data.fatherName = extractField(normalized, [
    /(?:father[\'s]* name|father|fathers name)\s*[:;#]\s*([A-Z][A-Za-z\s]{2,40})/i,
    /(?:father[\'s]* name|father|fathers name)\s*(?:is|:)?\s*\n?\s*([A-Z][A-Za-z\s]{2,40})/i,
    /FATHER\s*\n\s*([A-Z][A-Za-z\s]{2,40})/i
  ]);

  // ---- MOTHER'S NAME (Ethiopian passport field) ----
  data.motherName = extractField(normalized, [
    /(?:mother[\'s]* name|mother|mothers name)\s*[:;#]\s*([A-Z][A-Za-z\s]{2,40})/i,
    /(?:mother[\'s]* name|mother|mothers name)\s*(?:is|:)?\s*\n?\s*([A-Z][A-Za-z\s]{2,40})/i,
    /MOTHER\s*\n\s*([A-Z][A-Za-z\s]{2,40})/i
  ]);

  // ---- Fallback: Try MRZ format parsing ----
  if (!data.passportNumber || !data.surname || !data.givenNames) {
    parseMRZ(normalized, data);
  }

  return data;
}

/**
 * Parse Machine Readable Zone (MRZ) from passport
 * MRZ Line 1: P<ETHASSEFA<<ABEBE<<<<<<<<<<<<<<<<<<<<<<<<<<
 * MRZ Line 2: ET12345678ETH9005154M3005315<<<<<<<<<<<<<<04
 */
function parseMRZ(text: string, data: PassportData): void {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);

  for (const line of lines) {
    // MRZ Line 1 pattern: P< then country code, then surname << given names
    if (line.startsWith('P<') || line.startsWith('P<')) {
      const mrz = line.replace(/</g, ' ').trim();
      const parts = mrz.split(/\s+/).filter(p => p.length > 1);
      if (parts.length >= 3) {
        if (!data.surname && parts[1]) data.surname = parts[1];
        if (!data.givenNames && parts[2]) data.givenNames = parts.slice(2).join(' ');
      }
      continue;
    }

    // MRZ Line 2 pattern: passport number + country + DOB + sex + expiry
    const mrzLine2Match = line.match(/^([A-Z0-9]{9})(\d)([A-Z]{3})(\d{6})(\d)([MF])(\d{6})/);
    if (mrzLine2Match) {
      if (!data.passportNumber) data.passportNumber = mrzLine2Match[1];
      if (!data.nationality) data.nationality = mrzLine2Match[3];
      if (!data.dateOfBirth) {
        const dob = mrzLine2Match[4];
        // MRZ format is YYMMDD
        const yy = dob.substring(0, 2);
        const mm = dob.substring(2, 4);
        const dd = dob.substring(4, 6);
        const fullYear = (parseInt(yy) > 30 ? '19' : '20') + yy;
        data.dateOfBirth = `${fullYear}-${mm}-${dd}`;
      }
      if (!data.sex) {
        data.sex = mrzLine2Match[6] === 'M' ? 'Male' : 'Female';
      }
      if (!data.dateOfExpiry) {
        const exp = mrzLine2Match[7];
        const yy = exp.substring(0, 2);
        const mm = exp.substring(2, 4);
        const dd = exp.substring(4, 6);
        const fullYear = (parseInt(yy) > 30 ? '19' : '20') + yy;
        data.dateOfExpiry = `${fullYear}-${mm}-${dd}`;
      }
    }
  }
}

/**
 * Format date to ISO format (YYYY-MM-DD)
 * Handles multiple input formats intelligently
 */
export function formatDateToISO(dateStr: string): string {
  if (!dateStr) return '';

  // Already ISO?
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Normalize separators
  const normalized = dateStr.replace(/[\.\-]/g, '/');
  const parts = normalized.split('/').filter(p => p.length > 0);

  if (parts.length !== 3) return '';

  let day: string, month: string, year: string;

  // Check if first part is 4 digits (YYYY/MM/DD)
  if (parts[0].length === 4) {
    year = parts[0];
    month = parts[1].padStart(2, '0');
    day = parts[2].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // DD/MM/YYYY or MM/DD/YYYY
  day = parts[0];
  month = parts[1];
  year = parts[2];

  const dayNum = parseInt(day);
  const monthNum = parseInt(month);

  // Validate ranges
  if (monthNum > 12) {
    // Must be day/month swapped
    [day, month] = [month, day];
  } else if (dayNum > 12 && dayNum <= 31) {
    // day is clearly the day
    // keep as is
  }
  // If both <= 12, assume DD/MM/YYYY (Ethiopian/EU format is more common)

  // Handle 2-digit year
  if (year.length === 2) {
    const yearNum = parseInt(year);
    year = (yearNum > 30 ? '19' : '20') + year;
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Map passport data to form field names
 */
export function mapPassportToFormFields(passportData: PassportData) {
  // Clean up given names to extract first name
  let firstName = '';
  if (passportData.givenNames) {
    const names = passportData.givenNames.split(/\s+/).filter(n => n.length > 0);
    firstName = names[0] || '';
  }

  return {
    firstName: firstName,
    lastName: passportData.surname || '',
    dateOfBirth: passportData.dateOfBirth || '',
    gender: passportData.sex || '',
    nationality: passportData.nationality || '',
    passportNumber: passportData.passportNumber || '',
    passportExpiryDate: passportData.dateOfExpiry || '',
    passportIssuingDate: passportData.dateOfIssue || '',
    passportPlaceOfIssue: passportData.placeOfBirth || '',
    fatherName: passportData.fatherName || '',
    motherName: passportData.motherName || '',
  };
}

/**
 * Extract text regions from passport image (for manual parsing)
 */
export function extractPassportFields(image: HTMLImageElement) {
  return {
    mrzZone: '',
    photoZone: '',
  };
}
