import { describe, it, expect } from 'vitest';
import {
  mapAxeImpactToSeverity,
  calculateImpactScore,
  calculateAccessibilityScore,
  prioritiseViolations,
  RULE_EFFORT_LOOKUP,
  DEFAULT_EFFORT_MINUTES,
  PrioritisedIssueGroup,
} from '../prioritise';
import { Result } from 'axe-core';

describe('Prioritisation Logic (prioritise.ts)', () => {
  describe('mapAxeImpactToSeverity', () => {
    it('maps critical to critical', () => {
      expect(mapAxeImpactToSeverity('critical')).toBe('critical');
    });

    it('maps serious to serious', () => {
      expect(mapAxeImpactToSeverity('serious')).toBe('serious');
    });

    it('maps moderate to minor', () => {
      expect(mapAxeImpactToSeverity('moderate')).toBe('minor');
    });

    it('maps minor to minor', () => {
      expect(mapAxeImpactToSeverity('minor')).toBe('minor');
    });

    it('maps null or undefined to minor as safe default', () => {
      expect(mapAxeImpactToSeverity(null)).toBe('minor');
      expect(mapAxeImpactToSeverity(undefined)).toBe('minor');
    });
  });

  describe('calculateImpactScore', () => {
    it('calculates higher impact for critical Level A than minor Level AA', () => {
      const criticalA = calculateImpactScore('critical', 5, 'A');
      const minorAA = calculateImpactScore('minor', 5, 'AA');

      expect(criticalA).toBeGreaterThan(minorAA);
    });

    it('scales with element count up to dampening ceiling', () => {
      const scoreFew = calculateImpactScore('serious', 2, 'AA');
      const scoreMany = calculateImpactScore('serious', 10, 'AA');

      expect(scoreMany).toBeGreaterThan(scoreFew);
    });

    it('clamps output between 10 and 100', () => {
      const score = calculateImpactScore('critical', 100, 'A');
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThanOrEqual(10);
    });
  });

  describe('prioritiseViolations', () => {
    it('groups violations and sorts by priority ratio (impact ÷ effort)', () => {
      const mockAxeViolations: Partial<Result>[] = [
        {
          id: 'image-alt',
          impact: 'critical',
          tags: ['wcag2a', 'wcag111'],
          help: 'Images must have alternate text',
          description: 'Ensures <img> elements have alternate text or a role of none or presentation',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/image-alt',
          nodes: [{ target: ['img.banner'], html: '<img src="banner.jpg">' } as any],
        },
        {
          id: 'color-contrast',
          impact: 'serious',
          tags: ['wcag2aa', 'wcag143'],
          help: 'Elements must have sufficient color contrast',
          description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA thresholds',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/color-contrast',
          nodes: [
            { target: ['p.sub'], html: '<p class="sub">Low contrast</p>' } as any,
            { target: ['span.hint'], html: '<span class="hint">Hint text</span>' } as any,
          ],
        },
      ];

      const prioritised = prioritiseViolations(mockAxeViolations as Result[]);

      expect(prioritised.length).toBe(2);
      expect(prioritised[0].fixTimeMinutes).toBe(RULE_EFFORT_LOOKUP['image-alt']);
      expect(prioritised[0].priorityRatio).toBeGreaterThan(0);

      // Verify descending sort by priorityRatio
      for (let i = 0; i < prioritised.length - 1; i++) {
        expect(prioritised[i].priorityRatio).toBeGreaterThanOrEqual(prioritised[i + 1].priorityRatio);
      }
    });

    it('falls back to default effort minutes for unknown rules', () => {
      const mockViolation: Partial<Result> = {
        id: 'custom-unknown-rule',
        impact: 'minor',
        tags: ['best-practice'],
        help: 'Custom rule',
        description: 'Custom description',
        helpUrl: 'https://example.com',
        nodes: [{ target: ['div'], html: '<div></div>' } as any],
      };

      const result = prioritiseViolations([mockViolation as Result]);
      expect(result[0].fixTimeMinutes).toBe(DEFAULT_EFFORT_MINUTES);
    });
  });

  describe('calculateAccessibilityScore', () => {
    it('returns 100 when there are no issues or all issues are fixed', () => {
      expect(calculateAccessibilityScore([])).toBe(100);

      const fixedIssues: Partial<PrioritisedIssueGroup>[] = [
        { severity: 'critical', elementCount: 3, isFixed: true },
        { severity: 'serious', elementCount: 2, isFixed: true },
      ];
      expect(calculateAccessibilityScore(fixedIssues as PrioritisedIssueGroup[])).toBe(100);
    });

    it('deducts more score for critical than minor issues', () => {
      const criticalOnly: Partial<PrioritisedIssueGroup>[] = [
        { severity: 'critical', elementCount: 2, isFixed: false },
      ];
      const minorOnly: Partial<PrioritisedIssueGroup>[] = [
        { severity: 'minor', elementCount: 2, isFixed: false },
      ];

      const scoreCrit = calculateAccessibilityScore(criticalOnly as PrioritisedIssueGroup[]);
      const scoreMinor = calculateAccessibilityScore(minorOnly as PrioritisedIssueGroup[]);

      expect(scoreCrit).toBeLessThan(scoreMinor);
    });
  });
});

