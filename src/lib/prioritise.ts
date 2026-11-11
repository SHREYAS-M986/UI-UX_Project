import { Result, NodeResult } from 'axe-core';

export type SeverityLevel = 'critical' | 'serious' | 'minor';
export type WcagLevel = 'A' | 'AA' | 'AAA' | 'Best Practice';

export interface RemediationDetail {
  whyItMatters: string;
  beforeSnippet: string;
  afterSnippet: string;
  fixGuide: string;
}

export interface AffectedElementNode {
  targetSelector: string;
  htmlSnippet: string;
  failureSummary?: string;
}

export interface PrioritisedIssueGroup {
  id: string;
  ruleId: string;
  wcagCode: string;
  wcagLevel: WcagLevel;
  wcagUrl: string;
  title: string;
  description: string;
  help: string;
  helpUrl: string;
  severity: SeverityLevel;
  elementCount: number;
  fixTimeMinutes: number;
  impactScore: number; // 0-100
  effortScore: number; // 0-100 (ease of fix for chart)
  priorityRatio: number; // impact ÷ effort
  snippet: string;
  nodes: AffectedElementNode[];
  whyItMatters: string;
  beforeSnippet: string;
  afterSnippet: string;
  isFixed: boolean;
}

// Rule ID to estimated developer effort in minutes
export const RULE_EFFORT_LOOKUP: Record<string, number> = {
  'html-has-lang': 1,
  'document-title': 2,
  'image-alt': 2,
  'label': 3,
  'button-name': 3,
  'input-button-name': 3,
  'color-contrast': 5,
  'link-name': 5,
  'landmark-one-main': 5,
  'region': 5,
  'form-field-multiple-labels': 5,
  'aria-roles': 8,
  'aria-required-children': 10,
  'aria-required-parent': 10,
  'duplicate-id': 8,
  'tabindex': 8,
};

export const DEFAULT_EFFORT_MINUTES = 5;

// WCAG Criterion mapping from Rule IDs
const RULE_WCAG_MAPPING: Record<string, { code: string; level: WcagLevel; url: string }> = {
  'color-contrast': {
    code: '1.4.3 Contrast (Minimum)',
    level: 'AA',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
  },
  'image-alt': {
    code: '1.1.1 Non-text Content',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
  },
  'link-name': {
    code: '2.4.4 Link Purpose (In Context)',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
  },
  'label': {
    code: '3.3.2 Labels or Instructions',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
  },
  'button-name': {
    code: '4.1.2 Name, Role, Value',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
  },
  'input-button-name': {
    code: '4.1.2 Name, Role, Value',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
  },
  'html-has-lang': {
    code: '3.1.1 Language of Page',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
  },
  'document-title': {
    code: '2.4.2 Page Titled',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
  },
  'region': {
    code: '1.3.1 Info and Relationships',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
  },
  'landmark-one-main': {
    code: '1.3.1 Info and Relationships',
    level: 'A',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
  },
};

// Plain language "Why It Matters" explanations
const REMEDIATION_KNOWLEDGE: Record<string, Partial<RemediationDetail>> = {
  'color-contrast': {
    whyItMatters:
      'Users with moderate low vision, color vision deficiencies, or those using mobile devices in bright sunlight cannot read low-contrast text without significant eye strain.',
    beforeSnippet: '<p class="text-gray-400">Low contrast text</p>',
    afterSnippet: '<p class="text-gray-700 dark:text-gray-200">High contrast text (>= 4.5:1)</p>',
    fixGuide: 'Increase foreground font luminance or darken the background until the contrast ratio achieves at least 4.5:1 (3:1 for large text).',
  },
  'image-alt': {
    whyItMatters:
      'Blind and low-vision users rely on screen readers to announce image descriptions. Without alt attributes, screen readers may read the raw file URL or skip the element completely.',
    beforeSnippet: '<img src="hero-graphic.png">',
    afterSnippet: '<img src="hero-graphic.png" alt="Team members collaborating on a project whiteboard">',
    fixGuide: 'Provide a concise, meaningful alt text attribute describing the purpose or information conveyed by the image.',
  },
  'link-name': {
    whyItMatters:
      'Screen reader users often navigate pages by tabbing through links. Ambiguous links like "Click here" or "Read more" provide zero context when read out of sequence.',
    beforeSnippet: '<a href="/features">Click here</a>',
    afterSnippet: '<a href="/features">Explore enterprise security features</a>',
    fixGuide: 'Make link text specific and self-explanatory, or provide an aria-label with complete context.',
  },
  'label': {
    whyItMatters:
      'Form inputs without associated labels prevent speech input software and screen readers from identifying which field the user is currently editing.',
    beforeSnippet: '<input type="text" placeholder="Full name">',
    afterSnippet: '<label for="full-name">Full Name</label>\n<input type="text" id="full-name" name="name">',
    fixGuide: 'Pair each input with a visible <label for="..."> matching the input ID, or assign an aria-label.',
  },
  'button-name': {
    whyItMatters:
      'Icon-only buttons with no textual label are announced as "unlabeled button" by assistive tools, leaving users unable to submit or close dialogs.',
    beforeSnippet: '<button><svg ...></svg></button>',
    afterSnippet: '<button aria-label="Close dialog">\n  <svg aria-hidden="true" ...></svg>\n</button>',
    fixGuide: 'Add text inside the button or supply an aria-label attribute describing the action.',
  },
};

