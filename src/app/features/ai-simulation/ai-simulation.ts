import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Gauge,
  Layers3,
  RefreshCw,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  WalletCards,
  X
} from 'lucide-angular';

interface Simulation {
  id: string;
  name: string;
  scope: string;
  revenueDelta: number;
  costDelta: number;
  profitDelta: number;
  marginDelta: number;
  confidence: number;
  status: 'Recommended' | 'Watch' | 'Risk';
}

interface ScenarioPreset {
  name: string;
  description: string;
  revenueMultiplier: number;
  costMultiplier: number;
  automation: number;
}

@Component({
  selector: 'app-ai-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-simulation.html',
  styleUrl: './ai-simulation.scss'
})
export class AiSimulationComponent {
  readonly Math = Math;
  readonly X = X;
  readonly Search = Search;
  readonly RefreshCw = RefreshCw;
  readonly RotateCcw = RotateCcw;
  readonly Download = Download;
  readonly CircleDollarSign = CircleDollarSign;
  readonly TrendingUp = TrendingUp;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;
  readonly Gauge = Gauge;
  readonly Calculator = Calculator;
  readonly BarChart3 = BarChart3;
  readonly Settings2 = Settings2;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly ShieldCheck = ShieldCheck;
  readonly Sparkles = Sparkles;
  readonly WalletCards = WalletCards;
  readonly Layers3 = Layers3;
  readonly Activity = Activity;
  readonly CheckCircle2 = CheckCircle2;

  readonly monthlyRevenue = signal(856000);
  readonly monthlyAiCost = signal(118000);
  readonly ticketVolume = signal(52000);
  readonly automationRate = signal(68);
  readonly agentCount = signal(84);
  readonly modelCostIndex = signal(100);
  readonly priceIndex = signal(100);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('All');
  readonly selectedSimulation = signal<Simulation | null>(null);

  readonly presets = signal<ScenarioPreset[]>([
    { name: 'Growth Push', description: 'Increase pricing and automation to maximize profit expansion.', revenueMultiplier: 1.14, costMultiplier: 1.08, automation: 78 },
    { name: 'Efficiency First', description: 'Reduce AI unit cost and increase workflow automation.', revenueMultiplier: 1.04, costMultiplier: 0.86, automation: 82 },
    { name: 'Conservative', description: 'Protect margin with controlled growth and lower operating risk.', revenueMultiplier: 1.06, costMultiplier: 0.96, automation: 72 }
  ]);

  readonly simulations = signal<Simulation[]>([
    { id: 'SIM-3001', name: 'Increase automation to 80%', scope: 'Global Support', revenueDelta: 41200, costDelta: -16800, profitDelta: 58000, marginDelta: 3.7, confidence: 92, status: 'Recommended' },
    { id: 'SIM-3002', name: 'Reduce model cost by 15%', scope: 'AI Platform', revenueDelta: 0, costDelta: -17700, profitDelta: 17700, marginDelta: 2.1, confidence: 96, status: 'Recommended' },
    { id: 'SIM-3003', name: 'Increase service price by 8%', scope: 'Premium SLA', revenueDelta: 14700, costDelta: 1800, profitDelta: 12900, marginDelta: 0.8, confidence: 84, status: 'Recommended' },
    { id: 'SIM-3004', name: 'Add 20 support agents', scope: 'Managed Services', revenueDelta: 26800, costDelta: 29400, profitDelta: -2600, marginDelta: -1.7, confidence: 76, status: 'Watch' },
    { id: 'SIM-3005', name: 'Double ticket volume', scope: 'Enterprise Support', revenueDelta: 92000, costDelta: 104000, profitDelta: -12000, marginDelta: -4.3, confidence: 68, status: 'Risk' }
  ]);

  readonly simulatedRevenue = computed(() => {
    const price = this.priceIndex() / 100;
    const automationLift = 1 + Math.max(0, this.automationRate() - 68) * 0.0017;
    const volume = this.ticketVolume() / 52000;
    return this.monthlyRevenue() * price * automationLift * volume;
  });

  readonly simulatedCost = computed(() => {
    const volume = this.ticketVolume() / 52000;
    const automationSavings = 1 - Math.max(0, this.automationRate() - 68) * 0.004;
    const modelIndex = this.modelCostIndex() / 100;
    return Math.max(0, this.monthlyAiCost() * volume * modelIndex * automationSavings);
  });

  readonly simulatedProfit = computed(() => this.simulatedRevenue() - this.simulatedCost());
  readonly simulatedMargin = computed(() => this.simulatedRevenue() ? (this.simulatedProfit() / this.simulatedRevenue()) * 100 : 0);
  readonly profitDelta = computed(() => this.simulatedProfit() - (this.monthlyRevenue() - this.monthlyAiCost()));
  readonly profitDeltaPct = computed(() => {
    const baseline = this.monthlyRevenue() - this.monthlyAiCost();
    return baseline ? (this.profitDelta() / baseline) * 100 : 0;
  });

  readonly filteredSimulations = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    return this.simulations().filter(s =>
      (!q || [s.id, s.name, s.scope].some(v => v.toLowerCase().includes(q))) &&
      (status === 'All' || s.status === status)
    );
  });

  money(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  pct(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  runPreset(preset: ScenarioPreset): void {
    this.priceIndex.set(Math.round(preset.revenueMultiplier * 100));
    this.modelCostIndex.set(Math.round(preset.costMultiplier * 100));
    this.automationRate.set(preset.automation);
  }

  resetModel(): void {
    this.priceIndex.set(100);
    this.modelCostIndex.set(100);
    this.automationRate.set(68);
    this.ticketVolume.set(52000);
  }

  selectSimulation(simulation: Simulation): void {
    this.selectedSimulation.set(simulation);
  }

  closeDetail(): void {
    this.selectedSimulation.set(null);
  }
}
