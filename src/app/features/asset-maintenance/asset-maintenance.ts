import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Wrench,
  CalendarDays,
  ShieldCheck,
  ClipboardList,
  Package,
  UserCog,
  Search,
  Plus,
  Filter,
  Clock3,
  CircleDollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building2,
  Ticket,
  Settings2,
  History,
  Gauge,
  TimerReset } from 'lucide-angular';

interface MaintenanceWorkOrder {
  id: string;
  asset: string;
  assetCode: string;
  type: 'Preventive' | 'Corrective' | 'Inspection' | 'Repair';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'In Progress' | 'Waiting Parts' | 'Completed' | 'Cancelled';
  technician: string;
  vendor: string;
  dueDate: string;
  downtime: number;
  cost: number;
  ticket?: string;
}

interface WarrantyClaim {
  id: string;
  asset: string;
  assetCode: string;
  provider: string;
  expiry: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Claim Submitted' | 'Claim Approved';
  claimValue: number;
  ticket?: string;
}

interface ServiceContract {
  id: string;
  vendor: string;
  scope: string;
  start: string;
  end: string;
  assets: number;
  annualCost: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

@Component({
  selector: 'app-asset-maintenance',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './asset-maintenance.html',
  styleUrl: './asset-maintenance.scss'
})
export class AssetMaintenanceComponent {
  readonly icons = {
    Wrench, CalendarDays, ShieldCheck, ClipboardList, Package, UserCog, Search,
    Plus, Filter, Clock3, CircleDollarSign, AlertTriangle, CheckCircle2,
    XCircle, ChevronLeft, ChevronRight, FileText, Building2, Ticket,
    Settings2, History, Gauge, TimerReset
  };

  activeTab: 'work-orders' | 'preventive' | 'warranty' | 'contracts' | 'parts' = 'work-orders';
  query = '';
  statusFilter = 'All';
  priorityFilter = 'All';

  selectedMonth = new Date(2026, 10, 1);
  showCreatePanel = false;

  workOrders: MaintenanceWorkOrder[] = [
    { id: 'MWO-1048', asset: 'Dell PowerEdge R750', assetCode: 'AST-2048', type: 'Preventive', priority: 'High', status: 'Scheduled', technician: 'علی رضایی', vendor: 'Dell Service', dueDate: '2026-11-23', downtime: 2, cost: 420, ticket: 'INC-8421' },
    { id: 'MWO-1047', asset: 'HP LaserJet M608', assetCode: 'AST-1812', type: 'Repair', priority: 'Critical', status: 'In Progress', technician: 'سارا احمدی', vendor: 'HP Partner', dueDate: '2026-11-21', downtime: 5, cost: 680, ticket: 'INC-8418' },
    { id: 'MWO-1046', asset: 'Cisco Catalyst 9300', assetCode: 'AST-0930', type: 'Inspection', priority: 'Medium', status: 'Completed', technician: 'محمد کریمی', vendor: 'NetworkCare', dueDate: '2026-11-19', downtime: 1, cost: 210 },
    { id: 'MWO-1045', asset: 'Lenovo ThinkPad T14', assetCode: 'AST-2214', type: 'Corrective', priority: 'Medium', status: 'Waiting Parts', technician: 'نگار موسوی', vendor: 'Lenovo Partner', dueDate: '2026-11-24', downtime: 8, cost: 310, ticket: 'SR-3102' },
    { id: 'MWO-1044', asset: 'APC Smart-UPS 3000', assetCode: 'AST-0712', type: 'Preventive', priority: 'Low', status: 'Scheduled', technician: 'علی رضایی', vendor: 'APC Service', dueDate: '2026-11-28', downtime: 1, cost: 160 }
  ];

  warrantyClaims: WarrantyClaim[] = [
    { id: 'WAR-208', asset: 'Dell PowerEdge R750', assetCode: 'AST-2048', provider: 'Dell', expiry: '2027-02-12', status: 'Active', claimValue: 0 },
    { id: 'WAR-207', asset: 'HP LaserJet M608', assetCode: 'AST-1812', provider: 'HP', expiry: '2026-12-02', status: 'Expiring Soon', claimValue: 950 },
    { id: 'WAR-206', asset: 'Cisco Catalyst 9300', assetCode: 'AST-0930', provider: 'Cisco', expiry: '2026-11-18', status: 'Claim Submitted', claimValue: 620, ticket: 'INC-8418' },
    { id: 'WAR-205', asset: 'Lenovo ThinkPad T14', assetCode: 'AST-2214', provider: 'Lenovo', expiry: '2026-10-04', status: 'Expired', claimValue: 0 }
  ];

