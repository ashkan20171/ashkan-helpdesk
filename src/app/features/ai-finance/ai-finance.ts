import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Coins,
  Download,
  Gauge,
  Landmark,
  LineChart,
  PieChart,
  RefreshCw,
  Search,
  TrendingUp,
  WalletCards,
  X
} from 'lucide-angular';

interface RevenueRecord {
  id: string;
  scope: string;
  revenue: number;
  aiCost: number;
  grossProfit: number;
  margin: number;
  attribution: string;
  trend: 'up' | 'down' | 'flat';
  status: 'Healthy' | 'Watch' | 'At Risk';
}

interface RevenueStream {
  name: string;
  revenue: number;
  share: number;
  growth: number;
  margin: number;
}

@Component({
  selector: 'app-ai-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-finance.html',
  styleUrl: './ai-finance.scss'
})
export class AiFinanceComponent {
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
  readonly PieChart = PieChart;
  readonly BarChart3 = BarChart3;
  readonly BriefcaseBusiness = BriefcaseBusiness;
  readonly Building2 = Building2;
  readonly Landmark = Landmark;
  readonly Coins = Coins;
  readonly Gauge = Gauge;

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('All');
  readonly selectedRecord = signal<RevenueRecord | null>(null);

  readonly revenueRecords = signal<RevenueRecord[]>([
    { id: 'REV-2401', scope: 'Enterprise Support', revenue: 248500, aiCost: 28600, grossProfit: 219900, margin: 88.5, attribution: 'AI-assisted resolution', trend: 'up', status: 'Healthy' },
    { id: 'REV-2402', scope: 'Premium SLA', revenue: 184200, aiCost: 24100, grossProfit: 160100, margin: 86.9, attribution: 'Copilot productivity', trend: 'up', status: 'Healthy' },
    { id: 'REV-2403', scope: 'Self-Service Portal', revenue: 132800, aiCost: 21900, grossProfit: 110900, margin: 83.5, attribution: 'Deflection & automation', trend: 'up', status: 'Healthy' },
    { id: 'REV-2404', scope: 'Managed Services', revenue: 116400, aiCost: 30200, grossProfit: 86200, margin: 74.1, attribution: 'Agent assist', trend: 'down', status: 'Watch' },
    { id: 'REV-2405', scope: 'Internal Operations', revenue: 68400, aiCost: 26400, grossProfit: 42000, margin: 61.4, attribution: 'Workflow automation', trend: 'down', status: 'At Risk' }
  ]);

  readonly revenueStreams = signal<RevenueStream[]>([
    { name: 'Enterprise Support', revenue: 248500, share: 33.2, growth: 14.8, margin: 88.5 },
    { name: 'Premium SLA', revenue: 184200, share: 24.6, growth: 11.2, margin: 86.9 },
    { name: 'Self-Service Portal', revenue: 132800, share: 17.7, growth: 18.6, margin: 83.5 },
    { name: 'Managed Services', revenue: 116400, share: 15.5, growth: 5.4, margin: 74.1 },
    { name: 'Internal Operations', revenue: 68400, share: 9.0, growth: -2.7, margin: 61.4 }
  ]);

  readonly filteredRecords = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    return this.revenueRecords().filter(r =>
      (!q || [r.id, r.scope, r.attribution].some(v => v.toLowerCase().includes(q))) &&
      (status === 'All' || r.status === status)
    );
  });

  readonly totalRevenue = computed(() => this.revenueRecords().reduce((s, r) => s + r.revenue, 0));
  readonly totalAiCost = computed(() => this.revenueRecords().reduce((s, r) => s + r.aiCost, 0));
  readonly totalProfit = computed(() => this.revenueRecords().reduce((s, r) => s + r.grossProfit, 0));
  readonly avgMargin = computed(() => this.totalRevenue() ? (this.totalProfit() / this.totalRevenue()) * 100 : 0);
  readonly costToRevenue = computed(() => this.totalRevenue() ? (this.totalAiCost() / this.totalRevenue()) * 100 : 0);

  money(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  pct(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  selectRecord(record: RevenueRecord): void {
    this.selectedRecord.set(record);
  }

  closeDetail(): void {
    this.selectedRecord.set(null);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('All');
  }
}
