import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  Activity,
  BarChart3,
  Bell,
  BrainCircuit,
  Calculator,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Eye,
  FolderKanban,
  HeartPulse,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  LucideAngularModule
} from 'lucide-angular';
@Component({
  selector: 'ah-app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="sidebar-shell" [class.collapsed]="collapsed">
      <div class="brand">
        <div class="brand-mark"><lucide-icon [img]="Sparkles" [size]="20"></lucide-icon></div>
        <div class="brand-copy" *ngIf="!collapsed">
          <strong>Ashkan</strong>
          <span>HelpDesk</span>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Main navigation">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          <lucide-icon [img]="LayoutDashboard" [size]="18"></lucide-icon><span *ngIf="!collapsed">Dashboard</span>
        </a>
        <a routerLink="/tickets" routerLinkActive="active">
          <lucide-icon [img]="Ticket" [size]="18"></lucide-icon><span *ngIf="!collapsed">Tickets</span>
        </a>
        <a routerLink="/customers" routerLinkActive="active">
          <lucide-icon [img]="Users" [size]="18"></lucide-icon><span *ngIf="!collapsed">Customers</span>
        </a>
        <a routerLink="/knowledge" routerLinkActive="active">
          <lucide-icon [img]="FolderKanban" [size]="18"></lucide-icon><span *ngIf="!collapsed">Knowledge Base</span>
        </a>
        <a routerLink="/reports" routerLinkActive="active">
          <lucide-icon [img]="BarChart3" [size]="18"></lucide-icon><span *ngIf="!collapsed">Reports</span>
        </a>

        <div class="nav-section" *ngIf="!collapsed">AI Intelligence</div>
        <a routerLink="/ai-knowledge" routerLinkActive="active">
          <lucide-icon [img]="BrainCircuit" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Knowledge & RAG</span>
        </a>
        <a routerLink="/ai-model-management" routerLinkActive="active">
          <lucide-icon [img]="Sparkles" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Models & Prompts</span>
        </a>
        <a routerLink="/ai-security" routerLinkActive="active">
          <lucide-icon [img]="ShieldCheck" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Safety & Red-Team</span>
        </a>
        <a routerLink="/ai-incidents" routerLinkActive="active">
          <lucide-icon [img]="HeartPulse" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Incident Command</span>
        </a>
        <a routerLink="/ai-governance" routerLinkActive="active">
          <lucide-icon [img]="ShieldCheck" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Governance & Compliance</span>
        </a>
        <a routerLink="/ai-audit" routerLinkActive="active">
          <lucide-icon [img]="ClipboardCheck" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Audit & Evidence</span>
        </a>
        <a routerLink="/ai-observability" routerLinkActive="active">
          <lucide-icon [img]="Activity" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Observability & Operations</span>
        </a>
        <a routerLink="/ai-trust" routerLinkActive="active">
          <lucide-icon [img]="Eye" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Trust & Transparency</span>
        </a>
        <a routerLink="/ai-finance" routerLinkActive="active">
          <lucide-icon [img]="CircleDollarSign" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Finance & Revenue</span>
        </a>
        <a routerLink="/ai-forecasting" routerLinkActive="active">
          <lucide-icon [img]="TrendingUp" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Revenue Forecasting & Planning</span>
        </a>
        <a routerLink="/ai-simulation" routerLinkActive="active">
          <lucide-icon [img]="Calculator" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Scenario Simulation</span>
        </a>
        <a routerLink="/ai-finops" routerLinkActive="active">
          <lucide-icon [img]="Wallet" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Cost & FinOps</span>
        </a>
        <a routerLink="/ai-billing" routerLinkActive="active">
          <lucide-icon [img]="Receipt" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Chargeback & Billing</span>
        </a>
        <a routerLink="/ai-executive" routerLinkActive="active">
          <lucide-icon [img]="BrainCircuit" [size]="18"></lucide-icon><span *ngIf="!collapsed">AI Executive Intelligence</span>
        </a>

        <div class="nav-section" *ngIf="!collapsed">Workspace</div>
        <a routerLink="/notifications" routerLinkActive="active">
          <lucide-icon [img]="Bell" [size]="18"></lucide-icon><span *ngIf="!collapsed">Notifications</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active">
          <lucide-icon [img]="Settings" [size]="18"></lucide-icon><span *ngIf="!collapsed">Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button type="button" class="collapse-btn" (click)="toggleCollapsed.emit()">
          <lucide-icon [img]="ChevronRight" [size]="18"></lucide-icon>
          <span *ngIf="!collapsed">Collapse</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host { display:block; height:100%; }
    .sidebar-shell { height:100%; width:270px; display:flex; flex-direction:column; padding:18px 12px; box-sizing:border-box; }
    .sidebar-shell.collapsed { width:78px; }
    .brand { display:flex; align-items:center; gap:10px; padding:8px 10px 20px; }
    .brand-mark { width:38px; height:38px; border-radius:12px; display:grid; place-items:center; background:linear-gradient(135deg,#6d5dfc,#36cfc9); color:white; }
    .brand-copy { display:flex; flex-direction:column; line-height:1.05; }
    .brand-copy span { font-size:11px; opacity:.62; margin-top:4px; }
    .sidebar-nav { display:flex; flex-direction:column; gap:4px; overflow:auto; }
    .sidebar-nav a { display:flex; align-items:center; gap:11px; min-height:42px; padding:0 11px; border-radius:12px; text-decoration:none; color:inherit; }
    .sidebar-nav a.active { background:rgba(109,93,252,.12); }
    .nav-section { margin:16px 10px 7px; font-size:11px; font-weight:700; opacity:.5; text-transform:uppercase; letter-spacing:.06em; }
    .sidebar-footer { margin-top:auto; padding-top:12px; }
    .collapse-btn { width:100%; display:flex; align-items:center; gap:10px; border:0; background:transparent; padding:10px 11px; cursor:pointer; color:inherit; border-radius:12px; }
  `]
})
export class AppSidebarComponent {
  readonly Activity = Activity;
  readonly BarChart3 = BarChart3;
  readonly Bell = Bell;
  readonly BrainCircuit = BrainCircuit;
  readonly Calculator = Calculator;
  readonly ChevronRight = ChevronRight;
  readonly CircleDollarSign = CircleDollarSign;
  readonly ClipboardCheck = ClipboardCheck;
  readonly Eye = Eye;
  readonly FolderKanban = FolderKanban;
  readonly HeartPulse = HeartPulse;
  readonly LayoutDashboard = LayoutDashboard;
  readonly Receipt = Receipt;
  readonly Settings = Settings;
  readonly ShieldCheck = ShieldCheck;
  readonly Sparkles = Sparkles;
  readonly Ticket = Ticket;
  readonly TrendingUp = TrendingUp;
  readonly Users = Users;
  readonly Wallet = Wallet;

@Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();
  @Output() toast = new EventEmitter<string>();
}
