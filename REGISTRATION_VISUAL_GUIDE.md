# Employee Registration Wizard - Visual Overview

## 📊 Registration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│         EMPLOYEE REGISTRATION WIZARD - 4 STEPS                  │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────┐
                    │   START REGISTRATION         │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  STEP 1: PERSONAL INFO       │
                    │  (13 Fields)                 │
                    │                              │
                    │ ✓ First Name*  ✓ Last Name*  │
                    │ ✓ Email*       ✓ Birth Date  │
                    │ ✓ Gender       ✓ Nationality│
                    │ ✓ Region*      ✓ Zone*      │
                    │ ✓ Phone*       ✓ Alt Phone  │
                    │ ✓ Emg Contact* ✓ Emg Phone* │
                    │ ✓ Marital Stat.             │
                    │                              │
                    │ [BACK] [NEXT]                │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  STEP 2: SKILLS              │
                    │  (6 Fields - Optional)       │
                    │                              │
                    │ ✓ Education Level            │
                    │ ✓ Job Role (27 options)     │
                    │ ✓ Experience (6 levels)     │
                    │ ✓ Destination (120+ countries)
                    │ ✓ Languages (32 languages) │
                    │ ✓ Additional Skills          │
                    │                              │
                    │ [BACK] [NEXT]                │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  STEP 3: DOCUMENTS           │
                    │  (Optional)                  │
                    │                              │
                    │ 📄 Photo/Passport Upload    │
                    │    (Teledrive - JPG/PNG)   │
                    │                              │
                    │ 🎥 Interview Video Upload   │
                    │    (Telegram - MP4/WebM)   │
                    │                              │
                    │ [BACK] [NEXT]                │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  STEP 4: REVIEW              │
                    │  (Color-Coded Sections)      │
                    │                              │
                    │ 🟦 Personal Information     │
                    │   (Brand Blue)              │
                    │                              │
                    │ 🟩 Skills & Qualifications  │
                    │   (Emerald Green)           │
                    │                              │
                    │ 🟦 Documents                 │
                    │   (Sky Blue)                │
                    │                              │
                    │ [BACK] [SUBMIT]              │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │   ✅ SUCCESS MESSAGE         │
                    │   Employee registered!      │
                    └──────────────────────────────┘
