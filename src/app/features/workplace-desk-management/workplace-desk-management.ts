import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Armchair, Building2, CalendarDays, CheckCircle2, Clock3, Users, MapPinned, Search, Plus, LogIn, LogOut, Layers3 } from 'lucide-angular';

interface Desk {
  id: number;
  code: string;
  name: string;
  floor: string;
  zone: string;
  neighborhood: string;
  type: 'Hot Desk' | 'Assigned Desk' | 'Shared Desk';
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance' | 'Blocked';
  employee: string;
  capacity: number;
  checkIn: string;
  equipment: string[];
}

@Component({
  selector: 'app-workplace-desk-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workplace-desk-management.html',
  styleUrl: './workplace-desk-management.scss'
})
export class WorkplaceDeskManagementComponent {
  readonly icons = { Armchair, Building2, CalendarDays, CheckCircle2, Clock3, Users, MapPinned, Search, Plus, LogIn, LogOut, Layers3 };

  search = '';
  statusFilter = 'All';
  typeFilter = 'All';
  showReservationDrawer = false;

  desks: Desk[] = [
    { id: 1, code: 'D-101', name: 'Product Pod A', floor: 'Floor 1', zone: 'North', neighborhood: 'Product', type: 'Assigned Desk', status: 'Occupied', employee: 'سارا محمدی', capacity: 1, checkIn: '08:32', equipment: ['Monitor', 'Dock'] },
    { id: 2, code: 'D-102', name: 'Product Pod B', floor: 'Floor 1', zone: 'North', neighborhood: 'Product', type: 'Hot Desk', status: 'Available', employee: '', capacity: 1, checkIn: '-', equipment: ['Monitor'] },
    { id: 3, code: 'D-203', name: 'Engineering Hub', floor: 'Floor 2', zone: 'East', neighborhood: 'Engineering', type: 'Shared Desk', status: 'Reserved', employee: 'علی رضایی', capacity: 2, checkIn: '-', equipment: ['Monitor', 'Dock', 'Keyboard'] },
    { id: 4, code: 'D-207', name: 'Engineering Hub 2', floor: 'Floor 2', zone: 'East', neighborhood: 'Engineering', type: 'Hot Desk', status: 'Occupied', employee: 'مهدی احمدی', capacity: 1, checkIn: '09:04', equipment: ['Monitor', 'Dock'] },
    { id: 5, code: 'D-301', name: 'Finance Corner', floor: 'Floor 3', zone: 'West', neighborhood: 'Finance', type: 'Assigned Desk', status: 'Maintenance', employee: 'نگار کریمی', capacity: 1, checkIn: '-', equipment: ['Monitor'] },
    { id: 6, code: 'D-308', name: 'Collaboration Table', floor: 'Floor 3', zone: 'West', neighborhood: 'Finance', type: 'Shared Desk', status: 'Available', employee: '', capacity: 4, checkIn: '-', equipment: ['Display', 'Dock'] },
    { id: 7, code: 'D-401', name: 'Executive Desk', floor: 'Floor 4', zone: 'South', neighborhood: 'Leadership', type: 'Assigned Desk', status: 'Blocked', employee: 'مدیرعامل', capacity: 1, checkIn: '-', equipment: ['Monitor', 'Dock', 'Phone'] }
  ];

  get filteredDesks(): Desk[] {
    const q = this.search.trim().toLowerCase();
    return this.desks.filter(d =>
      (!q || [d.code, d.name, d.floor, d.zone, d.neighborhood, d.employee].join(' ').toLowerCase().includes(q)) &&
      (this.statusFilter === 'All' || d.status === this.statusFilter) &&
      (this.typeFilter === 'All' || d.type === this.typeFilter)
    );
  }

  get total() { return this.desks.length; }
  get available() { return this.desks.filter(d => d.status === 'Available').length; }
  get occupied() { return this.desks.filter(d => d.status === 'Occupied').length; }
  get reserved() { return this.desks.filter(d => d.status === 'Reserved').length; }
  get capacity() { return this.desks.reduce((sum, d) => sum + d.capacity, 0); }

  statusClass(status: Desk['status']) {
    return {
      Available: 'available',
      Reserved: 'reserved',
      Occupied: 'occupied',
      Maintenance: 'maintenance',
      Blocked: 'blocked'
    }[status];
  }

  checkIn(desk: Desk) {
    if (desk.status === 'Available' || desk.status === 'Reserved') {
      desk.status = 'Occupied';
      desk.checkIn = 'اکنون';
      if (!desk.employee) desk.employee = 'کاربر فعلی';
    }
  }

  checkOut(desk: Desk) {
    if (desk.status === 'Occupied') {
      desk.status = 'Available';
      desk.checkIn = '-';
      desk.employee = '';
    }
  }
}
