import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  DoorOpen,
  FileCheck2,
  Filter,
  LogIn,
  LogOut,
  QrCode,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
  LucideAngularModule
} from 'lucide-angular';

type VisitorStatus =
  | 'Invited'
  | 'Awaiting Approval'
  | 'Approved'
  | 'Checked-in'
  | 'Checked-out'
  | 'Cancelled'
  | 'Blacklisted';

interface VisitorRecord {
  id: string;
  name: string;
  company: string;
  host: string;
  purpose: string;
  visitDate: string;
  arrival: string;
  status: VisitorStatus;
  accessZone: string;
  badge: string;
  risk: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-visitor-reception',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './visitor-reception.html',
  styleUrl: './visitor-reception.scss'
})
export class VisitorReceptionComponent {
  readonly icons = {
    calendar: CalendarDays,
    check: CheckCircle2,
    clock: Clock3,
    door: DoorOpen,
    file: FileCheck2,
    filter: Filter,
    login: LogIn,
    logout: LogOut,
    qr: QrCode,
    search: Search,
    shield: ShieldAlert,
    userCheck: UserCheck,
    userPlus: UserPlus,
    users: Users,
    x: XCircle
  };

  searchTerm = '';
  statusFilter = 'All';
  showNewVisitor = false;

  newVisitor = {
    name: '',
    company: '',
    host: '',
    purpose: 'Meeting',
    visitDate: '',
    arrival: '',
    accessZone: 'Reception',
    risk: 'Low'
  };

  visitors: VisitorRecord[] = [
    {
      id: 'VIS-1048',
      name: 'سارا محمدی',
      company: 'پارس‌تک',
      host: 'علی رضایی',
      purpose: 'Meeting',
      visitDate: '2026-11-20',
      arrival: '09:30',
      status: 'Checked-in',
      accessZone: 'HQ - Floor 2',
      badge: 'B-248',
      risk: 'Low'
    },
    {
      id: 'VIS-1049',
      name: 'مهدی کریمی',
      company: 'راهکاران نوین',
      host: 'نگار احمدی',
      purpose: 'Interview',
      visitDate: '2026-11-20',
      arrival: '10:15',
      status: 'Approved',
      accessZone: 'HQ - Floor 1',
      badge: 'Pending',
      risk: 'Low'
    },
    {
      id: 'VIS-1050',
      name: 'John Carter',
      company: 'Global Systems',
      host: 'رضا موسوی',
      purpose: 'Vendor Review',
      visitDate: '2026-11-20',
      arrival: '11:00',
      status: 'Awaiting Approval',
      accessZone: 'Restricted - Floor 3',
      badge: 'Pending',
      risk: 'Medium'
    },
    {
      id: 'VIS-1047',
      name: 'الهام اکبری',
      company: 'آتیه گستر',
      host: 'سینا مرادی',
      purpose: 'Training',
      visitDate: '2026-11-20',
      arrival: '08:45',
      status: 'Checked-out',
      accessZone: 'Training Center',
      badge: 'B-241',
      risk: 'Low'
    },
    {
      id: 'VIS-1046',
      name: 'کامران نادری',
      company: '—',
      host: 'مریم صادقی',
      purpose: 'Personal Visit',
      visitDate: '2026-11-20',
      arrival: '12:20',
      status: 'Blacklisted',
      accessZone: 'Reception',
      badge: 'Blocked',
      risk: 'High'
    }
  ];

  get filteredVisitors(): VisitorRecord[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.visitors.filter(visitor => {
      const matchesStatus =
        this.statusFilter === 'All' || visitor.status === this.statusFilter;
      const haystack = [
        visitor.id,
        visitor.name,
        visitor.company,
        visitor.host,
        visitor.purpose,
        visitor.accessZone
      ].join(' ').toLowerCase();
      return matchesStatus && (!q || haystack.includes(q));
    });
  }

  get totalVisitors(): number {
    return this.visitors.length;
  }

  get checkedInCount(): number {
    return this.visitors.filter(v => v.status === 'Checked-in').length;
  }

  get pendingCount(): number {
    return this.visitors.filter(v =>
      v.status === 'Awaiting Approval' || v.status === 'Approved'
    ).length;
  }

  get highRiskCount(): number {
    return this.visitors.filter(v => v.risk === 'High').length;
  }

  get awaitingApprovalCount(): number {
    return this.visitors.filter(v => v.status === 'Awaiting Approval').length;
  }

  get restrictedZoneCount(): number {
    return this.visitors.filter(v => v.accessZone.includes('Restricted')).length;
  }

  createInvitation(): void {
    if (!this.newVisitor.name.trim() || !this.newVisitor.host.trim()) {
      return;
    }

    this.visitors = [
      {
        id: `VIS-${1051 + this.visitors.length}`,
        name: this.newVisitor.name.trim(),
        company: this.newVisitor.company.trim() || '—',
        host: this.newVisitor.host.trim(),
        purpose: this.newVisitor.purpose,
        visitDate: this.newVisitor.visitDate || '2026-11-20',
        arrival: this.newVisitor.arrival || '14:00',
        status: 'Invited',
        accessZone: this.newVisitor.accessZone,
        badge: 'Pending',
        risk: this.newVisitor.risk as VisitorRecord['risk']
      },
      ...this.visitors
    ];

    this.newVisitor = {
      name: '',
      company: '',
      host: '',
      purpose: 'Meeting',
      visitDate: '',
      arrival: '',
      accessZone: 'Reception',
      risk: 'Low'
    };
    this.showNewVisitor = false;
  }

  approve(visitor: VisitorRecord): void {
    if (visitor.status === 'Awaiting Approval') {
      visitor.status = 'Approved';
    }
  }

  checkIn(visitor: VisitorRecord): void {
    if (visitor.status === 'Approved' || visitor.status === 'Invited') {
      visitor.status = 'Checked-in';
      visitor.badge = visitor.badge === 'Pending' ? `B-${250 + this.visitors.indexOf(visitor)}` : visitor.badge;
    }
  }

  checkOut(visitor: VisitorRecord): void {
    if (visitor.status === 'Checked-in') {
      visitor.status = 'Checked-out';
    }
  }

  statusClass(status: VisitorStatus): string {
    return status.toLowerCase().replace(/[\s-]+/g, '-');
  }
}
