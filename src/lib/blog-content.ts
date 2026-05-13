// Centralised blog content for each service.
// Slug = lowercased service name with spaces / slashes → "-".

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroImage: string;
  readTime: string;
  category: string;
  intro: string;
  sections: { heading: string; body: string; image?: string }[];
  takeaways: string[];
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const BLOGS: BlogPost[] = [
  {
    slug: "general-physician",
    title: "General Physician Care: Your First Line of Lifelong Health",
    metaTitle: "General Physician in Kondapur | Dev's Multispeciality Clinic",
    metaDescription:
      "Expert general physician consultations in Kondapur for fever, infections, diabetes, hypertension and preventive health checks.",
    keywords: ["general physician", "family doctor", "preventive care", "health checkup", "kondapur"],
    heroImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
    readTime: "6 min read",
    category: "Primary Care",
    intro:
      "A trusted general physician is the cornerstone of long-term health. From a sudden fever to managing chronic conditions like diabetes or hypertension, your GP coordinates every aspect of your wellbeing — and often catches what specialists never see.",
    sections: [
      {
        heading: "What a General Physician actually treats",
        body:
          "General physicians manage acute infections (fever, flu, throat and urinary infections), lifestyle disorders (diabetes, hypertension, thyroid, cholesterol), gastritis, anaemia, allergies and post-viral recovery. They also screen for early signs of cardiac, kidney and liver disease — long before symptoms appear.",
      },
      {
        heading: "Why preventive consultations matter more than cures",
        body:
          "Most chronic illnesses develop silently for years. An annual health review with a physician — including BP, blood sugar, lipid profile, BMI and a focused physical exam — can cut your lifetime risk of stroke, heart attack and kidney failure dramatically.",
        image:
          "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "When to see a physician immediately",
        body:
          "Fever above 102°F lasting more than 48 hours, unexplained weight loss, persistent cough, chest discomfort, breathlessness, severe headache, or any sudden change in your usual health pattern deserves a same-day consultation.",
      },
      {
        heading: "How we work at Dev's Multispeciality Clinic",
        body:
          "Our physicians spend unhurried time with every patient, review prior reports, and coordinate with in-house pharmacy, diagnostics and specialists — so you get a complete answer in one visit, not five.",
      },
    ],
    takeaways: [
      "Annual physical exams catch silent illness early",
      "Don't self-medicate fever beyond 48 hours",
      "Bring all old reports & medication lists to your visit",
    ],
  },
  {
    slug: "orthopaedic",
    title: "Orthopaedic Care: Restoring Movement, Relieving Pain",
    metaTitle: "Best Orthopaedic Doctor in Kondapur | Joint, Bone & Spine Care",
    metaDescription:
      "Comprehensive orthopaedic treatment for joint pain, fractures, sports injuries, arthritis and spine problems in Kondapur, Hyderabad.",
    keywords: ["orthopaedic", "joint pain", "knee pain", "back pain", "fracture", "arthritis"],
    heroImage:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1600&q=80",
    readTime: "7 min read",
    category: "Bone & Joint",
    intro:
      "Bones, joints and the spine carry every step you take. Modern orthopaedics combines precision diagnostics, image-guided injections and minimally invasive surgery to get you back to pain-free movement — often without major surgery.",
    sections: [
      {
        heading: "Common orthopaedic problems we see daily",
        body:
          "Knee osteoarthritis, frozen shoulder, low back pain, sciatica, sports ligament tears, tennis/golfer's elbow, plantar fasciitis, and post-fracture rehabilitation. Most respond beautifully to non-surgical care if started early.",
      },
      {
        heading: "When pain is a red flag",
        body:
          "Pain that wakes you at night, joint swelling with fever, sudden weakness in a limb, or back pain with numbness in legs needs urgent orthopaedic review — these can signal infection, nerve compression or serious injury.",
        image:
          "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "The non-surgical first approach",
        body:
          "Tailored physiotherapy, posture correction, weight management, ergonomic advice, and ultrasound-guided injections resolve over 70% of orthopaedic complaints without ever entering an operating room.",
      },
      {
        heading: "When surgery is genuinely required",
        body:
          "Displaced fractures, advanced arthritis, complete ligament tears or persistent nerve compression may need arthroscopy, joint replacement or spine surgery. We refer transparently and only when truly indicated.",
      },
    ],
    takeaways: [
      "Don't ignore joint pain lasting more than 2 weeks",
      "Early physiotherapy beats late surgery",
      "Strong muscles protect weak joints — keep moving",
    ],
  },
  {
    slug: "physiotherapy",
    title: "Physiotherapy: The Science of Healing Through Movement",
    metaTitle: "Physiotherapy Clinic in Kondapur | Sports & Pain Rehabilitation",
    metaDescription:
      "Evidence-based physiotherapy for back pain, post-surgical recovery, sports injuries, stroke rehab and posture correction.",
    keywords: ["physiotherapy", "rehabilitation", "back pain", "sports injury", "stroke recovery"],
    heroImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80",
    readTime: "6 min read",
    category: "Rehabilitation",
    intro:
      "Physiotherapy is no longer just hot packs and massage. It's a measured, evidence-based discipline that reverses pain, rebuilds strength after surgery, and helps stroke survivors walk again.",
    sections: [
      {
        heading: "Conditions that respond best to physiotherapy",
        body:
          "Chronic back & neck pain, frozen shoulder, post-fracture stiffness, ACL/meniscus rehab, sciatica, vertigo (BPPV), Bell's palsy, post-stroke weakness, and pre-/post-operative joint replacement recovery.",
      },
      {
        heading: "Why technique beats intensity",
        body:
          "Doing the wrong exercise — or the right one with bad form — can worsen pain. A trained physiotherapist assesses joint range, muscle imbalance and movement patterns, then prescribes the precise dose of exercise your body needs.",
        image:
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "Modalities we use",
        body:
          "Manual therapy, dry needling, ultrasound therapy, IFT/TENS, kinesio-taping, postural retraining, and structured home-exercise programmes — combined intelligently for each patient.",
      },
      {
        heading: "Recovery is a partnership",
        body:
          "Three sessions a week at the clinic plus 10 minutes of correct daily exercise at home will outperform daily sessions without homework. Consistency beats intensity, every time.",
      },
    ],
    takeaways: [
      "Physiotherapy reverses pain that pills only mask",
      "Home exercises decide your final outcome",
      "Start rehab early after any surgery or injury",
    ],
  },
  {
    slug: "gastroenterology",
    title: "Gastroenterology: Listen to Your Gut",
    metaTitle: "Gastroenterologist in Kondapur | Acidity, Liver & Digestive Care",
    metaDescription:
      "Expert care for acidity, IBS, fatty liver, ulcers, jaundice and digestive disorders by experienced gastroenterologists.",
    keywords: ["gastroenterology", "acidity", "fatty liver", "IBS", "constipation", "endoscopy"],
    heroImage:
      "https://images.unsplash.com/photo-1559757175-08bb73c47ed7?auto=format&fit=crop&w=1600&q=80",
    readTime: "7 min read",
    category: "Digestive Health",
    intro:
      "Your gut influences your immunity, mood, weight and metabolism. Modern gastroenterology can diagnose silent liver disease, treat acidity at the root, and pick up cancers years before symptoms.",
    sections: [
      {
        heading: "The most overlooked digestive complaints",
        body:
          "Chronic acidity, bloating after meals, alternating constipation and loose stools, fatty liver on a routine scan, and unexplained iron-deficiency anaemia are all early signals that deserve evaluation — not antacids forever.",
      },
      {
        heading: "Fatty liver: the silent epidemic",
        body:
          "1 in 3 urban Indian adults already has fatty liver. Left untreated it progresses to fibrosis and cirrhosis. The good news: it's almost fully reversible with weight loss, sugar control and exercise — if caught early.",
        image:
          "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "When endoscopy is genuinely needed",
        body:
          "Persistent reflux, difficulty swallowing, black stools, unexplained weight loss, or iron-deficiency anaemia in adults over 40 are clear indications. A 10-minute endoscopy can rule out ulcers and cancers definitively.",
      },
      {
        heading: "Lifestyle is medicine for the gut",
        body:
          "Smaller, slower meals, 8 hours of sleep, 30 minutes of daily walking, and reducing ultra-processed food can resolve more digestive complaints than any prescription.",
      },
    ],
    takeaways: [
      "Don't take daily antacids without diagnosis",
      "Get a liver scan if BMI > 25",
      "Black stools or weight loss = endoscopy now",
    ],
  },
  {
    slug: "diagnostics",
    title: "Diagnostics: Numbers That Save Lives",
    metaTitle: "Diagnostic Lab in Kondapur | Blood Tests & Health Checkups",
    metaDescription:
      "Accurate, fast diagnostic testing — blood, urine, hormones, full body checkups — at Dev's Multispeciality Clinic.",
    keywords: ["diagnostics", "blood test", "lab", "health checkup", "pathology"],
    heroImage:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=80",
    readTime: "5 min read",
    category: "Lab & Pathology",
    intro:
      "A good diagnostic report is more than numbers — it's a roadmap. Accurate sampling, calibrated machines and the right reference ranges turn a blood draw into a powerful preventive tool.",
    sections: [
      {
        heading: "Tests every adult should consider yearly",
        body:
          "CBC, fasting blood sugar & HbA1c, lipid profile, liver & kidney function, thyroid (TSH), Vitamin D and B12, urine routine. After 40, add ECG and an annual physician review.",
      },
      {
        heading: "Why preparation changes results",
        body:
          "Fasting tests truly need 10–12 hours of fasting. Heavy exercise the previous evening can falsely elevate liver enzymes. Hydration affects kidney markers. Follow pre-test instructions carefully.",
        image:
          "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "Reading your report sensibly",
        body:
          "A single 'high' value rarely means disease. Trends over time, combined with symptoms and other markers, matter far more than one out-of-range number. Always review reports with your physician.",
      },
      {
        heading: "Quality matters",
        body:
          "We use NABL-grade equipment, internal & external quality controls, and trained phlebotomists — because a wrong report is worse than no report.",
      },
    ],
    takeaways: [
      "Fast properly before fasting tests",
      "One annual checkup outperforms occasional panic tests",
      "Always interpret reports with a doctor, never alone",
    ],
  },
  {
    slug: "digital-x-ray",
    title: "Digital X-Ray: Sharper Images, Lower Radiation",
    metaTitle: "Digital X-Ray in Kondapur | Instant Reports, Low Radiation",
    metaDescription:
      "High-resolution digital X-ray imaging with up to 90% less radiation than conventional film. Instant reports.",
    keywords: ["digital x-ray", "imaging", "radiology", "chest x-ray", "fracture x-ray"],
    heroImage:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1600&q=80",
    readTime: "4 min read",
    category: "Imaging",
    intro:
      "Digital X-ray has replaced film almost entirely — and for good reason. Lower radiation, sharper images, instant viewing, and the ability to digitally enhance contrast make diagnosis faster and safer.",
    sections: [
      {
        heading: "What digital X-ray reveals best",
        body:
          "Bone fractures and dislocations, lung infections like pneumonia and tuberculosis, sinusitis, dental and jaw conditions, and abdominal obstruction. It's still the fastest, cheapest first-line imaging study.",
      },
      {
        heading: "Radiation: the honest truth",
        body:
          "A single chest X-ray delivers about the same radiation as 10 days of natural background exposure. With digital sensors, doses are 50–90% lower than film X-rays — perfectly safe when clinically indicated.",
        image:
          "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "When X-ray is not enough",
        body:
          "Soft-tissue injuries (ligaments, tendons, brain, organs) need ultrasound, CT or MRI. Your physician will choose the right modality — never demand an unnecessary scan.",
      },
      {
        heading: "Pregnancy & paediatric care",
        body:
          "Pregnant patients should always inform staff before any imaging. For children, we use the lowest possible dose with protective shielding.",
      },
    ],
    takeaways: [
      "Digital X-ray = lower radiation, faster reports",
      "Always declare pregnancy before imaging",
      "X-ray is for bone & lung — not soft tissue",
    ],
  },
  {
    slug: "pharmacy",
    title: "Pharmacy: Where Prescriptions Become Real Healing",
    metaTitle: "In-house Pharmacy in Kondapur | Genuine Medicines, Counselling",
    metaDescription:
      "Genuine medicines, expert pharmacist counselling and home delivery from Dev's Multispeciality Clinic pharmacy.",
    keywords: ["pharmacy", "medicines", "prescription", "drug counselling"],
    heroImage:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80",
    readTime: "5 min read",
    category: "Pharmacy",
    intro:
      "A pharmacy is more than a counter that hands over medicines — it's the last line of safety between a prescription and your body. Drug interactions, dosage errors and counterfeit medicines harm thousands every year.",
    sections: [
      {
        heading: "Why the source of your medicine matters",
        body:
          "Counterfeit and substandard medicines are a documented problem in India. Buying from a licensed, temperature-controlled pharmacy with genuine supply-chain documentation guarantees what's on the label is in the tablet.",
      },
      {
        heading: "Drug interactions: the hidden danger",
        body:
          "Common combinations like blood thinners + painkillers, or certain antibiotics + cholesterol drugs, can cause serious harm. A trained pharmacist reviews every prescription against your existing medications.",
        image:
          "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "Storage matters more than you think",
        body:
          "Many medicines lose potency when stored above 25°C or in a humid bathroom. Insulin, eye drops and antibiotics are especially sensitive. Keep medicines in a cool, dark, dry place.",
      },
      {
        heading: "Adherence is the single best predictor of recovery",
        body:
          "Skipping doses or stopping antibiotics early creates resistant infections and treatment failures. If side effects are intolerable, talk to your doctor — never stop on your own.",
      },
    ],
    takeaways: [
      "Buy only from licensed pharmacies",
      "Always show your full medication list",
      "Never stop antibiotics or BP/diabetes meds on your own",
    ],
  },
  {
    slug: "surgicals",
    title: "Surgical Care: Modern, Minimally Invasive, Safer Than Ever",
    metaTitle: "Minor & Day-care Surgicals in Kondapur | Safe Procedures",
    metaDescription:
      "Minor surgicals, day-care procedures, dressings and post-operative care delivered with hospital-grade safety standards.",
    keywords: ["surgicals", "minor surgery", "day care", "wound care", "dressing"],
    heroImage:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80",
    readTime: "6 min read",
    category: "Surgical Care",
    intro:
      "Many procedures that once required a hospital admission are now safely done as 30-minute clinic visits. Modern instruments, sterile technique and proper anaesthesia have made minor surgery faster and far safer.",
    sections: [
      {
        heading: "Common procedures we perform",
        body:
          "Wound suturing, abscess drainage, lipoma & cyst removal, ingrown toenail correction, ear lobe repair, foreign-body removal, biopsies, and post-operative dressings & suture removal.",
      },
      {
        heading: "Sterilisation is non-negotiable",
        body:
          "Every instrument is autoclaved, every surface disinfected, and single-use disposables are exactly that — single use. This is the difference between a safe procedure and a hospital-acquired infection.",
        image:
          "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=80",
      },
      {
        heading: "What to expect on procedure day",
        body:
          "Eat lightly, take routine medicines unless told otherwise, bring a companion if local anaesthesia is planned, and follow wound-care instructions strictly for the first 48 hours.",
      },
      {
        heading: "When to call us after a procedure",
        body:
          "Increasing pain, swelling, redness spreading beyond the wound, fever, or any discharge from the wound site needs immediate review. Most issues are easily managed if caught early.",
      },
    ],
    takeaways: [
      "Minor surgery should be quick, sterile and painless",
      "Follow wound-care instructions to the letter",
      "Call us early if anything feels wrong post-procedure",
    ],
  },
];

export const blogBySlug: Record<string, BlogPost> = Object.fromEntries(
  BLOGS.map((b) => [b.slug, b]),
);

export const allBlogs = BLOGS;
