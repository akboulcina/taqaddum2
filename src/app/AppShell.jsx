import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { projects as projectData } from '../data/projects.js';
import { executiveKpis, executiveAlerts, territorialSites } from '../data/dashboard.js';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import ModulePlaceholder from './ModulePlaceholder.jsx';
import ExecutiveDashboard from '../features/executive-dashboard/ExecutiveDashboard.jsx';
import PortfolioModule from '../features/portfolio/PortfolioModule.jsx';
import { AlgeriaProjectMap } from '../features/map/AlgeriaProjectMap.jsx';
import { KpiModule } from '../features/kpi/KpiModule.jsx';
import { AlertsModule } from '../features/alerts/AlertsModule.jsx';
import { CollaborationModule } from '../features/collaboration/CollaborationModule.jsx';
import { ProjectDetailsModule } from '../features/project-details/ProjectDetailsModule.jsx';
import ReportsModule from '../features/reports/ReportsModule.jsx';

const demoActivity = [
  { id: 'ACT-1', actor: 'Sofiane Merabet', action: 'a actualisé l’avancement du projet', time: '27 oct. 2026', type: 'Mise à jour', projectId: 'PRJ-2038' },
  { id: 'ACT-2', actor: 'Yacine Hamdi', action: 'a soumis une demande d’arbitrage', time: '26 oct. 2026', type: 'Décision', projectId: 'PRJ-2031' },
  { id: 'ACT-3', actor: 'Karim Benali', action: 'a vérifié les engagements budgétaires', time: '24 oct. 2026', type: 'Finance', projectId: 'PRJ-2035' }
];

export default function AppShell({ activeRoute, onNavigate, route }) {
  const { t, lang, dir, user } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState(projectData[0]?.id ?? null);
  const [selectedWilaya, setSelectedWilaya] = useState(null);

  const selectedProject = useMemo(
    () => projectData.find((project) => (project.id ?? project.code) === selectedProjectId) ?? null,
    [selectedProjectId]
  );

  const openProject = (projectId) => {
    setSelectedProjectId(projectId);
    onNavigate('project-details');
  };

  const renderRoute = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'portfolio':
        return <PortfolioModule projects={projectData} user={user} onSelectProject={openProject} />;
      case 'map':
        return (
          <AlgeriaProjectMap
            sites={territorialSites}
            projects={projectData}
            selectedWilaya={selectedWilaya}
            onSelectWilaya={setSelectedWilaya}
          />
        );
      case 'kpi':
        return <KpiModule projects={projectData} kpis={executiveKpis} user={user} />;
      case 'alerts':
        return <AlertsModule alerts={executiveAlerts} projects={projectData} user={user} />;
      case 'collaboration':
        return <CollaborationModule user={user} projects={projectData} activity={demoActivity} />;
      case 'project-details':
        return (
          <ProjectDetailsModule
            project={selectedProject}
            user={user}
            onBack={() => onNavigate('portfolio')}
          />
        );
      case 'reports':
        return <ReportsModule projects={projectData} user={user} />;
      default:
        return <ModulePlaceholder route={route} contract="Cette route n’est pas encore disponible." />;
    }
  };

  return (
    <div className="app-shell" dir={dir} lang={lang}>
      <Sidebar activeRoute={activeRoute} onNavigate={onNavigate} />
      <div className="main-area">
        <TopBar route={route} />
        <main className="content">
          <div className="demo-banner"><span className="demo-dot" /><span>{t('demo.banner')}</span></div>
          {renderRoute()}
          <footer className="app-footer">{t('footer.demo')} · {user.role[lang]}</footer>
        </main>
      </div>
    </div>
  );
}
