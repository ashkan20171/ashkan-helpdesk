import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, BrainCircuit, UsersRound, Armchair, Building2, TrendingUp, AlertTriangle, CalendarDays, Sparkles, ShieldCheck } from 'lucide-angular';

interface Scenario {
  name: string;
  attendance: number;
  desks: number;
  gap: number;
  risk: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-workforce-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workforce-planning.html',
  styleUrl: './workforce-planning.scss'
})
export class WorkforcePlanningComponent {
  readonly icons = { BrainCircuit, UsersRound, Armchair, Building2, TrendingUp, AlertTriangle, CalendarDays, Sparkles, ShieldCheck };
  horizon = 'Next 30 days';
  scenario = 'Balanced';
  teams = [
    { name: 'Platform Engineering', employees: 42, expected: 31, desks: 34, gap: -3 },
    { name: 'Customer Support', employees: 56, expected: 43, desks: 40, gap: 3 },
    { name: 'Product & Design', employees: 28, expected: 19, desks: 22, gap: -3 },
    { name: 'Finance', employees: 21, expected: 14, desks: 18, gap: -4 },
    { name: 'Service Desk', employees: 35, expected: 29, desks: 27, gap: 2 }
  ];
  scenarios: Scenario[] = [
    { name: 'Conservative', attendance: 82, desks: 112, gap: -8, risk: 'Low' },
    { name: 'Balanced', attendance: 88, desks: 126, gap: 2, risk: 'Medium' },
    { name: 'Peak On-site', attendance: 94, desks: 141, gap: 17, risk: 'High' }
  ];

  get selectedScenario() { return this.scenarios.find(x => x.name === this.scenario) ?? this.scenarios[1]; }
  get capacityGap() { return this.selectedScenario.gap; }
  get peakDemand() { return this.selectedScenario.desks; }
  get utilization() { return Math.round((this.selectedScenario.desks / 150) * 100); }
  get riskLabel() { return this.selectedScenario.risk === 'Low' ? 'ریسک پایین' : this.selectedScenario.risk === 'Medium' ? 'نیازمند پایش' : 'ریسک بالا'; }
}
