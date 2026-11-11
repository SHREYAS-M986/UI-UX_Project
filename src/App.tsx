import { useState, lazy, Suspense } from 'react';
import { BackgroundMesh } from './components/BackgroundMesh';
import { SkipLink } from './components/SkipLink';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatsRow } from './components/StatsRow';
import { FixList } from './components/FixList';
import { ProgressCard } from './components/ProgressCard';
import { ScatterChart } from './components/ScatterChart';
import { GlassCard } from './components/GlassCard';
import { RunAuditModal } from './components/RunAuditModal';
import { IssueDetailDrawer } from './components/IssueDetailDrawer';
import { MilestoneCelebration } from './components/MilestoneCelebration';
import { useAuditStore } from './lib/store';

// Lazy-load non-critical view tabs for code splitting & optimal bundle size
const IssuesView = lazy(() => import('./components/views/IssuesView').then((m) => ({ default: m.IssuesView })));
const PagesView = lazy(() => import('./components/views/PagesView').then((m) => ({ default: m.PagesView })));
const ReportsView = lazy(() => import('./components/views/ReportsView').then((m) => ({ default: m.ReportsView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then((m) => ({ default: m.SettingsView })));

export function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('overview');
  const isAuditModalOpen = useAuditStore((state) => state.isAuditModalOpen);
  const setAuditModalOpen = useAuditStore((state) => state.setAuditModalOpen);

  return (
    <div className="relative min-h-screen text-forest antialiased flex flex-col justify-between selection:bg-deep-green selection:text-mist">
      {/* Background organic mesh */}
      <BackgroundMesh />

      {/* Accessible skip link */}
      <SkipLink />

      {/* Run Audit Modal */}
      <RunAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

      {/* Issue Detail Drawer */}
      <IssueDetailDrawer />

      {/* Milestone Toast & Celebrations */}
      <MilestoneCelebration />

      {/* Main Page Container */}
      <div className="w-full max-w-[1680px] mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-4 xl:gap-6 pb-20 lg:pb-6">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Column: Banner + Main Landmarks as top-level siblings */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Bar Navigation & Controls */}
          <TopBar />

          {/* Main Landmark */}
          <main
            id="main-content"
            role="main"
            className="flex-1 min-w-0 flex flex-col focus:outline-none"
            tabIndex={-1}
          >
            {/* View Routing */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Screen-reader H1 for landmark structure */}
                <h1 className="sr-only">AccessAudit Dashboard Overview</h1>

                {/* Row 1: Accessibility Score ring + 3 Stat Cards */}
                <StatsRow />

                {/* Row 2: Fix These First + Right Column */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Main Actionable Card: Fix These First */}
                  <div className="lg:col-span-8 w-full min-w-0 overflow-hidden">
                    <FixList onViewAllIssues={() => setActiveTab('issues')} />
                  </div>

                  {/* Right Column: Your Progress + Impact vs Effort */}
                  <aside
                    aria-label="Audit progress and impact metrics"
                    className="lg:col-span-4 w-full flex flex-col gap-5 min-w-0"
                  >
                    {/* Progress & Streak Card */}
                    <ProgressCard />

                    {/* Impact vs Effort Chart Card */}
                    <GlassCard className="p-5">
                      <ScatterChart />
                    </GlassCard>
                  </aside>
                </div>
              </div>
            )}

            <Suspense
              fallback={
                <div className="p-12 text-center text-forest-600">
                  <div className="w-6 h-6 border-2 border-deep-green border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs font-semibold">Loading view...</span>
                </div>
              }
            >
              {activeTab === 'issues' && <IssuesView />}
              {activeTab === 'pages' && <PagesView />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'settings' && <SettingsView />}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
