import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building2, DoorOpen, Armchair, Wrench, Users, Search, Plus, Filter,
  MapPin, CalendarDays, Ticket, Package, ShieldCheck, Gauge, ChevronLeft,
  ChevronRight, Clock3, CheckCircle2, AlertTriangle, XCircle, Layers3,
  KeyRound, ClipboardList, Settings2 } from 'lucide-angular';

interface FacilityRequest {
  id: string;
  title: string;
  location: string;
  category: 'Room' | 'Furniture' | 'HVAC' | 'Electrical' | 'Access';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'New' | 'Assigned' | 'In Progress' | 'Waiting' | 'Completed';
  requester: string;
  assignee: string;
  due: string;
  ticket?: string;
}

interface Space {
  code: string;
  name: string;
  building: string;
  floor: string;
  type: 'Office' | 'Meeting' | 'Training' | 'Lab' | 'Common';
  capacity: number;
  occupied: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
}

interface FacilityAsset {
  code: string;
  name: string;
  location: string;
  health: number;
  nextMaintenance: string;
  status: 'Healthy' | 'Attention' | 'Maintenance';
}

@Component({
  selector: 'app-facilities-workplace',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './facilities-workplace.html',
  styleUrl: './facilities-workplace.scss'
})
export class FacilitiesWorkplaceComponent {
  readonly icons = {
    Building2, DoorOpen, Armchair, Wrench, Users, Search, Plus, Filter, MapPin,
    CalendarDays, Ticket, Package, ShieldCheck, Gauge, ChevronLeft, ChevronRight,
    Clock3, CheckCircle2, AlertTriangle, XCircle, Layers3, KeyRound,
    ClipboardList, Settings2
  };

  activeTab: 'requests' | 'spaces' | 'buildings' | 'facility-assets' = 'requests';
  query = '';
  statusFilter = 'All';
  priorityFilter = 'All';
  showCreatePanel = false;

  facilityRequests: FacilityRequest[] = [
    { id: 'FAC-2108', title: 'خرابی سیستم تهویه اتاق جلسه', location: 'ساختمان مرکزی / طبقه ۳', category: 'HVAC', priority: 'High', status: 'Assigned', requester: 'مریم احمدی', assignee: 'تیم تأسیسات', due: '2026-11-21', ticket: 'INC-8501' },
    { id: 'FAC-2107', title: 'تعویض صندلی‌های فضای تیم فروش', location: 'ساختمان مرکزی / طبقه ۲', category: 'Furniture', priority: 'Medium', status: 'In Progress', requester: 'علی رضایی', assignee: 'Facility Ops', due: '2026-11-24' },
    { id: 'FAC-2106', title: 'فعال‌سازی کارت دسترسی اتاق سرور', location: 'دیتاسنتر / طبقه همکف', category: 'Access', priority: 'Critical', status: 'New', requester: 'محمد کریمی', assignee: 'Security Desk', due: '2026-11-20', ticket: 'REQ-4421' },
    { id: 'FAC-2105', title: 'رفع مشکل برق اتاق 2B', location: 'ساختمان شمالی / طبقه ۲', category: 'Electrical', priority: 'High', status: 'Waiting', requester: 'نگار موسوی', assignee: 'پیمانکار برق', due: '2026-11-23' },
    { id: 'FAC-2104', title: 'رزرو اتاق برای جلسه مدیریت', location: 'ساختمان مرکزی / طبقه ۴', category: 'Room', priority: 'Low', status: 'Completed', requester: 'رضا نادری', assignee: 'Facility Ops', due: '2026-11-19' }
  ];