```

---

## 📋 Field Breakdown by Step

### STEP 1: PERSONAL INFORMATION (13 Fields)

```
┌─────────────────────────────────────────────┐
│ PERSONAL INFORMATION                        │
├─────────────────────────────────────────────┤
│                                             │
│  📝 First Name*          📝 Last Name*      │
│  [________________]  [________________]   │
│                                             │
│  📧 Email*               📅 Date of Birth   │
│  [________________]  [________________]   │
│                                             │
│  👤 Gender               💍 Marital Status  │
│  [Dropdown ▼]        [Dropdown ▼]         │
│  • Male                  • Single           │
│  • Female                • Married          │
│  • Other                 • Divorced         │
│                                             │
│  🌍 Nationality          📍 Region*        │
│  [Dropdown ▼]        [Dropdown ▼]         │
│  • Ethiopia              • Addis Ababa     │
│  • USA                   • Amhara          │
│  • Saudi Arabia          • Oromia          │
│                          • Tigray          │
│                                             │
│  🗺️ Zone* (Cascading)                      │
│  [Dropdown ▼]                             │
│  (Automatically populated based on Region) │
│                                             │
│  ☎️ Contact Phone*       ☎️ Alternate Phone │
│  [________________]  [________________]   │
│                                             │
│  👨‍👩‍👧 Emergency Contact*   ☎️ Emergency Phone*│
│  [________________]  [________________]   │
│                                             │
└─────────────────────────────────────────────┘
```

### STEP 2: SKILLS & QUALIFICATIONS (6 Fields)

```
┌─────────────────────────────────────────────┐
│ SKILLS & QUALIFICATIONS                    │
├─────────────────────────────────────────────┤
│                                             │
│  🎓 Education Level          📊 Experience  │
│  [Dropdown ▼]            [Dropdown ▼]     │
│  • No formal education        • No exp.     │
│  • Primary school             • 0-1 year    │
│  • Secondary school           • 1-3 years   │
│  • High school                • 3-5 years   │
│  • Certificate/Diploma        • 5-10 years  │
│  • Bachelor's degree          • 10+ years   │
│  • Master's degree                         │
│  • Doctorate degree                        │
│                                             │
│  💼 Job Role*                🌐 Destination │
│  [Dropdown ▼]            [Dropdown ▼]     │
│  • Domestic Worker            • UAE         │
│  • Caregiver                  • Saudi Arabia│
│  • Cook                       • Qatar       │
│  • House Cleaner              • Kuwait      │
│  • Nanny                      • USA         │
│  • Gardener                   • UK          │
│  • Driver                     • 100+ more   │
│  • Security Guard                          │
│  • Nurse                                   │
│  • Engineer                                │
│  • (21 more options)                       │
│                                             │
│  🗣️ Languages (Multi-Select) *             │
│  [Select Box - Hold Ctrl to select multiple]
│  ☑️ Amharic      ☑️ English    ☑️ Arabic    │
│  ☑️ French       ☑️ Spanish    ☑️ Chinese   │
│  ☑️ (28 more languages)                    │
│                                             │
│  Selected: [Amharic] [English ×] [Arabic ×]│
│                                             │
│  💡 Additional Skills                       │
│  [Multi-line text input]                  │
│  (e.g., First aid, Cooking, Childcare)    │
│                                             │
└─────────────────────────────────────────────┘
```

### STEP 3: DOCUMENTS (Optional)

```
┌─────────────────────────────────────────────┐
│ DOCUMENTS & MEDIA UPLOADS                  │
├─────────────────────────────────────────────┤
│                                             │
│  📄 PHOTO / PASSPORT (Teledrive)           │
│  ┌─────────────────────────────┐           │
│  │  📤 Click to upload files   │           │
│  │  (JPG, PNG, PDF)            │           │
│  │  Max: 50MB                  │           │
│  └─────────────────────────────┘           │
│                                             │
│  OR paste path manually:                   │
│  [________________ /path/to/file]         │
│                                             │
│  ─────────────────────────────────────────│
│                                             │
│  🎥 INTERVIEW VIDEO (Telegram)             │
│  ┌─────────────────────────────┐           │
│  │  📤 Click to upload video   │           │
│  │  (MP4, WebM, MOV)           │           │
│  │  Max: 50MB                  │           │
│  └─────────────────────────────┘           │
│                                             │
│  OR paste ID manually:                     │
│  [___________ Telegram file ID]           │
│                                             │
└─────────────────────────────────────────────┘
```

### STEP 4: REVIEW (All Data)

```
┌─────────────────────────────────────────────┐
│ REVIEW & CONFIRM                           │
├─────────────────────────────────────────────┤
│                                             │
│ 🟦 PERSONAL INFORMATION (Brand Blue)       │
│ ├─ First Name: Abebe                       │
│ ├─ Last Name: Assefa                       │
│ ├─ Email: abebe@email.com                  │
│ ├─ Gender: Male                            │
│ ├─ Marital Status: Married                 │
│ ├─ Nationality: Ethiopia                   │
│ ├─ Region: Addis Ababa                     │
│ ├─ Zone: Not Applicable                    │
│ ├─ Contact Phone: +251911234567            │
│ ├─ Alternate Phone: +251922234567          │
│ ├─ Emergency Contact: Almaz Assefa         │
│ └─ Emergency Phone: +251933234567          │
│                                             │
│ 🟩 SKILLS & QUALIFICATIONS (Emerald)      │
│ ├─ Education: Bachelor's degree            │
│ ├─ Job Role: Nurse                         │
│ ├─ Experience: 5-10 years                  │
│ ├─ Destination: Saudi Arabia               │
│ ├─ Languages: [Amharic] [English] [Arabic]│
│ └─ Additional Skills: First aid, Patient   │
│                                             │
│ 🟦 DOCUMENTS (Blue)                        │
│ ├─ Document Path: /teledrive/uploads/...   │
│ └─ Video ID: AAAB7JL7qYt0k-YzXJB-8...     │
│                                             │
│ [BACK - Edit]    [SUBMIT - Confirm]        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Data Entry Ease Features

