# Low-Fidelity Wireframe Review Protocol
**Target Evaluators**: At least 2 experienced front-end developers or software engineers.  
**Objective**: Evaluate information hierarchy, spatial density, and cognitive clarity of low-fidelity wireframe layouts prior to visual styling.

---

## 1. Wireframe Presentation Procedure
1. Display Grayscale Wireframe 1: **Executive Overview Dashboard**.
   - Explain the three key zones: (A) Top score ring & severity cards; (B) "Fix These First" prioritized queue; (C) Progress tracker & Impact vs. Effort scatter plot.
   - Ask: *"At first glance, what does this screen tell you to do first?"*
   - Prompt: *"Does the 5-item constraint feel helpful or restrictive?"*
2. Display Grayscale Wireframe 2: **Run Audit Execution Modal**.
   - Explain the 3 input options: Demo sandbox, HTML paste/upload, URL input.
   - Ask: *"Is it clear what happens when you enter a URL or paste an HTML snippet?"*
3. Display Grayscale Wireframe 3: **Slide-Over Issue Detail Drawer**.
   - Explain the breakdown: WCAG rule code, external documentation link, target selectors, plain-language 'Why it matters', and before/after code diff.
   - Ask: *"What additional information would you need right here to fix this code without opening other tabs?"*
4. Display Grayscale Wireframe 4: **Impact vs. Effort Scatter Plot**.
   - Ask: *"How would you interpret the two axes? Does this chart help you pick a fix?"*

---

## 2. Reviewer Observation Template
Log feedback into `evidence/research_data.xlsx` (`Wireframe_Feedback` sheet):
- **Feedback ID**: WF-01 / WF-02
- **Participant ID**: P-01 / P-02
- **Screen Evaluated**: (Overview / Modal / Drawer / Scatter Plot)
- **Specific Observation / Critique**: Verbatim comments on layout, clarity, or missing elements.
- **Action Taken in Final Design**: Corresponding design iteration implemented.
