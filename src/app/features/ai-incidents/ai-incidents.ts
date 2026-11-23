import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle, Bot, CheckCircle2, Clock3, FileText, Filter,
  Flag, GitBranch, History, LockKeyhole, LucideAngularModule,
  MessageSquare, Play, Plus, Search, ShieldAlert, ShieldCheck,
  UserCheck, UsersRound, XCircle
} from 'lucide-angular';

type IncidentStatus = 'Open' | 'Investigating' | 'Contained' | 'Resolved';
type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

interface AiIncident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  category: string;
  owner: string;
  detected: string;
  impact: string;
  affected: string;
}

@Component({
  selector: 'ah-ai-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-incidents.html',
  styleUrl: './ai-incidents.scss'
})
export class AiIncidentsComponent {
  readonly AlertTriangle = AlertTriangle;
  readonly Bot = Bot;
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock3 = Clock3;
  readonly FileText = FileText;
  readonly Filter = Filter;
  readonly Flag = Flag;
  readonly GitBranch = GitBranch;
  readonly History = History;
  readonly LockKeyhole = LockKeyhole;
  readonly MessageSquare = MessageSquare;
  readonly Play = Play;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly ShieldAlert = ShieldAlert;
  readonly ShieldCheck = ShieldCheck;
  readonly UserCheck = UserCheck;
  readonly UsersRound = UsersRound;
  readonly XCircle = XCircle;

  readonly search = signal('');
  readonly statusFilter = signal<'All' | IncidentStatus>('All');
  readonly selected = signal<AiIncident | null>(null);
  readonly showDetail = signal(false);
  readonly toast = signal('');

  readonly incidents = signal<AiIncident[]>([
    {
      id: 'AI-INC-104',
      title: 'Prompt injection reached customer-facing copilot',
      severity: 'High',
      status: 'Investigating',
      category: 'Prompt Injection',
      owner: 'AI Security',
      detected: '12 min ago',
      impact: 'Potential unsafe instruction following',
      affected: 'Customer Copilot'
    },
    {
      id: 'AI-INC-101',
      title: 'Unexpected cross-tenant retrieval signal',
      severity: 'Critical',
      status: 'Contained',
      category: 'Tenant Isolation',
      owner: 'Platform Security',
      detected: '48 min ago',
      impact: 'Retrieval boundary violation attempt',
      affected: 'RAG Gateway'
    },
    {
      id: 'AI-INC-098',
      title: 'AI action recommendation exceeded approval policy',
      severity: 'High',
      status: 'Resolved',
      category: 'Excessive Agency',
      owner: 'Automation Team',
      detected: '3 hrs ago',
      impact: 'Human approval was required',
      affected: 'Ticket Automation'
    },
    {
      id: 'AI-INC-095',
      title: 'Citation quality degradation in knowledge answers',
      severity: 'Medium',
      status: 'Open',
      category: 'Groundedness',
      owner: 'Knowledge Engineering',
      detected: '5 hrs ago',
      impact: 'Reduced answer trust',
      affected: 'Knowledge Copilot'
    }
  ]);

  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const filter = this.statusFilter();
    return this.incidents().filter(x => {
      const matchesStatus = filter === 'All' || x.status === filter;
      const matchesQuery = !q || `${x.id} ${x.title} ${x.severity} ${x.status} ${x.category} ${x.owner} ${x.affected}`.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  });

  readonly openCount = computed(() => this.incidents().filter(x => x.status === 'Open').length);
  readonly activeCount = computed(() => this.incidents().filter(x => x.status === 'Investigating' || x.status === 'Contained').length);
  readonly criticalCount = computed(() => this.incidents().filter(x => x.severity === 'Critical').length);
  readonly resolvedCount = computed(() => this.incidents().filter(x => x.status === 'Resolved').length);

  notify(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2800);
  }

  createIncident() {
    this.notify('New AI incident workflow is ready for backend persistence.');
  }

  openIncident(item: AiIncident) {
    this.selected.set(item);
    this.showDetail.set(true);
  }

  statusClass(value: string) {
    return value.toLowerCase();
  }

  severityClass(value: string) {
    return value.toLowerCase();
  }

  track(_: number, item: AiIncident) {
    return item.id;
  }
}