| Feature | Before | After |
|---------|--------|-------|
| Job Role | Type anything | Select from 27 predefined |
| Region/Zone | Manual entry | Dropdown + cascading |
| Destination | Type country name | Select from 120+ |
| Languages | Comma-separated text | Multi-select with tags |
| Gender | Free text | 4 options only |
| Education | Free text | 8 defined levels |
| Experience | Number input | Predefined ranges |
| Validation | Basic | Comprehensive |

---

## 🌳 Region/Zone Hierarchy

```
ADDIS ABABA (1 zone)
├─ Not Applicable

AMHARA (6 zones)
├─ North Wollo
├─ South Wollo
├─ Oromia Zone
├─ East Gojjam
├─ West Gojjam
└─ North Shewa

OROMIA (13 zones)
├─ East Hararghe
├─ West Hararghe
├─ North Shewa
├─ South Shewa
├─ Bale
├─ Guji
├─ Borena
├─ Arsi
├─ West Wollega
├─ East Wollega
├─ Ilubabor
├─ Jimma
└─ Kellem Wollega

SOMALI (9 zones)
├─ Afmadu
├─ Deghabur
├─ Doolo
├─ Fiq
├─ Gode
├─ Jijiga
├─ Lij Momale
├─ Shinile
└─ Warder

(And 6 more regions...)
```

---

## 🎨 Color Scheme

```
Step 1 Progress: 🔵 Brand Blue (Hex: #2563EB)
Step 2 Progress: 🟢 Brand Green (Hex: #10B981)
Step 3 Progress: 🔵 Brand Blue (Hex: #2563EB)
Step 4 Progress: ⚫ Completed/Done

Review Sections:
  Personal Info   → 🟦 Brand Blue
  Skills          → 🟩 Emerald Green
  Documents       → 🟦 Sky Blue
  Buttons         → 🔴 Brand Red (Call-to-action)
```

---

## 📱 Responsive Layout

```
DESKTOP (2 columns):              MOBILE (1 column):
┌──────────┬──────────┐           ┌──────────┐
│ First    │ Last     │           │ First    │
│ Name     │ Name     │           │ Name     │
├──────────┼──────────┤           ├──────────┤
│ Email    │ DOB      │           │ Last     │
│          │          │           │ Name     │
├──────────┼──────────┤           ├──────────┤
│ Gender   │ Marital  │           │ Email    │
│          │ Status   │           │          │
├──────────┼──────────┤           ├──────────┤
│ Reg.     │ Zone     │           │ DOB      │
│          │          │           │          │
└──────────┴──────────┘           ├──────────┤
                                  │ Gender   │
                                  │          │
                                  ├──────────┤
                                  │ Marital  │
                                  │ Status   │
                                  ├──────────┤
                                  │ Region   │
                                  │          │
                                  ├──────────┤
                                  │ Zone     │
                                  │          │
                                  └──────────┘
```

---

## ✅ Validation Indicators

```
FIELD STATES:

✅ Valid Input:
   [Input with green border]

❌ Invalid Input:
   [Input with red border]
   Error: "Email must be valid"

⚠️ Empty Required Field:
   [Input with warning color]
   (Next button disabled)

✓ Optional Field:
   [Input - can be empty]
   No error shown

🔄 Zone Cascading:
   Select Region → Zone dropdown populates
   Change Region → Zone resets
```

---

## 🔐 Data Security

```
Registration Data Flow:

User Input
    ↓
[Frontend Validation - Zod]
    ↓
[TypeScript Type Check]
    ↓
[API Submission]
    ↓
[Backend Validation - Zod]
    ↓
[Prisma ORM Processing]
    ↓
[MySQL Database Storage]
    ↓
[Teledrive/Telegram Uploads]
```

---

**Status: ✅ PRODUCTION READY**

All features implemented, tested, and documented!
