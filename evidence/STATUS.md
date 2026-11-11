# AccessAudit — Evidence & Project Audit Status
**Generated**: 2026-11-11  
**Target Environment**: `https://access-audit-roan.vercel.app`  
**Repository**: `https://github.com/SHREYAS-M986/UI-UX_Project`

---

## 1. Executive Summary & Verification Matrix

| Component | Status | Empirical Ground Truth |
| :--- | :---: | :--- |
| **Live Deployed Prototype** | `[VERIFIED]` | Live at `https://access-audit-roan.vercel.app` (HTTP 200, SPA routing active). |
| **Axe-core Automated Audit** | `[VERIFIED]` | 0 violations across all 5 views (Overview, Issues, Pages, Reports, Settings); 42 passes. |
| **Lighthouse Scores** | `[VERIFIED]` | **Accessibility: 96**, **Best Practices: 100**, **SEO: 91**, **Performance: 63** (axe bundle payload 676 kB). |
| **320px Reflow (400% Zoom)** | `[VERIFIED]` | Doc Width = 320px, Window Width = 320px, **Horizontal Overflow = False (0px)**. |
| **Contrast Ratios (WCAG AA)** | `[VERIFIED]` | Forest Black on Mist: **13.72:1** (Pass AAA). Deep Green on Mist: **9.66:1** (Pass AAA). Amber Brown on Mist: **4.57:1** (Pass AA). Taupe on Mist: **2.92:1 (Fail as body text; Pass AA 4.7:1 with Forest Black text on Taupe badge)**. |
| **Keyboard Navigation** | `[VERIFIED]` | Focus trace recorded 6 standard tab stops starting with accessible Skip Link (`#main-content`). |
| **SSRF Security Protection** | `[VERIFIED]` | `/api/fetch-page.ts` enforces 10s timeout, script stripping, and regex blocking of private IPs (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). |
| **Implemented UI States** | `[VERIFIED]` | Loading (Modal & Suspense), Error (Modal URL fetch error banner), Permission Denied (SSRF block), Filtered Empty (IssuesView). |
| **Missing UI States** | `[MISSING]` | Explicit offline detection banner (`navigator.onLine`), Overview zero-issues empty state. |
| **Human Research Data (Ch.2)** | `[PENDING]` | Real developer interviews (min 5 participants) not yet conducted. Logged in `research_data.xlsx`. |
| **Human Wireframe Feedback (Ch.6)**| `[PENDING]` | Feedback from 2 real engineers on wireframes not yet collected. Logged in `research_data.xlsx`. |
| **Human Usability Testing (Ch.9)** | `[PENDING]` | 5-user usability testing on 7 tasks & SUS survey not yet conducted. Logged in `research_data.xlsx`. |
| **Scanned Hand Sketches (Ch.5)** | `[PENDING]` | Student hand-drawn paper sketches to be scanned and inserted. |
| **Student Metadata & Reflection** | `[PENDING]` | Placeholders `[Student Name]`, `[USN]`, `[Section]` and student personal reflection prompts in Ch.10. |

---

## 2. Design Tokens Extracted from Code

```json
{
  "colors": {
    "forest": "#15231C",
    "deepGreen": "#21402A",
    "mist": "#ECECE4",
    "amber": "#8B6222",
    "taupe": "#A08569",
    "backgroundSage": "#D9DFD5"
  },
  "glassmorphism": {
    "cardBackground": "rgba(236, 236, 228, 0.45)",
    "cardBackgroundHover": "rgba(236, 236, 228, 0.60)",
    "cardBorder": "1px solid rgba(255, 255, 255, 0.65)",
    "cardBlur": "22px",
    "sidebarBackground": "rgba(21, 35, 28, 0.88)",
    "sidebarBorder": "1px solid rgba(255, 255, 255, 0.12)",
    "sidebarBlur": "24px",
    "fallbackSolid": "rgba(236, 236, 228, 0.94)"
  },
  "typography": {
    "sans": "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    "mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    "scale": {
      "display": "48px / Bold (700)",
      "h1": "24px / Bold (700)",
      "h2": "18px / Semi-Bold (600)",
      "body": "14px / Regular (400)",
      "caption": "12px / Medium (500)",
      "code": "13px / Monospace (400)"
    }
  },
  "spacing": "8-point spatial rhythm (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)",
  "radii": {
    "sm": "14px",
    "md": "20px",
    "lg": "24px",
    "xl": "28px"
  },
  "sidebarWidth": "80px (collapsed desktop icon bar) / 100% full width (mobile)",
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  }
}
```

---

## 3. Real-World Human Evidence Needed from Student

To finalize the report with authentic empirical data:
1. **User Research (Chapter 2)**: Interview at least 5 software developers / QA engineers using the `/kit/interview_script.md`. Record answers into `research_data.xlsx` (`Participants` & `Interview_Notes`).
2. **Wireframe Feedback (Chapter 6)**: Show wireframe sketches to at least 2 engineers using `/kit/wireframe_feedback_script.md`. Log notes into `research_data.xlsx` (`Wireframe_Feedback`).
3. **Usability Testing (Chapter 9)**: Conduct moderated 20-minute usability test with 5 users over the live Vercel URL using `/kit/usability_test_script.md`. Log task timings, success (Y/N), and SUS responses into `research_data.xlsx` (`Usability_Results` & `SUS_Responses`).
4. **Scanned Hand Sketches (Chapter 5)**: Photograph or scan 1–2 pages of preliminary paper ideation sketches and place them into `/evidence/scanned_sketches/`.
5. **Student Metadata**: Fill in `[Student Name]`, `[USN]`, `[Section]`, `[Sl No]`, `[DD-MM-YYYY]`, `[20XX-XX]`.
6. **Student Reflection (Chapter 10)**: Provide personal answers to the 3 guided reflection prompts regarding project challenges and learnings.
