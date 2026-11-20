import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppRole, hasPermission } from '../../features/auth/auth.guard';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Ticket, LifeBuoy, Users, UsersRound, BookOpen, Laptop, ChartNoAxesCombined, Palette, Settings, FileText, Search, ShoppingCart, Package, Wrench, Wallet, Activity, PlugZap, ChevronDown, PanelRightClose, Headset, ShieldCheck, ContactRound, CreditCard, Building2, Flag, HeartPulse, Sparkles, BrainCircuit,
} from 'lucide-angular';

@Component({
  selector: 'ah-app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="sidebar" [class.sidebar-mobile-open]="mobileOpen">
      <div class="brand-row">
        <a class="brand-home" routerLink="/dashboard" aria-label="صفحه اصلی Ashkan HelpDesk">
          <div class="brand-mark"><span>A</span><i></i></div>
          <div class="brand-copy"><strong>ashkan<span>.</span></strong><small>HELPDESK PLATFORM</small></div>
        </a>
        <button class="icon-button sidebar-toggle" type="button" aria-label="جمع یا باز کردن منو" (click)="toggleCollapsed.emit()">
          <i-lucide [img]="PanelRightClose" [size]="18"></i-lucide>
        </button>
        <button class="icon-button mobile-close" type="button" aria-label="بستن منو" (click)="closeMobile.emit()">×</button>
      </div>

      <button class="workspace-switch" type="button" (click)="workspaceOpen = !workspaceOpen" [attr.aria-expanded]="workspaceOpen">
        <div class="workspace-avatar">AC</div>
        <div class="workspace-copy"><strong>شرکت آشیان</strong><small>فضای کاری سازمانی</small></div>
        <i-lucide [img]="ChevronDown" [size]="16"></i-lucide>
      </button>
      @if (workspaceOpen) {
        <div class="workspace-menu"><strong>فضای کاری فعال</strong><span>شرکت آشیان · سازمان اصلی</span><button type="button" (click)="showComingSoon('انتخاب فضای کاری')">مدیریت فضاهای کاری</button></div>
      }

      <div class="nav-label">فضای کاری</div>
      <nav class="main-nav" aria-label="منوی اصلی">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMobile.emit()"><i-lucide [img]="LayoutDashboard" [size]="19"></i-lucide><span>داشبورد</span><kbd>⌘ 1</kbd></a>
        <a routerLink="/search" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Search" [size]="19"></i-lucide><span>جستجوی سراسری</span><em class="nav-count">⌘K</em></a>
        <a routerLink="/portal" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ContactRound" [size]="19"></i-lucide><span>پورتال خدمات کاربران</span></a>
        <a routerLink="/tickets" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Ticket" [size]="19"></i-lucide><span>مدیریت تیکت‌ها</span><em class="nav-count">۱۲</em></a>
        <a routerLink="/requests" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="LifeBuoy" [size]="19"></i-lucide><span>درخواست خدمات</span></a>
        @if (can('users.view')) { <a routerLink="/users" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Users" [size]="19"></i-lucide><span>کاربران و دسترسی‌ها</span></a> }
        @if (can('users.view')) { <a routerLink="/organization" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="UsersRound" [size]="19"></i-lucide><span>تیم‌ها و دپارتمان‌ها</span></a> }
        <a routerLink="/sla" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ShieldCheck" [size]="19"></i-lucide><span>مدیریت SLA</span></a>
        <a routerLink="/workflows" routerLinkActive="active" (click)="closeMobile.emit()"><i class="nav-glyph">⌘</i><span>موتور گردش کار</span></a>
        <a routerLink="/approvals" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ShieldCheck" [size]="19"></i-lucide><span>Workflow و تأییدیه‌ها</span><em class="nav-count">جدید</em></a>
        <a routerLink="/automation" routerLinkActive="active" (click)="closeMobile.emit()"><i class="nav-glyph">⚡</i><span>موتور اتوماسیون</span></a>
        <a routerLink="/omnichannel" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Headset" [size]="19"></i-lucide><span>Omnichannel و مسیریابی</span><em class="nav-count">جدید</em></a>
      </nav>

      <a routerLink="/ai-knowledge" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="BrainCircuit" [size]="19"></i-lucide><span>AI Knowledge & RAG</span><em class="nav-count">RAG</em></a>
        <a routerLink="/copilot" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Sparkles" [size]="19"></i-lucide><span>Ashkan Copilot</span><em class="nav-count">AI</em></a>
        <div class="nav-label nav-label-spaced">دانش و منابع</div>
      <nav class="main-nav" aria-label="مدیریت دانش و منابع">
        <a routerLink="/knowledge" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="BookOpen" [size]="19"></i-lucide><span>پایگاه دانش</span></a>
        <a routerLink="/assets" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Laptop" [size]="19"></i-lucide><span>مدیریت دارایی‌ها</span></a>
        <a routerLink="/contracts" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="FileText" [size]="19"></i-lucide><span>قراردادها و تأمین‌کنندگان</span></a>
        <a routerLink="/procurement" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ShoppingCart" [size]="19"></i-lucide><span>مدیریت خرید و سفارشات</span></a>
        <a routerLink="/inventory" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Package" [size]="19"></i-lucide><span>مدیریت انبار و موجودی</span></a>
        <a routerLink="/maintenance" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Wrench" [size]="19"></i-lucide><span>تعمیرات و نگهداری</span></a>
        <a routerLink="/finance" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Wallet" [size]="19"></i-lucide><span>مدیریت مالی و هزینه‌ها</span></a>
        @if (can('workforce.plan')) { <a routerLink="/workforce-planning" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ChartNoAxesCombined" [size]="19"></i-lucide><span>برنامه‌ریزی ظرفیت نیروی انسانی</span></a> }
        @if (can('reports.view')) { <a routerLink="/reports" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ChartNoAxesCombined" [size]="19"></i-lucide><span>گزارش‌گیری و تحلیل</span></a> }
        <a routerLink="/design-system" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Palette" [size]="19"></i-lucide><span>کتابخانه طراحی</span></a>
      </nav>

      <div class="sidebar-bottom">
        <div class="sidebar-help"><div class="help-icon"><i-lucide [img]="Headset" [size]="18"></i-lucide></div><strong>به راهنمایی نیاز دارید؟</strong><p>مرکز راهنما همیشه کنار شماست.</p><button type="button" (click)="showComingSoon('مرکز راهنما')">مشاهده راهنما <span>←</span></button></div>
        @if (can('billing.view')) { <a class="settings-link" routerLink="/billing" routerLinkActive="active" (click)="closeMobile.emit()"><i class="nav-glyph">＄</i><span>اشتراک‌ها و صورتحساب‌ها</span></a> }
        <a class="settings-link" routerLink="/tenants" routerLinkActive="active" (click)="closeMobile.emit()"><i class="nav-glyph">▦</i><span>مدیریت سازمان‌ها</span></a>
        <a class="settings-link" routerLink="/api-management" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="PlugZap" [size]="19"></i-lucide><span>مدیریت API و یکپارچه‌سازی‌ها</span></a>
        <a class="settings-link" routerLink="/audit-log" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Activity" [size]="19"></i-lucide><span>ثبت رویدادها و ممیزی</span></a>
        <a class="settings-link" routerLink="/subscription-billing" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="CreditCard" [size]="19"></i-lucide><span>اشتراک و صورتحساب</span></a>\n        <a class="settings-link" routerLink="/entitlements" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Flag" [size]="19"></i-lucide><span>قابلیت‌ها و سهمیه‌ها</span></a>
        <a class="settings-link" routerLink="/customer-success" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="HeartPulse" [size]="19"></i-lucide><span>Customer Success و سلامت مشتری</span></a>
        <a class="settings-link" routerLink="/customer-success-automation" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Activity" [size]="19"></i-lucide><span>اتوماسیون Customer Success</span></a>
        <a class="settings-link" routerLink="/tenant-management" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Building2" [size]="19"></i-lucide><span>مدیریت سازمان‌ها و Tenantها</span></a>
        <a class="settings-link" routerLink="/organization-access" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="UsersRound" [size]="19"></i-lucide><span>مرکز مدیریت سازمان</span></a>
        <a class="settings-link" routerLink="/profile-access" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="ContactRound" [size]="19"></i-lucide><span>پروفایل و مرکز دسترسی</span></a>
        <a class="settings-link" routerLink="/settings" routerLinkActive="active" (click)="closeMobile.emit()"><i-lucide [img]="Settings" [size]="19"></i-lucide><span>تنظیمات سامانه</span></a>
        <div class="sidebar-security"><i-lucide [img]="ShieldCheck" [size]="15"></i-lucide><span>محیط امن سازمانی</span></div>
        <div class="user-profile"><div class="avatar avatar-purple">{{displayName().slice(0,1)}}</div><div class="profile-copy"><strong>{{displayName()}}</strong><small>{{roleName()}}</small></div><button class="logout-mini" type="button" title="خروج از حساب" (click)="logout()">↪</button><span class="online-indicator" title="آنلاین"></span></div>
      </div>
    </aside>
  `
})
export class AppSidebarComponent {
  readonly BrainCircuit = BrainCircuit;
  readonly Sparkles = Sparkles;
  constructor(private readonly router: Router) {}
  @Input() mobileOpen = false;
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();
  @Output() toast = new EventEmitter<string>();
  workspaceOpen = false;
  readonly LayoutDashboard = LayoutDashboard; readonly Ticket = Ticket; readonly LifeBuoy = LifeBuoy;
  readonly Users = Users; readonly UsersRound = UsersRound; readonly BookOpen = BookOpen; readonly Laptop = Laptop;
  readonly ChartNoAxesCombined = ChartNoAxesCombined; readonly Activity = Activity; readonly PlugZap = PlugZap; readonly Palette = Palette; readonly Settings = Settings; readonly FileText = FileText; readonly ShoppingCart = ShoppingCart; readonly Package = Package; readonly Wrench = Wrench; readonly Wallet = Wallet;
  readonly Search = Search; readonly ChevronDown = ChevronDown; readonly PanelRightClose = PanelRightClose; readonly Headset = Headset; readonly ShieldCheck = ShieldCheck; readonly ContactRound = ContactRound; readonly CreditCard = CreditCard; readonly Building2 = Building2; readonly Flag = Flag; readonly HeartPulse = HeartPulse;

  readonly role: AppRole = (localStorage.getItem('ashkan.demo.role') || 'customer') as AppRole;
  can(permission: string): boolean { return hasPermission(permission); }
  displayName(): string { return localStorage.getItem('ashkan.demo.name') || 'کاربر'; }
  roleName(): string { return this.role === 'admin' ? 'مدیر سامانه' : this.role === 'manager' ? 'مدیر پشتیبانی' : this.role === 'agent' ? 'کارشناس پشتیبانی' : 'کاربر / مشتری'; }
  logout(): void { localStorage.removeItem('ashkan.demo.session'); localStorage.removeItem('ashkan.demo.role'); this.router.navigateByUrl('/auth/login'); this.closeMobile.emit(); }

  preventAndNotify(event: Event, name: string): void { event.preventDefault(); this.showComingSoon(name); }
  showComingSoon(name: string): void { this.toast.emit(`${name} در فازهای بعدی تکمیل می‌شود.`); this.closeMobile.emit(); }
}