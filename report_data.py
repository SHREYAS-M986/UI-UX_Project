# report_data.py
# Submission-ready academic project report data for AccessAudit
# V Semester B.E. (CSE), East Point College of Engineering and Technology

CERTIFICATE_DATA = {
    "header_image": "evidence/template_assets/college_header.png",
    "department": "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
    "course": "V Semester B.E. (CSE)",
    "title": "CERTIFICATE",
    "body_text": (
        "This is to certify that the project work entitled \"Accessibility Audit Tool for Developers "
        "(AccessAudit)\" is a bonafide work carried out by [Student Name] (USN: [USN], Section: [Section], "
        "Sl No: [Sl No]) in partial fulfillment for the award of Bachelor of Engineering in Computer Science "
        "and Engineering of the Visvesvaraya Technological University, Belagavi during the academic year "
        "[20XX-XX]. It is certified that all corrections/suggestions indicated for internal assessment have "
        "been incorporated in the report deposited in the departmental library. The project report has been "
        "approved as it satisfies the academic requirements in respect of Project Work prescribed for the "
        "said Degree."
    ),
    "guide_name": "Prasanth",
    "guide_title": "Assistant Professor, Dept. of CSE",
    "hod_name": "Dr. [HOD Name]",
    "hod_title": "Professor & Head, Dept. of CSE",
    "date": "[DD-MM-YYYY]",
    "examiner_1": "1. Name: [Examiner 1 Name]          Signature: ____________________",
    "examiner_2": "2. Name: [Examiner 2 Name]          Signature: ____________________"
}

ABSTRACT_TEXT = (
    "Digital accessibility remains a persistent crisis in modern web engineering: industry audits reveal "
    "that over 95.9% of top homepages violate Web Content Accessibility Guidelines (WCAG) [VERIFIED]. While automated "
    "accessibility engines can detect up to 40% of barrier classes, current tooling overwhelms frontend developers "
    "by dumping flat, uncurated lists of hundreds of technical violations lacking developmental context or prioritization. "
    "This report presents \"AccessAudit\", an actionable accessibility audit web application engineered specifically for "
    "developer workflows. Built on a sandboxed client-side axe-core v4.10 engine and a secure server-side request forgery "
    "(SSRF)-defended proxy, AccessAudit introduces an automated prioritization algorithm that ranks issues by their "
    "impact-to-effort ratio, a contextual slide-out drawer providing before-and-after framework code remediations, "
    "and intrinsic motivational gamification via dynamic velocity tracking and streak counters. The interface adheres to "
    "a strict, natural five-color palette rendered through an accessible glassmorphic visual system with strict opaque fallbacks. "
    "Automated WCAG 2.2 AA testing confirmed 0 axe-core violations and a 96 Lighthouse accessibility score across all core views [VERIFIED]. "
    "Formal empirical usability and System Usability Scale (SUS) benchmarks are currently designated as [PENDING] awaiting final participant execution."
)

