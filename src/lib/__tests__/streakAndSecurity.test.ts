import { describe, it, expect } from 'vitest';
import { computeNextStreak, StreakState } from '../store';
import { isPrivateOrBlockedHost, sanitizeAndPrepareHtml } from '../fetchPageUtil';

describe('Streak Calculation Logic (store.ts)', () => {
  it('starts streak at 1 on first fix', () => {
    const today = new Date('2026-11-11T12:00:00Z');
    const initialStreak: StreakState = {
      currentStreak: 0,
      lastFixedDate: null,
      bestStreak: 0,
    };

    const next = computeNextStreak(initialStreak, today);
    expect(next.currentStreak).toBe(1);
    expect(next.lastFixedDate).toBe('2026-11-11');
    expect(next.bestStreak).toBe(1);
  });

  it('keeps streak the same if fix is recorded on the same day', () => {
    const today = new Date('2026-11-11T12:00:00Z');
    const existingStreak: StreakState = {
      currentStreak: 3,
      lastFixedDate: '2026-11-11',
      bestStreak: 5,
    };

    const next = computeNextStreak(existingStreak, today);
    expect(next.currentStreak).toBe(3);
    expect(next.lastFixedDate).toBe('2026-11-11');
    expect(next.bestStreak).toBe(5);
  });

  it('increments streak if fix is recorded on the consecutive day', () => {
    const today = new Date('2026-11-11T12:00:00Z');
    const existingStreak: StreakState = {
      currentStreak: 3,
      lastFixedDate: '2026-11-10', // yesterday
      bestStreak: 3,
    };

    const next = computeNextStreak(existingStreak, today);
    expect(next.currentStreak).toBe(4);
    expect(next.lastFixedDate).toBe('2026-11-11');
    expect(next.bestStreak).toBe(4);
  });

  it('resets streak to 1 if more than one day was missed', () => {
    const today = new Date('2026-11-11T12:00:00Z');
    const existingStreak: StreakState = {
      currentStreak: 10,
      lastFixedDate: '2026-11-05', // 6 days ago
      bestStreak: 10,
    };

    const next = computeNextStreak(existingStreak, today);
    expect(next.currentStreak).toBe(1);
    expect(next.lastFixedDate).toBe('2026-11-11');
    expect(next.bestStreak).toBe(10); // preserves lifetime best streak
  });
});

describe('SSRF Protection & HTML Sanitization (fetchPageUtil.ts)', () => {
  describe('isPrivateOrBlockedHost', () => {
    it('blocks localhost and aliases', () => {
      expect(isPrivateOrBlockedHost('localhost')).toBe(true);
      expect(isPrivateOrBlockedHost('app.localhost')).toBe(true);
      expect(isPrivateOrBlockedHost('0.0.0.0')).toBe(true);
      expect(isPrivateOrBlockedHost('::1')).toBe(true);
    });

    it('blocks loopback 127.0.0.1', () => {
      expect(isPrivateOrBlockedHost('127.0.0.1')).toBe(true);
      expect(isPrivateOrBlockedHost('127.1.2.3')).toBe(true);
    });

    it('blocks private IP ranges (10.x, 192.168.x, 172.16-31.x)', () => {
      expect(isPrivateOrBlockedHost('10.0.0.1')).toBe(true);
      expect(isPrivateOrBlockedHost('192.168.1.1')).toBe(true);
      expect(isPrivateOrBlockedHost('172.16.0.5')).toBe(true);
      expect(isPrivateOrBlockedHost('172.31.255.255')).toBe(true);
    });

    it('blocks AWS/GCP cloud metadata 169.254.169.254', () => {
      expect(isPrivateOrBlockedHost('169.254.169.254')).toBe(true);
    });

    it('allows valid public domain names', () => {
      expect(isPrivateOrBlockedHost('example.com')).toBe(false);
      expect(isPrivateOrBlockedHost('w3.org')).toBe(false);
      expect(isPrivateOrBlockedHost('github.com')).toBe(false);
    });
  });

  describe('sanitizeAndPrepareHtml', () => {
    it('strips <script> tags and injects <base href="...">', () => {
      const raw = `<!DOCTYPE html><html><head><title>Test</title><script>alert('xss')</script></head><body><p>Hello</p></body></html>`;
      const sanitized = sanitizeAndPrepareHtml(raw, 'https://example.com/sub');

      expect(sanitized).not.toContain('<script');
      expect(sanitized).not.toContain("alert('xss')");
      expect(sanitized).toContain('<base href="https://example.com/sub">');
      expect(sanitized).toContain('<p>Hello</p>');
    });

    it('strips inline event handlers', () => {
      const raw = `<img src="x" onerror="alert(1)" onload='doBadThings()' />`;
      const sanitized = sanitizeAndPrepareHtml(raw, 'https://example.com');

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('onload');
    });
  });
});
