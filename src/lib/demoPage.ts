/**
 * Built-in realistic demonstration HTML document with deliberate WCAG violations:
 * - 1.4.3 Contrast: light gray text on light background
 * - 1.1.1 Non-text Content: images missing alt attributes
 * - 2.4.4 Link Purpose: generic "click here" and "read more" anchor texts
 * - 1.4.1 Use of Color: status and error information conveyed solely through color
 * - 3.3.2 / 4.1.2 Form Labels: inputs without associated labels or aria-label attributes
 */

export const DEMO_PAGE_TITLE = 'Storefront & Portal Demo';

export const DEMO_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${DEMO_PAGE_TITLE}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      background-color: #ffffff;
      color: #1a202c;
      margin: 0;
      padding: 32px;
    }
    header {
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .hero-banner {
      background: #f8fafc;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 32px;
    }
    /* Contrast violation (1.4.3): 2.5:1 ratio */
    .low-contrast-text {
      color: #a0aec0;
      font-size: 14px;
    }
    .low-contrast-caption {
      color: #94a3b8;
      font-size: 13px;
    }
    /* Color-only violation (1.4.1): information only indicated by red/green */
    .status-error {
      color: #dc2626;
      font-weight: 500;
    }
    .status-success {
      color: #16a34a;
    }
    .form-group {
      margin-bottom: 16px;
    }
    input[type="text"], input[type="email"] {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      width: 280px;
    }
    .btn {
      padding: 8px 16px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 6px;
      text-decoration: none;
      display: inline-block;
    }
  </style>
</head>
<body>
  <header>
    <h1>Modern Workspace Portal</h1>
    <!-- WCAG 1.4.3 Contrast Violation -->
    <p class="low-contrast-text">Designed for high productivity and modern distributed teams.</p>
  </header>

  <main>
    <section class="hero-banner">
      <h2>Transform Your Workflow</h2>
      <!-- WCAG 1.1.1 Non-text Content: Image without alt attribute -->
      <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80" width="400" height="240" />
      
      <!-- WCAG 1.4.3 Contrast Violation -->
      <p class="low-contrast-caption">Updated 10 minutes ago by product management.</p>
      
      <!-- WCAG 2.4.4 Link Purpose: Non-descriptive anchor text -->
      <p>Want to see all features? <a href="#features">Click here</a> or explore further and <a href="#details">read more</a>.</p>
    </section>

    <section>
      <h2>Account Registration</h2>
      
      <!-- WCAG 1.4.1 Use of Color Violation: Error conveyed only by red text without icon or label -->
      <div class="form-group">
        <span class="status-error">Error: Invalid format</span>
      </div>

      <!-- WCAG 3.3.2 Form Labels Missing: Input without label or aria-label -->
      <div class="form-group">
        <input type="text" placeholder="Enter your full name" id="user-name" />
      </div>

      <div class="form-group">
        <!-- WCAG 3.3.2 Form Labels Missing: Input without label -->
        <input type="email" placeholder="Enter your work email address" id="user-email" />
      </div>

      <!-- WCAG 1.1.1 Non-text Content: Icon image without alt -->
      <button type="submit" class="btn">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M5 12h14M12 5l7 7-7 7'/%3E%3C/svg%3E" />
        Submit Registration
      </button>
    </section>
  </main>
</body>
</html>`;
