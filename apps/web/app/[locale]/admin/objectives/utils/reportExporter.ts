// /workspaces/website/apps/web/app/[locale]/admin/objectives/utils/reportExporter.ts
// Description: Export objectives reports to PDF
// Last modified: 2026-01-10
// COMPLETE FILE

import type { ObjectiveWithProgress } from '../types';
import { OBJECTIVE_TYPE_LABELS, OBJECTIVE_STATUS_CONFIG, formatObjectiveValue, OBJECTIVE_TYPE_UNITS, MONTHS_FR } from '../types';

// Note: jsPDF must be imported dynamically to avoid SSR issues
// import { jsPDF } from 'jspdf';

export interface ReportOptions {
  title?: string;
  subtitle?: string;
  includeCharts?: boolean;
  includeActions?: boolean;
  includeTransactions?: boolean;
  dateRange?: { start: Date; end: Date };
}

export interface ReportData {
  objective: ObjectiveWithProgress;
  historicalData?: { date: string; value: number }[];
  actions?: { title: string; status: string; impact: number }[];
  transactions?: { date: string; description: string; amount: number }[];
  insights?: { title: string; message: string }[];
}

/**
 * Generate PDF report for a single objective
 */
export async function generateObjectiveReport(
  data: ReportData,
  options: ReportOptions = {}
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const { objective } = data;
  const statusConfig = OBJECTIVE_STATUS_CONFIG[objective.status];
  const unit = OBJECTIVE_TYPE_UNITS[objective.type];

  let y = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(options.title || 'Rapport d\'objectif', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' }), margin, y);
  y += 15;

  // Objective Info
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text(objective.name || OBJECTIVE_TYPE_LABELS[objective.type], margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(getPeriodLabel(objective), margin, y);
  y += 15;

  // Status Box
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 40, 3, 3, 'F');

  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Statut:', margin + 10, y);
  doc.setTextColor(...hexToRgb(statusConfig.color.replace('text-', '').replace('-400', '')));
  doc.text(statusConfig.label, margin + 50, y);

  y += 10;
  doc.setTextColor(30, 30, 30);
  doc.text('Progression:', margin + 10, y);
  doc.text(`${objective.progressPercent.toFixed(1)}%`, margin + 50, y);

  y += 10;
  doc.text('Actuel / Objectif:', margin + 10, y);
  doc.text(
    `${formatObjectiveValue(objective.actualAmount, unit)} / ${formatObjectiveValue(objective.targetAmount, unit)}`,
    margin + 60, y
  );

  y += 20;

  // Progress Bar (visual representation)
  const barWidth = pageWidth - 2 * margin - 20;
  const barHeight = 8;
  const progressWidth = Math.min(100, objective.progressPercent) / 100 * barWidth;

  doc.setFillColor(220, 220, 220);
  doc.roundedRect(margin + 10, y, barWidth, barHeight, 2, 2, 'F');

  doc.setFillColor(...getStatusColor(objective.status));
  doc.roundedRect(margin + 10, y, progressWidth, barHeight, 2, 2, 'F');

  y += 25;

  // Insights Section
  if (data.insights && data.insights.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('Insights', margin, y);
    y += 10;

    doc.setFontSize(10);
    for (const insight of data.insights.slice(0, 5)) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setTextColor(60, 60, 60);
      doc.text(`• ${insight.title}`, margin + 5, y);
      y += 5;
      doc.setTextColor(100, 100, 100);
      const lines = doc.splitTextToSize(insight.message, pageWidth - 2 * margin - 10);
      doc.text(lines, margin + 10, y);
      y += lines.length * 5 + 5;
    }
    y += 10;
  }

  // Actions Section
  if (options.includeActions && data.actions && data.actions.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('Actions recommandées', margin, y);
    y += 10;

    doc.setFontSize(10);
    for (const action of data.actions.slice(0, 5)) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setTextColor(60, 60, 60);
      doc.text(`• ${action.title}`, margin + 5, y);
      y += 5;
      doc.setTextColor(100, 100, 100);
      doc.text(`Impact estimé: ${formatObjectiveValue(action.impact, unit)}`, margin + 10, y);
      y += 8;
    }
    y += 10;
  }

  // Transactions Section
  if (options.includeTransactions && data.transactions && data.transactions.length > 0) {
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('Transactions récentes', margin, y);
    y += 10;

    // Table header
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Date', margin + 5, y);
    doc.text('Description', margin + 35, y);
    doc.text('Montant', pageWidth - margin - 30, y);
    y += 5;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setTextColor(60, 60, 60);
    for (const tx of data.transactions.slice(0, 10)) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      const date = new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      doc.text(date, margin + 5, y);
      doc.text(tx.description.substring(0, 40), margin + 35, y);
      doc.text(formatObjectiveValue(tx.amount, 'currency'), pageWidth - margin - 30, y);
      y += 6;
    }
  }

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} / ${pageCount} - Généré par VMCloud Objectives`,
      pageWidth / 2,
      285,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}

/**
 * Generate summary PDF report for multiple objectives
 */
export async function generateSummaryReport(
  objectives: ObjectiveWithProgress[],
  options: ReportOptions = {}
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  let y = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(options.title || 'Rapport de synthèse des objectifs', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' }), margin, y);
  y += 20;

  // Summary Stats
  const achieved = objectives.filter(o => o.status === 'achieved').length;
  const onTrack = objectives.filter(o => o.status === 'on_track').length;
  const atRisk = objectives.filter(o => o.status === 'at_risk').length;
  const behind = objectives.filter(o => o.status === 'behind').length;
  const avgProgress = objectives.length > 0
    ? objectives.reduce((sum, o) => sum + o.progressPercent, 0) / objectives.length
    : 0;

  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('Vue d\'ensemble', margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total: ${objectives.length} objectifs`, margin + 5, y);
  y += 6;
  doc.text(`Atteints: ${achieved}`, margin + 5, y);
  y += 6;
  doc.text(`En bonne voie: ${onTrack}`, margin + 5, y);
  y += 6;
  doc.text(`À risque: ${atRisk}`, margin + 5, y);
  y += 6;
  doc.text(`En retard: ${behind}`, margin + 5, y);
  y += 6;
  doc.text(`Progression moyenne: ${avgProgress.toFixed(1)}%`, margin + 5, y);
  y += 15;

  // Objectives List
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('Détail des objectifs', margin, y);
  y += 10;

  // Table header
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Objectif', margin + 5, y);
  doc.text('Statut', margin + 80, y);
  doc.text('Progression', margin + 110, y);
  doc.text('Actuel', margin + 140, y);
  y += 5;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFontSize(9);
  for (const obj of objectives) {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const statusConfig = OBJECTIVE_STATUS_CONFIG[obj.status];
    const unit = OBJECTIVE_TYPE_UNITS[obj.type];

    doc.setTextColor(60, 60, 60);
    doc.text((obj.name || OBJECTIVE_TYPE_LABELS[obj.type]).substring(0, 30), margin + 5, y);
    doc.text(statusConfig.label, margin + 80, y);
    doc.text(`${obj.progressPercent.toFixed(0)}%`, margin + 110, y);
    doc.text(formatObjectiveValue(obj.actualAmount, unit), margin + 140, y);
    y += 7;
  }

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} / ${pageCount} - Généré par VMCloud Objectives`,
      pageWidth / 2,
      285,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}

/**
 * Download PDF report
 */
export function downloadReport(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper functions
function getPeriodLabel(objective: ObjectiveWithProgress): string {
  if (objective.period === 'yearly') return `Année ${objective.year}`;
  if (objective.period === 'quarterly' && objective.quarter) {
    return `T${objective.quarter} ${objective.year}`;
  }
  if (objective.period === 'monthly' && objective.month) {
    return `${MONTHS_FR[objective.month - 1]} ${objective.year}`;
  }
  return `${objective.year}`;
}

function getStatusColor(status: string): [number, number, number] {
  switch (status) {
    case 'achieved':
      return [16, 185, 129]; // emerald
    case 'on_track':
      return [59, 130, 246]; // blue
    case 'at_risk':
      return [245, 158, 11]; // amber
    case 'behind':
      return [239, 68, 68]; // red
    default:
      return [113, 113, 122]; // zinc
  }
}

function hexToRgb(colorName: string): [number, number, number] {
  const colors: Record<string, [number, number, number]> = {
    emerald: [16, 185, 129],
    blue: [59, 130, 246],
    amber: [245, 158, 11],
    red: [239, 68, 68],
    zinc: [113, 113, 122],
  };
  return colors[colorName] || colors.zinc;
}
