import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UsersRound, MapPinned, Armchair, Shuffle, UserPlus, Search, Building2, CalendarDays, ShieldCheck, TrendingUp } from 'lucide-angular';

type WorkMode = 'Hybrid' | 'On-site' | 'Remote';
type SeatStatus = 'Assigned' | 'Available' | 'Shared' | 'Reserved';

interface TeamPlan {
  id: number;
  team: string;
  department: string;
  neighborhood: string;
  floor: string;
  seats: number;
  assigned: number;
  shared: number;
  mode: WorkMode;
  density: number;
  status: 'Healthy' | 'Tight' | 'Needs Relocation';
}

@Component({
  selector: 'app-team-seating-neighborhood',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './team-seating-neighborhood.html',
  styleUrl: './team-seating-neighborhood.scss'
})
export class TeamSeatingNeighborhoodComponent {
  readonly icons = { UsersRound, MapPinned, Armchair, Shuffle, UserPlus, Search, Building2, CalendarDays, ShieldCheck, TrendingUp };

  search = '';
  modeFilter = 'All';
  showAssignmentDrawer = false;

  plans: TeamPlan[] = [
    { id: 1, team: 'Platform Engineering', department: 'Engineering', neighborhood: 'Engineering Hub', floor: 'Floor 2', seats: 24, assigned: 21, shared: 3, mode: 'Hybrid', density: 88, status: 'Healthy' },
    { id: 2, team: 'Customer Support', department: 'Service Desk', neighborhood: 'Support Pod', floor: 'Floor 2', seats: 20, assigned: 18, shared: 2, mode: 'On-site', density: 90, status: 'Tight' },
    { id: 3, team: 'Product & Design', department: 'Product', neighborhood: 'Product Neighborhood', floor: 'Floor 1', seats: 18, assigned: 14, shared: 4, mode: 'Hybrid', density: 78, status: 'Healthy' },
    { id: 4, team: 'Finance', department: 'Finance', neighborhood: 'Finance Corner', floor: 'Floor 3', seats: 16, assigned: 16, shared: 0, mode: 'On-site', density: 100, status: 'Needs Relocation' },
    { id: 5, team: 'Leadership', department: 'Executive', neighborhood: 'Leadership Zone', floor: 'Floor 4', seats: 10, assigned: 7, shared: 3, mode: 'Hybrid', density: 70, status: 'Healthy' }
  ];

  get filteredPlans() {
    const q = this.search.trim().toLowerCase();
    return this.plans.filter(p =>
      (!q || [p.team,p.department,p.neighborhood,p.floor,p.mode].join(' ').toLowerCase().includes(q)) &&
      (this.modeFilter === 'All' || p.mode === this.modeFilter)
    );
  }

  get totalSeats() { return this.plans.reduce((s,p)=>s+p.seats,0); }
  get assignedSeats() { return this.plans.reduce((s,p)=>s+p.assigned,0); }
  get sharedSeats() { return this.plans.reduce((s,p)=>s+p.shared,0); }
  get relocations() { return this.plans.filter(p=>p.status==='Needs Relocation').length; }
  get avgDensity() { return this.totalSeats ? Math.round(this.plans.reduce((s,p)=>s+p.density,0)/this.plans.length) : 0; }

  statusClass(s: TeamPlan['status']) {
    return { Healthy:'healthy', Tight:'tight', 'Needs Relocation':'relocate' }[s];
  }
}
