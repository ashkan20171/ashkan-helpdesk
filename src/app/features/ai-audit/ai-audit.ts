import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Archive, BadgeCheck, CalendarClock, CheckCircle2, ChevronRight, CircleAlert, ClipboardCheck, Clock3, Download, FileCheck2, FileSearch, FolderArchive, History, Info, LockKeyhole, Search, ShieldCheck, X } from 'lucide-angular';

type EvidenceStatus = 'Complete' | 'Review' | 'Missing';
type EvidenceType = 'Decision' | 'Model' | 'Security' | 'Compliance' | 'Human Review';

interface EvidenceRecord {
  id: string; title: string; type: EvidenceType; status: EvidenceStatus; owner: string;
  collectedAt: string; source: string; retention: string; integrity: string; description: string;
}

interface AuditEvent {
  id: string; action: string; actor: string; timestamp: string; scope: string;
  result: 'Passed' | 'Flagged' | 'Recorded';
}

@Component({
  selector: 'app-ai-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-audit.html',
  styleUrl: './ai-audit.scss',
})
export class AiAuditComponent {
  readonly Search = Search; readonly X = X; readonly Download = Download; readonly ChevronRight = ChevronRight;
  readonly ShieldCheck = ShieldCheck; readonly ClipboardCheck = ClipboardCheck; readonly FileCheck2 = FileCheck2;
  readonly FolderArchive = FolderArchive; readonly History = History; readonly FileSearch = FileSearch;
  readonly CalendarClock = CalendarClock; readonly LockKeyhole = LockKeyhole; readonly CircleAlert = CircleAlert;
  readonly CheckCircle2 = CheckCircle2; readonly Clock3 = Clock3; readonly BadgeCheck = BadgeCheck;
  readonly Archive = Archive; readonly Info = Info;

  readonly searchTerm = signal('');
  readonly statusFilter = signal<'All' | EvidenceStatus>('All');
  readonly selectedEvidence = signal<EvidenceRecord | null>(null);

  readonly evidence = signal<EvidenceRecord[]>([
    { id: 'EV-2401', title: 'AI Response Decision Trace', type: 'Decision', status: 'Complete', owner: 'AI Governance', collectedAt: '22 Nov 2026 · 20:12', source: 'Decision telemetry', retention: '365 days', integrity: 'SHA-256 verified', description: 'Decision metadata, policy evaluation, retrieval context and human-review state for a material AI-assisted response.' },
    { id: 'EV-2397', title: 'Model Card & Evaluation Snapshot', type: 'Model', status: 'Complete', owner: 'AI Platform', collectedAt: '22 Nov 2026 · 19:48', source: 'Model registry', retention: '730 days', integrity: 'SHA-256 verified', description: 'Versioned model identity, capabilities, limitations, evaluation coverage and approved-use context.' },
    { id: 'EV-2391', title: 'Prompt Injection Security Finding', type: 'Security', status: 'Review', owner: 'AI Security', collectedAt: '22 Nov 2026 · 18:36', source: 'Red-team center', retention: '730 days', integrity: 'Pending verification', description: 'Evidence package for an adversarial prompt-injection scenario, including detection signals and mitigation status.' },
    { id: 'EV-2385', title: 'EU AI Governance Control Mapping', type: 'Compliance', status: 'Complete', owner: 'Compliance', collectedAt: '22 Nov 2026 · 17:20', source: 'AI governance center', retention: '1095 days', integrity: 'SHA-256 verified', description: 'Framework mapping and control evidence supporting organizational AI governance readiness.' },
    { id: 'EV-2378', title: 'Human Approval Record', type: 'Human Review', status: 'Missing', owner: 'Service Operations', collectedAt: '22 Nov 2026 · 16:05', source: 'Review workflow', retention: '365 days', integrity: 'Not collected', description: 'Required approval artifact for a sensitive AI-assisted action that crossed the configured human-oversight threshold.' },
  ]);

  readonly auditEvents = signal<AuditEvent[]>([
    { id: 'AU-881', action: 'Evidence package sealed', actor: 'AI Audit Service', timestamp: '20:16', scope: 'EV-2401', result: 'Passed' },
    { id: 'AU-880', action: 'Human review requested', actor: 'Policy Engine', timestamp: '20:09', scope: 'EV-2378', result: 'Flagged' },
    { id: 'AU-879', action: 'Model snapshot captured', actor: 'AI Platform', timestamp: '19:49', scope: 'EV-2397', result: 'Recorded' },
    { id: 'AU-878', action: 'Security evidence attached', actor: 'AI Security', timestamp: '18:39', scope: 'EV-2391', result: 'Recorded' },
  ]);

  readonly filteredEvidence = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    return this.evidence().filter(item => {
      const matchesTerm = !term || [item.id, item.title, item.type, item.owner, item.source, item.description]
        .some(value => value.toLowerCase().includes(term));
      return matchesTerm && (status === 'All' || item.status === status);
    });
  });

  readonly completeCount = computed(() => this.evidence().filter(e => e.status === 'Complete').length);
  readonly reviewCount = computed(() => this.evidence().filter(e => e.status === 'Review').length);
  readonly missingCount = computed(() => this.evidence().filter(e => e.status === 'Missing').length);
  readonly evidenceScore = computed(() =>
    Math.round(this.evidence().reduce((sum, item) => sum + (item.status === 'Complete' ? 100 : item.status === 'Review' ? 65 : 20), 0) / this.evidence().length)
  );

  openEvidence(item: EvidenceRecord): void { this.selectedEvidence.set(item); }
  closeEvidence(): void { this.selectedEvidence.set(null); }
  setStatus(status: 'All' | EvidenceStatus): void { this.statusFilter.set(status); }
}
