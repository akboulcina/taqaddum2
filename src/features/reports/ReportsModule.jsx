import { useMemo, useState } from 'react';
import './ReportsModule.css';

const money = (value) => new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(value ?? 0);

export default function ReportsModule({ projects = [], user }) {
  const [notice, setNotice] = useState('');
  const summary = useMemo(() => ({
    count: projects.length,
    budget: projects.reduce((sum, project) => sum + (Number(project.budget) || 0), 0),
    committed: projects.reduce((sum, project) => sum + (Number(project.committed) || 0), 0),
    paid: projects.reduce((sum, project) => sum + (Number(project.paid) || 0), 0),
    delayed: projects.filter((project) => project.status === 'delayed').length,
    atRisk: projects.filter((project) => project.status === 'atRisk').length,
  }), [projects]);

  const exportCsv = () => {
    const columns = ['id', 'name', 'wilaya', 'sector', 'status', 'progress', 'budget', 'committed', 'paid', 'dueDate', 'manager'];
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [columns.join(';'), ...projects.map((project) => columns.map((key) => escape(project[key])).join(';'))].join('\r\n');
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taqaddum-portfolio-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setNotice('Export CSV généré à partir des données de démonstration.');
  };

  return (
    <section className="reports-module" aria-label="Rapports et exports">
      <header className="reports-header">
        <div><p className="reports-brand">TAQADDUM</p><h2>Rapports & exports</h2><p>Rapports de synthèse simulés · {user?.name ?? 'Utilisateur de démonstration'}</p></div>
        <span className="reports-demo-badge">Données de démonstration</span>
      </header>
      {notice && <p className="reports-notice" role="status">{notice}</p>}
      <div className="reports-summary">
        <article><span>Projets du portefeuille</span><strong>{summary.count}</strong></article>
        <article><span>Budget total</span><strong>{money(summary.budget)}</strong></article>
        <article><span>Engagements</span><strong>{money(summary.committed)}</strong></article>
        <article><span>Paiements</span><strong>{money(summary.paid)}</strong></article>
        <article><span>Projets en retard</span><strong>{summary.delayed}</strong></article>
        <article><span>Projets à risque</span><strong>{summary.atRisk}</strong></article>
      </div>
      <div className="reports-card">
        <div><h3>État consolidé du portefeuille</h3><p>Exporter les lignes du portefeuille actuellement fourni à l’application au format CSV, compatible avec Excel.</p></div>
        <button type="button" onClick={exportCsv}>Exporter le portefeuille CSV</button>
      </div>
      <div className="reports-table-wrap">
        <table>
          <thead><tr><th>Référence</th><th>Projet</th><th>Wilaya</th><th>Statut</th><th>Avancement</th><th>Budget</th></tr></thead>
          <tbody>{projects.map((project) => <tr key={project.id ?? project.code}><td>{project.id ?? project.code ?? '—'}</td><td>{project.name ?? project.title ?? 'Projet'}</td><td>{project.wilaya ?? '—'}</td><td>{project.status ?? '—'}</td><td>{Number(project.progress) || 0}%</td><td>{money(project.budget)}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
