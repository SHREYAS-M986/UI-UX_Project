import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PrioritisedIssueGroup, calculateAccessibilityScore } from './prioritise';
import { PRIORITIZED_ISSUES } from '../data/mockData';

export interface AuditHistoryEntry {
  id: string;
  timestamp: string;
  score: number;
  criticalCount: number;
  seriousCount: number;
  minorCount: number;
  pageName: string;
}

export interface StreakState {
  currentStreak: number;
  lastFixedDate: string | null; // 'YYYY-MM-DD'
  bestStreak: number;
}

export interface AuditedPageInfo {
  id: string;
  urlOrTitle: string;
  score: number;
  issuesCount: number;
  criticalCount: number;
  lastAudited: string;
}

export interface MilestoneNotification {
  id: string;
  percentage: number;
  message: string;
  timestamp: number;
}

export interface AppState {
  // Project settings
  projectName: string;
  userInitials: string;
  targetWcagLevel: 'AA' | 'AAA';
  lastAuditSource: 'demo' | 'html' | 'url';
  lastAuditedUrl: string;

  // Active Audit Data
  issues: PrioritisedIssueGroup[];
  score: number;
  previousScore: number;
  scoreDelta: number;
  lastAuditTime: string;

  // Real Audit History for sparklines and reports
  history: AuditHistoryEntry[];

  // Audited Pages
  pages: AuditedPageInfo[];

  // Motivation & Streak Tracking
  streak: StreakState;
  activeMilestoneToast: MilestoneNotification | null;

  // UI state
  activeDrawerIssueId: string | null;
  isAuditModalOpen: boolean;
  selectedFilterSeverity: 'all' | 'critical' | 'serious' | 'minor';
  selectedFilterLevel: 'all' | 'A' | 'AA';
  searchQuery: string;

  // Actions
  setProjectName: (name: string) => void;
  setTargetWcagLevel: (level: 'AA' | 'AAA') => void;
  setIssuesFromAudit: (newIssues: PrioritisedIssueGroup[], pageTitle: string, source: 'demo' | 'html' | 'url') => void;
  toggleIssueFixed: (issueId: string) => void;
  openDrawer: (issueId: string) => void;
  closeDrawer: () => void;
  setAuditModalOpen: (open: boolean) => void;
  setFilterSeverity: (sev: 'all' | 'critical' | 'serious' | 'minor') => void;
  setFilterLevel: (level: 'all' | 'A' | 'AA') => void;
  setSearchQuery: (query: string) => void;
  dismissMilestoneToast: () => void;
  resetToInitialDemo: () => void;
}

const STORAGE_KEY = 'access_audit_store_v1';

// Date utility functions for daily streak calculation
export function getIsoDateString(d = new Date()): string {
  return d.toISOString().split('T')[0];
}

