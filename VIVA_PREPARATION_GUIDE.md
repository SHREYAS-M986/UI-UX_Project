# AccessAudit — Project Defense & Viva Quick Reference Guide
**Course**: Advanced UI/UX | V Semester B.E., Dept. of Computer Science & Engineering  
**Project**: AccessAudit — Accessibility Audit Tool for Developers  
**Live Application**: [https://access-audit-roan.vercel.app](https://access-audit-roan.vercel.app)  
**GitHub Repository**: [https://github.com/SHREYAS-M986/UI-UX_Project](https://github.com/SHREYAS-M986/UI-UX_Project)

---

## 1. Quick Project Elevator Pitch
> *"Existing automated accessibility tools dump hundreds of unranked violations on developers without context, causing audit fatigue and leaving critical digital barriers unaddressed. AccessAudit is a developer-centric accessibility dashboard that prioritizes fixes based on remediation ROI (Impact ÷ Effort), pairing each violation with copy-ready code snippets and positive streak motivation so developers can fix high-impact issues in minutes during active sprint cycles."*

---

## 2. The 6-Stage Double Diamond Design Process

| Stage | Key Actions in AccessAudit | Deliverables & Outcomes |
| :--- | :--- | :--- |
| **1. Discover** | Observed 5 software developers conducting audits; analyzed Lighthouse, axe, WAVE. | Identified 3 major friction points: audit fatigue, context switching, lack of motivation. |
| **2. Define** | Created 2 personas (Alex & Priya), Empathy Map, End-to-End User Journey, MoSCoW prioritization. | Reframed problem: *"How might we empower developers to prioritize and fix high-impact issues rapidly while staying motivated?"* |
| **3. Ideate** | Sketched 3 concepts: Dense Table (A), Wizard Stepper (B), Action-First Glass Dashboard (C). | Weighted decision matrix selected Concept C for balancing strategic visibility with tactical agility. |
| **4. Prototype** | Low-fi wireframes -> User feedback -> Design system (5-color tokens) -> Hi-fi React/TypeScript app. | Built glassmorphism UI, sandboxed axe-core engine, interactive SVG scatter plot, and slide-over drawer. |
| **5. Test** | Moderated usability testing with 5 developers on 3 core tasks; axe-core self-audit. | 100% task completion, 64% reduction in time-to-first-fix (5.1 min vs 14.2 min), **SUS score: 89.2/100**, **0 self-audit violations**. |
| **6. Reflect** | Analyzed design trade-offs, technical constraints, ethical disclaimers, and future roadmap. | Disclaimed 100/100 automated limitations; added serverless SSRF security boundaries. |

---

## 3. High-Probability Viva Questions & Model Answers

### Q1: Why did you limit the main queue to 5 issues instead of displaying all violations?
**Answer**:  
User research demonstrated that developers experience "choice overload" and cognitive paralysis when faced with 100+ unranked violations in a scrollable list. Capping the initial queue to the top 5 highest-return fixes creates a clear, achievable sprint goal. Developers can easily access the full catalog via the "View all issues" tab whenever needed.

---

### Q2: How does the prioritization algorithm calculate Impact and Effort?
**Answer**:  
The algorithm uses an objective mathematical heuristic:
$$\text{Impact Score} = \min\left(100, \text{round}\left(\text{SeverityWeight} \times \min(N, 12) \times \text{WcagLevelWeight} \times 0.85\right)\right)$$
- **SeverityWeight**: Critical = 4.0, Serious = 2.5, Minor = 1.0.
- **WcagLevelWeight**: Level A = 1.3 (foundational barriers), Level AA = 1.0.
- **Effort**: Looked up from a rule taxonomy dictionary in minutes (e.g., missing alt text = 5 min; contrast fix = 5 min; color-only = 2 min).
- **Ranking**: Issues are sorted by $\text{Impact} \div \text{Effort}$, placing high-impact "quick wins" at the top of the queue.

---

### Q3: Why did you use this nature-inspired 5-color palette instead of standard red, yellow, and green?
**Answer**:  
1. **Psychological Impact**: Conventional red/green audit interfaces induce anxiety and feel punitive, discouraging developers from engaging with accessibility. Our calming nature palette creates a focused problem-solving mindset.
2. **Accessibility Standards (WCAG 1.4.1 - Use of Color)**: Standard traffic lights discriminate against color-blind users. AccessAudit pairs every color with distinct icons (exclamation, alert triangle, info circle) and text badges.
3. **Contrast Compliance (WCAG 1.4.3)**: Every token exceeds WCAG 2.2 AA requirements on Mist White:
   - Forest Black (`#15231C`): **14.2:1** (Exceeds AAA)
   - Deep Green (`#21402A`): **10.1:1** (Exceeds AAA)
   - Amber Brown (`#8B6222`): **4.58:1** (Exceeds AA)
   - Taupe (`#A08569`): **6.3:1** when paired with Forest Black text.

---

### Q4: How does the app prevent security vulnerabilities like XSS and SSRF when scanning URLs?
**Answer**:  
- **SSRF Prevention**: Remote URL fetches pass through a Vercel serverless function (`/api/fetch-page`) that checks the target hostname against strict IP regex rules, immediately blocking private/local addresses (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`).
- **XSS Prevention**: The proxy strips all `<script>` tags, injects a `<base>` tag for relative assets, and renders HTML in a sandboxed, hidden iframe with restricted execution privileges.

---

### Q5: What were the key usability testing findings?
**Answer**:  
Testing 5 software engineers on 3 core tasks revealed:
- **100% Task Success** across all participants.
- **Time-to-First-Fix**: Dropped from a 14.2-minute baseline down to **5.1 minutes** (a **64% improvement**).
- **SUS Usability Score**: **89.2 / 100** (Grade A+, Excellent).
- **Key Iteration**: Users initially found clicking the scatter plot disconnected from the table. We added synchronized hover rings and focus linking between scatter coordinates and queue items.

---

### Q6: Can automated audits guarantee 100% WCAG compliance?
**Answer**:  
No. Automated engines (like axe-core or Lighthouse) can only test approximately 30–40% of WCAG criteria. Automated tools cannot judge if an alt text is contextually meaningful, if a heading hierarchy reflects logical semantics, or if screen reader announcements feel natural. AccessAudit prominently displays this disclaimer to ensure developers combine automated triage with manual assistive technology verification.

