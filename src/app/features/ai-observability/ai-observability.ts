import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cpu,
  DollarSign,
  Gauge,
  Layers3,
  RefreshCw,
  Search,
  ServerCog,
  ShieldAlert,
  Sparkles,
  Timer,
  TrendingUp,
  X,
  Zap,
} from 'lucide-angular';

type HealthState = 'Healthy' | 'Degraded' | 'Critical';

interface ModelHealth {
  name: string;
  provider: string;
  health: HealthState;
  latency: string;
  errorRate: string;
  availability: string;
  traffic: string;
  trend: number;
}

interface AlertItem {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  time: string;
  source: string;
  state: 'Open' | 'Investigating' | 'Resolved';
}

@Component({
  selector: 'app-ai-observability',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-observability.html',
  styleUrl: './ai-observability.scss',
})
export class AiObservabilityComponent {
  readonly Search = Search;
  readonly X = X;
  readonly Activity = Activity;
  readonly Bot = Bot;
  readonly Gauge = Gauge;
  readonly Timer = Timer;
  readonly DollarSign = DollarSign;
  readonly Zap = Zap;
  readonly Cpu = Cpu;
  readonly ServerCog = ServerCog;
  readonly Layers3 = Layers3;
  readonly ShieldAlert = ShieldAlert;
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle2 = CheckCircle2;
  readonly ChevronRight = ChevronRight;
  readonly Clock3 = Clock3;
  readonly RefreshCw = RefreshCw;
  readonly Sparkles = Sparkles;
  readonly TrendingUp = TrendingUp;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;

  readonly searchTerm = signal('');
  readonly selectedHealth = signal<'All' | HealthState>('All');
  readonly selectedModel = signal<ModelHealth | null>(null);

  readonly models = signal<ModelHealth[]>([
    { name: 'Apex Reasoning 4.2', provider: 'Primary Gateway', health: 'Healthy', latency: '820 ms', errorRate: '0.34%', availability: '99.97%', traffic: '42%', trend: 8.4 },
    { name: 'Apex Fast 3.8', provider: 'Primary Gateway', health: 'Healthy', latency: '410 ms', errorRate: '0.21%', availability: '99.99%', traffic: '31%', trend: 4.7 },
    { name: 'Orion Enterprise', provider: 'Fallback Gateway', health: 'Degraded', latency: '1.42 s', errorRate: '1.86%', availability: '99.62%', traffic: '17%', trend: -6.2 },
    { name: 'Local Guardrail Model', provider: 'On-Prem Runtime', health: 'Healthy', latency: '190 ms', errorRate: '0.08%', availability: '99.99%', traffic: '10%', trend: 2.1 },
  ]);

  readonly alerts = signal<AlertItem[]>([
    { id: 'AL-482', title: 'Fallback model latency above SLO', severity: 'Warning', time: '4 min ago', source: 'Model routing', state: 'Investigating' },
    { id: 'AL-479', title: 'Token consumption spike detected', severity: 'Info', time: '12 min ago', source: 'Cost telemetry', state: 'Open' },
    { id: 'AL-476', title: 'Guardrail response-time anomaly', severity: 'Warning', time: '27 min ago', source: 'Safety runtime', state: 'Resolved' },
    { id: 'AL-471', title: 'Provider availability recovered', severity: 'Info', time: '41 min ago', source: 'Gateway monitor', state: 'Resolved' },
  ]);

  readonly filteredModels = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const health = this.selectedHealth();
    return this.models().filter(model => {
      const text = `${model.name} ${model.provider}`.toLowerCase();
      return (!term || text.includes(term)) && (health === 'All' || model.health === health);
    });
  });

  readonly healthyCount = computed(() => this.models().filter(m => m.health === 'Healthy').length);
  readonly degradedCount = computed(() => this.models().filter(m => m.health === 'Degraded').length);
  readonly criticalCount = computed(() => this.models().filter(m => m.health === 'Critical').length);

  openModel(model: ModelHealth): void {
    this.selectedModel.set(model);
  }

  closeModel(): void {
    this.selectedModel.set(null);
  }

  setHealth(value: 'All' | HealthState): void {
    this.selectedHealth.set(value);
  }
}
