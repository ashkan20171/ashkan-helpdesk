import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  CircleDollarSign,
  Download,
  Gauge,
  Layers3,
  LineChart,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  WalletCards,
  X
} from 'lucide-angular';

interface ForecastRecord {
  id: string;
  scope: string;
  currentRevenue: number;
  forecastRevenue: number;
  currentMargin: number;
  forecastMargin: number;
  confidence: number;
  scenario: 'Base' | 'Upside' | 'Downside';
  status: 'On Track' | 'Watch' | 'At Risk';
}

interface Scenario {
  name: 'Base' | 'Upside' | 'Downside';
  revenue: number;
  margin: number;
  growth: number;
  confidence: number;
}

@Component({
  selector: 'app-ai-forecasting',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-forecasting.html',
  styleUrl: './ai-forecasting.scss'
})
export class AiForecastingComponent {
  readonly Search = Search;
  readonly X = X;
  readonly Download = Download;
  readonly RefreshCw = RefreshCw;
  readonly TrendingUp = TrendingUp;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;
  readonly CircleDollarSign = CircleDollarSign;
  readonly WalletCards = WalletCards;
  readonly LineChart = LineChart;
  readonly BarChart3 = BarChart3;
  readonly CalendarRange = CalendarRange;
  readonly Gauge = Gauge;
  readonly Layers3 = Layers3;
  readonly ShieldCheck = ShieldCheck;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Activity = Activity;

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('All');
  readonly selectedScenario = signal('Base');
  readonly selectedRecord = signal<ForecastRecord | null>(null);

  readonly forecastRecords = signal<ForecastRecord[]>([
    { id: 'FC-2501', scope: 'Enterprise Support', currentRevenue: 248500, forecastRevenue: 291400, currentMargin: 88.5, forecastMargin: 89.2, confidence: 94, scenario: 'Base', status: 'On Track' },
    { id: 'FC-2502', scope: 'Premium SLA', currentRevenue: 184200, forecastRevenue: 211800, currentMargin: 86.9, forecastMargin: 87.6, confidence: 91, scenario: 'Base', status: 'On Track' },
    { id: 'FC-2503', scope: 'Self-Service Portal', currentRevenue: 132800, forecastRevenue: 162500, currentMargin: 83.5, forecastMargin: 85.1, confidence: 89, scenario: 'Upside', status: 'On Track' },
    { id: 'FC-2504', scope: 'Managed Services', currentRevenue: 116400, forecastRevenue: 124900, currentMargin: 74.1, forecastMargin: 72.8, confidence: 78, scenario: 'Downside', status: 'Watch' },
    { id: 'FC-2505', scope: 'Internal Operations', currentRevenue: 68400, forecastRevenue: 65400, currentMargin: 61.4, forecastMargin: 58.9, confidence: 72, scenario: 'Downside', status: 'At Risk' }
  ]);

  readonly scenarios = signal<Scenario[]>([
    { name: 'Base', revenue: 856000, margin: 84.8, growth: 13.9, confidence: 91 },
    { name: 'Upside', revenue: 921500, margin: 86.7, growth: 22.6, confidence: 78 },
    { name: 'Downside', revenue: 772800, margin: 81.2, growth: 2.8, confidence: 73 }
  ]);

  readonly filteredRecords = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const scenario = this.selectedScenario();
    return this.forecastRecords().filter(r =>
      (!q || [r.id, r.scope, r.scenario].some(v => v.toLowerCase().includes(q))) &&
      (status === 'All' || r.status === status) &&
      (scenario === 'All' || r.scenario === scenario)
    );
  });

  readonly currentRevenue = computed(() => this.forecastRecords().reduce((s, r) => s + r.currentRevenue, 0));
  readonly forecastRevenue = computed(() => this.forecastRecords().reduce((s, r) => s + r.forecastRevenue, 0));
  readonly revenueGrowth = computed(() => this.currentRevenue() ? ((this.forecastRevenue() - this.currentRevenue()) / this.currentRevenue()) * 100 : 0);
  readonly forecastMargin = computed(() => {
    const total = this.forecastRecords().reduce((s, r) => s + r.forecastRevenue, 0);
    const weighted = this.forecastRecords().reduce((s, r) => s + (r.forecastRevenue * r.forecastMargin), 0);
    return total ? weighted / total : 0;
  });
  readonly confidence = computed(() => {
    const values = this.forecastRecords();
    return values.length ? values.reduce((s, r) => s + r.confidence, 0) / values.length : 0;
  });

  money(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  pct(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  selectRecord(record: ForecastRecord): void {
    this.selectedRecord.set(record);
  }

  closeDetail(): void {
    this.selectedRecord.set(null);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('All');
    this.selectedScenario.set('Base');
  }

  scenarioValue(name: string): Scenario {
    return this.scenarios().find(s => s.name === name) ?? this.scenarios()[0];
  }
}
