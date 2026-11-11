import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { GlassCard } from '../GlassCard';
import { Button } from '../Button';
import { Settings as SettingsIcon, RotateCcw, Check, ShieldAlert } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { projectName, setProjectName, targetWcagLevel, setTargetWcagLevel, resetToInitialDemo } =
    useAuditStore();

  const [localName, setLocalName] = useState(projectName);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectName(localName.trim() || 'My Web Project');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    resetToInitialDemo();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-forest tracking-tight">Project Settings</h1>
        <p className="text-xs text-forest-600 mt-1">
          Configure project configuration, audit targets, and data persistence.
        </p>
      </div>

      {/* General Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-forest-100/30">
          <SettingsIcon className="w-5 h-5 text-forest-600" aria-hidden="true" />
          <h2 className="text-base font-bold text-forest">General Configuration</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="project-name-input" className="block text-xs font-bold text-forest mb-1.5">
              Project Display Name
            </label>
            <input
              id="project-name-input"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-forest focus:outline-none focus:ring-2 focus:ring-deep-green"
              placeholder="e.g. My Web Project"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest mb-1.5">
              Target Conformance Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetWcagLevel('AA')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  targetWcagLevel === 'AA'
                    ? 'bg-forest text-mist border-forest shadow-md'
                    : 'bg-mist-200/60 text-forest border-white/60 hover:bg-mist-300/60'
                }`}
              >
                <div className="text-sm font-bold">WCAG 2.1 Level AA</div>
                <div className="text-[11px] opacity-80 mt-0.5">Industry standard legal compliance target</div>
              </button>

              <button
                type="button"
                onClick={() => setTargetWcagLevel('AAA')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  targetWcagLevel === 'AAA'
                    ? 'bg-forest text-mist border-forest shadow-md'
                    : 'bg-mist-200/60 text-forest border-white/60 hover:bg-mist-300/60'
                }`}
              >
                <div className="text-sm font-bold">WCAG 2.1 Level AAA</div>
                <div className="text-[11px] opacity-80 mt-0.5">Highest enhanced contrast & accessibility tier</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-forest-500 font-medium">
              {savedSuccess ? 'Settings saved successfully!' : ''}
            </span>
            <Button variant="primary" size="md" type="submit" className="text-xs font-semibold px-6">
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-deep-green mr-1.5" aria-hidden="true" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-6 border-amber-border/60">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-amber" aria-hidden="true" />
          <h2 className="text-base font-bold text-forest">Reset Audit Data</h2>
        </div>
        <p className="text-xs text-forest-600 mb-4 leading-relaxed">
          Clear custom scan results, reset localStorage persistence, and revert the dashboard back to the initial reference demo state.
        </p>

        {showConfirmReset ? (
          <div className="p-4 rounded-2xl bg-amber-tint border border-amber-border space-y-3">
            <p className="text-xs font-bold text-forest">
              Are you sure? This will reset all your fixes, custom audits, and daily streak history.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
                className="bg-amber hover:bg-amber/90 text-mist text-xs font-bold"
              >
                Yes, Reset All Data
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmReset(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowConfirmReset(true)}
            className="text-xs font-semibold gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber" aria-hidden="true" />
            <span>Reset to Initial State</span>
          </Button>
        )}
      </GlassCard>
    </div>
  );
};
