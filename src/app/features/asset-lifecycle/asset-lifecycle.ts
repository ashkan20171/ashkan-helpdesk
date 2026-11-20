import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Archive, ArrowLeftRight, Barcode, Boxes, CalendarDays, Check, ClipboardCheck,
  Clock3, Coins, FileKey2, Filter, History, MapPin, Package, Plus, QrCode,
  Search, ShieldCheck, Truck, UserRound, Wrench, X } from 'lucide-angular';

interface Asset {
  id: string;
  name: string;
  category: string;
  serial: string;
  status: 'In Stock' | 'Assigned' | 'Maintenance' | 'Retired';
  owner: string;
  location: string;
  warranty: string;
  value: string;
  ci: string;
  lastAudit: string;
}

interface Movement {
  id: string;
  asset: string;
  type: 'Assignment' | 'Transfer' | 'Check-in' | 'Check-out' | 'Maintenance';
  from: string;
  to: string;
  actor: string;
  date: string;
}

@Component({
  selector: 'app-asset-lifecycle',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './asset-lifecycle.html',
  styleUrl: './asset-lifecycle.scss'
})
export class AssetLifecycleComponent {
  readonly icons = {
    Archive, ArrowLeftRight, Barcode, Boxes, CalendarDays, Check, ClipboardCheck,
    Clock3, Coins, FileKey2, Filter, History, MapPin, Package, Plus, QrCode,
    Search, ShieldCheck, Truck, UserRound, Wrench, X
  };

  search = '';
  status = 'All';
  selected: Asset | null = null;
  showAsset = false;
  showMovement = false;
  showQr = false;

  assets: Asset[] = [
    { id: 'AST-10042', name: 'MacBook Pro 16"', category: 'Laptop', serial: 'C02ZK7A1LVDL', status: 'Assigned', owner: 'Sara Ahmadi', location: 'Design / Tehran', warranty: 'Oct 2027', value: '$2,899', ci: 'CI-IT-0441', lastAudit: 'Nov 18, 2026' },
    { id: 'AST-10041', name: 'Dell Precision 5680', category: 'Laptop', serial: 'DL5680-88312', status: 'In Stock', owner: '—', location: 'WH-A / Shelf 01', warranty: 'Jun 2027', value: '$2,150', ci: 'CI-IT-0438', lastAudit: 'Nov 15, 2026' },
    { id: 'AST-10039', name: '27" 4K Monitor', category: 'Monitor', serial: 'MN4K-22081', status: 'Maintenance', owner: 'Ali Karimi', location: 'Service Center', warranty: 'Mar 2027', value: '$620', ci: 'CI-IT-0409', lastAudit: 'Nov 10, 2026' },
    { id: 'AST-10034', name: 'Cisco VPN Gateway', category: 'Network', serial: 'CSC-88419', status: 'Assigned', owner: 'Network Team', location: 'DC-A / Rack 12', warranty: 'Jan 2028', value: '$3,200', ci: 'CI-NET-0082', lastAudit: 'Nov 19, 2026' },
    { id: 'AST-10011', name: 'ThinkPad T14', category: 'Laptop', serial: 'PF4M8X2A', status: 'Retired', owner: '—', location: 'Archive', warranty: 'Expired', value: '$1,050', ci: 'CI-IT-0111', lastAudit: 'Aug 02, 2026' }
  ];

  movements: Movement[] = [
    { id: 'MV-9032', asset: 'AST-10042', type: 'Assignment', from: 'WH-A', to: 'Sara Ahmadi', actor: 'IT Asset Team', date: 'Nov 18, 2026 10:42' },
    { id: 'MV-9031', asset: 'AST-10039', type: 'Maintenance', from: 'Ali Karimi', to: 'Service Center', actor: 'Support Team', date: 'Nov 17, 2026 15:20' },
    { id: 'MV-9030', asset: 'AST-10034', type: 'Transfer', from: 'DC-B / Rack 03', to: 'DC-A / Rack 12', actor: 'Network Team', date: 'Nov 16, 2026 09:12' },
    { id: 'MV-9029', asset: 'AST-10041', type: 'Check-in', from: 'Reza Mohammadi', to: 'WH-A / Shelf 01', actor: 'IT Asset Team', date: 'Nov 15, 2026 13:08' }
  ];

  get filteredAssets() {
    const q = this.search.trim().toLowerCase();
    return this.assets.filter(a =>
      (this.status === 'All' || a.status === this.status) &&
      (!q || `${a.id} ${a.name} ${a.category} ${a.serial} ${a.owner} ${a.location} ${a.ci}`.toLowerCase().includes(q))
    );
  }

  select(asset: Asset) {
    this.selected = asset;
  }

  createAsset() {
    const id = `AST-${10050 + this.assets.length}`;
    this.assets.unshift({
      id, name: 'New Asset', category: 'Other', serial: 'Pending',
      status: 'In Stock', owner: '—', location: 'Receiving',
      warranty: 'Pending', value: '$0', ci: 'Pending', lastAudit: 'Not audited'
    });
    this.selected = this.assets[0];
    this.showAsset = false;
  }

  assignSelected() {
    if (!this.selected) return;
    this.selected.status = 'Assigned';
    this.selected.owner = 'Current user';
    this.selected.location = 'IT / Assigned';
    this.showMovement = false;
  }

  retireSelected() {
    if (!this.selected) return;
    this.selected.status = 'Retired';
    this.selected.owner = '—';
    this.selected.location = 'Archive';
    this.showAsset = false;
  }

  statusClass(status: string) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  movementClass(type: string) {
    return type.toLowerCase().replace(/\s+/g, '-');
  }
}
