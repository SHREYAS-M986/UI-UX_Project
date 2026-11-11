import { useState } from 'react';
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
import { IssuesView } from './components/views/IssuesView';
import { PagesView } from './components/views/PagesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { useAuditStore } from './lib/store';

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

        {/* Main Content Area */}
        <main
          id="main-content"
          role="main"
          className="flex-1 min-w-0 flex flex-col focus:outline-none"
          tabIndex={-1}
        >
          {/* Top Bar Navigation & Controls */}
          <TopBar />

          {/* View Routing */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
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

          {activeTab === 'issues' && (
            <div className="animate-in fade-in duration-200">
              <IssuesView />
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="animate-in fade-in duration-200">
              <PagesView />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="animate-in fade-in duration-200">
              <ReportsView />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-200">
              <SettingsView />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
