import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ArrowLeftRight,
  Barcode,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Laptop,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  X,
  XCircle,
  LucideAngularModule
} from 'lucide-angular';

type ResourceStatus = 'Available' | 'Reserved' | 'Checked-out' | 'Maintenance' | 'Unavailable';
type BookingStatus = 'Requested' | 'Approved' | 'Ready' | 'Checked-out' | 'Returned' | 'Cancelled';

interface Resource {
  id: string;
  name: string;
  category: 'IT Equipment' | 'AV Equipment' | 'Vehicle' | 'Training' | 'Workspace';
  location: string;
  owner: string;
  status: ResourceStatus;
  condition: 'Excellent' | 'Good' | 'Needs Check';
  nextAvailable: string;
  linkedAsset: string;
}

interface ResourceBooking {
  id: string;
  resource: string;
  requester: string;
  purpose: string;
  start: string;
  end: string;
  status: BookingStatus;
  meeting: string;
  quantity: number;
}

@Component({
  selector: 'app-resource-equipment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './resource-equipment-booking.html',
  styleUrl: './resource-equipment-booking.scss'
})
export class ResourceEquipmentBookingComponent {
  readonly icons = {
    transfer: ArrowLeftRight,
    barcode: Barcode,
    calendar: CalendarDays,
    check: CheckCircle2,
    clock: Clock3,
    filter: Filter,
    laptop: Laptop,
    package: PackageCheck,
    plus: Plus,
    search: Search,
    settings: Settings2,
    shield: ShieldCheck,
    truck: Truck,
    users: Users,
    wrench: Wrench,
    x: X,
    cancelled: XCircle
  };

  searchTerm = '';
  statusFilter = 'All';
  categoryFilter = 'All';
  showNewBooking = false;

  newBooking = {
    resource: 'Laptop Kit 01',
    requester: '',
    purpose: '',
    start: '2026-11-20T14:00',
    end: '2026-11-20T17:00',
    meeting: 'MTG-2084',
    quantity: 1
  };

  resources: Resource[] = [
    { id: 'AST-4102', name: 'Laptop Kit 01', category: 'IT Equipment', location: 'IT Warehouse', owner: 'IT Operations', status: 'Available', condition: 'Excellent', nextAvailable: 'Now', linkedAsset: 'CI-LAP-102' },
    { id: 'AST-4110', name: 'Conference Camera Pro', category: 'AV Equipment', location: 'HQ · Floor 2', owner: 'AV Team', status: 'Reserved', condition: 'Good', nextAvailable: '12:30', linkedAsset: 'CI-AV-110' },
    { id: 'AST-4201', name: 'Pool Vehicle 03', category: 'Vehicle', location: 'HQ Parking', owner: 'Facilities', status: 'Available', condition: 'Good', nextAvailable: 'Now', linkedAsset: 'CI-CAR-201' },
    { id: 'AST-4308', name: 'Training Projector', category: 'Training', location: 'Training Center', owner: 'L&D', status: 'Maintenance', condition: 'Needs Check', nextAvailable: '2026-11-22', linkedAsset: 'CI-PRJ-308' },
    { id: 'AST-4404', name: 'Mobile Presentation Kit', category: 'AV Equipment', location: 'Reception Store', owner: 'Workplace', status: 'Checked-out', condition: 'Excellent', nextAvailable: '17:00', linkedAsset: 'CI-AV-404' },
    { id: 'AST-4502', name: 'Focus Desk A-12', category: 'Workspace', location: 'HQ · Floor 1', owner: 'Workplace', status: 'Available', condition: 'Excellent', nextAvailable: 'Now', linkedAsset: 'CI-DSK-502' }
  ];