  contracts: ServiceContract[] = [
    { id: 'SVC-031', vendor: 'Dell Service', scope: 'سرورها و تجهیزات دیتاسنتر', start: '2026-01-01', end: '2026-12-31', assets: 24, annualCost: 18500, status: 'Active' },
    { id: 'SVC-030', vendor: 'NetworkCare', scope: 'سوئیچ‌ها، روترها و Wi-Fi', start: '2026-02-15', end: '2026-12-10', assets: 46, annualCost: 12900, status: 'Expiring Soon' },
    { id: 'SVC-029', vendor: 'APC Service', scope: 'UPS و تجهیزات برق اضطراری', start: '2025-12-01', end: '2026-11-30', assets: 18, annualCost: 7600, status: 'Expiring Soon' }
  ];

  parts = [
    { code: 'PRT-001', name: 'SSD Enterprise 1.92TB', stock: 12, reserved: 4, reorder: 6, unitCost: 390 },
    { code: 'PRT-002', name: 'Fuser Kit HP M608', stock: 3, reserved: 2, reorder: 4, unitCost: 220 },
    { code: 'PRT-003', name: 'Power Supply 750W', stock: 9, reserved: 1, reorder: 3, unitCost: 145 },
    { code: 'PRT-004', name: 'APC Battery Pack', stock: 2, reserved: 0, reorder: 3, unitCost: 280 }
  ];

  preventiveSchedules = [
    { asset: 'Dell PowerEdge R750', code: 'AST-2048', cadence: 'ماهانه', last: '2026-10-23', next: '2026-11-23', owner: 'علی رضایی', health: 96 },
    { asset: 'Cisco Catalyst 9300', code: 'AST-0930', cadence: 'فصلی', last: '2026-08-19', next: '2026-11-19', owner: 'محمد کریمی', health: 91 },
    { asset: 'APC Smart-UPS 3000', code: 'AST-0712', cadence: 'ماهانه', last: '2026-10-28', next: '2026-11-28', owner: 'علی رضایی', health: 88 },
    { asset: 'HP LaserJet M608', code: 'AST-1812', cadence: 'دوماهه', last: '2026-09-21', next: '2026-11-21', owner: 'سارا احمدی', health: 72 }
  ];

  get filteredWorkOrders() {
    const q = this.query.trim().toLowerCase();
    return this.workOrders.filter(item => {
      const textMatch = !q || `${item.id} ${item.asset} ${item.assetCode} ${item.technician} ${item.vendor}`.toLowerCase().includes(q);
      const statusMatch = this.statusFilter === 'All' || item.status === this.statusFilter;
      const priorityMatch = this.priorityFilter === 'All' || item.priority === this.priorityFilter;
      return textMatch && statusMatch && priorityMatch;
    });
  }

  get totalCost() {
    return this.workOrders.reduce((sum, item) => sum + item.cost, 0);
  }

  get totalDowntime() {
    return this.workOrders.reduce((sum, item) => sum + item.downtime, 0);
  }

  get openOrders() {
    return this.workOrders.filter(item => !['Completed', 'Cancelled'].includes(item.status)).length;
  }

  get warrantyRisk() {
    return this.warrantyClaims.filter(item => ['Expiring Soon', 'Expired'].includes(item.status)).length;
  }

  nextMonth() {
    this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 1);
  }

  previousMonth() {
    this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() - 1, 1);
  }

  monthLabel() {
    return this.selectedMonth.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' });
  }

  statusClass(value: string) {
    return value.toLowerCase().replaceAll(' ', '-');
  }

  priorityClass(value: string) {
    return value.toLowerCase();
  }

  lowStock(part: { stock: number; reorder: number }) {
    return part.stock <= part.reorder;
  }

  addWorkOrder() {
    this.showCreatePanel = true;
  }

  closeCreatePanel() {
    this.showCreatePanel = false;
  }
}
