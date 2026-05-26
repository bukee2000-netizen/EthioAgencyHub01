# Employee Registration Wizard - Complete Guide

## 🎯 Overview

The employee registration wizard is a comprehensive 4-step form that makes it easy to register new employees with predefined dropdown options for common fields. This eliminates data entry errors and ensures consistency across all employee records.

---

## 📋 Registration Steps

### Step 1: Personal Information (Required)
Capture basic employee details with easy dropdown selections.

**Fields:**
| Field | Type | Required | Options |
|-------|------|----------|---------|
| First Name | Text | ✅ | Any text |
| Last Name | Text | ✅ | Any text |
| Email | Email | ✅ | Valid email format |
| Date of Birth | Date | ❌ | Calendar picker |
| Gender | Dropdown | ❌ | Male, Female, Other, Prefer not to say |
| Marital Status | Dropdown | ❌ | Single, Married, Divorced, Widowed, Separated |
| Nationality | Dropdown | ❌ | 120+ countries |
| Region | Dropdown | ❌ | 11 Ethiopian regions |
| Zone | Dropdown | ❌ | Cascades based on region selected |
| Contact Phone | Text | ✅ | 7+ digit phone number |
| Alternate Phone | Text | ❌ | 7+ digit phone number |
| Emergency Contact Name | Text | ✅ | Full name |
| Emergency Contact Phone | Text | ✅ | 7+ digit phone number |

**💡 Tips:**
- Region is automatically cleared when you change the region
- Zone dropdown only appears after selecting a region
- All phone fields validate minimum 7 characters
- Email must include @ symbol

---

### Step 2: Skills & Qualifications (Optional)
Define the employee's professional qualifications and preferences.

**Fields:**
| Field | Type | Options |
|-------|------|---------|
| Education Level | Dropdown | No formal education, Primary school, Secondary school, High school, Certificate/Diploma, Bachelor's degree, Master's degree, Doctorate degree |
| Job Role | Dropdown | 27 predefined positions (Domestic Worker, Cook, Driver, Nurse, Engineer, etc.) |
| Experience Level | Dropdown | No experience, 0-1 year, 1-3 years, 3-5 years, 5-10 years, 10+ years |
| Destination Country | Dropdown | 120+ countries |
| Languages | Multi-select | 32 supported languages (Amharic, English, Arabic, French, Chinese, etc.) |
| Additional Skills | Text | Comma-separated custom skills |

**💡 Tips:**
- Hold Ctrl (Windows/Linux) or Cmd (Mac) to select multiple languages
- Click the ✕ button on language tags to remove them
- Additional skills are useful for first aid, cooking, childcare, etc.

**Available Job Roles:**
```
Domestic Worker, Caregiver, Cook, House Cleaner, Nanny, Gardener, Driver,
Security Guard, Nurse, Laboratory Technician, Factory Worker, Construction Worker,
Electrician, Plumber, Carpenter, Welder, Mechanic, Chef, Hotel Staff, Restaurant Worker,
Sales Representative, Customer Service, Administrative Staff, Data Entry, Accountant,
Engineer, Technician
```

**Available Languages:**
```
Amharic, Tigrinya, Somali, Afaan Oromo, Gurage, Sidaamu Afoo, Wolayttatta,
English, Arabic, French, Spanish, Portuguese, Italian, German, Dutch, Turkish,
Farsi, Pashto, Urdu, Hindi, Bengali, Tagalog, Indonesian, Thai, Chinese Mandarin,
Cantonese, Japanese, Korean, Russian, Ukrainian, Polish, Greek
```

---

### Step 3: Documents & Media (Optional)
Upload employee identification documents and interview videos.

**Upload Options:**
1. **Photo/Passport (Teledrive)**
   - Formats: JPG, PNG, PDF
   - Uploaded to Teledrive sync folder
   - Maximum 50MB
   - Used for identity verification

2. **Interview Video (Telegram)**
   - Format: MP4, WebM, MOV, etc.
   - Uploaded to Telegram private channel
   - Free global streaming capability
   - Maximum 50MB

**💡 Tips:**
- You can either upload files using the upload boxes or paste paths/IDs manually
- Files are automatically processed to respective storage systems
- Both fields are optional - you can complete registration without files
- Video will be accessible via authenticated Telegram stream

---

### Step 4: Review & Submit
Verify all entered information before final submission.

**Sections:**
1. **Personal Information** (Brand-colored section)
   - All personal details at a glance
   - Review contact information

2. **Skills & Qualifications** (Emerald-colored section)
   - Verify education and experience
   - Check selected languages
   - Confirm destination preference

