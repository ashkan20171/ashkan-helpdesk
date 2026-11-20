import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeftRight, Boxes, Check, ChevronDown, ClipboardCheck, Clock3, Coins,
  FileCheck2, Filter, Package, Plus, Search, ShieldCheck, ShoppingCart,
  Truck, UserRound, Warehouse, X, Workflow } from 'lucide-angular';

interface Quote {
  vendor: string;
  price: string;
  delivery: string;
  warranty: string;
  score: number;
  recommended: boolean;
}

interface ProcurementRequest {
  id: string;
  item: string;
  requester: string;
  quantity: number;
  status: 'Draft' | 'Approval' | 'Quoting' | 'Purchase Order' | 'Delivery' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: string;
  vendor: string;
  due: string;
  linkedService: string;
}

interface StockItem {
  name: string;
  sku: string;
  available: number;
  reserved: number;
  reorder: number;
  location: string;
}

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './procurement.html',
  styleUrl: './procurement.scss'
})
export class ProcurementComponent {
  readonly icons = {
    ArrowLeftRight, Boxes, Check, ChevronDown, ClipboardCheck, Clock3, Coins,
    FileCheck2, Filter, Package, Plus, Search, ShieldCheck, ShoppingCart,
    Truck, UserRound, Warehouse, X, Workflow
  };

  search = '';
  status = 'All';
  selected: ProcurementRequest | null = null;
  showNew = false;
  showQuotes = false;

  requests: ProcurementRequest[] = [
    { id: 'PR-2058', item: 'Developer Laptop', requester: 'Sara Ahmadi', quantity: 3, status: 'Quoting', priority: 'High', budget: '$5,100', vendor: 'TechSource', due: 'Nov 22', linkedService: 'SR-1048' },
    { id: 'PR-2057', item: 'Microsoft 365 Licenses', requester: 'Ali Karimi', quantity: 25, status: 'Approval', priority: 'Medium', budget: '$1,500', vendor: '—', due: 'Nov 21', linkedService: 'SR-1047' },
    { id: 'PR-2056', item: 'VPN Gateway', requester: 'Nima Rezaei', quantity: 1, status: 'Purchase Order', priority: 'Critical', budget: '$3,200', vendor: 'NetSecure', due: 'Nov 24', linkedService: 'SR-1046' },
    { id: 'PR-2055', item: 'Ergonomic Chair', requester: 'Maryam Hosseini', quantity: 8, status: 'Delivery', priority: 'Low', budget: '$2,240', vendor: 'OfficePlus', due: 'Nov 23', linkedService: 'SR-1039' },
    { id: 'PR-2054', item: 'USB-C Dock', requester: 'Reza Mohammadi', quantity: 10, status: 'Completed', priority: 'Medium', budget: '$950', vendor: 'TechSource', due: 'Completed', linkedService: 'SR-1032' }
  ];

  stock: StockItem[] = [
    { name: 'USB-C Dock', sku: 'IT-DOCK-01', available: 12, reserved: 6, reorder: 8, location: 'WH-A / Shelf 04' },
    { name: 'Standard Laptop', sku: 'IT-LAP-STD', available: 7, reserved: 4, reorder: 5, location: 'WH-A / Shelf 01' },
    { name: 'Wireless Keyboard', sku: 'IT-KBD-WL', available: 31, reserved: 10, reorder: 15, location: 'WH-B / Shelf 02' },
    { name: 'Monitor 27"', sku: 'IT-MON-27', available: 4, reserved: 3, reorder: 6, location: 'WH-A / Shelf 07' }
  ];

  quotes: Quote[] = [
    { vendor: 'TechSource', price: '$4,980', delivery: '3 days', warranty: '36 months', score: 94, recommended: true },
    { vendor: 'DigitalHub', price: '$5,120', delivery: '2 days', warranty: '24 months', score: 89, recommended: false },
    { vendor: 'OfficePlus', price: '$4,760', delivery: '7 days', warranty: '12 months', score: 81, recommended: false }
  ];

  get filteredRequests() {
    const q = this.search.trim().toLowerCase();
    return this.requests.filter(r =>
      (this.status === 'All' || r.status === this.status) &&
      (!q || `${r.id} ${r.item} ${r.requester} ${r.vendor} ${r.linkedService}`.toLowerCase().includes(q))
    );
  }

  select(request: ProcurementRequest) {
    this.selected = request;
    this.showQuotes = false;
  }

  openQuotes() {
    this.showQuotes = true;
  }

  createRequest() {
    const id = `PR-${2060 + this.requests.length}`;
    this.requests.unshift({
      id, item: 'New Procurement Item', requester: 'Current user', quantity: 1,
      status: 'Draft', priority: 'Medium', budget: '$0', vendor: '—',
      due: 'To be planned', linkedService: '—'
    });
    this.selected = this.requests[0];
    this.showNew = false;
  }

  statusClass(value: string) {
    return value.toLowerCase().replace(/\s+/g, '-');
  }

  stockHealth(item: StockItem) {
    return item.available <= item.reorder ? 'low' : 'healthy';
  }
}
