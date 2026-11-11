# User Research Interview Protocol
**Project**: AccessAudit — Accessibility Audit Tool for Developers  
**Target Participants**: Front-end developers, full-stack engineers, QA automation engineers, and UI/UX designers responsible for web accessibility.  
**Format**: 30–45 minute semi-structured remote/in-person interview + contextual observation.

---

## 1. Interview Introduction & Briefing (5 mins)
- Welcome the participant and thank them for their time.
- State the research purpose: *"We are studying how software developers interact with automated web accessibility audit tools, how issues are prioritized during sprint cycles, and where the biggest workflow bottlenecks occur."*
- Confirm informed consent (review and sign Consent Form). Emphasize that we are evaluating the design and tooling, NOT the participant's knowledge or ability.
- Request permission to record audio/notes for research documentation purposes.

---

## 2. Demographic & Background Questions (5 mins)
1. What is your current role and primary engineering focus (e.g., front-end, full-stack, QA, design systems)?
2. How many years of experience do you have developing web applications?
3. What frameworks, libraries, and design systems do you typically use in your daily workflow?
4. What is your current level of familiarity with WCAG 2.1 / 2.2 guidelines and accessibility testing standards?

---

## 3. Core Workflow Inquiries (15–20 mins)
5. **[CORE 1]**: When an automated testing tool (such as Google Lighthouse, axe DevTools, or WAVE) flags 100+ violations on your sprint deliverable, walk me through your immediate triage process.
6. **[CORE 2]**: How do you determine which accessibility issue to address first, and what criteria or heuristics determine that prioritization?
7. **[CORE 3]**: What causes the most friction or time loss when attempting to fix an unfamiliar WCAG violation?
8. **[CORE 4]**: How does your engineering team measure, track, and celebrate accessibility improvements across sprint cycles or release retrospectives?
9. **[CORE 5]**: What specific information do you need in an audit report to write the fix immediately without opening external documentation or searching the web?
10. Can you describe a specific situation where you deferred or closed an accessibility ticket without fixing it? What drove that decision?
11. How do you distinguish between visual design issues (e.g., color contrast) and fundamental DOM/structural code issues (e.g., ARIA roles, keyboard focus traps)?
12. If you could design the ideal developer-facing accessibility tool, what single capability would make you use it daily?

---

## 4. Debrief & Next Steps (5 mins)
- Solicit any final thoughts or suggestions.
- Inform participant about subsequent prototype usability testing sessions.
- Thank participant and conclude session. Log responses into `evidence/research_data.xlsx` (`Interview_Notes`).
