export type PersonalData = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  contactPhone: string;
  alternatePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  nationalId: string;
  laborId: string;
  passportNumber: string;
  passportExpiryDate: string;
  passportIssuingDate: string;
  passportPlaceOfIssue: string;
  fatherName: string;
  motherName: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
  medicalHistory: string;
  religion: string;
};

export type SkillsData = {
  education: string;
  role: string;
  experience: string;
  destination: string;
  languages: string[];
  additionalSkills: string;
};

export type DocumentsData = { docPath: string; tgVideoId: string; passportSizePhoto: string; fullBodyPhoto: string; pdfDocuments: string[] };

export type PsychologyData = { [key: string]: number | string[] };

export type PsychInterviewData = {
  interviewerName: string;
  interviewerRole: string;
  interviewDate: string;
  observations: string;
  emotionalStability: number;
  socialAdaptability: number;
  communicationSkills: number;
  workMotivation: number;
  selfAwareness: number;
  problemSolving: number;
  overallAssessment: string;
  recommendations: string;
};

export type Draft = {
  id: string;
  personal: PersonalData;
  skills: SkillsData;
  docs: DocumentsData;
  psychology: PsychologyData;
  step: number;
  createdAt: string;
};

export type RegistrationWizardProps = {
  initialStep?: number;
};

export const PSYCH_QUESTIONS = [
  { id: 'q1', text: 'How do you handle being away from family for a long time?', options: ['Very difficult, I struggle', 'It\'s hard but I can manage', 'I can adapt well', 'I am fully prepared'] },
  { id: 'q2', text: 'Have you worked or lived away from home before?', options: ['Never', 'Briefly (less than 3 months)', 'Yes, 3-12 months', 'Yes, more than 1 year'] },
  { id: 'q3', text: 'How would you rate your ability to work under strict rules and supervision?', options: ['I prefer full independence', 'Somewhat comfortable', 'Comfortable most of the time', 'Very comfortable'] },
  { id: 'q4', text: 'What is your primary motivation for working abroad?', options: ['Family pressure only', 'Not sure yet', 'Improve family income', 'Career growth and financial goals'] },
  { id: 'q5', text: 'How do you cope with cultural differences and new environments?', options: ['Very uncomfortable', 'Takes me a long time', 'I adjust moderately', 'I adapt quickly'] },
  { id: 'q6', text: 'Do you have a support system (family/friends) who encourage your decision?', options: ['No support at all', 'Some support', 'Good support', 'Strong support and encouragement'] },
  { id: 'q7', text: 'How confident are you in completing your full contract period (2+ years)?', options: ['Not confident', 'Somewhat unsure', 'Fairly confident', 'Very confident'] },
  { id: 'q8', text: 'Have you received any pre-departure counseling or training?', options: ['None', 'Basic information only', 'Some training', 'Full pre-departure training'] },
];

