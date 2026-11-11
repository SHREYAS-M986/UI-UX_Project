import axe, { AxeResults, Result } from 'axe-core';

export interface AuditProgressCallback {
  (stage: string, percent: number): void;
}

export interface AuditExecutionOptions {
  onProgress?: AuditProgressCallback;
  timeoutMs?: number;
}

export interface AuditRunResult {
  violations: Result[];
  passesCount: number;
  incompleteCount: number;
  inapplicableCount: number;
  rawResults: AxeResults;
  durationMs: number;
  timestamp: string;
}

/**
 * Executes axe-core accessibility audit against an HTML document rendered
 * within a secure, sandboxed, hidden iframe.
 */
export async function runAxeAudit(
  htmlContent: string,
  options: AuditExecutionOptions = {}
): Promise<AuditRunResult> {
  const { onProgress, timeoutMs = 15000 } = options;
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    let isSettled = false;
    let iframe: HTMLIFrameElement | null = null;

    // Timeout safety
    const timeoutId = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        cleanup();
        reject(new Error(`Audit execution timed out after ${timeoutMs / 1000} seconds.`));
      }
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timeoutId);
      if (iframe && iframe.parentNode) {
        try {
          iframe.parentNode.removeChild(iframe);
        } catch {
          // ignore cleanup error
        }
        iframe = null;
      }
    }

    try {
      onProgress?.('Preparing secure sandbox container...', 15);

      // Create hidden iframe with sandboxing
      iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '1280px';
      iframe.style.height = '900px';
      iframe.style.visibility = 'hidden';
      iframe.style.pointerEvents = 'none';
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;

      document.body.appendChild(iframe);

      onProgress?.('Rendering document and calculating computed layout...', 35);

      const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!frameDoc) {
        throw new Error('Sandbox creation failed: could not access iframe document.');
      }

      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      // Wait a short tick for CSS stylesheets and computed styles to resolve
      setTimeout(async () => {
        try {
          if (isSettled) return;

          onProgress?.('Running axe-core WCAG 2.1 Level A & AA evaluation...', 65);

          const targetDoc = iframe?.contentDocument || frameDoc;
          const targetNode = targetDoc?.documentElement || targetDoc?.body;

          if (!targetNode) {
            throw new Error('Sandbox document was empty or invalid.');
          }

          // Run axe against the sandboxed DOM
          const results = await axe.run(targetNode, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
            },
            resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
          });

          onProgress?.('Aggregating violation metrics and prioritisation...', 90);

          const durationMs = Math.round(performance.now() - startTime);

          isSettled = true;
          cleanup();

          onProgress?.('Audit complete!', 100);

          resolve({
            violations: results.violations,
            passesCount: results.passes.length,
            incompleteCount: results.incomplete.length,
            inapplicableCount: results.inapplicable.length,
            rawResults: results,
            durationMs,
            timestamp: new Date().toISOString(),
          });
        } catch (auditErr: any) {
          if (!isSettled) {
            isSettled = true;
            cleanup();
            reject(new Error(auditErr?.message || 'Failed while running axe-core analysis.'));
          }
        }
      }, 350);
    } catch (err: any) {
      if (!isSettled) {
        isSettled = true;
        cleanup();
        reject(new Error(err?.message || 'Failed to initialize audit sandbox.'));
      }
    }
  });
}
