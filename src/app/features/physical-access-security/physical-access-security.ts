import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ShieldCheck, KeyRound, Users, DoorOpen, Search, Plus, Filter, Clock3,
  MapPin, Ticket, AlertTriangle, CheckCircle2, XCircle, UserRoundCheck,
  Building2, BadgeCheck, Activity, LockKeyhole, FileCheck2, ChevronDown } from 'lucide-angular';

interface AccessRequest {
  id: string;
  person: string;
  type: 'Employee' | 'Contractor' | 'Visitor';
  zone: string;
  accessLevel: 'Standard' | 'Restricted' | 'Critical';
  reason: string;
  status: 'New' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Expired';
  requestedAt: string;
  approver: string;
  ticket?: string;
}

interface AccessCredential {
  id: string;
  holder: string;
  credential: 'Card' | 'Mobile' | 'Biometric' | 'Temporary Badge';
  zones: number;
  issued: string;
  expires: string;
  status: 'Active' | 'Suspended' | 'Expired';
}

interface AccessEvent {
  time: string;
  person: string;
  zone: string;
  action: 'Granted' | 'Denied' | 'Exit';
  method: string;
  device: string;
}

@Component({
  selector: 'app-physical-access-security',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './physical-access-security.html',
  styleUrl: './physical-access-security.scss'
})
export class PhysicalAccessSecurityComponent {
  readonly icons = {
    ShieldCheck, KeyRound, Users, DoorOpen, Search, Plus, Filter, Clock3,
    MapPin, Ticket, AlertTriangle, CheckCircle2, XCircle, UserRoundCheck,
    Building2, BadgeCheck, Activity, LockKeyhole, FileCheck2, ChevronDown
  };

  activeTab: 'requests' | 'credentials' | 'zones' | 'events' = 'requests';
  query = '';
  statusFilter = 'All';
  levelFilter = 'All';
  showCreatePanel = false;

  requests: AccessRequest[] = [
    { id: 'ACC-3108', person: 'محمد کریمی', type: 'Employee', zone: 'دیتاسنتر', accessLevel: 'Critical', reason: 'پشتیبانی زیرساخت شبکه', status: 'Pending Approval', requestedAt: '2026-11-20 08:42', approver: 'مدیر امنیت', ticket: 'REQ-4521' },
    { id: 'ACC-3107', person: 'سارا احمدی', type: 'Employee', zone: 'اتاق مدیریت', accessLevel: 'Restricted', reason: 'جلسه مدیریتی', status: 'Approved', requestedAt: '2026-11-20 08:15', approver: 'مدیر منابع انسانی' },
    { id: 'ACC-3106', person: 'پیمانکار HVAC', type: 'Contractor', zone: 'موتورخانه', accessLevel: 'Restricted', reason: 'سرویس چیلر', status: 'New', requestedAt: '2026-11-20 07:58', approver: 'Facility Security', ticket: 'FAC-2108' },
    { id: 'ACC-3105', person: 'رضا نادری', type: 'Visitor', zone: 'ساختمان مرکزی', accessLevel: 'Standard', reason: 'ملاقات با واحد فروش', status: 'Approved', requestedAt: '2026-11-20 07:31', approver: 'پذیرش' },
    { id: 'ACC-3104', person: 'نگار موسوی', type: 'Employee', zone: 'آزمایشگاه شبکه', accessLevel: 'Critical', reason: 'آزمایش تجهیزات', status: 'Rejected', requestedAt: '2026-11-19 18:10', approver: 'مدیر امنیت' }
  ];

  credentials: AccessCredential[] = [
    { id: 'CRD-9001', holder: 'محمد کریمی', credential: 'Card', zones: 5, issued: '2026-01-14', expires: '2027-01-14', status: 'Active' },
    { id: 'CRD-9002', holder: 'سارا احمدی', credential: 'Mobile', zones: 3, issued: '2026-02-08', expires: '2027-02-08', status: 'Active' },
    { id: 'CRD-9003', holder: 'پیمانکار HVAC', credential: 'Temporary Badge', zones: 2, issued: '2026-11-20', expires: '2026-11-21', status: 'Active' },
    { id: 'CRD-9004', holder: 'رضا نادری', credential: 'Biometric', zones: 1, issued: '2025-11-20', expires: '2026-11-19', status: 'Expired' },
    { id: 'CRD-9005', holder: 'نگار موسوی', credential: 'Card', zones: 4, issued: '2026-04-12', expires: '2027-04-12', status: 'Suspended' }
  ];

  zones = [
    { name: 'دیتاسنتر', code: 'ZONE-DC', level: 'Critical', people: 7, doors: 4, status: 'Protected', color: 'red' },
    { name: 'آزمایشگاه شبکه', code: 'ZONE-LAB', level: 'Critical', people: 11, doors: 2, status: 'Protected', color: 'red' },
    { name: 'اتاق مدیریت', code: 'ZONE-MGMT', level: 'Restricted', people: 18, doors: 3, status: 'Protected', color: 'amber' },
    { name: 'ساختمان مرکزی', code: 'ZONE-HQ', level: 'Standard', people: 142, doors: 18, status: 'Operational', color: 'blue' }
  ];

  events: AccessEvent[] = [
    { time: '09:42:18', person: 'محمد کریمی', zone: 'دیتاسنتر', action: 'Granted', method: 'Card', device: 'AC-DC-04' },
    { time: '09:40:11', person: 'پیمانکار HVAC', zone: 'موتورخانه', action: 'Granted', method: 'Temporary Badge', device: 'AC-ME-02' },
    { time: '09:37:44', person: 'ناشناس', zone: 'آزمایشگاه شبکه', action: 'Denied', method: 'Unknown Card', device: 'AC-LB-01' },
    { time: '09:35:09', person: 'سارا احمدی', zone: 'اتاق مدیریت', action: 'Exit', method: 'Mobile', device: 'AC-MG-02' },
    { time: '09:31:52', person: 'رضا نادری', zone: 'ساختمان مرکزی', action: 'Granted', method: 'Biometric', device: 'AC-HQ-07' }
  ];

  get filteredRequests() {
    const q = this.query.trim().toLowerCase();
    return this.requests.filter(item => {
      const textMatch = !q || `${item.id} ${item.person} ${item.zone} ${item.reason} ${item.approver}`.toLowerCase().includes(q);
      const statusMatch = this.statusFilter === 'All' || item.status === this.statusFilter;
      const levelMatch = this.levelFilter === 'All' || item.accessLevel === this.levelFilter;
      return textMatch && statusMatch && levelMatch;
    });
  }

  get pendingApprovals() {
    return this.requests.filter(x => x.status === 'Pending Approval').length;
  }

  get activeCredentials() {
    return this.credentials.filter(x => x.status === 'Active').length;
  }

  get deniedEvents() {
    return this.events.filter(x => x.action === 'Denied').length;
  }

  get protectedZones() {
    return this.zones.filter(x => x.status === 'Protected').length;
  }

  statusClass(value: string) {
    return value.toLowerCase().replaceAll(' ', '-');
  }

  levelClass(value: string) {
    return value.toLowerCase();
  }

  eventClass(value: string) {
    return value.toLowerCase();
  }

  addAccessRequest() {
    this.showCreatePanel = true;
  }

  closeCreatePanel() {
    this.showCreatePanel = false;
  }
}