  bookings: ResourceBooking[] = [
    { id: 'RES-7001', resource: 'Conference Camera Pro', requester: 'رضا موسوی', purpose: 'Vendor Review', start: '11:30', end: '12:30', status: 'Checked-out', meeting: 'MTG-2082', quantity: 1 },
    { id: 'RES-7002', resource: 'Mobile Presentation Kit', requester: 'مریم صادقی', purpose: 'جلسه آموزش امنیت', start: '15:00', end: '17:00', status: 'Approved', meeting: 'MTG-2084', quantity: 1 },
    { id: 'RES-7003', resource: 'Laptop Kit 01', requester: 'نگار احمدی', purpose: 'مصاحبه استخدامی', start: '13:00', end: '14:00', status: 'Ready', meeting: 'MTG-2083', quantity: 2 },
    { id: 'RES-7004', resource: 'Pool Vehicle 03', requester: 'سینا مرادی', purpose: 'بازدید سایت مشتری', start: '16:00', end: '19:00', status: 'Requested', meeting: '—', quantity: 1 },
    { id: 'RES-7005', resource: 'Training Projector', requester: 'علی رضایی', purpose: 'آموزش داخلی', start: '09:00', end: '11:00', status: 'Cancelled', meeting: '—', quantity: 1 }
  ];

  get filteredResources(): Resource[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.resources.filter(resource => {
      const statusOk = this.statusFilter === 'All' || resource.status === this.statusFilter;
      const categoryOk = this.categoryFilter === 'All' || resource.category === this.categoryFilter;
      const text = [resource.id, resource.name, resource.category, resource.location, resource.owner, resource.linkedAsset].join(' ').toLowerCase();
      return statusOk && categoryOk && (!q || text.includes(q));
    });
  }

  get availableCount(): number { return this.resources.filter(r => r.status === 'Available').length; }
  get reservedCount(): number { return this.resources.filter(r => r.status === 'Reserved').length; }
  get checkoutCount(): number { return this.resources.filter(r => r.status === 'Checked-out').length; }
  get maintenanceCount(): number { return this.resources.filter(r => r.status === 'Maintenance').length; }
  get activeBookings(): number {
    return this.bookings.filter(b => !['Returned', 'Cancelled'].includes(b.status)).length;
  }

  resourceCategories(): string[] {
    return ['IT Equipment', 'AV Equipment', 'Vehicle', 'Training', 'Workspace'];
  }

  bookingStatusClass(status: BookingStatus): string {
    return status.toLowerCase().replace(/[\s-]+/g, '-');
  }

  resourceStatusClass(status: ResourceStatus): string {
    return status.toLowerCase().replace(/[\s-]+/g, '-');
  }

  createBooking(): void {
    if (!this.newBooking.requester.trim() || !this.newBooking.purpose.trim()) return;

    const id = `RES-${7006 + this.bookings.length}`;
    this.bookings = [{
      id,
      resource: this.newBooking.resource,
      requester: this.newBooking.requester.trim(),
      purpose: this.newBooking.purpose.trim(),
      start: this.newBooking.start.substring(11, 16),
      end: this.newBooking.end.substring(11, 16),
      status: 'Requested',
      meeting: this.newBooking.meeting || '—',
      quantity: Number(this.newBooking.quantity) || 1
    }, ...this.bookings];

    this.showNewBooking = false;
    this.newBooking = {
      resource: 'Laptop Kit 01',
      requester: '',
      purpose: '',
      start: '2026-11-20T14:00',
      end: '2026-11-20T17:00',
      meeting: 'MTG-2084',
      quantity: 1
    };
  }

  approveBooking(booking: ResourceBooking): void {
    if (booking.status === 'Requested') booking.status = 'Approved';
  }

  markReady(booking: ResourceBooking): void {
    if (booking.status === 'Approved') booking.status = 'Ready';
  }

  checkout(booking: ResourceBooking): void {
    if (booking.status === 'Ready' || booking.status === 'Approved') booking.status = 'Checked-out';
  }

  returnResource(booking: ResourceBooking): void {
    if (booking.status === 'Checked-out') booking.status = 'Returned';
  }

  cancelBooking(booking: ResourceBooking): void {
    if (['Requested', 'Approved'].includes(booking.status)) booking.status = 'Cancelled';
  }
}