TOC_ITEMS = [
    ("Certificate", "i"),
    ("Abstract", "ii"),
    ("Table of Contents", "iii"),
    ("List of Figures", "iv"),
    ("List of Tables", "v"),
    ("CHAPTER 1: PROBLEM DEFINITION AND SCOPE", "1"),
    ("    1.1 Background and Context", "1"),
    ("    1.2 Problem Statement", "3"),
    ("    1.3 Project Objectives", "4"),
    ("    1.4 Scope and System Boundaries", "5"),
    ("    1.5 Stakeholder Ecosystem Analysis", "7"),
    ("    1.6 Success Metrics and Target KPIs", "9"),
    ("CHAPTER 2: USER RESEARCH AND COMPETITIVE BENCHMARKING", "11"),
    ("    2.1 Research Methodology and Protocol", "11"),
    ("    2.2 Participant Demographics", "13"),
    ("    2.3 Competitive Benchmarking", "14"),
    ("    2.4 Research Synthesis and Key Findings", "17"),
    ("CHAPTER 3: PERSONAS, EMPATHY MAPPING, AND PROBLEM REFRAMING", "20"),
    ("    3.1 Provisional Personas", "20"),
    ("    3.2 Empathy Mapping", "23"),
    ("    3.3 Frustrations, Pain Points, and Latent Needs", "25"),
    ("    3.4 How Might We (HMW) Statements", "27"),
    ("CHAPTER 4: USER JOURNEY MAPPING AND INFORMATION ARCHITECTURE", "29"),
    ("    4.1 End-to-End User Journey", "29"),
    ("    4.2 Emotional Trajectory", "32"),
    ("    4.3 Task Flows", "34"),
    ("    4.4 Information Architecture and Sitemap", "36"),
    ("    4.5 Feature Prioritization (MoSCoW Matrix)", "38"),
    ("CHAPTER 5: IDEATION, EXPLORATION, AND CONCEPT SELECTION", "40"),
    ("    5.1 Design Exploration Directions", "40"),
    ("    5.2 Concept Sketches", "42"),
    ("    5.3 Concept Evaluation and Weighted Decision Matrix", "44"),
    ("    5.4 Justification of Selected Direction", "46"),
    ("CHAPTER 6: LOW-FIDELITY WIREFRAMING AND FORMATIVE FEEDBACK", "48"),
    ("    6.1 Low-Fidelity Wireframes", "48"),
    ("    6.2 Structural Layout Decisions", "51"),
    ("    6.3 Formative Peer Feedback", "52"),
    ("    6.4 Iterative Refinements", "54"),
    ("CHAPTER 7: VISUAL DESIGN SYSTEM AND ACCESSIBILITY ENGINEERING", "56"),
    ("    7.1 Strict Color Palette", "56"),
    ("    7.2 Contrast Ratio Analysis", "58"),
    ("    7.3 The Readability Cost of Glassmorphism", "60"),
    ("    7.4 Typography and Hierarchy", "63"),
    ("    7.5 Component Inventory and Interactive States", "65"),
    ("    7.6 Glassmorphic Specification and CSS Fallback", "68"),
    ("CHAPTER 8: HIGH-FIDELITY IMPLEMENTATION AND TECHNICAL ARCHITECTURE", "70"),
    ("    8.1 High-Fidelity Views and Real Screenshots", "70"),
    ("    8.2 System Architecture and Engine Pipeline", "74"),
    ("    8.3 Prioritization Scoring Engine", "77"),
    ("    8.4 Micro-Interactions, Feedback, and Gamification", "80"),
    ("    8.5 Edge State Implementation Audit", "82"),
    ("    8.6 Deployment and Live Verification", "84"),
    ("CHAPTER 9: USABILITY TESTING, QUANTITATIVE EVALUATION, AND WCAG AUDIT", "86"),
    ("    9.1 Usability Testing Protocol and Tasks", "86"),
    ("    9.2 Usability Testing Results", "88"),
    ("    9.3 System Usability Scale (SUS) Evaluation", "90"),
    ("    9.4 Automated WCAG 2.2 AA Compliance Audit", "92"),
    ("    9.5 Limitations of Automated Accessibility Testing", "95"),
    ("CHAPTER 10: DESIGN RATIONALE, TECHNICAL TRADE-OFFS, AND REFLECTION", "97"),
    ("    10.1 Five Core Design Rationale Decisions", "97"),
    ("    10.2 Technical Trade-Offs and Engineering Compromises", "100"),
    ("    10.3 Security and Ethical Considerations", "103"),
    ("    10.4 Repository History and Iterative Evolution", "105"),
    ("    10.5 Reflective Critique and Student Reflection Prompt", "107"),
    ("    10.6 Future Roadmap and v2.0 Vision", "109"),
    ("REFERENCES", "111"),
    ("APPENDIX A: COMPLETE USER INTERVIEW PROTOCOL", "113"),
    ("APPENDIX B: USABILITY TESTING TASK SHEETS", "116"),
    ("APPENDIX C: SYSTEM USABILITY SCALE (SUS) QUESTIONNAIRE", "119"),
    ("APPENDIX D: PRIORITIZATION ENGINE EFFORT LOOKUP TABLE", "121"),
    ("APPENDIX E: USER RECRUITMENT AND SCREENING PLAN", "123"),
    ("APPENDIX F: RESPONSIVE VIEWPORT VERIFICATION MATRIX", "125"),
    ("APPENDIX G: AUTOMATED TEST EXECUTION LOGS", "127"),
]

