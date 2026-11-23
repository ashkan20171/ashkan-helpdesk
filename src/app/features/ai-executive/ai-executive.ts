import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  CircleDollarSign,
  Gauge,
  Layers3,
  LucideAngularModule,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X
} from 'lucide-angular';

interface Decision {
  id: string;
  title: string;
  domain: string;
  owner: string;
  impact: string;
  confidence: number;
  status: 'Recommended' | 'Review' | 'Risk';
}

interface Signal {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'neutral' | 'negative';
}

@Component({
  selector: 'app-ai-executive',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-executive.html',
  styleUrl: './ai-executive.scss'
})
export class AiExecutiveComponent {
  readonly Math = Math;
  readonly X = X;
  readonly Search = Search;
  readonly Sparkles = Sparkles;
  readonly BrainCircuit = BrainCircuit;
  readonly CircleDollarSign = CircleDollarSign;
  readonly TrendingUp = TrendingUp;
  readonly Gauge = Gauge;
  readonly Target = Target;
  readonly ShieldCheck = ShieldCheck;
  readonly BarChart3 = BarChart3;
  readonly Activity = Activity;
  readonly Layers3 = Layers3;
  readonly Users = Users;
  readonly CheckCircle2 = CheckCircle2;
  readonly CircleAlert = CircleAlert;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('All');
  readonly selectedDecision = signal<Decision | null>(null);

  readonly executiveScore = signal(91);
  readonly serviceHealth = signal(94);
  readonly aiEfficiency = signal(87);
  readonly forecastConfidence = signal(89);

  readonly signals = signal<Signal[]>([
    { label: 'Revenue outlook', value: '$1.24M', delta: '+8.6%', tone: 'positive' },
    { label: 'AI cost efficiency', value: '87%', delta: '+4.2%', tone: 'positive' },
    { label: 'SLA attainment', value: '96.4%', delta: '+1.8%', tone: 'positive' },
    { label: 'Open critical risk', value: '4', delta: '-2', tone: 'positive' }
  ]);

  readonly decisions = signal<Decision[]>([
    { id: 'DEC-4101', title: 'Increase automation in Tier-1 support', domain: 'Operations', owner: 'Support Leadership', impact: '+$58K / month', confidence: 94, status: 'Recommended' },
    { id: 'DEC-4102', title: 'Promote lower-cost model for routine intents', domain: 'AI Economics', owner: 'AI Platform', impact: '-15% AI cost', confidence: 92, status: 'Recommended' },
    { id: 'DEC-4103', title: 'Adjust premium SLA pricing', domain: 'Revenue', owner: 'Commercial', impact: '+$14.7K / month', confidence: 84, status: 'Review' },
    { id: 'DEC-4104', title: 'Add capacity to enterprise queue', domain: 'Workforce', owner: 'Operations', impact: '-1.7% margin', confidence: 76, status: 'Risk' },
    { id: 'DEC-4105', title: 'Refresh AI governance evidence pack', domain: 'Governance', owner: 'Risk & Compliance', impact: 'Control readiness', confidence: 97, status: 'Recommended' }
  ]);

  readonly filteredDecisions = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    return this.decisions().filter(d =>
      (!q || [d.id, d.title, d.domain, d.owner].some(v => v.toLowerCase().includes(q))) &&
      (status === 'All' || d.status === status)
    );
  });

  readonly portfolioValue = computed(() => {
    const positive = this.decisions()
      .filter(d => d.status === 'Recommended')
      .reduce((sum, d) => sum + (d.impact.includes('58') ? 58 : d.impact.includes('14.7') ? 14.7 : 0), 0);
    return positive;
  });

  money(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  selectDecision(decision: Decision): void {
    this.selectedDecision.set(decision);
  }

  closeDetail(): void {
    this.selectedDecision.set(null);
  }
}
