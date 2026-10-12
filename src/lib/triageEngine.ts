import { ModuleType, TriageResult } from './types';

// Emergency triggers that require immediate emergency intervention
const EMERGENCY_KEYWORDS = [
  'severe chest pain',
  'chest pressure',
  'heart attack',
  'breathing difficulty',
  'unable to breathe',
  'shortness of breath at rest',
  'face drooping',
  'slurred speech',
  'arm weakness',
  'stroke',
  'unconscious',
  'passed out',
  'fainted and not waking',
  'severe bleeding',
  'coughing blood',
  'vomiting blood',
  'stiff neck with high fever',
  'blue lips',
  'bluish skin',
  'severe anaphylaxis',
  'throat swelling',
  'cyanosis'
];

export interface TriageInput {
  moduleType: ModuleType;
  patientName: string;
  age: string | number;
  guardianName?: string;
  healthProblem: string;
  symptoms: string;
  duration: string;
  medicalHistory?: string;
  currentMedications?: string;
  sex?: string;
}

export function detectEmergency(symptoms: string, healthProblem: string): { isEmergency: boolean; reason?: string } {
  const combinedText = `${healthProblem} ${symptoms}`.toLowerCase();
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return {
        isEmergency: true,
        reason: `Potential critical red flag detected: "${keyword}". Immediate emergency evaluation is vital.`
      };
    }
  }
  return { isEmergency: false };
}

