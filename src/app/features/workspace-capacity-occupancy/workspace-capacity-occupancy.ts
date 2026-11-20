import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building2, Users, Gauge, Layers3, MapPinned, TrendingUp, AlertTriangle, Search, Plus, UsersRound, Armchair } from 'lucide-angular';

interface WorkspaceArea {
  id: number;
  name: string;
  building: string;
  floor: string;
  zone: string;
  neighborhood: string;
  capacity: number;
  occupied: number;
  desks: number;
  assignedTeams: string[];
  status: 'Healthy' | 'Near Capacity' | 'Over Capacity' | 'Blocked';
}

@Component({
  selector: 'app-workspace-capacity-occupancy',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workspace-capacity-occupancy.html',
  styleUrl: './workspace-capacity-occupancy.scss'
})
export class WorkspaceCapacityOccupancyComponent {
  readonly icons = { Building2, Users, Gauge, Layers3, MapPinned, TrendingUp, AlertTriangle, Search, Plus, UsersRound, Armchair };

  search = '';
  statusFilter = 'All';
  showAllocationDrawer = false;

  areas: WorkspaceArea[] = [
    { id: 1, name: 'Product Neighborhood', building: 'HQ', floor: 'Floor 1', zone: 'North', neighborhood: 'Product', capacity: 34, occupied: 27, desks: 31, assignedTeams: ['Product', 'Design'], status: 'Healthy' },
    { id: 2, name: 'Engineering Hub', building: 'HQ', floor: 'Floor 2', zone: 'East', neighborhood: 'Engineering', capacity: 48, occupied: 43, desks: 46, assignedTeams: ['Backend', 'Frontend', 'QA'], status: 'Near Capacity' },
    { id: 3, name: 'Finance Corner', building: 'HQ', floor: 'Floor 3', zone: 'West', neighborhood: 'Finance', capacity: 20, occupied: 21, desks: 19, assignedTeams: ['Finance'], status: 'Over Capacity' },
    { id: 4, name: 'Leadership Zone', building: 'HQ', floor: 'Floor 4', zone: 'South', neighborhood: 'Leadership', capacity: 14, occupied: 8, desks: 12, assignedTeams: ['Executive'], status: 'Healthy' },
    { id: 5, name: 'Support Pod', building: 'HQ', floor: 'Floor 2', zone: 'West', neighborhood: 'Support', capacity: 28, occupied: 18, desks: 26, assignedTeams: ['Support', 'Customer Success'], status: 'Healthy' }
  ];

  get filteredAreas() {
    const q = this.search.trim().toLowerCase();
    return this.areas.filter(a =>
      (!q || [a.name, a.building, a.floor, a.zone, a.neighborhood, ...a.assignedTeams].join(' ').toLowerCase().includes(q)) &&
      (this.statusFilter === 'All' || a.status === this.statusFilter)
    );
  }

  get totalCapacity() { return this.areas.reduce((s,a) => s+a.capacity, 0); }
  get totalOccupied() { return this.areas.reduce((s,a) => s+a.occupied, 0); }
  get totalDesks() { return this.areas.reduce((s,a) => s+a.desks, 0); }
  get utilization() { return this.totalCapacity ? Math.round((this.totalOccupied/this.totalCapacity)*100) : 0; }
  get nearCapacity() { return this.areas.filter(a => a.status === 'Near Capacity').length; }
  get overCapacity() { return this.areas.filter(a => a.status === 'Over Capacity').length; }

  utilizationOf(area: WorkspaceArea) {
    return area.capacity ? Math.round((area.occupied / area.capacity) * 100) : 0;
  }

  statusClass(status: WorkspaceArea['status']) {
    return { Healthy: 'healthy', 'Near Capacity': 'near', 'Over Capacity': 'over', Blocked: 'blocked' }[status];
  }
}