  spaces: Space[] = [
    { code: 'RM-301', name: 'اتاق جلسه آفتاب', building: 'ساختمان مرکزی', floor: 'طبقه ۳', type: 'Meeting', capacity: 12, occupied: 9, status: 'Occupied' },
    { code: 'RM-214', name: 'اتاق تیم فروش', building: 'ساختمان مرکزی', floor: 'طبقه ۲', type: 'Office', capacity: 18, occupied: 17, status: 'Occupied' },
    { code: 'RM-401', name: 'اتاق هیئت‌مدیره', building: 'ساختمان مرکزی', floor: 'طبقه ۴', type: 'Meeting', capacity: 16, occupied: 0, status: 'Reserved' },
    { code: 'TR-101', name: 'مرکز آموزش', building: 'ساختمان شمالی', floor: 'طبقه ۱', type: 'Training', capacity: 30, occupied: 0, status: 'Available' },
    { code: 'LB-020', name: 'آزمایشگاه شبکه', building: 'ساختمان شمالی', floor: 'همکف', type: 'Lab', capacity: 14, occupied: 8, status: 'Maintenance' },
    { code: 'CM-001', name: 'فضای استراحت', building: 'ساختمان مرکزی', floor: 'همکف', type: 'Common', capacity: 35, occupied: 22, status: 'Occupied' }
  ];

  buildings = [
    { name: 'ساختمان مرکزی', code: 'HQ-01', floors: 6, spaces: 82, utilization: 78, manager: 'سارا احمدی', status: 'Operational' },
    { name: 'ساختمان شمالی', code: 'NTH-02', floors: 4, spaces: 54, utilization: 64, manager: 'محمد کریمی', status: 'Operational' },
    { name: 'دیتاسنتر', code: 'DC-01', floors: 2, spaces: 18, utilization: 91, manager: 'علی رضایی', status: 'Restricted' }
  ];

  facilityAssets: FacilityAsset[] = [
    { code: 'FA-0012', name: 'چیلر مرکزی 01', location: 'ساختمان مرکزی / بام', health: 92, nextMaintenance: '2026-12-04', status: 'Healthy' },
    { code: 'FA-0088', name: 'ژنراتور اضطراری', location: 'دیتاسنتر / موتورخانه', health: 78, nextMaintenance: '2026-11-26', status: 'Attention' },
    { code: 'FA-0134', name: 'سیستم کنترل تردد', location: 'ورودی اصلی', health: 97, nextMaintenance: '2027-01-12', status: 'Healthy' },
    { code: 'FA-0172', name: 'هواساز طبقه ۳', location: 'ساختمان مرکزی / طبقه ۳', health: 61, nextMaintenance: '2026-11-21', status: 'Maintenance' }
  ];

  get filteredRequests() {
    const q = this.query.trim().toLowerCase();
    return this.facilityRequests.filter(item => {
      const textMatch = !q || `${item.id} ${item.title} ${item.location} ${item.requester} ${item.assignee}`.toLowerCase().includes(q);
      const statusMatch = this.statusFilter === 'All' || item.status === this.statusFilter;
      const priorityMatch = this.priorityFilter === 'All' || item.priority === this.priorityFilter;
      return textMatch && statusMatch && priorityMatch;
    });
  }

  get openRequests() {
    return this.facilityRequests.filter(x => x.status !== 'Completed').length;
  }

  get highPriority() {
    return this.facilityRequests.filter(x => ['Critical', 'High'].includes(x.priority) && x.status !== 'Completed').length;
  }

  get occupiedSpaces() {
    return this.spaces.filter(x => x.status === 'Occupied').length;
  }

  get facilityHealth() {
    return Math.round(this.facilityAssets.reduce((sum, x) => sum + x.health, 0) / this.facilityAssets.length);
  }

  statusClass(value: string) {
    return value.toLowerCase().replaceAll(' ', '-');
  }

  priorityClass(value: string) {
    return value.toLowerCase();
  }

  utilization(item: Space) {
    return item.capacity ? Math.round((item.occupied / item.capacity) * 100) : 0;
  }

  addRequest() {
    this.showCreatePanel = true;
  }

  closeCreatePanel() {
    this.showCreatePanel = false;
  }
}