export function evaluateClinicalTriage(input: TriageInput): TriageResult {
  const { moduleType, patientName, age, healthProblem, symptoms, duration, medicalHistory, currentMedications } = input;
  const combinedText = `${healthProblem} ${symptoms}`.toLowerCase();
  const emergencyCheck = detectEmergency(symptoms, healthProblem);

  let recommendedSpecialty = 'General Physician & Family Health';
  let specialtyExplanation = 'A board-certified General Physician is recommended as the primary clinician to perform a physical examination, baseline laboratory investigations, and direct you to subspecialists if required.';
  let precautions: string[] = [
    'Maintain adequate hydration with clean water or electrolyte fluids.',
    'Prioritize 7-8 hours of restful sleep and avoid strenuous exertion.',
    'Keep a detailed daily symptom log noting any changes in severity or frequency.',
    'Consult a healthcare provider before starting any non-prescription medications.'
  ];
  let thingsToAvoid: string[] = [
    'Avoid self-medicating with unprescribed antibiotics or strong analgesics.',
    'Avoid heavy physical strain or high stress until clinically evaluated.',
    'Do not delay emergency medical attention if symptoms worsen abruptly.'
  ];
  let warningSigns: string[] = [
    'Sudden, severe shortness of breath or persistent chest discomfort',
    'High fever above 102°F (38.9°C) that fails to respond to basic measures',
    'Inability to keep liquids down, severe dizziness, or fainting',
    'Sudden localized weakness, confusion, or severe worsening of pain'
  ];
  let fallPreventionGuidance: string[] | undefined = undefined;

  // 1. WOMEN'S HEALTH
  if (moduleType === 'womens') {
    if (combinedText.includes('menstru') || combinedText.includes('period') || combinedText.includes('cramp') || combinedText.includes('bleeding') || combinedText.includes('dysmenorrhea')) {
      recommendedSpecialty = 'Gynecologist';
      specialtyExplanation = 'A Gynecologist specializes in female reproductive health, hormonal cycles, and menstrual disorders, providing pelvic evaluations, ultrasounds, and hormonal balancing.';
      precautions = [
        'Apply a warm heating pad to the lower abdomen or lower back to relax uterine muscles.',
        'Drink warm herbal teas such as chamomile or ginger, and stay well-hydrated.',
        'Track cycle dates, flow intensity, and pain scores in a menstrual health diary.',
        'Eat iron-rich foods (spinach, legumes, dates) to support healthy red blood cell counts.'
      ];
      thingsToAvoid = [
        'Avoid excessive caffeine, carbonated drinks, and high-sodium foods which increase water retention and cramping.',
        'Avoid using unverified hormonal supplements without formal endocrine testing.'
      ];
      warningSigns = [
        'Bleeding through more than one pad/tampon every hour for consecutive hours',
        'Severe, debilitating pelvic pain unresponsive to basic comfort measures',
        'Fever, foul-smelling vaginal discharge, or sudden dizziness upon standing'
      ];
    } else if (combinedText.includes('pcos') || combinedText.includes('hormon') || combinedText.includes('facial hair') || combinedText.includes('acne') || combinedText.includes('irregular cycle')) {
      recommendedSpecialty = 'Gynecologist & Reproductive Endocrinologist';
      specialtyExplanation = 'PCOS and hormonal imbalances involve both ovarian function and metabolic pathways (insulin sensitivity). A reproductive endocrinologist or gynecologist can conduct hormone panels, ultrasound scans, and metabolic workups.';
      precautions = [
        'Adopt a low-glycemic, fiber-rich nutritional regimen to stabilize insulin sensitivity.',
        'Engage in gentle daily physical exercise such as brisk walking, pilates, or swimming.',
        'Maintain a consistent sleep-wake schedule to support adrenal and pituitary hormone regulation.'
      ];
      thingsToAvoid = [
        'Avoid refined sugars, sweetened beverages, and ultra-processed seed oils.',
        'Avoid crash dieting or extreme caloric restrictions which trigger cortisol spikes.'
      ];
      warningSigns = [
        'Absence of periods for over 90 consecutive days (excluding pregnancy)',
        'Rapid, unexplained weight swings accompanied by vision changes or severe migraines'
      ];
    } else if (combinedText.includes('pregnan') || combinedText.includes('conception') || combinedText.includes('morning sickness') || combinedText.includes('baby') || combinedText.includes('prenatal')) {
      recommendedSpecialty = 'Obstetrician & Maternal Health Specialist';
      specialtyExplanation = 'Obstetricians focus on maternal and fetal health, prenatal diagnostics, screening scans, and pregnancy care plans.';
      precautions = [
        'Consume small, frequent, bland meals (crackers, oats, ginger) to alleviate nausea.',
        'Maintain prescribed prenatal micronutrients (folic acid, vitamin D) as instructed by your clinician.',
        'Ensure continuous hydration and comfortable lateral resting positions.'
      ];
      thingsToAvoid = [
        'Avoid unpasteurized dairy, raw or undercooked meats, and high-mercury fish.',
        'Never consume prescription or over-the-counter pharmaceuticals without obstetrician clearance.',
        'Avoid hot tubs, saunas, and strenuous contact sports.'
      ];
      warningSigns = [
        'Any vaginal bleeding or spotting during confirmed or suspected pregnancy',
        'Severe localized abdominal pain, cramping, or fluid leakage',
        'Persistent vomiting preventing fluid intake for over 12 hours'
      ];
    } else if (combinedText.includes('menopause') || combinedText.includes('hot flash') || combinedText.includes('night sweat') || combinedText.includes('mood swing')) {
      recommendedSpecialty = 'Gynecologist & Menopause Specialist';
      specialtyExplanation = 'During perimenopause and menopause, estrogen and progesterone fluctuations affect bone density, cardiovascular health, and vasomotor symptoms. A menopause specialist provides evidence-based guidance.';
      precautions = [
        'Dress in layered, breathable natural cotton fabrics to manage vasomotor hot flashes.',
        'Incorporate weight-bearing exercises and calcium-rich foods for bone preservation.',
        'Practice mindfulness, cooling breathwork, and keep bedrooms well-ventilated at night.'
      ];
      thingsToAvoid = [
        'Avoid spicy foods, caffeine, and alcohol within 3 hours of bedtime.',
        'Avoid smoking, which exacerbates bone mineral loss and hot flashes.'
      ];
      warningSigns = [
        'Vaginal bleeding occurring 12+ months after the cessation of periods (postmenopausal bleeding requires prompt biopsy/scan)',
        'Sudden, severe chest palpitations or profound mood depression'
      ];
    } else if (combinedText.includes('breast') || combinedText.includes('lump') || combinedText.includes('nipple') || combinedText.includes('tenderness')) {
      recommendedSpecialty = 'Gynecologist / Breast Care Specialist';
      specialtyExplanation = 'Breast concerns warrant a thorough clinical breast exam, ultrasound, or mammography to evaluate glandular changes, benign fibroadenomas, or structural developments.';
      precautions = [
        'Perform regular gentle self-examinations after menstrual cycles.',
        'Wear a comfortable, non-underwired supportive bra.',
        'Document the exact location, texture, and cyclic variation of any tenderness or nodule.'
      ];
      thingsToAvoid = [
        'Avoid aggressive squeezing or deep manipulation of tender tissue.',
        'Avoid delaying clinical physical examination.'
      ];
      warningSigns = [
        'Hard, painless, immovable breast lump or skin dimpling/puckering',
        'Spontaneous bloody or clear nipple discharge',
        'Inversion of the nipple or persistent redness/peau d’orange texture'
      ];
    } else {
      recommendedSpecialty = 'Gynecologist & Women’s Health Clinician';
      specialtyExplanation = 'A dedicated women’s health physician provides preventative screenings, hormonal evaluations, and tailored female care.';
    }
  }

  // 2. MEN'S HEALTH
  else if (moduleType === 'mens') {
    if (combinedText.includes('urinar') || combinedText.includes('urine') || combinedText.includes('burning') || combinedText.includes('prostate') || combinedText.includes('weak stream') || combinedText.includes('frequent night')) {
      recommendedSpecialty = 'Urologist';
      specialtyExplanation = 'Urologists diagnose and treat conditions of the male urinary tract and prostate gland, including benign prostatic hyperplasia (BPH), infections, and stones.';
      precautions = [
        'Drink 2 to 2.5 liters of clean water daily, spaced evenly throughout the morning and afternoon.',
        'Limit fluid intake 2 hours before bedtime to reduce nocturnal awakenings.',
        'Empty your bladder completely when urinating without straining.'
      ];
      thingsToAvoid = [
        'Avoid high caffeine, alcohol, and spicy foods that irritate the bladder lining.',
        'Do not suppress the urge to urinate for prolonged periods.'
      ];
      warningSigns = [
        'Visible blood in the urine (hematuria - pink, red, or cola-colored)',
        'Inability to pass urine (acute urinary retention is a medical emergency)',
        'High fever accompanied by severe lower back or flank pain'
      ];
    } else if (combinedText.includes('erect') || combinedText.includes('libido') || combinedText.includes('reproduct') || combinedText.includes('testosteron') || combinedText.includes('testic')) {
      recommendedSpecialty = 'Urologist & Andrologist';
      specialtyExplanation = 'An andrologist specializes in male reproductive endocrinology, sexual health, testicular health, and vascular health.';
      precautions = [
        'Focus on cardiovascular health: 30 minutes of aerobic activity improves endothelial blood flow.',
        'Review lifestyle risk factors including smoking cessation and sleep apnea management.',
        'Prioritize balanced nutrition with adequate zinc, magnesium, and healthy fats.'
      ];
      thingsToAvoid = [
        'Avoid purchasing untested herbal stimulants or online counterfeit vitality formulas.',
        'Avoid smoking and excessive alcohol consumption, which impair microvascular circulation.'
      ];
      warningSigns = [
        'Sudden, severe testicular pain or swelling (possible testicular torsion - requires urgent ER evaluation within 6 hours)',
        'Palpable, painless lump or firmness in either testicle'
      ];
    } else if (combinedText.includes('hair') || combinedText.includes('skin') || combinedText.includes('bald') || combinedText.includes('rash') || combinedText.includes('dandruff') || combinedText.includes('itching')) {
      recommendedSpecialty = 'Dermatologist & Trichologist';
      specialtyExplanation = 'Dermatologists diagnose scalp conditions, androgenetic alopecia, skin infections, and eczema using dermoscopy and microscopic assessments.';
      precautions = [
        'Use mild, fragrance-free cleansers and avoid scalding hot showers.',
        'Protect sensitive scalp and facial skin with broad-spectrum SPF 30+ sunscreen.',
        'Pat skin dry gently with a soft towel rather than rubbing vigorously.'
      ];
      thingsToAvoid = [
        'Avoid aggressive chemical hair treatments, harsh bleach, or excessive heat styling.',
        'Do not scratch or squeeze inflammatory skin lesions to prevent secondary bacterial infection.'
      ];
      warningSigns = [
        'Rapidly spreading red, hot, swollen skin rash (possible cellulitis)',
        'A changing mole with irregular borders, multiple colors, or spontaneous bleeding'
      ];
    } else if (combinedText.includes('chest') || combinedText.includes('pressure') || combinedText.includes('fatigue') || combinedText.includes('breath') || combinedText.includes('palpitat') || combinedText.includes('blood pressure')) {
      recommendedSpecialty = 'Cardiologist & Internal Medicine Specialist';
      specialtyExplanation = 'Cardiologists evaluate coronary artery health, resting blood pressure, cardiac rhythm, and metabolic cardiovascular risk factors.';
      precautions = [
        'Monitor and log daily resting blood pressure and pulse readings.',
        'Adopt the DASH diet rich in leafy greens, potassium, and minimal sodium.',
        'Take regular restful breaks during the workday.'
      ];
      thingsToAvoid = [
        'Avoid heavy lifting or sudden high-intensity exertion without clearance.',
        'Eliminate tobacco products, vaping, and energy drinks containing stimulant stimulants.'
      ];
      warningSigns = [
        'Chest pain, tightness, radiating discomfort to left arm, neck, or jaw',
        'Sudden shortness of breath accompanied by cold sweats or dizziness'
      ];
    } else {
      recommendedSpecialty = 'General Physician & Family Health';
      specialtyExplanation = 'A comprehensive physical exam, lipid panel, metabolic profile, and blood pressure screening will provide holistic clarity on your symptoms.';
    }
  }

  // 3. CHILDREN'S HEALTH
  else if (moduleType === 'children') {
    recommendedSpecialty = 'Pediatrician';
    specialtyExplanation = 'Pediatricians specialize in physical, behavioral, and developmental health from infancy through adolescence, tailoring care to pediatric physiology.';
    
    if (combinedText.includes('fever') || combinedText.includes('temperature') || combinedText.includes('hot')) {
      precautions = [
        'Ensure the child stays comfortably hydrated with frequent sips of water, oral rehydration solution (ORS), or breastmilk/formula for infants.',
        'Dress the child in lightweight, loose cotton clothing and keep room temperature comfortable.',
        'Use lukewarm (not cold) sponge cloths on forehead if child is distressed.',
        'Consult a pediatrician for weight-based medication dosages if fever causes discomfort.'
      ];
      thingsToAvoid = [
        'NEVER administer Aspirin to children or teenagers due to the risk of Reye\'s Syndrome (a severe hepatic and neurological condition).',
        'Never give cold baths, ice packs, or alcohol rubs to lower temperature.',
        'Do not exceed recommended intervals for pediatric paracetamol or ibuprofen, and never guess dosages without a doctor\'s prescription.'
      ];
      warningSigns = [
        'Infant under 3 months with a rectal temperature of 100.4°F (38°C) or higher (requires immediate hospital evaluation)',
        'Child is lethargic, difficult to awaken, or unresponsive to parent voices',
        'Stiff neck, purple or dark red non-blanching rash, or febrile seizure',
        'Rapid breathing with flaring nostrils or chest pulling in beneath the ribs (retractions)'
      ];
    } else if (combinedText.includes('cough') || combinedText.includes('cold') || combinedText.includes('wheez') || combinedText.includes('breathing')) {
      recommendedSpecialty = combinedText.includes('wheez') ? 'Pediatric Pulmonologist / Pediatrician' : 'Pediatrician';
      specialtyExplanation = 'Pediatric respiratory conditions require specialized listening to lung sounds, oxygen saturation checks, and safe pediatric nebulization if indicated.';
      precautions = [
        'Use a cool-mist room humidifier to soothe irritated airways.',
        'For infants, apply saline nasal drops and gently suction secretions before feeds.',
        'Keep the child’s head slightly elevated during rest.'
      ];
      thingsToAvoid = [
        'Avoid over-the-counter cough and cold syrups for children under 6 years without pediatric prescription.',
        'Keep children strictly away from secondhand smoke, incense smoke, and strong aerosol sprays.'
      ];
      warningSigns = [
        'Grunting sounds with each breath, or inability to speak/cry in full sentences',
        'Bluish or grayish tint around the lips, tongue, or nail beds',
        'Refusal to drink fluids leading to dry diapers for more than 6-8 hours'
      ];
    } else {
      precautions = [
        'Maintain a balanced, easily digestible diet with plenty of fluids.',
        'Ensure ample rest and quiet play in a calm environment.',
        'Observe appetite, activity level, and diaper counts/urination frequency.'
      ];
      thingsToAvoid = [
        'Avoid administering adult medicines or leftover antibiotic syrups from previous illnesses.',
        'Do not force-feed solid food if child feels nauseous; prioritize hydration.'
      ];
      warningSigns = [
        'Persistent inconsolable crying for hours',
        'Persistent vomiting or signs of dehydration (sunken eyes, no tears when crying)',
        'Sudden loss of motor or verbal milestones'
      ];
    }
  }

  // 4. SENIOR HEALTH (ABOVE 50 YEARS)
  else if (moduleType === 'senior') {
    fallPreventionGuidance = [
      'Ensure hallways, staircases, and bathrooms are brightly illuminated, especially during nighttime.',
      'Remove loose throw rugs, clutter, and electrical cords from high-traffic walking pathways.',
      'Install sturdy grab bars inside the shower and next to the toilet, along with non-slip bath mats.',
      'Wear supportive footwear with non-skid rubber soles both indoors and outdoors.',
      'Have vision and hearing checked annually to preserve spatial depth perception.'
    ];

    if (combinedText.includes('joint') || combinedText.includes('knee') || combinedText.includes('hip') || combinedText.includes('back') || combinedText.includes('arthrit') || combinedText.includes('stiff')) {
      recommendedSpecialty = 'Orthopedic Specialist & Rheumatologist';
      specialtyExplanation = 'For adults over 50, degenerative cartilage changes (osteoarthritis) or inflammatory joint conditions benefit from targeted imaging, physical therapy, and joint-preservation protocols.';
      precautions = [
        'Engage in low-impact movement: water aerobics, stationary cycling, or gentle chair yoga to lubricate joints.',
        'Apply warm compresses for morning stiffness, and ice packs after periods of sustained walking.',
        'Maintain a healthy body weight to significantly reduce compressive load on knee and hip joints.'
      ];
      thingsToAvoid = [
        'Avoid high-impact jumping, sudden twisting, or lifting heavy loads improperly.',
        'Avoid prolonged stationary bed rest, which accelerates muscle deconditioning and worsens joint stiffness.'
      ];
      warningSigns = [
        'Sudden joint redness, intense heat, and severe swelling with fever (possible septic arthritis)',
        'Inability to bear any weight on a hip or knee following a slip or stumble'
      ];
    } else if (combinedText.includes('heart') || combinedText.includes('blood pressure') || combinedText.includes('bp') || combinedText.includes('palpitat') || combinedText.includes('shortness of breath') || combinedText.includes('swelling in legs')) {
      recommendedSpecialty = 'Cardiologist & Geriatric Physician';
      specialtyExplanation = 'Cardiovascular assessment in adults over 50 includes ECG, echocardiography, lipid management, and medication reconciliation to optimize vascular function.';
      precautions = [
        'Record blood pressure twice daily (morning and evening) in a quiet seated position.',
        'Elevate legs on pillows while seated to assist venous return if mild dependent ankle edema is present.',
        'Follow a low-sodium, potassium-balanced culinary approach.'
      ];
      thingsToAvoid = [
        'Avoid sudden cessation of prescribed antihypertensive medications without physician advice.',
        'Avoid high-sodium packaged snacks, canned soups, and heavy pickles.'
      ];
      warningSigns = [
        'Sudden crushing chest discomfort, pressure, or unexplained lightheadedness',
        'Rapid weight gain (>2 kg in 48 hours) with increased ankle swelling and breathlessness when lying flat'
      ];
    } else if (combinedText.includes('sugar') || combinedText.includes('diabet') || combinedText.includes('thirst') || combinedText.includes('urination') || combinedText.includes('weight loss') || combinedText.includes('thyroid')) {
      recommendedSpecialty = 'Endocrinologist & Geriatric Diabetologist';
      specialtyExplanation = 'Metabolic disorders in older adults require balanced glycemic control to avoid dangerous hypoglycemia while preventing microvascular complications.';
      precautions = [
        'Perform regular fasting and postprandial capillary blood glucose monitoring.',
        'Inspect feet daily for small cuts, blisters, or pressure sores with a magnifying mirror.',
        'Carry fast-acting glucose tablets or fruit candies for accidental hypoglycemia episodes.'
      ];
      thingsToAvoid = [
        'Never skip meals when taking insulin or insulin secretagogues.',
        'Avoid walking barefoot indoors or outdoors to prevent unnoticed neuropathic wounds.'
      ];
      warningSigns = [
        'Signs of severe hypoglycemia: intense trembling, cold diaphoresis, slurred speech, confusion',
        'Fruity breath odor accompanied by persistent nausea and rapid deep breathing'
      ];
    } else if (combinedText.includes('memory') || combinedText.includes('forget') || combinedText.includes('dizz') || combinedText.includes('fall') || combinedText.includes('balance') || combinedText.includes('shaking') || combinedText.includes('tremor')) {
      recommendedSpecialty = 'Geriatrician & Neurologist';
      specialtyExplanation = 'A comprehensive geriatric assessment reviews neuro-cognitive function, gait stability, sensory acuity, and polypharmacy interactions to protect independent living.';
      precautions = [
        'Perform a comprehensive medication review with your physician to eliminate drugs that cause drowsiness or postural hypotension.',
        'Stand up slowly from sitting or lying positions to allow blood pressure to equalize.',
        'Engage in brain-stimulating puzzles, reading, social interaction, and daily routines.'
      ];
      thingsToAvoid = [
        'Avoid mixing sleeping aids or antihistamines without clinical oversight.',
        'Avoid walking in unlit rooms or without prescribed walking aids (cane/walker).'
      ];
      warningSigns = [
        'Sudden acute confusion, agitation, or disorientation that developed over hours to days (delirium requires urgent medical attention)',
        'Any fall accompanied by head trauma, loss of consciousness, or inability to stand'
      ];
    } else {
      recommendedSpecialty = 'Geriatrician & Senior Health Specialist';
      specialtyExplanation = 'A Geriatrician provides specialized, holistic care for older adults, focusing on vitality, chronic disease optimization, functional independence, and medication safety.';
    }
  }

  // Override if critical emergency was detected
  if (emergencyCheck.isEmergency) {
    recommendedSpecialty = 'Emergency Medicine & Urgent Care Department';
    specialtyExplanation = 'CRITICAL RED FLAG DETECTED. The symptoms described require immediate clinical evaluation by emergency healthcare professionals rather than a delayed routine outpatient consultation.';
    warningSigns = [
      'IMMEDIATELY CALL EMERGENCY SERVICES (108 / 112 / 911) OR GO TO THE NEAREST HOSPITAL EMERGENCY ROOM',
      'Do not drive yourself to the hospital; have an ambulance or family member transport you',
      'Sit or lie in a comfortable, safe position and keep doors unlocked for paramedics'
    ];
  }

  return {
    patientName,
    patientAge: age,
    moduleType,
    reportedConcern: healthProblem,
    symptoms,
    duration,
    medicalHistory,
    currentMedications,
    recommendedSpecialty,
    specialtyExplanation,
    precautions,
    thingsToAvoid,
    warningSigns,
    isEmergency: emergencyCheck.isEmergency,
    emergencyReason: emergencyCheck.reason,
    fallPreventionGuidance,
    timestamp: new Date().toISOString()
  };
}
