import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CalendarDays, Armchair, Clock3, ShieldCheck, UsersRound, Search, AlertTriangle, CheckCircle2, XCircle, MapPinned, RefreshCw } from 'lucide-angular';

type ReservationStatus = 'Confirmed' | 'Pending' | 'Checked-in' | 'No-show' | 'Cancelled';
type WorkMode = 'Hybrid' | 'On-site' | 'Remote';

interface DeskReservation {
  id: number;
  employee: string;
  team: string;
  desk: string;
  neighborhood: string;
  date: string;
  time: string;
  mode: WorkMode;
  status: ReservationStatus;
  checkIn: string;
  noShowAfter: number;
  recurring: boolean;
}

@Component({
  selector: 'app-workplace-policy-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workplace-policy-reservation.html',
  styleUrl: './workplace-policy-reservation.scss'
})
export class WorkplacePolicyReservationComponent {
  readonly icons = { CalendarDays, Armchair, Clock3, ShieldCheck, UsersRound, Search, AlertTriangle, CheckCircle2, XCircle, MapPinned, RefreshCw };

  search = '';
  statusFilter = 'All';
  modeFilter = 'All';
  showDrawer = false;

  reservations: DeskReservation[] = [
    { id: 1, employee: 'سارا احمدی', team: 'Platform Engineering', desk: 'D-204', neighborhood: 'Engineering Hub', date: '2026-11-21', time: '08:30 - 17:00', mode: 'Hybrid', status: 'Confirmed', checkIn: '08:45', noShowAfter: 60, recurring: false },
    { id: 2, employee: 'علی رضایی', team: 'Customer Support', desk: 'D-118', neighborhood: 'Support Pod', date: '2026-11-21', time: '08:00 - 16:30', mode: 'On-site', status: 'Pending', checkIn: '-', noShowAfter: 45, recurring: true },
    { id: 3, employee: 'مریم کریمی', team: 'Product & Design', desk: 'D-032', neighborhood: 'Product Neighborhood', date: '2026-11-22', time: '09:00 - 17:30', mode: 'Hybrid', status: 'Checked-in', checkIn: '09:03', noShowAfter: 60, recurring: false },
    { id: 4, employee: 'رضا محمدی', team: 'Finance', desk: 'D-301', neighborhood: 'Finance Corner', date: '2026-11-21', time: '08:00 - 16:00', mode: 'On-site', status: 'No-show', checkIn: '-', noShowAfter: 30, recurring: false },
    { id: 5, employee: 'نگار حسینی', team: 'Leadership', desk: 'D-401', neighborhood: 'Leadership Zone', date: '2026-11-24', time: '09:00 - 15:00', mode: 'Hybrid', status: 'Confirmed', checkIn: '-', noShowAfter: 60, recurring: true },
    { id: 6, employee: 'امیر مرادی', team: 'Service Desk', desk: 'D-125', neighborhood: 'Support Pod', date: '2026-11-21', time: '10:00 - 18:00', mode: 'On-site', status: 'Cancelled', checkIn: '-', noShowAfter: 45, recurring: false }
  ];

  get filteredReservations() {
    const q = this.search.trim().toLowerCase();
    return this.reservations.filter(r =>
      (!q || [r.employee, r.team, r.desk, r.neighborhood, r.date].join(' ').toLowerCase().includes(q)) &&
      (this.statusFilter === 'All' || r.status === this.statusFilter) &&
      (this.modeFilter === 'All' || r.mode === this.modeFilter)
    );
  }

  get confirmed() { return this.reservations.filter(r => r.status === 'Confirmed').length; }
  get checkedIn() { return this.reservations.filter(r => r.status === 'Checked-in').length; }
  get noShows() { return this.reservations.filter(r => r.status === 'No-show').length; }
  get recurringCount() { return this.reservations.filter(r => r.recurring).length; }

  statusClass(status: ReservationStatus) {
    return {
      Confirmed: 'confirmed',
      Pending: 'pending',
      'Checked-in': 'checked',
      'No-show': 'noshow',
      Cancelled: 'cancelled'
    }[status];
  }
}