/**
 * Maps axe impact value to strict 3-tier severity.
 * critical -> Critical
 * serious -> Serious
 * moderate / minor / null -> Minor
 */
export function mapAxeImpactToSeverity(impact?: string | null): SeverityLevel {
  if (impact === 'critical') return 'critical';
  if (impact === 'serious') return 'serious';
  return 'minor';
}

/**
 * Computes impact score based on severity weight, element count, and WCAG Level weight.
 * Formula: severityWeight * min(elementCount, 10) * levelWeight * scalingFactor
 */
export function calculateImpactScore(
  severity: SeverityLevel,
  elementCount: number,
  level: WcagLevel
): number {
  const severityWeight = {
    critical: 10,
    serious: 6,
    minor: 2,
  }[severity];

  const levelWeight = {
    A: 1.4,
    AA: 1.2,
    AAA: 1.0,
    'Best Practice': 0.8,
  }[level];

  // Element dampening factor (logarithmic/capped so 100 elements don't disproportionately blow up the score)
  const countFactor = Math.min(elementCount, 12);

  const rawScore = severityWeight * countFactor * levelWeight * 0.85;
  return Math.min(100, Math.max(10, Math.round(rawScore)));
}

/**
 * Transforms axe-core raw violations into prioritized, actionable developer issue groups.
 */
export function prioritiseViolations(violations: Result[]): PrioritisedIssueGroup[] {
  return violations
    .map((v, index) => {
      const severity = mapAxeImpactToSeverity(v.impact);
      const ruleMapping = RULE_WCAG_MAPPING[v.id];

      // Determine WCAG Level from rule mapping or tags
      let wcagLevel: WcagLevel = ruleMapping?.level || 'AA';
      if (v.tags.includes('wcag2a') || v.tags.includes('wcag21a')) {
        wcagLevel = 'A';
      } else if (v.tags.includes('wcag2aa') || v.tags.includes('wcag21aa')) {
        wcagLevel = 'AA';
      } else if (v.tags.includes('best-practice')) {
        wcagLevel = 'Best Practice';
      }

      const wcagCode = ruleMapping?.code || `${v.id.toUpperCase()}`;
      const wcagUrl = ruleMapping?.url || v.helpUrl;

      const elementCount = v.nodes.length;
      const fixTimeMinutes = RULE_EFFORT_LOOKUP[v.id] || DEFAULT_EFFORT_MINUTES;
      const impactScore = calculateImpactScore(severity, elementCount, wcagLevel);

      // Effort score for scatter chart (0-100, higher = easier / lower effort)
      const effortScore = Math.max(15, Math.min(95, Math.round(100 - fixTimeMinutes * 7.5)));

      // Priority ratio for sorting (higher impact + lower effort = highest priority)
      const priorityRatio = parseFloat((impactScore / fixTimeMinutes).toFixed(2));

      // Extract node snippets
      const nodes: AffectedElementNode[] = v.nodes.map((n: NodeResult) => ({
        targetSelector: n.target.join(' > '),
        htmlSnippet: n.html,
        failureSummary: n.failureSummary,
      }));

      const primarySnippet = nodes[0]?.htmlSnippet || `<${v.id} />`;

      const remediation = REMEDIATION_KNOWLEDGE[v.id] || {};
      const whyItMatters =
        remediation.whyItMatters ||
        v.description ||
        'This issue creates barriers for users relying on keyboard navigation or screen readers.';
      const beforeSnippet = remediation.beforeSnippet || primarySnippet;
      const afterSnippet =
        remediation.afterSnippet ||
        `<!-- Compliant fix for ${v.id} -->\n${primarySnippet}`;

      return {
        id: `issue-${v.id}-${index}`,
        ruleId: v.id,
        wcagCode,
        wcagLevel,
        wcagUrl,
        title: v.help,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        severity,
        elementCount,
        fixTimeMinutes,
        impactScore,
        effortScore,
        priorityRatio,
        snippet: primarySnippet,
        nodes,
        whyItMatters,
        beforeSnippet,
        afterSnippet,
        isFixed: false,
      };
    })
    .sort((a, b) => b.priorityRatio - a.priorityRatio);
}

/**
 * Computes overall Accessibility Score (0-100) from active (unfixed) violations.
 * Base score is 100. Each unfixed violation applies a penalty according to severity and count.
 */
export function calculateAccessibilityScore(issues: PrioritisedIssueGroup[]): number {
  if (issues.length === 0) return 100;

  const unfixed = issues.filter((i) => !i.isFixed);
  if (unfixed.length === 0) return 100;

  let totalDeduction = 0;

  for (const issue of unfixed) {
    const penaltyPerIssue = {
      critical: 12,
      serious: 7,
      minor: 3,
    }[issue.severity];

    const elementMultiplier = Math.min(issue.elementCount, 5) * 0.4 + 0.6;
    totalDeduction += penaltyPerIssue * elementMultiplier;
  }

  const score = Math.round(100 - totalDeduction);
  return Math.max(10, Math.min(100, score));
}