export function getYesterdayDateString(d = new Date()): string {
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export function computeNextStreak(currentStreakState: StreakState, now = new Date()): StreakState {
  const today = getIsoDateString(now);
  const yesterday = getYesterdayDateString(now);

  if (currentStreakState.lastFixedDate === today) {
    // Already logged a fix today
    return currentStreakState;
  }

  let nextStreak = 1;
  if (currentStreakState.lastFixedDate === yesterday) {
    // Consecutive day
    nextStreak = currentStreakState.currentStreak + 1;
  }

  return {
    currentStreak: nextStreak,
    lastFixedDate: today,
    bestStreak: Math.max(currentStreakState.bestStreak, nextStreak),
  };
}

// Convert mock data issues to PrioritisedIssueGroup for initial load
function createInitialIssues(): PrioritisedIssueGroup[] {
  return PRIORITIZED_ISSUES.map((issue, idx) => ({
    id: issue.id,
    ruleId: issue.wcagCode.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    wcagCode: issue.wcagCode,
    wcagLevel: idx % 2 === 0 ? 'AA' : 'A',
    wcagUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/',
    title: issue.wcagCode,
    description: issue.description,
    help: issue.description,
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/',
    severity: issue.severity,
    elementCount: issue.elementCount,
    fixTimeMinutes: issue.fixTimeMinutes,
    impactScore: issue.impactScore,
    effortScore: issue.effortScore,
    priorityRatio: parseFloat((issue.impactScore / issue.fixTimeMinutes).toFixed(2)),
    snippet: issue.snippet,
    nodes: [
      {
        targetSelector: `body > main > div:nth-child(${idx + 1})`,
        htmlSnippet: issue.snippet,
        failureSummary: issue.description,
      },
    ],
    whyItMatters:
      'Users relying on screen readers or keyboard navigation encounter significant friction when this requirement is violated.',
    beforeSnippet: issue.snippet,
    afterSnippet: issue.snippet.replace('text-gray-400', 'text-gray-900').replace('<img src', '<img alt="Descriptive text" src'),
    isFixed: false,
  }));
}

const INITIAL_HISTORY: AuditHistoryEntry[] = [
  { id: 'h1', timestamp: '2 days ago', score: 62, criticalCount: 6, seriousCount: 11, minorCount: 16, pageName: 'Homepage' },
  { id: 'h2', timestamp: 'Yesterday', score: 70, criticalCount: 4, seriousCount: 9, minorCount: 14, pageName: 'Storefront Demo' },
  { id: 'h3', timestamp: 'Just now', score: 78, criticalCount: 3, seriousCount: 7, minorCount: 12, pageName: 'Storefront Demo' },
];

const INITIAL_PAGES: AuditedPageInfo[] = [
  { id: 'p-1', urlOrTitle: '/ (Homepage)', score: 84, issuesCount: 4, criticalCount: 0, lastAudited: '1 hour ago' },
  { id: 'p-2', urlOrTitle: '/checkout (Checkout Flow)', score: 68, issuesCount: 8, criticalCount: 2, lastAudited: '3 hours ago' },
  { id: 'p-3', urlOrTitle: 'Storefront & Portal Demo', score: 78, issuesCount: 5, criticalCount: 1, lastAudited: 'Just now' },
  { id: 'p-4', urlOrTitle: '/docs (Developer Docs)', score: 92, issuesCount: 2, criticalCount: 0, lastAudited: 'Yesterday' },
];

export const useAuditStore = create<AppState>()(
  persist(
    (set, get) => ({
      projectName: 'My Web Project',
      userInitials: 'SM',
      targetWcagLevel: 'AA',
      lastAuditSource: 'demo',
      lastAuditedUrl: '',

      issues: createInitialIssues(),
      score: 78,
      previousScore: 70,
      scoreDelta: 8,
      lastAuditTime: '12 minutes ago',

      history: INITIAL_HISTORY,
      pages: INITIAL_PAGES,

      streak: {
        currentStreak: 3,
        lastFixedDate: getIsoDateString(),
        bestStreak: 5,
      },
      activeMilestoneToast: null,

      activeDrawerIssueId: null,
      isAuditModalOpen: false,
      selectedFilterSeverity: 'all',
      selectedFilterLevel: 'all',
      searchQuery: '',

      setProjectName: (name) => set({ projectName: name }),
      setTargetWcagLevel: (level) => set({ targetWcagLevel: level }),

      setIssuesFromAudit: (newIssues, pageTitle, source) => {
        const state = get();
        const prevScore = state.score;
        const newScore = calculateAccessibilityScore(newIssues);
        const scoreDelta = newScore - prevScore;

        const criticalCount = newIssues.filter((i) => i.severity === 'critical' && !i.isFixed).length;
        const seriousCount = newIssues.filter((i) => i.severity === 'serious' && !i.isFixed).length;
        const minorCount = newIssues.filter((i) => i.severity === 'minor' && !i.isFixed).length;

        const newHistoryEntry: AuditHistoryEntry = {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: newScore,
          criticalCount,
          seriousCount,
          minorCount,
          pageName: pageTitle,
        };

        const updatedHistory = [...state.history, newHistoryEntry].slice(-8);

        // Update pages list
        const existingPageIndex = state.pages.findIndex((p) => p.urlOrTitle === pageTitle);
        let updatedPages = [...state.pages];
        if (existingPageIndex >= 0) {
          updatedPages[existingPageIndex] = {
            ...updatedPages[existingPageIndex],
            score: newScore,
            issuesCount: newIssues.length,
            criticalCount,
            lastAudited: 'Just now',
          };
        } else {
          updatedPages = [
            {
              id: `page-${Date.now()}`,
              urlOrTitle: pageTitle,
              score: newScore,
              issuesCount: newIssues.length,
              criticalCount,
              lastAudited: 'Just now',
            },
            ...updatedPages,
          ];
        }

        set({
          issues: newIssues,
          score: newScore,
          previousScore: prevScore,
          scoreDelta,
          lastAuditTime: 'Just now',
          history: updatedHistory,
          pages: updatedPages,
          lastAuditSource: source,
          isAuditModalOpen: false,
        });
      },

      toggleIssueFixed: (issueId: string) => {
        const state = get();
        let targetFixedState = false;

        const updatedIssues = state.issues.map((issue) => {
          if (issue.id === issueId) {
            targetFixedState = !issue.isFixed;
            return { ...issue, isFixed: targetFixedState };
          }
          return issue;
        });

        // Recalculate score
        const newScore = calculateAccessibilityScore(updatedIssues);
        const scoreDelta = newScore - state.score;

        // Calculate progress percentage
        const total = updatedIssues.length;
        const fixed = updatedIssues.filter((i) => i.isFixed).length;
        const percentage = total > 0 ? Math.round((fixed / total) * 100) : 100;

        // Check milestones
        let milestoneToast: MilestoneNotification | null = null;
        if (targetFixedState) {
          if (percentage >= 100) {
            milestoneToast = {
              id: `ms-${Date.now()}`,
              percentage: 100,
              message: '🏆 100% of prioritized WCAG fixes complete! Incredible velocity!',
              timestamp: Date.now(),
            };
          } else if (percentage >= 75 && percentage < 80) {
            milestoneToast = {
              id: `ms-${Date.now()}`,
              percentage: 75,
              message: '⚡ 75% complete! Almost at full compliance.',
              timestamp: Date.now(),
            };
          } else if (percentage >= 50 && percentage < 55) {
            milestoneToast = {
              id: `ms-${Date.now()}`,
              percentage: 50,
              message: '🎯 Halfway mark! Site accessibility is vastly improved.',
              timestamp: Date.now(),
            };
          } else if (percentage >= 25 && percentage < 30) {
            milestoneToast = {
              id: `ms-${Date.now()}`,
              percentage: 25,
              message: '🚀 Great start! 25% of fixes resolved.',
              timestamp: Date.now(),
            };
          }
        }

        // Update streak if marked as fixed
        const nextStreak = targetFixedState
          ? computeNextStreak(state.streak)
          : state.streak;

        set({
          issues: updatedIssues,
          score: newScore,
          previousScore: state.score,
          scoreDelta,
          streak: nextStreak,
          activeMilestoneToast: milestoneToast || state.activeMilestoneToast,
        });
      },

      openDrawer: (issueId) => set({ activeDrawerIssueId: issueId }),
      closeDrawer: () => set({ activeDrawerIssueId: null }),

      setAuditModalOpen: (open) => set({ isAuditModalOpen: open }),
      setFilterSeverity: (sev) => set({ selectedFilterSeverity: sev }),
      setFilterLevel: (level) => set({ selectedFilterLevel: level }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      dismissMilestoneToast: () => set({ activeMilestoneToast: null }),

      resetToInitialDemo: () => {
        set({
          issues: createInitialIssues(),
          score: 78,
          previousScore: 70,
          scoreDelta: 8,
          history: INITIAL_HISTORY,
          pages: INITIAL_PAGES,
          streak: { currentStreak: 3, lastFixedDate: getIsoDateString(), bestStreak: 5 },
          activeDrawerIssueId: null,
          activeMilestoneToast: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        // Fallback gracefully if localStorage is restricted or disabled
        try {
          return window.localStorage;
        } catch {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
      }),
      version: 1,
    }
  )
);
