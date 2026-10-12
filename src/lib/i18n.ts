import { Language } from './types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  emergencyBanner: string;
  emergencyAction: string;
  emergencyPhone: string;
  navDashboard: string;
  navDoctors: string;
  navBookAppointment: string;
  navMyRecords: string;
  navProfile: string;
  navLogin: string;
  navRegister: string;
  navLogout: string;
  aiCopilotButton: string;
  aiCopilotTitle: string;
  aiCopilotSubtitle: string;
  aiCopilotPlaceholder: string;
  aiCopilotSend: string;
  aiCopilotDisclaimer: string;

  // Modules Dashboard
  modulesTitle: string;
  modulesSubtitle: string;
  womensHealthTitle: string;
  womensHealthDesc: string;
  mensHealthTitle: string;
  mensHealthDesc: string;
  childrenHealthTitle: string;
  childrenHealthDesc: string;
  seniorHealthTitle: string;
  seniorHealthDesc: string;
  startAssessment: string;

  // Common Form Fields
  fullName: string;
  age: string;
  years: string;
  months: string;
  parentGuardianName: string;
  sex: string;
  sexMale: string;
  sexFemale: string;
  sexPreferNotToSay: string;
  healthProblem: string;
  selectOrTypeProblem: string;
  customProblemPlaceholder: string;
  symptoms: string;
  symptomsPlaceholder: string;
  duration: string;
  durationPlaceholder: string;
  medicalHistoryOptional: string;
  medicalHistoryPlaceholder: string;
  currentMedicationsOptional: string;
  currentMedicationsPlaceholder: string;
  submitButton: string;
  submitting: string;
  resetButton: string;
  backToDashboard: string;
  editDetails: string;

  // Form Validations
  errNameRequired: string;
  errAgeRequired: string;
  errSeniorAge: string;
  errProblemRequired: string;
  errSymptomsRequired: string;
  errDurationRequired: string;
  errGuardianRequired: string;

  // Results Page
  resultsTitle: string;
  resultsSubtitle: string;
  patientDetailsCard: string;
  reportedConcernCard: string;
  recommendedSpecialty: string;
  specialtyReason: string;
  generalPrecautions: string;
  thingsToAvoid: string;
  warningSigns: string;
  fallPreventionGuidance: string;
  bookAppointmentWithSpecialist: string;
  safetyDisclaimer: string;
  emergencyWarningNotice: string;

  // Doctor Directory & Booking
  doctorDirectoryTitle: string;
  doctorDirectorySubtitle: string;
  filterSpecialty: string;
  allSpecialties: string;
  filterType: string;
  allTypes: string;
  inPerson: string;
  onlineConsultation: string;
  verifiedDoctor: string;
  demoDoctor: string;
  experience: string;
  fee: string;
  bookNow: string;
  preferredDate: string;
  availableSlot: string;
  contactPhone: string;
  contactEmail: string;
  confirmBooking: string;
  bookingSuccessTitle: string;
  bookingSuccessDesc: string;
  bookingRef: string;
  viewAppointments: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'MediMate AI',
    appTagline: 'Your Personal AI Health Copilot',
    emergencyBanner: 'Medical Emergency Alert: If experiencing severe chest pain, stroke signs, or severe breathing distress, seek immediate emergency help.',
    emergencyAction: 'Call 108 / 112 / 911',
    emergencyPhone: '108',
    navDashboard: 'Dashboard',
    navDoctors: 'Find Doctors',
    navBookAppointment: 'Book Appointment',
    navMyRecords: 'Health Records',
    navProfile: 'My Profile',
    navLogin: 'Sign In',
    navRegister: 'Create Account',
    navLogout: 'Sign Out',
    aiCopilotButton: 'Ask AI Copilot',
    aiCopilotTitle: 'MediMate AI Health Copilot',
    aiCopilotSubtitle: 'Clinical guidance, health education & care navigation',
    aiCopilotPlaceholder: 'Ask a health question (e.g. causes of sudden headache, diet for diabetes)...',
    aiCopilotSend: 'Send',
    aiCopilotDisclaimer: 'MediMate AI provides health education, not medical diagnosis. In an emergency, dial 108/911 immediately.',

    modulesTitle: 'Select a Specialized Health Module',
    modulesSubtitle: 'Evidence-informed triage tailored to your stage of life, biology, and symptoms.',
    womensHealthTitle: "Women's Health",
    womensHealthDesc: 'Menstrual health, pregnancy care, PCOS, menopause, breast wellness, and hormonal balance.',
    mensHealthTitle: "Men's Health",
    mensHealthDesc: 'Urological care, reproductive wellness, prostate health, hair & skin, and cardiovascular health.',
    childrenHealthTitle: "Children's Health",
    childrenHealthDesc: 'Pediatric care, child development, seasonal illnesses, and safe age-appropriate guidance.',
    seniorHealthTitle: 'Senior Health (50+ Years)',
    seniorHealthDesc: 'Geriatric assessment, mobility, joint care, chronic management, and fall prevention.',
    startAssessment: 'Start Assessment',

    fullName: 'Patient Full Name',
    age: 'Age',
    years: 'Years',
    months: 'Months',
    parentGuardianName: 'Parent or Guardian Full Name',
    sex: 'Sex / Gender',
    sexMale: 'Male',
    sexFemale: 'Female',
    sexPreferNotToSay: 'Prefer not to say',
    healthProblem: 'Primary Health Problem / Concern',
    selectOrTypeProblem: 'Select common concern or enter below',
    customProblemPlaceholder: 'Or describe your specific health concern in detail',
    symptoms: 'Current Symptoms Experienced',
    symptomsPlaceholder: 'e.g., Cramping, mild nausea, fatigue, localized discomfort...',
    duration: 'Duration of Symptoms',
    durationPlaceholder: 'e.g., 3 days, 2 weeks, ongoing for 1 month...',
    medicalHistoryOptional: 'Relevant Medical History (Optional)',
    medicalHistoryPlaceholder: 'e.g., Asthma, thyroid condition, prior surgeries, allergies...',
    currentMedicationsOptional: 'Current Medications (Optional)',
    currentMedicationsPlaceholder: 'e.g., Metformin 500mg, Atorvastatin, Multivitamins...',
    submitButton: 'Submit Clinical Assessment',
    submitting: 'Analyzing Symptoms...',
    resetButton: 'Clear Form',
    backToDashboard: 'Back to Dashboard',
    editDetails: 'Edit Details',

    errNameRequired: 'Patient full name is required.',
    errAgeRequired: 'Valid age is required.',
    errSeniorAge: 'Senior module requires age greater than 50 years.',
    errProblemRequired: 'Please select or describe the health problem.',
    errSymptomsRequired: 'Please provide the symptoms experienced.',
    errDurationRequired: 'Please specify how long symptoms have persisted.',
    errGuardianRequired: 'Parent or guardian name is required for pediatric assessments.',

    resultsTitle: 'Your Personalized Clinical Care Assessment',
    resultsSubtitle: 'Evidence-informed guidance and verified specialist matching.',
    patientDetailsCard: 'Patient Profile & Intake',
    reportedConcernCard: 'Reported Symptoms & Timeline',
    recommendedSpecialty: 'Recommended Doctor Specialty',
    specialtyReason: 'Why This Specialty Is Appropriate',
    generalPrecautions: 'Safe General Precautions & Self-Care',
    thingsToAvoid: 'Important Things to Avoid',
    warningSigns: 'Warning Signs Requiring Urgent Medical Attention',
    fallPreventionGuidance: 'Senior Fall Prevention & Home Safety Guidance',
    bookAppointmentWithSpecialist: 'Book Appointment With Recommended Specialist',
    safetyDisclaimer: 'Notice: This guidance is for educational and care-navigation purposes only and does not constitute a formal diagnosis or prescription. Always consult a licensed clinician for individualized medical management.',
    emergencyWarningNotice: 'CRITICAL ALERT: Emergency indicators were detected. Please seek prompt emergency medical care immediately.',

    doctorDirectoryTitle: 'Doctor Directory & Specialists',
    doctorDirectorySubtitle: 'Connect with verified healthcare professionals and specialist clinics.',
    filterSpecialty: 'Filter by Specialty',
    allSpecialties: 'All Specialties',
    filterType: 'Consultation Mode',
    allTypes: 'All Modes',
    inPerson: 'In-person',
    onlineConsultation: 'Online Video',
    verifiedDoctor: 'Verified Clinician',
    demoDoctor: 'Sample / Demo Doctor',
    experience: 'Experience',
    fee: 'Consultation Fee',
    bookNow: 'Book Appointment',
    preferredDate: 'Preferred Consultation Date',
    availableSlot: 'Available Time Slot',
    contactPhone: 'Contact Phone Number',
    contactEmail: 'Contact Email Address',
    confirmBooking: 'Confirm & Reserve Slot',
    bookingSuccessTitle: 'Appointment Confirmed Successfully!',
    bookingSuccessDesc: 'Your appointment has been registered in the hospital system.',
    bookingRef: 'Booking Reference Number',
    viewAppointments: 'View My Appointments'
  },

  te: {
    appName: 'మెడిమేట్ AI',
    appTagline: 'మీ వ్యక్తిగత AI ఆరోగ్య సహచరి',
    emergencyBanner: 'అత్యవసర ఆరోగ్య హెచ్చరిక: ఛాతీ నొప్పి, పక్షవాతం లక్షణాలు లేదా శ్వాస తీసుకోవడంలో తీవ్ర ఇబ్బంది ఉంటే వెంటనే అత్యవసర చికిత్స పొందండి.',
    emergencyAction: '108 / 112 / 911 కు కాల్ చేయండి',
    emergencyPhone: '108',
    navDashboard: 'డాష్‌బోర్డ్',
    navDoctors: 'వైద్యుల వివరాలు',
    navBookAppointment: 'అపాయింట్‌మెంట్ బుకింగ్',
    navMyRecords: 'నా ఆరోగ్య రికార్డులు',
    navProfile: 'నా ప్రొఫైల్',
    navLogin: 'లాగిన్',
    navRegister: 'ఖాతా తెరవండి',
    navLogout: 'లాగౌట్',
    aiCopilotButton: 'AI కోపైలట్‌ను అడగండి',
    aiCopilotTitle: 'మెడిమేట్ AI ఆరోగ్య కోపైలట్',
    aiCopilotSubtitle: 'వైద్య మార్గదర్శకత్వం, ఆరోగ్య సలహాలు మరియు సూచనలు',
    aiCopilotPlaceholder: 'మీ ఆరోగ్య సందేహాన్ని అడగండి (ఉదా: తలనొప్పి కారణాలు, మధుమేహం ఆహార నియమాలు)...',
    aiCopilotSend: 'పంపండి',
    aiCopilotDisclaimer: 'మెడిమేట్ AI ఆరోగ్య విద్యను అందిస్తుంది, వైద్య నిర్ధారణను కాదు. అత్యవసర పరిస్థితుల్లో వెంటనే 108 కు కాల్ చేయండి.',

    modulesTitle: 'ప్రత్యేక ఆరోగ్య విభాగాన్ని ఎంచుకోండి',
    modulesSubtitle: 'మీ వయస్సు మరియు లక్షణాల ఆధారంగా ప్రత్యేకమైన ఆరోగ్య మార్గదర్శకత్వం.',
    womensHealthTitle: 'స్త్రీల ఆరోగ్యం',
    womensHealthDesc: 'రుతుచక్ర సమస్యలు, గర్భధారణ సంరక్షణ, PCOS, మెనోపాజ్ మరియు హార్మోన్ల సమతుల్యత.',
    mensHealthTitle: 'పురుషుల ఆరోగ్యం',
    mensHealthDesc: 'యూరాలజీ సంరక్షణ, సంతానోత్పత్తి, ప్రోస్టేట్, చర్మ మరియు జుట్టు సమస్యలు.',
    childrenHealthTitle: 'పిల్లల ఆరోగ్యం',
    childrenHealthDesc: 'పీడియాట్రిక్ సంరక్షణ, పిల్లల పెరుగుదల, జలుబు-జ్వరం మరియు సురక్షిత సంరక్షణ.',
    seniorHealthTitle: 'వృద్ధుల ఆరోగ్యం (50 ఏళ్ల పైబడినవారు)',
    seniorHealthDesc: 'కీళ్ల నొప్పులు, గుండె ఆరోగ్యం, దీర్ఘకాలిక సమస్యలు మరియు పడిపోకుండా నివారణ.',
    startAssessment: 'ఆరోగ్య పరీక్ష ప్రారంభించండి',

    fullName: 'రోగి పూర్తి పేరు',
    age: 'వయస్సు',
    years: 'సంవత్సరాలు',
    months: 'నెలలు',
    parentGuardianName: 'తల్లిదండ్రులు / సంరక్షకుని పూర్తి పేరు',
    sex: 'లింగం',
    sexMale: 'పురుషుడు',
    sexFemale: 'స్త్రీ',
    sexPreferNotToSay: 'చెప్పడానికి ఇష్టపడలేదు',
    healthProblem: 'ప్రధాన ఆరోగ్య సమస్య',
    selectOrTypeProblem: 'సాధారణ సమస్యను ఎంచుకోండి లేదా నమోదు చేయండి',
    customProblemPlaceholder: 'లేదా మీ నిర్దిష్ట సమస్యను వివరంగా వివరించండి',
    symptoms: 'ప్రస్తుతం ఉన్న లక్షణాలు',
    symptomsPlaceholder: 'ఉదా: కడుపు నొప్పి, అలసట, శరీర నొప్పులు...',
    duration: 'లక్షణాలు ఎంతకాలంగా ఉన్నాయి',
    durationPlaceholder: 'ఉదా: 3 రోజులు, 2 వారాలు, ఒక నెల...',
    medicalHistoryOptional: 'మునుపటి వైద్య చరిత్ర (ఐచ్ఛికం)',
    medicalHistoryPlaceholder: 'ఉదా: ఆస్తమా, థైరాయిడ్, అలర్జీలు...',
    currentMedicationsOptional: 'ప్రస్తుతం వాడుతున్న మందులు (ఐచ్ఛికం)',
    currentMedicationsPlaceholder: 'ఉదా: మెట్‌ఫార్మిన్, విటమిన్లు...',
    submitButton: 'లక్షణాలను సమర్పించండి',
    submitting: 'విశ్లేషిస్తోంది...',
    resetButton: 'ఫారమ్ క్లియర్ చేయండి',
    backToDashboard: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
    editDetails: 'వివరాలు సవరించండి',

    errNameRequired: 'రోగి పూర్తి పేరు తప్పనిసరి.',
    errAgeRequired: 'సరైన వయస్సు నమోదు చేయాలి.',
    errSeniorAge: 'వృద్ధుల విభాగానికి వయస్సు 50 సంవత్సరాలు పైబడి ఉండాలి.',
    errProblemRequired: 'దయచేసి ఆరోగ్య సమస్యను ఎంచుకోండి లేదా వ్రాయండి.',
    errSymptomsRequired: 'దయచేసి ప్రస్తుత లక్షణాలను వివరించండి.',
    errDurationRequired: 'లక్షణాలు ఎంతకాలంగా ఉన్నాయో తెలపండి.',
    errGuardianRequired: 'పిల్లల విభాగానికి సంరక్షకుని పేరు తప్పనిసరి.',

    resultsTitle: 'మీ వ్యక్తిగతీకరించిన ఆరోగ్య నివేదిక',
    resultsSubtitle: 'నిపుణుల సిఫార్సులు మరియు సురక్షితమైన స్వీయ-సంరక్షణ సలహాలు.',
    patientDetailsCard: 'రోగి వివరాలు',
    reportedConcernCard: 'సమర్పించిన లక్షణాలు & సమయం',
    recommendedSpecialty: 'సిఫార్సు చేయబడిన వైద్య నిపుణులు',
    specialtyReason: 'ఈ నిపుణుడిని ఎందుకు సంప్రదించాలి',
    generalPrecautions: 'సాధారణ జాగ్రత్తలు & స్వీయ సంరక్షణ',
    thingsToAvoid: 'నివారించాల్సిన ముఖ్య విషయాలు',
    warningSigns: 'అత్యవసర వైద్యం అవసరమయ్యే హెచ్చరిక సంకేతాలు',
    fallPreventionGuidance: 'వృద్ధులు పడిపోకుండా ఉండటానికి భద్రతా సూచనలు',
    bookAppointmentWithSpecialist: 'సిఫార్సు చేసిన వైద్యుడితో అపాయింట్‌మెంట్ బుక్ చేయండి',
    safetyDisclaimer: 'గమనిక: ఈ సమాచారం అవగాహన మరియు మార్గదర్శకత్వం కొరకు మాత్రమే. ఇది వైద్య పరీక్ష లేదా ఔషధ సూచన కాదు. దయచేసి అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.',
    emergencyWarningNotice: 'అత్యవసర హెచ్చరిక: అత్యవసర లక్షణాలు గుర్తించబడ్డాయి. వెంటనే సమీపంలోని ఆసుపత్రికి వెళ్లండి.',

    doctorDirectoryTitle: 'వైద్యుల డైరెక్టరీ & నిపుణులు',
    doctorDirectorySubtitle: 'ధృవీకరించబడిన వైద్య నిపుణులతో సంప్రదింపులు జరపండి.',
    filterSpecialty: 'విభాగం వారీగా శోధించండి',
    allSpecialties: 'అన్ని విభాగాలు',
    filterType: 'సంప్రదింపు విధానం',
    allTypes: 'అన్ని విధానాలు',
    inPerson: 'ప్రత్యక్షంగా (హాస్పిటల్)',
    onlineConsultation: 'ఆన్‌లైన్ వీడియో',
    verifiedDoctor: 'ధృవీకరించబడిన వైద్యులు',
    demoDoctor: 'నమూనా / డెమో వైద్యులు',
    experience: 'అనుభవం',
    fee: 'ఫీజు',
    bookNow: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    preferredDate: 'కావలసిన తేదీ',
    availableSlot: 'లభ్యమయ్యే సమయం',
    contactPhone: 'సంప్రదింపు ఫోన్ నంబర్',
    contactEmail: 'ఈమెయిల్ చిరునామా',
    confirmBooking: 'బుకింగ్‌ను నిర్ధారించండి',
    bookingSuccessTitle: 'అపాయింట్‌మెంట్ విజయవంతంగా ఖరారైంది!',
    bookingSuccessDesc: 'మీ అపాయింట్‌మెంట్ వివరాలు నమోదు చేయబడ్డాయి.',
    bookingRef: 'బుకింగ్ రిఫరెన్స్ నంబర్',
    viewAppointments: 'నా అపాయింట్‌మెంట్లు చూడండి'
  },

  hi: {
    appName: 'मेडीमेट AI',
    appTagline: 'आपका व्यक्तिगत AI स्वास्थ्य साथी',
    emergencyBanner: 'आपातकालीन चेतावनी: सीने में तेज दर्द, पक्षाघात के लक्षण या सांस लेने में भारी तकलीफ होने पर तुरंत आपातकालीन चिकित्सा सहायता लें।',
    emergencyAction: '108 / 112 / 911 पर कॉल करें',
    emergencyPhone: '108',
    navDashboard: 'डैशबोर्ड',
    navDoctors: 'डॉक्टर खोजें',
    navBookAppointment: 'अपॉइंटमेंट बुक करें',
    navMyRecords: 'स्वास्थ्य रिकॉर्ड्स',
    navProfile: 'मेरी प्रोफाइल',
    navLogin: 'लॉग इन',
    navRegister: 'खाता बनाएं',
    navLogout: 'लॉग आउट',
    aiCopilotButton: 'AI कोपायलट से पूछें',
    aiCopilotTitle: 'मेडीमेट AI हेल्थ कोपायलट',
    aiCopilotSubtitle: 'चिकित्सीय मार्गदर्शन, स्वास्थ्य शिक्षा और देखभाल सहायता',
    aiCopilotPlaceholder: 'स्वास्थ्य संबंधी सवाल पूछें (उदा: सिरदर्द के कारण, मधुमेह के लिए आहार)...',
    aiCopilotSend: 'भेजें',
    aiCopilotDisclaimer: 'मेडीमेट AI स्वास्थ्य शिक्षा प्रदान करता है, चिकित्सीय निदान नहीं। आपातकाल में तुरंत 108 पर कॉल करें।',

    modulesTitle: 'विशेष स्वास्थ्य मॉड्यूल चुनें',
    modulesSubtitle: 'आपकी उम्र और लक्षणों के अनुसार साक्ष्य-आधारित स्वास्थ्य मार्गदर्शन।',
    womensHealthTitle: 'महिला स्वास्थ्य',
    womensHealthDesc: 'मासिक धर्म, गर्भावस्था देखभाल, पीसीओएस, रजोनिवृत्ति और हार्मोनल संतुलन।',
    mensHealthTitle: 'पुरुष स्वास्थ्य',
    mensHealthDesc: 'मूत्र संबंधी समस्याएं, प्रजनन स्वास्थ्य, प्रोस्टेट, त्वचा और बाल।',
    childrenHealthTitle: 'बाल स्वास्थ्य',
    childrenHealthDesc: 'बाल चिकित्सा, बाल विकास, मौसमी बीमारियां और सुरक्षित देखभाल।',
    seniorHealthTitle: 'वरिष्ठ स्वास्थ्य (50 वर्ष से अधिक)',
    seniorHealthDesc: 'जोड़ों का दर्द, हृदय स्वास्थ्य, पुरानी बीमारियां और गिरने से बचाव।',
    startAssessment: 'मूल्यांकन शुरू करें',

    fullName: 'मरीज का पूरा नाम',
    age: 'आयु',
    years: 'वर्ष',
    months: 'महीने',
    parentGuardianName: 'माता-पिता या अभिभावक का नाम',
    sex: 'लिंग',
    sexMale: 'पुरुष',
    sexFemale: 'महिला',
    sexPreferNotToSay: 'बताना नहीं चाहते',
    healthProblem: 'मुख्य स्वास्थ्य समस्या',
    selectOrTypeProblem: 'सामान्य समस्या चुनें या नीचे लिखें',
    customProblemPlaceholder: 'या अपनी विशिष्ट स्वास्थ्य समस्या का विस्तार से वर्णन करें',
    symptoms: 'वर्तमान लक्षण',
    symptomsPlaceholder: 'उदा: पेट दर्द, हल्का बुखार, थकान, बदन दर्द...',
    duration: 'लक्षण कितने समय से हैं',
    durationPlaceholder: 'उदा: 3 दिन, 2 सप्ताह, 1 महीना...',
    medicalHistoryOptional: 'पिछला चिकित्सीय इतिहास (वैकल्पिक)',
    medicalHistoryPlaceholder: 'उदा: अस्थमा, थायराइड, पिछली सर्जरी, एलर्जी...',
    currentMedicationsOptional: 'वर्तमान दवाएं (वैकल्पिक)',
    currentMedicationsPlaceholder: 'उदा: मेटफॉर्मिन, विटामिन्स...',
    submitButton: 'लक्षण जमा करें',
    submitting: 'विश्लेषण किया जा रहा है...',
    resetButton: 'फॉर्म रीसेट करें',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं',
    editDetails: 'विवरण संपादित करें',

    errNameRequired: 'मरीज का पूरा नाम आवश्यक है।',
    errAgeRequired: 'मान्य आयु दर्ज करें।',
    errSeniorAge: 'वरिष्ठ मॉड्यूल के लिए आयु 50 वर्ष से अधिक होनी चाहिए।',
    errProblemRequired: 'कृपया स्वास्थ्य समस्या चुनें या दर्ज करें।',
    errSymptomsRequired: 'कृपया लक्षणों का विवरण दें।',
    errDurationRequired: 'कृपया बताएं कि लक्षण कितने समय से हैं।',
    errGuardianRequired: 'बच्चों के लिए अभिभावक का नाम आवश्यक है।',

    resultsTitle: 'आपकी व्यक्तिगत स्वास्थ्य रिपोर्ट',
    resultsSubtitle: 'विशेषज्ञ सिफारिशें और सुरक्षित स्व-देखभाल मार्गदर्शन।',
    patientDetailsCard: 'मरीज की जानकारी',
    reportedConcernCard: 'दर्ज किए गए लक्षण और समयसीमा',
    recommendedSpecialty: 'अनुशंसित डॉक्टर विशेषज्ञता',
    specialtyReason: 'यह विशेषज्ञता क्यों उपयुक्त है',
    generalPrecautions: 'सामान्य सावधानियां और सुरक्षित देखभाल',
    thingsToAvoid: 'बचने योग्य महत्वपूर्ण बातें',
    warningSigns: 'चेतावनी के संकेत (तत्काल ध्यान आवश्यक)',
    fallPreventionGuidance: 'वरिष्ठ नागरिकों के लिए गिरने से बचाव के उपाय',
    bookAppointmentWithSpecialist: 'अनुशंसित विशेषज्ञ के साथ अपॉइंटमेंट बुक करें',
    safetyDisclaimer: 'सूचना: यह मार्गदर्शन केवल शैक्षिक उद्देश्यों के लिए है और यह औपचारिक निदान या पर्चा नहीं है। व्यक्तिगत उपचार के लिए डॉक्टर से परामर्श लें।',
    emergencyWarningNotice: 'महत्वपूर्ण चेतावनी: आपातकालीन लक्षण पाए गए हैं। कृपया तुरंत नजदीकी अस्पताल में आपातकालीन सहायता लें।',

    doctorDirectoryTitle: 'डॉक्टर डायरेक्टरी और विशेषज्ञ',
    doctorDirectorySubtitle: 'सत्यापित स्वास्थ्य पेशेवरों से जुड़ें।',
    filterSpecialty: 'विशेषज्ञता के अनुसार खोजें',
    allSpecialties: 'सभी विशेषज्ञताएं',
    filterType: 'परामर्श का प्रकार',
    allTypes: 'सभी प्रकार',
    inPerson: 'व्यक्तिगत (अस्पताल में)',
    onlineConsultation: 'ऑनलाइन वीडियो',
    verifiedDoctor: 'सत्यापित डॉक्टर',
    demoDoctor: 'नमूना / डेमो डॉक्टर',
    experience: 'अनुभव',
    fee: 'परामर्श शुल्क',
    bookNow: 'अपॉइंटमेंट बुक करें',
    preferredDate: 'पसंदीदा तारीख',
    availableSlot: 'उपलब्ध समय',
    contactPhone: 'संपर्क फोन नंबर',
    contactEmail: 'ईमेल पता',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    bookingSuccessTitle: 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!',
    bookingSuccessDesc: 'आपका अपॉइंटमेंट अस्पताल प्रणाली में दर्ज कर लिया गया है।',
    bookingRef: 'बुकिंग संदर्भ संख्या',
    viewAppointments: 'मेरे अपॉइंटमेंट्स देखें'
  },

  ta: {
    appName: 'மெடிமேட் AI',
    appTagline: 'உங்கள் தனிப்பட்ட AI சுகாதார வழிகாட்டி',
    emergencyBanner: 'அவசர மருத்துவ எச்சரிக்கை: கடுமையான நெஞ்சு வலி, பக்கவாத அறிகுறிகள் அல்லது மூச்சுத் திணறல் ஏற்பட்டால் உடனடியாக அவசர மருத்துவ உதவியை நாடவும்.',
    emergencyAction: '108 / 112 / 911 ஐ அழைக்கவும்',
    emergencyPhone: '108',
    navDashboard: 'முகப்பு',
    navDoctors: 'மருத்துவர்கள் பட்டியல்',
    navBookAppointment: 'முன்பதிவு செய்க',
    navMyRecords: 'சுகாதார பதிவுகள்',
    navProfile: 'எனது சுயவிவரம்',
    navLogin: 'உள்நுழைக',
    navRegister: 'பதிவு செய்க',
    navLogout: 'வெளியேறுக',
    aiCopilotButton: 'AI வழிகாட்டியை கேட்கவும்',
    aiCopilotTitle: 'மெடிமேட் AI ஹெல்த் கோபைலட்',
    aiCopilotSubtitle: 'மருத்துவ வழிகாட்டுதல், சுகாதார கல்வி மற்றும் ஆலோசனை',
    aiCopilotPlaceholder: 'சுகாதாரம் குறித்த கேள்விகளைக் கேளுங்கள் (எ.கா: தலைவலி காரணங்கள், நீரிழிவு உணவு முறை)...',
    aiCopilotSend: 'அனுப்புக',
    aiCopilotDisclaimer: 'மெடிமேட் AI சுகாதார கல்வியை வழங்குகிறது, மருத்துவ நோயறிதல் அல்ல. அவசர காலங்களில் 108 ஐ அழைக்கவும்.',

    modulesTitle: 'சிறப்பு சுகாதார பிரிவைத் தேர்ந்தெடுக்கவும்',
    modulesSubtitle: 'உங்கள் வயது மற்றும் அறிகுறிகளுக்கு ஏற்ப தகுந்த மருத்துவ வழிகாட்டுதல்.',
    womensHealthTitle: 'பெண்கள் நலம்',
    womensHealthDesc: 'மாதவிடாய் பிரச்சினைகள், கர்ப்பகால பராமரிப்பு, பிசிஓஎஸ், மெனோபாஸ் மற்றும் ஹார்மோன் சமநிலை.',
    mensHealthTitle: 'ஆண்கள் நலம்',
    mensHealthDesc: 'சிறுநீரக நலம், இனப்பெருக்க ஆரோக்கியம், புரோஸ்டேட், முடி மற்றும் தோல் நலம்.',
    childrenHealthTitle: 'குழந்தைகள் நலம்',
    childrenHealthDesc: 'குழந்தை நல மருத்துவம், வளர்ச்சி, சளி-காய்ச்சல் மற்றும் பாதுகாப்பான வழிகாட்டுதல்.',
    seniorHealthTitle: 'முதியோர் நலம் (50 வயதுக்கு மேற்பட்டவர்கள்)',
    seniorHealthDesc: 'மூட்டு வலி, இதய நலம், நாள்பட்ட நோய்கள் மற்றும் கீழே விழுவதைத் தடுத்தல்.',
    startAssessment: 'ஆய்வைத் தொடங்குங்கள்',

    fullName: 'நோயாளியின் முழுப் பெயர்',
    age: 'வயது',
    years: 'ஆண்டுகள்',
    months: 'மாதங்கள்',
    parentGuardianName: 'பெற்றோர் அல்லது பாதுகாவலரின் பெயர்',
    sex: 'பாலினம்',
    sexMale: 'ஆண்',
    sexFemale: 'பெண்',
    sexPreferNotToSay: 'கூற விரும்பவில்லை',
    healthProblem: 'முதன்மையான சுகாதார பிரச்சினை',
    selectOrTypeProblem: 'பொதுவான பிரச்சினையைத் தேர்வு செய்யவும் அல்லது தட்டச்சு செய்யவும்',
    customProblemPlaceholder: 'அல்லது உங்கள் குறிப்பிட்ட பிரச்சினையை விரிவாக விவரிக்கவும்',
    symptoms: 'தற்போதைய அறிகுறிகள்',
    symptomsPlaceholder: 'எ.கா: வயிற்று வலி, சோர்வு, உடல் வலி, அசதி...',
    duration: 'அறிகுறிகள் எவ்வளவு காலமாக உள்ளன',
    durationPlaceholder: 'எ.கா: 3 நாட்கள், 2 வாரங்கள், 1 மாதம்...',
    medicalHistoryOptional: 'முந்தைய மருத்துவ வரலாறு (விருப்பமானது)',
    medicalHistoryPlaceholder: 'எ.கா: ஆஸ்துமா, தைராய்டு, அறுவை சிகிச்சை, ஒவ்வாமை...',
    currentMedicationsOptional: 'தற்போது உட்கொள்ளும் மருந்துகள் (விருப்பமானது)',
    currentMedicationsPlaceholder: 'எ.கா: மெட்பார்மின், வைட்டமின்கள்...',
    submitButton: 'அறிகுறிகளைச் சமர்ப்பிக்கவும்',
    submitting: 'பகுப்பாய்வு செய்யப்படுகிறது...',
    resetButton: 'படிவத்தை அழிக்கவும்',
    backToDashboard: 'முகப்புக்குத் திரும்பு',
    editDetails: 'விவரங்களைத் திருத்தவும்',

    errNameRequired: 'நோயாளியின் முழுப் பெயர் அவசியம்.',
    errAgeRequired: 'சரியான வயதை உள்ளிடவும்.',
    errSeniorAge: 'முதியோர் பிரிவுக்கு வயது 50 க்கு மேல் இருக்க வேண்டும்.',
    errProblemRequired: 'சுகாதார பிரச்சினையைத் தேர்வு செய்யவும் அல்லது உள்ளிடவும்.',
    errSymptomsRequired: 'அறிகுறிகளை விவரிக்கவும்.',
    errDurationRequired: 'அறிகுறிகள் எவ்வளவு காலம் நீடிக்கின்றன என்பதைக் குறிப்பிடவும்.',
    errGuardianRequired: 'குழந்தைகள் பிரிவுக்கு பாதுகாவலர் பெயர் அவசியம்.',

    resultsTitle: 'உங்கள் தனிப்பயனாக்கப்பட்ட மருத்துவ மதிப்பீடு',
    resultsSubtitle: 'ஆதாரப்பூர்வ வழிகாட்டுதல் மற்றும் மருத்துவ நிபுணர் பரிந்துரை.',
    patientDetailsCard: 'நோயாளி விவரங்கள்',
    reportedConcernCard: 'அறிவிக்கப்பட்ட அறிகுறிகள் & காலம்',
    recommendedSpecialty: 'பரிந்துரைக்கப்பட்ட மருத்துவ நிபுணர்',
    specialtyReason: 'இந்த நிபுணர் ஏன் பொருத்தமானவர்',
    generalPrecautions: 'பொதுவான முன்னெச்சரிக்கைகள் & சுய பராமரிப்பு',
    thingsToAvoid: 'தவிர்க்க வேண்டிய முக்கிய விஷயங்கள்',
    warningSigns: 'அவசர கவனம் தேவைப்படும் எச்சரிக்கை அறிகுறிகள்',
    fallPreventionGuidance: 'முதியவர்கள் கீழே விழுவதைத் தடுப்பதற்கான பாதுகாப்பு வழிகாட்டுதல்',
    bookAppointmentWithSpecialist: 'பரிந்துரைக்கப்பட்ட மருத்துவரிடம் முன்பதிவு செய்க',
    safetyDisclaimer: 'அறிவிப்பு: இந்த வழிகாட்டுதல் விழிப்புணர்வுக்காக மட்டுமே. இது மருத்துவ நோயறிதல் அல்ல. தனிப்பட்ட சிகிச்சைக்கு தகுதியான மருத்துவரை அணுகவும்.',
    emergencyWarningNotice: 'அவசர எச்சரிக்கை: அவசர மருத்துவ அறிகுறிகள் கண்டறியப்பட்டுள்ளன. உடனடியாக அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும்.',

    doctorDirectoryTitle: 'மருத்துவர்கள் பட்டியல் & நிபுணர்கள்',
    doctorDirectorySubtitle: 'சரிபார்க்கப்பட்ட மருத்துவ நிபுணர்களுடன் இணைந்திடுங்கள்.',
    filterSpecialty: 'சிறப்புப் பிரிவு மூலம் வடிகட்டவும்',
    allSpecialties: 'அனைத்து பிரிவுகளும்',
    filterType: 'ஆலோசனை முறை',
    allTypes: 'அனைத்து முறைகளும்',
    inPerson: 'நேரில் (மருத்துவமனை)',
    onlineConsultation: 'ஆன்லைன் வீடியோ',
    verifiedDoctor: 'சரிபார்க்கப்பட்ட மருத்துவர்',
    demoDoctor: 'மாதிரி / டெமோ மருத்துவர்',
    experience: 'அனுபவம்',
    fee: 'கட்டணம்',
    bookNow: 'முன்பதிவு செய்க',
    preferredDate: 'விருப்பமான தேதி',
    availableSlot: 'கிடைக்கும் நேரம்',
    contactPhone: 'தொலைபேசி எண்',
    contactEmail: 'மின்னஞ்சல் முகவரி',
    confirmBooking: 'முன்பதிவை உறுதிப்படுத்துக',
    bookingSuccessTitle: 'முன்பதிவு வெற்றிகரமாக முடிந்தது!',
    bookingSuccessDesc: 'உங்கள் முன்பதிவு மருத்துவமனை அமைப்பில் பதிவு செய்யப்பட்டுள்ளது.',
    bookingRef: 'முன்பதிவு எண்',
    viewAppointments: 'எனது முன்பதிவுகளைக் காண்க'
  }
};
