import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CalendarCheck2, Clock3, UsersRound, MapPin, QrCode, ShieldCheck, AlertTriangle, LogIn, LogOut, TrendingUp, Search, ScanLine } from 'lucide-angular';

type AttendanceStatus = 'Present' | 'Late' | 'No-show' | 'Checked-out' | 'Remote';
type AttendanceSource = 'Desk Check-in' | 'QR' | 'Physical Access' | 'Manual';

interface AttendanceRecord {
  id: number;
  employee: string;
  team: string;
  date: string;
  checkIn: string;
  checkOut: string;
  desk: string;
  neighborhood: string;
  status: AttendanceStatus;
  source: AttendanceSource;
  lateMinutes: number;
}

@Component({
  selector: 'app-workplace-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workplace-attendance.html',
  styleUrl: './workplace-attendance.scss'
})
export class WorkplaceAttendanceComponent {
  readonly icons = {
    CalendarCheck2, Clock3, UsersRound, MapPin, QrCode, ShieldCheck,
    AlertTriangle, LogIn, LogOut, TrendingUp, Search, ScanLine
  };

  search = '';
  statusFilter = 'All';
  sourceFilter = 'All';
  showCheckIn = false;

  records: AttendanceRecord[] = [
    { id: 1, employee: 'سارا احمدی', team: 'Platform Engineering', date: '2026-11-21', checkIn: '08:45', checkOut: '-', desk: 'D-204', neighborhood: 'Engineering Hub', status: 'Present', source: 'Desk Check-in', lateMinutes: 0 },
    { id: 2, employee: 'علی رضایی', team: 'Customer Support', date: '2026-11-21', checkIn: '08:57', checkOut: '-', desk: 'D-118', neighborhood: 'Support Pod', status: 'Late', source: 'Physical Access', lateMinutes: 27 },
    { id: 3, employee: 'مریم کریمی', team: 'Product & Design', date: '2026-11-21', checkIn: '09:03', checkOut: '-', desk: 'D-032', neighborhood: 'Product Neighborhood', status: 'Present', source: 'QR', lateMinutes: 0 },
    { id: 4, employee: 'رضا محمدی', team: 'Finance', date: '2026-11-21', checkIn: '-', checkOut: '-', desk: 'D-301', neighborhood: 'Finance Corner', status: 'No-show', source: 'Desk Check-in', lateMinutes: 0 },
    { id: 5, employee: 'نگار حسینی', team: 'Leadership', date: '2026-11-21', checkIn: '09:12', checkOut: '15:10', desk: 'D-401', neighborhood: 'Leadership Zone', status: 'Checked-out', source: 'Physical Access', lateMinutes: 0 },
    { id: 6, employee: 'امیر مرادی', team: 'Service Desk', date: '2026-11-21', checkIn: '-', checkOut: '-', desk: '-', neighborhood: '-', status: 'Remote', source: 'Manual', lateMinutes: 0 }
  ];

  get filteredRecords() {
    const q = this.search.trim().toLowerCase();
    return this.records.filter(r =>
      (!q || [r.employee, r.team, r.desk, r.neighborhood, r.date, r.source].join(' ').toLowerCase().includes(q)) &&
      (this.statusFilter === 'All' || r.status === this.statusFilter) &&
      (this.sourceFilter === 'All' || r.source === this.sourceFilter)
    );
  }

  get presentCount() { return this.records.filter(r => r.status === 'Present').length; }
  get lateCount() { return this.records.filter(r => r.status === 'Late').length; }
  get noShowCount() { return this.records.filter(r => r.status === 'No-show').length; }
  get remoteCount() { return this.records.filter(r => r.status === 'Remote').length; }

  statusClass(status: AttendanceStatus) {
    return {
      Present: 'present',
      Late: 'late',
      'No-show': 'noshow',
      'Checked-out': 'out',
      Remote: 'remote'
    }[status];
  }

  checkInNow() {
    this.showCheckIn = false;
  }
}
