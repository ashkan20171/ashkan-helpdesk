import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity, BarChart3, CheckCircle2, Clock3, Database, Gauge, GitBranch,
  LucideAngularModule, RefreshCw, Search, ShieldCheck, Sparkles, Target,
  TrendingUp, XCircle
} from 'lucide-angular';

type RunStatus = 'Healthy' | 'Needs Review' | 'Failed';
type EvalStatus = 'Passed' | 'Review' | 'Failed';

interface AiRun {
  id: string;
  model: string;
  task: string;
  latency: number;
  tokens: number;
  cost: number;
  confidence: number;
  status: RunStatus;
  time: string;
}

interface EvalCase {
  id: string;
  name: string;
  dataset: string;
  score: number;
  grounded: number;
  safety: number;
  status: EvalStatus;
}

@Component({
  selector: 'ah-ai-observability',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-observability.html',
  styleUrl: './ai-observability.scss'
})
export class AiObservabilityComponent {
  readonly Activity = Activity;
  readonly BarChart3 = BarChart3;
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock3 = Clock3;
  readonly Database = Database;
  readonly Gauge = Gauge;
  readonly GitBranch = GitBranch;
  readonly RefreshCw = RefreshCw;
  readonly Search = Search;
  readonly ShieldCheck = ShieldCheck;
  readonly Sparkles = Sparkles;
  readonly Target = Target;
  readonly TrendingUp = TrendingUp;
  readonly XCircle = XCircle;

  readonly search = signal('');
  readonly selectedRun = signal<AiRun | null>(null);
  readonly showModal = signal(false);
  readonly toast = signal('');
  readonly refreshing = signal(false);

  readonly runs = signal<AiRun[]>([
    { id: 'RUN-9021', model: 'GPT-4.1', task: 'Ticket summarization', latency: 842, tokens: 1280, cost: 0.014, confidence: 96, status: 'Healthy', time: '2 min ago' },
    { id: 'RUN-9019', model: 'Claude Sonnet', task: 'RCA generation', latency: 1180, tokens: 2140, cost: 0.026, confidence: 91, status: 'Healthy', time: '8 min ago' },
    { id: 'RUN-9015', model: 'GPT-4.1 mini', task: 'Knowledge retrieval answer', latency: 620, tokens: 760, cost: 0.004, confidence: 88, status: 'Needs Review', time: '16 min ago' },
    { id: 'RUN-9008', model: 'GPT-4.1', task: 'Sensitive action recommendation', latency: 1450, tokens: 1820, cost: 0.019, confidence: 72, status: 'Needs Review', time: '31 min ago' },
    { id: 'RUN-8997', model: 'Fallback model', task: 'Customer reply draft', latency: 1710, tokens: 1420, cost: 0.011, confidence: 61, status: 'Failed', time: '49 min ago' }
  ]);

  readonly evaluations = signal<EvalCase[]>([
    { id: 'EVAL-104', name: 'Enterprise Support QA', dataset: 'support-golden-v3', score: 94, grounded: 97, safety: 99, status: 'Passed' },
    { id: 'EVAL-103', name: 'RAG Citation Accuracy', dataset: 'rag-citations-v2', score: 91, grounded: 93, safety: 98, status: 'Passed' },
    { id: 'EVAL-102', name: 'Prompt Injection Defense', dataset: 'security-redteam-v1', score: 88, grounded: 84, safety: 96, status: 'Review' },
    { id: 'EVAL-101', name: 'Customer Tone & Policy', dataset: 'tone-policy-v4', score: 96, grounded: 95, safety: 99, status: 'Passed' }
  ]);

  readonly filteredRuns = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.runs();
    return this.runs().filter(x =>
      `${x.id} ${x.model} ${x.task} ${x.status}`.toLowerCase().includes(q)
    );
  });

  readonly healthyRate = computed(() => {
    const all = this.runs();
    return Math.round((all.filter(x => x.status === 'Healthy').length / all.length) * 100);
  });

  readonly avgLatency = computed(() =>
    Math.round(this.runs().reduce((sum, x) => sum + x.latency, 0) / this.runs().length)
  );

  readonly totalTokens = computed(() =>
    this.runs().reduce((sum, x) => sum + x.tokens, 0)
  );

  readonly totalCost = computed(() =>
    this.runs().reduce((sum, x) => sum + x.cost, 0)
  );

  readonly avgEvalScore = computed(() =>
    Math.round(this.evaluations().reduce((sum, x) => sum + x.score, 0) / this.evaluations().length)
  );

  notify(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 3000);
  }

  refresh() {
    this.refreshing.set(true);
    this.notify('AI observability snapshot is refreshing...');
    setTimeout(() => {
      this.refreshing.set(false);
      this.notify('Telemetry snapshot refreshed. Backend collector is ready for integration.');
    }, 700);
  }

  openRun(run: AiRun) {
    this.selectedRun.set(run);
    this.showModal.set(true);
  }

  statusClass(status: string) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  track(_: number, item: AiRun) {
    return item.id;
  }

  trackEval(_: number, item: EvalCase) {
    return item.id;
  }
}