3. **Documents** (Blue-colored section)
   - Confirm uploaded file paths
   - Verify Telegram video ID

**Actions:**
- ✏️ Click "Back" to edit any information
- ✅ Click "Submit registration" to finalize

---

## 📍 Ethiopian Regions & Zones

### All Regions (11 Total)
1. **Addis Ababa** - Not Applicable
2. **Affar** - 5 zones
3. **Amhara** - 6 zones
4. **Benishangul-Gumuz** - 5 zones
5. **Dire Dawa** - Not Applicable
6. **Gambella** - 5 zones
7. **Harari** - Not Applicable
8. **Oromia** - 13 zones
9. **SNNPR** - 7 zones
10. **Somali** - 9 zones
11. **Tigray** - 6 zones

---

## 🌍 Destination Countries (120+)

### Middle East & Gulf
UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, Jordan, Lebanon

### Africa
Egypt, Kenya, Uganda, Tanzania, South Africa, Ethiopia, and 50+ others

### Asia
Malaysia, Singapore, Thailand, Indonesia, Philippines, Hong Kong, Japan, South Korea

### Europe
UK, Germany, France, Italy, Spain, Switzerland, and 20+ others

### Americas
USA, Canada, Brazil, Mexico

*And 100+ more countries globally*

---

## ✅ Validation Rules

### Required Fields
- ❌ Cannot be empty
- ❌ First Name: minimum 2 characters
- ❌ Last Name: minimum 2 characters
- ❌ Email: must include @ symbol
- ❌ Contact Phone: minimum 7 digits
- ❌ Emergency Contact: minimum 2 characters
- ❌ Emergency Phone: minimum 7 digits

### Optional Fields
- ✅ Can be left empty
- ✅ Will be skipped during submission
- ✅ No validation applied

### Next Button Behavior
- ✅ Enabled: All required fields on current step are filled
- ❌ Disabled: Any required field is empty on steps 1 or 2

---

## 🔄 Workflow Example

```
User fills Personal Info
         ↓
Click "Next" → validates required fields
         ↓
Step 2: Skills form loads
         ↓
Select job role and destination
         ↓
Click "Next" → allows optional step
         ↓
Step 3: Upload documents
         ↓
Click "Next" → continues (uploads optional)
         ↓
Step 4: Review all data
         ↓
Click "Submit" → sends to backend API
         ↓
Success or error message displayed
```

---

## 💾 Submitted Data Structure

```json
{
  "personal": {
    "firstName": "Abebe",
    "lastName": "Assefa",
    "email": "abebe@email.com",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "maritalStatus": "Married",
    "nationality": "Ethiopia",
    "region": "Addis Ababa",
    "zone": "Not Applicable",
    "contactPhone": "+251911234567",
    "alternatePhone": "+251922234567",
    "emergencyContact": "Almaz Assefa",
    "emergencyPhone": "+251933234567"
  },
  "skills": {
    "education": "Bachelor's degree",
    "role": "Nurse",
    "experience": "5-10 years",
    "destination": "Saudi Arabia",
    "languages": ["Amharic", "English", "Arabic"],
    "additionalSkills": "First aid, Patient care"
  },
  "documents": {
    "docPath": "/teledrive/uploads/abebe_passport.pdf",
    "tgVideoId": "AAAB7JL7qYt0k-YzXJB-8..."
  }
}
```

---

## 🔐 Data Security

- ✅ All data validated before submission
- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ Teledrive handles document storage securely
- ✅ Telegram videos in private channel (authorized access only)
- ✅ Agency data isolation (multi-tenant)
- ✅ HTTPS encryption in transit

---

## ⚠️ Common Issues & Solutions

### "Next button is disabled"
**Problem:** Can't proceed to next step
**Solution:** Ensure all required fields marked with * are filled:
- Step 1: First name, Last name, Email, Contact phone, Emergency contact, Emergency phone
- Step 2: At least Job role or another non-required field

### "Zone dropdown not showing"
**Problem:** Zone dropdown appears but empty or not visible
**Solution:** Make sure you've selected a region first. Zone dropdown cascades after region selection.

### "Upload failed"
**Problem:** File upload to Teledrive or Telegram failed
**Solution:** 
- Check file size (max 50MB)
- Verify file format (JPG/PNG/PDF for docs, MP4/WebM for video)
- Try uploading again or paste path/ID manually

### "Invalid email"
**Problem:** Email field shows error
**Solution:** Email must contain @ symbol and valid format (e.g., user@example.com)

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Contact: support@ethioagencyhub.com
3. Visit: docs.ethioagencyhub.com

---

**Version:** 1.0  
**Last Updated:** May 5, 2026  
**Status:** ✅ Production Ready
