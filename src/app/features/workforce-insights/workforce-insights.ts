import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, BarChart3, TrendingUp, Clock3, UsersRound, AlertTriangle, CalendarDays, Building2, Activity, Download, Filter, ShieldCheck } from 'lucide-angular';

interface TeamInsight {
  team: string;
  attendance: number;
  punctuality: number;
  noShow: number;
  avgHours: number;
  hybrid: number;
}

@Component({
  selector: 'app-workforce-insights',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workforce-insights.html',
  styleUrl: './workforce-insights.scss'
})
export class WorkforceInsightsComponent {
  readonly icons = { BarChart3, TrendingUp, Clock3, UsersRound, AlertTriangle, CalendarDays, Building2, Activity, Download, Filter, ShieldCheck };

  period = 'Weekly';
  department = 'All';
  selectedTeam = 'All';

  teams: TeamInsight[] = [
    { team: 'Platform Engineering', attendance: 94, punctuality: 91, noShow: 2, avgHours: 8.1, hybrid: 58 },
    { team: 'Customer Support', attendance: 89, punctuality: 84, noShow: 5, avgHours: 7.7, hybrid: 32 },
    { team: 'Product & Design', attendance: 96, punctuality: 94, noShow: 1, avgHours: 8.3, hybrid: 64 },
    { team: 'Finance', attendance: 92, punctuality: 88, noShow: 3, avgHours: 8.0, hybrid: 24 },
    { team: 'Service Desk', attendance: 91, punctuality: 86, noShow: 4, avgHours: 7.9, hybrid: 18 }
  ];

  get filteredTeams() {
    return this.selectedTeam === 'All' ? this.teams : this.teams.filter(t => t.team === this.selectedTeam);
  }

  get avgAttendance() { return Math.round(this.teams.reduce((s, t) => s + t.attendance, 0) / this.teams.length); }
  get avgPunctuality() { return Math.round(this.teams.reduce((s, t) => s + t.punctuality, 0) / this.teams.length); }
  get avgHours() { return (this.teams.reduce((s, t) => s + t.avgHours, 0) / this.teams.length).toFixed(1); }
  get totalNoShow() { return this.teams.reduce((s, t) => s + t.noShow, 0); }

  barWidth(value: number) {
    return `${Math.max(6, Math.min(100, value))}%`;
  }
}
