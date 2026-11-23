import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle, BookOpenCheck, CheckCircle2, ClipboardCheck, FileCheck2,
  FileText, Flag, Globe2, History, LockKeyhole, LucideAngularModule,
  Search, ShieldCheck, Sparkles, UserCheck, UsersRound, XCircle
} from 'lucide-angular';

type ComplianceStatus = 'Compliant' | 'Review' | 'Gap';
type ControlStatus = 'Implemented' | 'Partial' | 'Planned';

interface Framework {
  id: string;
  name: string;
  scope: string;
  coverage: number;
  status: ComplianceStatus;
  nextReview: string;
}

interface Control {
  id: string;
  title: string;
  domain: string;
  status: ControlStatus;
  evidence: number;
  owner: string;
}

@Component({
  selector: 'ah-ai-governance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-governance.html',
  styleUrl: './ai-governance.scss'
})
export class AiGovernanceComponent {
  readonly AlertTriangle = AlertTriangle;
  readonly BookOpenCheck = BookOpenCheck;
  readonly CheckCircle2 = CheckCircle2;
  readonly ClipboardCheck = ClipboardCheck;
  readonly FileCheck2 = FileCheck2;
  readonly FileText = FileText;
  readonly Flag = Flag;
  readonly Globe2 = Globe2;
  readonly History = History;
  readonly LockKeyhole = LockKeyhole;
  readonly Search = Search;
  readonly ShieldCheck = ShieldCheck;
  readonly Sparkles = Sparkles;
  readonly UserCheck = UserCheck;
  readonly UsersRound = UsersRound;
  readonly XCircle = XCircle;

  readonly search = signal('');
  readonly statusFilter = signal<'All' | ComplianceStatus>('All');
  readonly toast = signal('');
  readonly selected = signal<Framework | null>(null);
  readonly showDetail = signal(false);

  readonly frameworks = signal<Framework[]>([
    { id: 'EU-AI-ACT', name: 'EU AI Act Readiness', scope: 'Risk management, transparency & human oversight', coverage: 86, status: 'Review', nextReview: '30 days' },
    { id: 'ISO-42001', name: 'ISO/IEC 42001', scope: 'AI management system governance', coverage: 78, status: 'Review', nextReview: '45 days' },
    { id: 'ISO-27001', name: 'ISO/IEC 27001 AI Controls', scope: 'Information security controls around AI services', coverage: 94, status: 'Compliant', nextReview: '60 days' },
    { id: 'NIST-AI-RMF', name: 'NIST AI RMF', scope: 'Govern, Map, Measure & Manage', coverage: 91, status: 'Compliant', nextReview: '60 days' }
  ]);

  readonly controls = signal<Control[]>([
    { id: 'GOV-001', title: 'AI system inventory and ownership', domain: 'Governance', status: 'Implemented', evidence: 100, owner: 'AI Governance' },
    { id: 'RISK-014', title: 'AI risk assessment before production', domain: 'Risk Management', status: 'Implemented', evidence: 96, owner: 'Risk Office' },
    { id: 'HUM-008', title: 'Human oversight for sensitive actions', domain: 'Human Oversight', status: 'Implemented', evidence: 92, owner: 'AI Operations' },
    { id: 'TRN-005', title: 'Transparency and user disclosure', domain: 'Transparency', status: 'Partial', evidence: 71, owner: 'Product Compliance' },
    { id: 'DAT-012', title: 'AI data lineage and retention policy', domain: 'Data Governance', status: 'Partial', evidence: 68, owner: 'Data Office' },
    { id: 'MON-003', title: 'Continuous model monitoring', domain: 'Monitoring', status: 'Planned', evidence: 42, owner: 'Platform Engineering' }
  ]);

  readonly filteredFrameworks = computed(() => {
    const q = this.search().trim().toLowerCase();
    const f = this.statusFilter();
    return this.frameworks().filter(x => {
      const statusMatch = f === 'All' || x.status === f;
      const queryMatch = !q || `${x.id} ${x.name} ${x.scope} ${x.status}`.toLowerCase().includes(q);
      return statusMatch && queryMatch;
    });
  });

  readonly overallCoverage = computed(() => Math.round(this.frameworks().reduce((sum, x) => sum + x.coverage, 0) / this.frameworks().length));
  readonly compliant = computed(() => this.frameworks().filter(x => x.status === 'Compliant').length);
  readonly review = computed(() => this.frameworks().filter(x => x.status === 'Review').length);
  readonly gaps = computed(() => this.frameworks().filter(x => x.status === 'Gap').length);
  readonly controlEvidence = computed(() => Math.round(this.controls().reduce((sum, x) => sum + x.evidence, 0) / this.controls().length));

  notify(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2800);
  }

  open(item: Framework) {
    this.selected.set(item);
    this.showDetail.set(true);
  }

  runAssessment() {
    this.notify('AI governance assessment workflow is ready for backend execution.');
  }

  classOf(value: string) {
    return value.toLowerCase().replace(/\s+/g, '-');
  }

  track(_: number, item: Framework) {
    return item.id;
  }

  trackControl(_: number, item: Control) {
    return item.id;
  }
}
