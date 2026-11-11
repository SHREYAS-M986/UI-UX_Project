# Moderated Usability Testing Protocol & Task Sheets
**Target Participants**: At least 5 software developers / QA engineers.  
**Prototype URL**: `https://access-audit-roan.vercel.app`  
**Test Format**: Moderated think-aloud usability testing (approx. 20–25 minutes).

---

## 1. Test Facilitator Script & Orientation
> *"Thank you for joining this usability session. Today you will be evaluating AccessAudit, a dashboard designed to help software developers prioritize and remediate web accessibility violations. Please remember that we are testing the application, not your skills. There are no incorrect actions. We ask that you think aloud as you navigate: tell us what you notice, what you expect to happen, and if anything feels confusing or surprising. You may stop at any point."*

---

## 2. Seven Standard Usability Tasks

### Task 1: Audit Initialization via Demo Page
- **Prompt**: *"Open the audit dialog and run a scan on the built-in demo page."*
- **Success Criteria**: User clicks 'Re-run audit' in the top bar, selects the 'Demo Page' tab, and initiates the scan.
- **Max Time Target**: 45 seconds.

### Task 2: Overall Compliance Assessment
- **Prompt**: *"Review the dashboard and determine your project's current accessibility score and recent score velocity."*
- **Success Criteria**: User identifies the 78/100 score ring and notes the +8 delta tag since last audit.
- **Max Time Target**: 30 seconds.

### Task 3: Identifying the #1 Prioritized Fix
- **Prompt**: *"Identify the top recommended accessibility issue to fix first and explain why the tool recommends it."*
- **Success Criteria**: User locates '1.4.3 Contrast' in 'Fix These First' and notes the high impact-to-effort ratio (6 elements, 5 min fix).
- **Max Time Target**: 45 seconds.

### Task 4: Detailed Inspection & Code Copying
- **Prompt**: *"Inspect the technical details for '1.4.3 Contrast', review the recommended code fix, and copy the snippet to your clipboard."*
- **Success Criteria**: User clicks the issue row to open the slide-over drawer, navigates to the 'Fix Suggestion' block, and clicks 'Copy fix'.
- **Max Time Target**: 45 seconds.

### Task 5: Marking an Issue as Fixed
- **Prompt**: *"Mark '1.4.3 Contrast' as fixed and observe what happens to your dashboard metrics."*
- **Success Criteria**: User clicks 'Mark as fixed' on the drawer or row; observes score ring increment, progress bar movement, and streak count.
- **Max Time Target**: 30 seconds.

### Task 6: Locating Issues via Scatter Plot
- **Prompt**: *"Use the 'Impact vs Effort' scatter plot to locate a 'Minor' severity issue that requires the least development effort."*
- **Success Criteria**: User hovers or clicks on a green scatter point in the lower-left/lower-right quadrants and identifies the matching rule.
- **Max Time Target**: 60 seconds.

### Task 7: Compliance Data Export
- **Prompt**: *"Navigate to the Reports view and export the current audit results as a CSV spreadsheet."*
- **Success Criteria**: User switches to the 'Reports' tab and successfully clicks 'Export CSV'.
- **Max Time Target**: 45 seconds.

---

## 3. Post-Test System Usability Scale (SUS) Survey
Immediately upon finishing Task 7, administer the 10-item Brooke SUS questionnaire (see `/kit/sus_questionnaire.md`). Log all results into `evidence/research_data.xlsx` (`Usability_Results` & `SUS_Responses`).

