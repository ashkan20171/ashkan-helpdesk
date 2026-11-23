import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BadgeCheck,
  BrainCircuit,
  ChevronRight,
  CircleAlert,
  Eye,
  FileCheck2,
  Fingerprint,
  Gauge,
  Info,
  Layers3,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  X,
} from 'lucide-angular';

type TrustStatus = 'Verified' | 'Review' | 'Gap';
type TrustCategory = 'Transparency' | 'Explainability' | 'Provenance' | 'Fairness' | 'Disclosure';

interface TrustControl {
  id: string;
  title: string;
  category: TrustCategory;
  status: TrustStatus;
  score: number;
  owner: string;
  description: string;
  evidence: string;
  limitation: string;
  userDisclosure: string;
}

@Component({
  selector: 'app-ai-trust',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-trust.html',
  styleUrl: './ai-trust.scss',
})
export class AiTrustComponent {
  readonly Search = Search;
  readonly X = X;
  readonly Eye = Eye;
  readonly BrainCircuit = BrainCircuit;
  readonly Sparkles = Sparkles;
  readonly ShieldCheck = ShieldCheck;
  readonly BadgeCheck = BadgeCheck;
  readonly FileCheck2 = FileCheck2;
  readonly Fingerprint = Fingerprint;
  readonly Gauge = Gauge;
  readonly Layers3 = Layers3;
  readonly Scale = Scale;
  readonly UserCheck = UserCheck;
  readonly Target = Target;
  readonly Info = Info;
  readonly CircleAlert = CircleAlert;
  readonly ChevronRight = ChevronRight;

  readonly searchTerm = signal('');
  readonly statusFilter = signal<'All' | TrustStatus>('All');
  readonly selectedControl = signal<TrustControl | null>(null);

  readonly controls = signal<TrustControl[]>([
    {
      id: 'TR-001',
      title: 'AI Decision Transparency',
      category: 'Transparency',
      status: 'Verified',
      score: 94,
      owner: 'AI Governance',
      description: 'Every material AI-assisted action exposes decision context, source scope, and applicable policy signals.',
      evidence: 'Decision trace + policy reference + response metadata',
      limitation: 'Final production enforcement is backend dependent.',
      userDisclosure: 'This response was assisted by AI and may require human validation.',
    },
    {
      id: 'TR-002',
      title: 'Explainability / Why This Answer?',
      category: 'Explainability',
      status: 'Verified',
      score: 91,
      owner: 'AI Product',
      description: 'A user-facing explanation pattern provides concise rationale without exposing hidden prompts or secrets.',
      evidence: 'Explanation template + source references + confidence signal',
      limitation: 'Explanation quality depends on model telemetry and retrieval traces.',
      userDisclosure: 'Why this answer? Review the supporting sources and decision factors.',
    },
    {
      id: 'TR-003',
      title: 'Model Card & Capability Disclosure',
      category: 'Transparency',
      status: 'Review',
      score: 82,
      owner: 'AI Platform',
      description: 'Models are represented with intended use, capabilities, limitations, evaluation scope, and operational owner.',
      evidence: 'Model card + evaluation summary + owner assignment',
      limitation: 'Provider-specific metadata still needs backend synchronization.',
      userDisclosure: 'AI capabilities and limitations are documented for this model.',
    },
    {
      id: 'TR-004',
      title: 'Data & Source Provenance',
      category: 'Provenance',
      status: 'Verified',
      score: 96,
      owner: 'Knowledge Engineering',
      description: 'AI outputs can be connected to indexed source material, retrieval events, and provenance metadata.',
      evidence: 'Source IDs + chunk lineage + retrieval timestamp',
      limitation: 'Live vector-store lineage will be supplied by the backend.',
      userDisclosure: 'Sources used for this answer are available for review.',
    },
    {
      id: 'TR-005',
      title: 'Fairness & Bias Monitoring',
      category: 'Fairness',
      status: 'Review',
      score: 76,
      owner: 'Responsible AI',
      description: 'Trust monitoring provides a foundation for segment-level quality, fairness, and bias evaluation.',
      evidence: 'Evaluation cohorts + quality deltas + red-team findings',
      limitation: 'Production demographic or protected-attribute analysis requires governed datasets.',
      userDisclosure: 'AI quality may vary across contexts and should be reviewed for material decisions.',
    },
    {
      id: 'TR-006',
      title: 'AI Interaction Disclosure',
      category: 'Disclosure',
      status: 'Gap',
      score: 68,
      owner: 'UX Governance',
      description: 'A centralized disclosure policy defines when users should be informed that an interaction includes AI.',
      evidence: 'Disclosure policy + UI pattern + localization keys',
      limitation: 'Final channel-level enforcement remains a frontend/backend integration task.',
      userDisclosure: 'You are interacting with an AI-assisted feature.',
    },
  ]);

  readonly filteredControls = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.controls().filter((control) => {
      const matchesTerm =
        !term ||
        [control.title, control.category, control.owner, control.description]
          .some((value) => value.toLowerCase().includes(term));
      const matchesStatus = status === 'All' || control.status === status;
      return matchesTerm && matchesStatus;
    });
  });

  readonly verifiedCount = computed(() => this.controls().filter(c => c.status === 'Verified').length);
  readonly reviewCount = computed(() => this.controls().filter(c => c.status === 'Review').length);
  readonly gapCount = computed(() => this.controls().filter(c => c.status === 'Gap').length);
  readonly trustScore = computed(() =>
    Math.round(this.controls().reduce((sum, control) => sum + control.score, 0) / this.controls().length)
  );
  readonly avgExplainability = computed(() => {
    const items = this.controls().filter(c => c.category === 'Explainability' || c.category === 'Transparency');
    return Math.round(items.reduce((sum, c) => sum + c.score, 0) / items.length);
  });

  openControl(control: TrustControl): void {
    this.selectedControl.set(control);
  }

  closeControl(): void {
    this.selectedControl.set(null);
  }

  setStatus(status: 'All' | TrustStatus): void {
    this.statusFilter.set(status);
  }
}
