import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Check,
  ChevronLeft,
  ClipboardList,
  Clock3,
  Coins,
  FileCheck2,
  Filter,
  Headphones,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Ticket,
  UserRound,
  UsersRound,
  Workflow } from 'lucide-angular';

interface ServiceField {
  id: number;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'number';
  required: boolean;
  options?: string[];
}

interface ServiceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  owner: string;
  sla: string;
  estimatedCost: string;
  popularity: number;
  status: 'Active' | 'Draft';
  fields: ServiceField[];
}

interface ServiceRequest {
  id: string;
  service: string;
  requester: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Submitted' | 'Approval' | 'Fulfillment' | 'Completed';
  sla: string;
  due: string;
  costCenter: string;
  linkedTicket: string;
}

@Component({
  selector: 'app-service-catalog',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './service-catalog.html',
  styleUrl: './service-catalog.scss'
})
export class ServiceCatalogComponent {
  readonly icons = {
    ClipboardList, Clock3, Coins, FileCheck2, Filter, Headphones, PackageCheck,
    Plus, Search, Settings2, ShieldCheck, Ticket, UserRound, UsersRound, Workflow,
    ChevronLeft, Check
  };

  search = '';
  category = 'All';
  requestStatus = 'All';
  selectedService: ServiceItem | null = null;
  showRequestForm = false;
  showBuilder = false;
  newFieldLabel = '';
  newFieldType: ServiceField['type'] = 'text';

  categories = ['All', 'Access & Identity', 'Hardware', 'Software', 'Facilities', 'HR'];

  services: ServiceItem[] = [
    {
      id: 1, name: 'New Employee Onboarding', category: 'HR',
      description: 'Create accounts, equipment, access and onboarding tasks for a new employee.',
      owner: 'HR Service Desk', sla: '2 business days', estimatedCost: '$120',
      popularity: 94, status: 'Active',
      fields: [
        { id: 1, label: 'Employee name', type: 'text', required: true },
        { id: 2, label: 'Start date', type: 'date', required: true },
        { id: 3, label: 'Department', type: 'select', required: true, options: ['IT', 'Finance', 'Sales', 'HR'] }
      ]
    },
    {
      id: 2, name: 'Laptop Request', category: 'Hardware',
      description: 'Request a standard or specialized laptop with asset assignment and delivery tracking.',
      owner: 'Endpoint Team', sla: '3 business days', estimatedCost: '$1,450',
      popularity: 88, status: 'Active',
      fields: [
        { id: 4, label: 'Device profile', type: 'select', required: true, options: ['Standard', 'Developer', 'Design'] },
        { id: 5, label: 'Business justification', type: 'textarea', required: true }
      ]
    },
    {
      id: 3, name: 'Software Access', category: 'Access & Identity',
      description: 'Request access to an approved application with manager approval and license checks.',
      owner: 'IAM Team', sla: '8 business hours', estimatedCost: '$35',
      popularity: 82, status: 'Active',
      fields: [
        { id: 6, label: 'Application', type: 'select', required: true, options: ['Microsoft 365', 'Jira', 'Figma', 'GitHub'] },
        { id: 7, label: 'Access reason', type: 'textarea', required: true }
      ]
    },
    {
      id: 4, name: 'VPN Access', category: 'Access & Identity',
      description: 'Secure remote access request with identity verification and approval workflow.',
      owner: 'Network Team', sla: '4 business hours', estimatedCost: '$0',
      popularity: 76, status: 'Active',
      fields: [
        { id: 8, label: 'Access duration', type: 'select', required: true, options: ['1 week', '1 month', 'Permanent'] }
      ]
    },
    {
      id: 5, name: 'Office Maintenance', category: 'Facilities',
      description: 'Report or request planned maintenance for office equipment and facilities.',
      owner: 'Facilities', sla: '1 business day', estimatedCost: '$80',
      popularity: 61, status: 'Active',
      fields: [
        { id: 9, label: 'Location', type: 'text', required: true },
        { id: 10, label: 'Details', type: 'textarea', required: true }
      ]
    }
  ];

  requests: ServiceRequest[] = [
    { id: 'SR-1048', service: 'Laptop Request', requester: 'Sara Ahmadi', department: 'Design', priority: 'High', status: 'Fulfillment', sla: '3 business days', due: 'Today 16:30', costCenter: 'CC-220', linkedTicket: 'INC-7821' },
    { id: 'SR-1047', service: 'Software Access', requester: 'Ali Karimi', department: 'Sales', priority: 'Medium', status: 'Approval', sla: '8 business hours', due: 'Tomorrow 10:00', costCenter: 'CC-410', linkedTicket: '—' },
    { id: 'SR-1046', service: 'VPN Access', requester: 'Nima Rezaei', department: 'Finance', priority: 'Critical', status: 'Submitted', sla: '4 business hours', due: 'Today 13:20', costCenter: 'CC-310', linkedTicket: 'INC-7816' },
    { id: 'SR-1045', service: 'New Employee Onboarding', requester: 'Maryam Hosseini', department: 'HR', priority: 'Medium', status: 'Completed', sla: '2 business days', due: 'Completed', costCenter: 'CC-100', linkedTicket: 'REQ-2041' }
  ];

  get filteredServices(): ServiceItem[] {
    const q = this.search.trim().toLowerCase();
    return this.services.filter(s =>
      (this.category === 'All' || s.category === this.category) &&
      (!q || `${s.name} ${s.category} ${s.description} ${s.owner}`.toLowerCase().includes(q))
    );
  }

  get filteredRequests(): ServiceRequest[] {
    const q = this.search.trim().toLowerCase();
    return this.requests.filter(r =>
      (this.requestStatus === 'All' || r.status === this.requestStatus) &&
      (!q || `${r.id} ${r.service} ${r.requester} ${r.department}`.toLowerCase().includes(q))
    );
  }

  selectService(service: ServiceItem) {
    this.selectedService = service;
    this.showRequestForm = false;
  }

  openRequest(service = this.selectedService) {
    this.selectedService = service;
    this.showRequestForm = true;
    this.showBuilder = false;
  }

  openBuilder() {
    this.showBuilder = true;
    this.showRequestForm = false;
  }

  addField() {
    const label = this.newFieldLabel.trim();
    if (!label) return;
    const target = this.selectedService ?? this.services[0];
    target.fields.push({
      id: Date.now(),
      label,
      type: this.newFieldType,
      required: true,
      options: this.newFieldType === 'select' ? ['Option 1', 'Option 2'] : undefined
    });
    this.newFieldLabel = '';
  }

  submitRequest() {
    if (!this.selectedService) return;
    const nextId = 1049 + this.requests.length;
    this.requests.unshift({
      id: `SR-${nextId}`,
      service: this.selectedService.name,
      requester: 'Current user',
      department: 'IT',
      priority: 'Medium',
      status: 'Submitted',
      sla: this.selectedService.sla,
      due: 'Calculated by SLA',
      costCenter: 'CC-200',
      linkedTicket: '—'
    });
    this.showRequestForm = false;
  }

  kpi(label: string): number {
    if (label === 'services') return this.services.filter(s => s.status === 'Active').length;
    if (label === 'open') return this.requests.filter(r => r.status !== 'Completed').length;
    if (label === 'approval') return this.requests.filter(r => r.status === 'Approval').length;
    return this.requests.filter(r => r.status === 'Fulfillment').length;
  }

  priorityClass(priority: ServiceRequest['priority']) {
    return priority.toLowerCase();
  }

  statusClass(status: ServiceRequest['status']) {
    return status.toLowerCase();
  }
}
