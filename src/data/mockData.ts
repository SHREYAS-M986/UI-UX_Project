export type SeverityLevel = 'critical' | 'serious' | 'minor';

export interface AuditIssue {
  id: string;
  severity: SeverityLevel;
  wcagCode: string;
  description: string;
  elementCount: number;
  fixTimeMinutes: number;
  snippet: string;
  isFixed: boolean;
  impactScore: number;
  effortScore: number;
}

export interface StatCardData {
  severity: SeverityLevel;
  count: number;
  label: string;
  trend: number[];
  color: string;
  ariaLabel: string;
}

export interface ScatterPoint {
  id: string;
  name: string;
  severity: SeverityLevel;
  impact: number; // 0-100 (y-axis: higher impact -> top)
  effort: number; // 0-100 (x-axis: lower effort -> right)
}

export const AUDIT_STATS = {
  score: 78,
  scoreDelta: 8,
  scoreStatus: 'Good job! Your site is mostly accessible.',
  projectName: 'My Web Project',
  userInitials: 'SM',
  lastAuditTime: '12 minutes ago',
  totalIssuesCount: 22,
};

export const SEVERITY_STATS: StatCardData[] = [
  {
    severity: 'critical',
    count: 3,
    label: 'Critical Issues',
    // Realistic undulating wave with crests and troughs matching reference
    trend: [5, 9, 3, 8, 2, 7, 3],
    color: '#8B6222',
    ariaLabel: '3 critical accessibility issues found',
  },
  {
    severity: 'serious',
    count: 7,
    label: 'Serious Issues',
    trend: [8, 5, 9, 6, 8, 4, 7],
    color: '#A08569',
    ariaLabel: '7 serious accessibility issues found',
  },
  {
    severity: 'minor',
    count: 12,
    label: 'Minor Issues',
    trend: [13, 17, 11, 16, 12, 15, 12],
    color: '#21402A',
    ariaLabel: '12 minor accessibility issues found',
  },
];

export const PRIORITIZED_ISSUES: AuditIssue[] = [
  {
    id: 'issue-1',
    severity: 'critical',
    wcagCode: '1.4.3 Contrast',
    description: 'Text must have sufficient contrast ratio.',
    elementCount: 6,
    fixTimeMinutes: 5,
    snippet: '<p class="text-gray-400">\n  Low contrast text\n</p>',
    isFixed: false,
    impactScore: 92,
    effortScore: 32,
  },
  {
    id: 'issue-2',
    severity: 'serious',
    wcagCode: '1.1.1 Non-text Content',
    description: 'Images must have meaningful alt text.',
    elementCount: 4,
    fixTimeMinutes: 5,
    snippet: '<img src="icon.png">',
    isFixed: false,
    impactScore: 62,
    effortScore: 78,
  },
  {
    id: 'issue-3',
    severity: 'serious',
    wcagCode: '2.4.4 Link Purpose',
    description: 'Links must have descriptive text.',
    elementCount: 8,
    fixTimeMinutes: 5,
    snippet: '<a href="#">Click here</a>',
    isFixed: false,
    impactScore: 70,
    effortScore: 65,
  },
  {
    id: 'issue-4',
    severity: 'minor',
    wcagCode: '1.4.1 Use of Color',
    description: 'Information should not rely only on color.',
    elementCount: 3,
    fixTimeMinutes: 2,
    snippet: '<span class="red">Error</span>',
    isFixed: false,
    impactScore: 36,
    effortScore: 30,
  },
  {
    id: 'issue-5',
    severity: 'minor',
    wcagCode: '3.3.2 Labels or Instructions',
    description: 'Form controls must have labels.',
    elementCount: 2,
    fixTimeMinutes: 2,
    snippet: '<input type="text">',
    isFixed: false,
    impactScore: 26,
    effortScore: 88,
  },
];

export const PROGRESS_DATA = {
  fixedCount: 12,
  totalCount: 40,
  streakDays: 3,
  streakMessage: 'Keep going!',
};

export const SCATTER_POINTS: ScatterPoint[] = [
  { id: 'p1', name: '1.4.3 Contrast', severity: 'critical', impact: 82, effort: 32 },
  { id: 'p2', name: '1.1.1 Non-text Content', severity: 'serious', impact: 60, effort: 78 },
  { id: 'p3', name: '1.4.1 Use of Color', severity: 'minor', impact: 36, effort: 30 },
  { id: 'p4', name: '3.3.2 Labels', severity: 'serious', impact: 26, effort: 88 },
];
