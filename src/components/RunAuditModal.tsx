import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { useAuditStore } from '@/lib/store';
import { runAxeAudit } from '@/lib/auditEngine';
import { prioritiseViolations } from '@/lib/prioritise';
import { DEMO_PAGE_HTML, DEMO_PAGE_TITLE } from '@/lib/demoPage';
import {
  X,
  Sparkles,
  Code2,
  Globe,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface RunAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'demo' | 'html' | 'url';

export const RunAuditModal: React.FC<RunAuditModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('demo');
  const [pastedHtml, setPastedHtml] = useState('');
  const [targetUrl, setTargetUrl] = useState('https://example.com');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setIssuesFromAudit = useAuditStore((state) => state.setIssuesFromAudit);

  // Focus trap and Esc key support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isScanning) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isScanning, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPastedHtml(content);
    };
    reader.readAsText(file);
  };

  const executeAudit = async (html: string, pageTitle: string, source: 'demo' | 'html' | 'url') => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanProgress(5);
    setScanStage('Initializing audit engine...');

    try {
      const result = await runAxeAudit(html, {
        onProgress: (stage, percent) => {
          setScanStage(stage);
          setScanProgress(percent);
        },
      });

      const prioritised = prioritiseViolations(result.violations);
      setIssuesFromAudit(prioritised, pageTitle, source);
      setIsScanning(false);
      onClose();
    } catch (err: any) {
      setIsScanning(false);
      setErrorMessage(err.message || 'Audit execution encountered an unexpected error.');
    }
  };

  const handleRunDemo = () => {
    executeAudit(DEMO_PAGE_HTML, DEMO_PAGE_TITLE, 'demo');
  };

  const handleRunPastedHtml = () => {
    if (!pastedHtml.trim()) {
      setErrorMessage('Please paste or upload HTML content before running the audit.');
      return;
    }
    executeAudit(pastedHtml, 'Custom HTML Document', 'html');
  };

  const handleRunUrl = async () => {
    if (!targetUrl.trim()) {
      setErrorMessage('Please enter a valid website URL.');
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);
    setScanProgress(15);
    setScanStage('Connecting to target URL via secure proxy...');

    try {
      const response = await fetch(`/api/fetch-page?url=${encodeURIComponent(targetUrl.trim())}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch page content.`);
      }

      executeAudit(data.html, data.title || targetUrl, 'url');
    } catch (err: any) {
      setIsScanning(false);
      setErrorMessage(err.message || 'Could not fetch target page. Check URL and connectivity.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <GlassCard
        ref={modalRef}
        className="w-full max-w-2xl bg-mist-700/90 shadow-2xl border border-white/80 p-6 relative max-h-[90vh] flex flex-col justify-between overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-forest-100/40">
          <div>
            <h2 id="audit-modal-title" className="text-lg font-bold text-forest">
              Run Accessibility Audit
            </h2>
            <p className="text-xs text-forest-600 mt-0.5">
              Select an audit target to evaluate WCAG 2.1 A & AA conformance with axe-core.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isScanning}
            className="w-9 h-9 rounded-full flex items-center justify-center text-forest-600 hover:text-forest hover:bg-mist-400/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
            aria-label="Close audit dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 p-1.5 bg-forest-100/30 rounded-2xl my-5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'demo'}
            onClick={() => {
              setActiveTab('demo');
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'demo'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-forest-700 hover:text-forest'
            }`}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Built-in Demo</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'html'}
            onClick={() => {
              setActiveTab('html');
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'html'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-forest-700 hover:text-forest'
            }`}
          >
            <Code2 className="w-4 h-4" aria-hidden="true" />
            <span>Paste / Upload HTML</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'url'}
            onClick={() => {
              setActiveTab('url');
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-forest-700 hover:text-forest'
            }`}
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>Scan URL</span>
          </button>
        </div>

        {/* Tab 1: Built-in Demo */}
        {activeTab === 'demo' && (
          <div className="space-y-4 py-2">
            <div className="bg-mist-200/60 border border-white/60 rounded-2xl p-4 text-xs text-forest-700 leading-relaxed">
              <p className="font-semibold text-forest text-sm mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-deep-green" aria-hidden="true" />
                <span>Storefront & Portal Test Suite</span>
              </p>
              Includes pre-configured real-world violations: color contrast ($1.4.3$), missing image alt descriptions ($1.1.1$), generic link anchors ($2.4.4$), color-only validation states ($1.4.1$), and missing input labels ($3.3.2$).
            </div>
          </div>
        )}

        {/* Tab 2: Paste or Upload HTML */}
        {activeTab === 'html' && (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-xs text-forest-600">
              <label htmlFor="pasted-html-input" className="font-semibold text-forest">
                Raw HTML Content:
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-deep-green font-semibold hover:underline"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Upload .html file</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <textarea
              id="pasted-html-input"
              rows={7}
              value={pastedHtml}
              onChange={(e) => setPastedHtml(e.target.value)}
              placeholder="<html><body><h1>My Page</h1><p>Paste HTML here...</p></body></html>"
              className="w-full p-3 text-xs font-mono rounded-xl glass-input text-forest placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-deep-green resize-none"
            />
          </div>
        )}

        {/* Tab 3: Scan URL */}
        {activeTab === 'url' && (
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="url-input" className="block text-xs font-semibold text-forest mb-1.5">
                Target Webpage URL:
              </label>
              <input
                id="url-input"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-forest focus:outline-none focus:ring-2 focus:ring-deep-green"
              />
            </div>

            <div className="text-[11px] text-forest-500 bg-mist-100/50 p-3 rounded-xl border border-white/50 leading-relaxed">
              <strong>Security & Protection:</strong> Fetched through a server-side proxy with script stripping, automatic &lt;base&gt; tag injection, 10s timeout, and strict private IP/SSRF blocking.
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-tint border border-amber-border text-forest text-xs mt-3 animate-in fade-in"
          >
            <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-bold">Audit Error: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Progress scanning state */}
        {isScanning && (
          <div className="mt-4 p-4 rounded-xl bg-mist-300/70 border border-white/60 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-forest">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-deep-green animate-spin" aria-hidden="true" />
                <span>{scanStage}</span>
              </span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-forest-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-deep-green h-full rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-forest-100/30 mt-4">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isScanning}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>

          {activeTab === 'demo' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleRunDemo}
              disabled={isScanning}
              className="text-xs font-semibold px-5"
            >
              Run Demo Audit
            </Button>
          )}

          {activeTab === 'html' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleRunPastedHtml}
              disabled={isScanning}
              className="text-xs font-semibold px-5"
            >
              Audit Pasted HTML
            </Button>
          )}

          {activeTab === 'url' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleRunUrl}
              disabled={isScanning}
              className="text-xs font-semibold px-5"
            >
              Fetch & Run Audit
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