LIST_OF_FIGURES = [
    ("Fig. 1.1", "Stakeholder Ecosystem Map for Digital Accessibility Tooling [VERIFIED]", "7"),
    ("Fig. 3.1", "Provisional Persona Profiles: Priya Sharma and Marcus Vance [ILLUSTRATIVE / PENDING]", "22"),
    ("Fig. 4.1", "End-to-End User Emotional Experience Trajectory Curve [ILLUSTRATIVE]", "33"),
    ("Fig. 4.2", "Core Task Flows: Audit Execution, Remediation, and URL Ingestion [VERIFIED]", "35"),
    ("Fig. 4.3", "Global Sitemap and Navigational Hierarchy of AccessAudit [VERIFIED]", "37"),
    ("Fig. 5.1", "Exploratory Digital Concept Sketches for Layout Directions [ILLUSTRATIVE]", "43"),
    ("Fig. 5.2", "Reserved Placeholder Slot for Scanned Hand Sketches [PENDING: Student Scanned Sketches]", "43"),
    ("Fig. 6.1", "Annotated Grayscale Wireframe Highlighting 6 Functional Zones [VERIFIED]", "50"),
    ("Fig. 7.1", "Strict Five-Color Nature-Derived Palette Swatches [VERIFIED]", "57"),
    ("Fig. 8.1", "AccessAudit High-Fidelity Overview Dashboard (1280px Desktop) [VERIFIED]", "71"),
    ("Fig. 8.2", "Contextual Slide-Out Remediation Drawer and Issues View [VERIFIED]", "72"),
    ("Fig. 8.3", "Responsive Reflow on Mobile Viewports (375px & 320px 400% Zoom) [VERIFIED]", "73"),
    ("Fig. 8.4", "Tablet (768px) and 4K Ultra-Wide (1920px) Responsive Layouts [VERIFIED]", "74"),
    ("Fig. 8.5", "Full-Stack System Architecture and Client-Side Execution Pipeline [VERIFIED]", "76"),
]

LIST_OF_TABLES = [
    ("Table 1.1", "System Scope: In-Scope Capabilities vs Out-of-Scope Boundaries [VERIFIED]", "6"),
    ("Table 2.1", "User Research Participant Demographic and Profile Matrix [PENDING: real data required]", "13"),
    ("Table 2.2", "8-Dimension Competitive Benchmarking Matrix [VERIFIED]", "15"),
    ("Table 4.1", "11-Stage End-to-End User Journey Mapping Matrix [VERIFIED]", "30"),
    ("Table 4.2", "MoSCoW Feature Prioritization Matrix for AccessAudit [VERIFIED]", "39"),
    ("Table 5.1", "Multi-Criteria Weighted Concept Decision Matrix [VERIFIED]", "45"),
    ("Table 6.1", "Formative Low-Fidelity Wireframe Feedback Log [PENDING: real data required]", "53"),
    ("Table 7.1", "WCAG 2.2 Contrast Ratio and Relative Luminance Analysis [VERIFIED]", "59"),
    ("Table 7.2", "Typographic Scale, Hierarchy, and Semantic Token Mapping [VERIFIED]", "64"),
    ("Table 7.3", "Comprehensive Interactive Component State Matrix [VERIFIED]", "66"),
    ("Table 8.1", "System Edge State Implementation and Resilience Audit [VERIFIED]", "83"),
    ("Table 9.1", "Usability Testing Quantitative Performance Matrix [PENDING: real data required]", "89"),
    ("Table 9.2", "Automated WCAG 2.2 AA Compliance Audit Results [VERIFIED]", "93"),
    ("Table D.1", "Prioritization Engine Rule Lookup and Effort Allocation Matrix [VERIFIED]", "121"),
    ("Table F.1", "Multi-Viewport Layout and Reflow Verification Matrix [VERIFIED]", "125"),
]

from data_ch1_to_ch5 import CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5
from data_ch6_to_ch10 import CHAPTER_6, CHAPTER_7, CHAPTER_8, CHAPTER_9, CHAPTER_10
from data_ref_and_appendices import REFERENCES_DATA, APPENDICES_DATA

CHAPTERS = [
    CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5,
    CHAPTER_6, CHAPTER_7, CHAPTER_8, CHAPTER_9, CHAPTER_10
]
REFERENCES = REFERENCES_DATA
APPENDICES = APPENDICES_DATA

print('Assembled all report data successfully. Total chapters:', len(CHAPTERS))