export const INTERVIEW_PSYCH_QUESTIONS = [
  { id: 'int1', text: 'How do you feel about working in a Muslim-majority country?', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable'] },
  { id: 'int2', text: 'How will you handle dietary differences (Injera vs rice-based meals)?', options: ['I will struggle greatly', 'I will have some difficulty', 'I can adapt reasonably well', 'I am fully prepared'] },
  { id: 'int3', text: 'How do you feel about working for employers from different religious backgrounds?', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable'] },
  { id: 'int4', text: 'How familiar are you with Middle Eastern culture and customs?', options: ['Not at all familiar', 'Slightly familiar', 'Moderately familiar', 'Very familiar'] },
  { id: 'int5', text: 'How will you communicate if you don\'t speak Arabic fluently?', options: ['I will struggle greatly', 'I will have difficulty', 'I can manage with basic phrases', 'I will find ways to communicate'] },
  { id: 'int6', text: 'How do you feel about living in urban areas after coming from rural Ethiopia?', options: ['Very overwhelming', 'Somewhat challenging', 'I can adapt', 'I look forward to it'] },
  { id: 'int7', text: 'How familiar are you with modern home appliances?', options: ['Not at all familiar', 'Slightly familiar', 'Moderately familiar', 'Very familiar'] },
  { id: 'int8', text: 'How do you plan to handle homesickness while working abroad?', options: ['I don\'t have a plan', 'I will rely on occasional calls', 'I will stay busy and connected', 'I am prepared emotionally'] },
];

export const LANGUAGE_ASSESSMENT = [
  { id: 'lang1', text: 'How well do you speak Amharic?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
  { id: 'lang2', text: 'How well do you speak Oromo?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
  { id: 'lang3', text: 'How well do you understand English?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
  { id: 'lang4', text: 'How well do you understand Arabic?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
];

export const DOMESTIC_WORK_ASSESSMENT = [
  { id: 'dom1', text: 'Experience with cooking Ethiopian food', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'dom2', text: 'Experience with cleaning and household chores', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'dom3', text: 'Experience with childcare', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'dom4', text: 'Experience with elderly care', options: ['None', 'Basic', 'Good', 'Expert'] },
];

export const APPLIANCE_ASSESSMENT = [
  { id: 'app1', text: 'Experience with modern kitchen appliances', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'app2', text: 'Experience with washing machines and dryers', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'app3', text: 'Experience with vacuum cleaners', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'app4', text: 'Experience with home security systems', options: ['None', 'Basic', 'Good', 'Expert'] },
];

export const CULTURE_ASSESSMENT = [
  { id: 'cult1', text: 'Knowledge of Middle Eastern food culture', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'cult2', text: 'Knowledge of Western food culture', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'cult3', text: 'Experience with different religious practices', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'cult4', text: 'Comfort level with cultural differences', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable'] },
];

export const PSYCH_INTERVIEW_RATINGS = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

export const PSYCH_INTERVIEW_SECTION = [
  { id: 'psychInterview_emotionalStability', text: 'Emotional Stability & Resilience', desc: 'How well does the candidate handle stress and emotional challenges?' },
  { id: 'psychInterview_socialAdaptability', text: 'Social Adaptability', desc: 'Ability to adjust to new social environments and cultural norms.' },
  { id: 'psychInterview_communicationSkills', text: 'Communication Skills', desc: 'Clarity in expressing thoughts, listening ability, and responsiveness.' },
  { id: 'psychInterview_workMotivation', text: 'Work Motivation & Commitment', desc: 'Genuine motivation to work abroad and complete the contract.' },
  { id: 'psychInterview_selfAwareness', text: 'Self-Awareness & Realistic Expectations', desc: 'Does the candidate have realistic expectations about working abroad?' },
  { id: 'psychInterview_problemSolving', text: 'Problem-Solving & Conflict Resolution', desc: 'How would the candidate handle disputes or difficult situations at work?' },
];

export const RETURN_RISK_ASSESSMENT = [
  { id: 'risk1', text: 'How likely are you to return home before 6 months?', options: ['Very likely', 'Somewhat likely', 'Unlikely', 'Very unlikely'] },
  { id: 'risk2', text: 'What would make you return early? (Select all that apply)', options: ['Homesickness', 'Culture shock', 'Poor working conditions', 'Family emergency', 'Financial reasons', 'None of the above'], multiple: true },
  { id: 'risk3', text: 'How prepared are you for potential challenges?', options: ['Not prepared at all', 'Somewhat prepared', 'Well prepared', 'Very well prepared'] },
  { id: 'risk4', text: 'Do you have a plan to stay committed for the full contract?', options: ['No plan', 'Basic plan', 'Detailed plan', 'Very committed'] },
];

export const MEDICAL_HISTORY_SECTION = [
  { id: 'med1', text: 'Do you have any chronic medical conditions?', options: ['None', 'Mild (managed)', 'Moderate', 'Severe'] },
  { id: 'med2', text: 'Do you have any allergies (food, medication, environmental)?', options: ['None', 'Mild', 'Moderate', 'Severe'] },
  { id: 'med3', text: 'Do you have any history of mental health conditions?', options: ['None', 'Mild', 'Moderate', 'Severe'] },
  { id: 'med4', text: 'Are you currently taking any medications?', options: ['None', 'Occasional', 'Regular', 'Multiple medications'] },
  { id: 'med5', text: 'Have you ever been hospitalized for serious conditions?', options: ['Never', 'Once', '2-3 times', 'Multiple times'] },
  { id: 'med6', text: 'Do you have any physical limitations?', options: ['None', 'Minor', 'Moderate', 'Significant'] },
];

export const steps = ['Personal', 'Skills', 'Bank', 'Assessment', 'Documents', 'Review'];
