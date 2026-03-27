export const TEMPLATE_SERVICES = [
  // Preventive
  { name: 'Routine Dental Cleaning', duration: 45, category: 'preventive' },
  { name: 'Comprehensive Dental Exam', duration: 60, category: 'preventive' },
  { name: 'Dental X-Rays', duration: 20, category: 'preventive' },
  { name: 'Fluoride Treatment', duration: 20, category: 'preventive' },
  { name: 'Fissure Sealants', duration: 30, category: 'preventive' },

  // Restorative
  { name: 'Tooth Filling (Composite)', duration: 45, category: 'restorative' },
  { name: 'Dental Crown', duration: 90, category: 'restorative' },
  { name: 'Root Canal Treatment', duration: 90, category: 'restorative' },
  { name: 'Tooth Extraction (Simple)', duration: 30, category: 'restorative' },
  { name: 'Wisdom Tooth Extraction', duration: 60, category: 'restorative' },
  { name: 'Dental Bridge', duration: 90, category: 'restorative' },
  { name: 'Dentures (Full / Partial)', duration: 60, category: 'restorative' },

  // Cosmetic
  { name: 'Teeth Whitening (In-Chair)', duration: 90, category: 'cosmetic' },
  { name: 'Dental Veneers', duration: 90, category: 'cosmetic' },
  { name: 'Smile Makeover Consultation', duration: 45, category: 'cosmetic' },

  // Orthodontics
  { name: 'Invisalign Consultation', duration: 45, category: 'orthodontics' },
  { name: 'Braces Consultation', duration: 45, category: 'orthodontics' },
  { name: 'Retainer Fitting', duration: 30, category: 'orthodontics' },

  // Implants & Surgery
  { name: 'Dental Implant Consultation', duration: 45, category: 'implants' },
  { name: 'Dental Implant Placement', duration: 120, category: 'implants' },
  { name: 'Bone Grafting Consultation', duration: 45, category: 'implants' },

  // Emergency
  { name: 'Emergency Dental Appointment', duration: 30, category: 'emergency' },
  { name: 'Broken Tooth Repair', duration: 45, category: 'emergency' },
  { name: 'Toothache Consultation', duration: 30, category: 'emergency' },

  // Paediatric
  { name: 'Children\'s Dental Checkup', duration: 30, category: 'paediatric' },
  { name: 'Child Tooth Extraction', duration: 30, category: 'paediatric' },

  // New Patient
  { name: 'New Patient Comprehensive Exam', duration: 60, category: 'new_patient' },
]

export const TEMPLATE_FAQS = [
  {
    question: 'How often should I visit the dentist?',
    answer: 'We recommend a checkup and cleaning every 6 months. Patients with gum disease or other conditions may need more frequent visits.',
  },
  {
    question: 'Does teeth whitening hurt?',
    answer: 'Some patients experience temporary sensitivity during or after whitening. We use professional-grade products and can apply desensitising gel to minimise discomfort.',
  },
  {
    question: 'How long does a root canal take?',
    answer: 'Most root canals take 60–90 minutes. Complex cases may require a second visit. Modern techniques make the procedure comfortable and pain-free.',
  },
  {
    question: 'Do you accept insurance?',
    answer: 'We work with most major dental insurance plans. Please contact us with your provider details and we will confirm your coverage before your appointment.',
  },
  {
    question: 'What should I do in a dental emergency?',
    answer: 'Call us immediately. For a knocked-out tooth, keep it moist (in milk or saliva) and come in within 30 minutes for the best chance of saving it.',
  },
  {
    question: 'How much does a dental implant cost?',
    answer: 'Implant costs vary depending on the case. A single implant typically starts from $2,500. We offer a free consultation to provide an accurate quote.',
  },
  {
    question: 'Is Invisalign suitable for me?',
    answer: 'Invisalign works for most mild to moderate alignment issues. Book a free consultation and we will assess your teeth and show you a 3D preview of your results.',
  },
  {
    question: 'How do I book an appointment?',
    answer: 'You can book directly through this chat, call us, or use our online booking form. We offer morning, afternoon, and evening slots.',
  },
]

export const TEMPLATE_PROMOTIONS = [
  {
    code: 'WELCOME15',
    description: '15% off for new patients on their first visit',
    discount_type: 'percentage',
    discount_value: 15,
    active: true,
  },
  {
    code: 'CLEAN50',
    description: '$50 off routine cleaning for new patients',
    discount_type: 'fixed',
    discount_value: 50,
    active: true,
  },
  {
    code: 'FAMILY10',
    description: '10% off for family bookings (2 or more patients)',
    discount_type: 'percentage',
    discount_value: 10,
    active: false,
  },
]
