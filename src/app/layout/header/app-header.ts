import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, Search, Bell, Sun, Moon, ChevronDown, Menu, Command, CheckCheck, UserRound, Settings, LogOut, X, ArrowUpLeft } from 'lucide-angular';

@Component({
  selector: 'ah-app-header',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <header class="topbar">
      <div class="topbar-leading">
        <button class="icon-button mobile-menu-button" type="button" aria-label="باز کردن منو" (click)="mobileMenu.emit()"><i-lucide [img]="Menu" [size]="20"></i-lucide></button>
        <div class="breadcrumb"><span>فضای کاری</span><b>/</b><strong>{{ pageTitle }}</strong></div>
      </div>
      <div class="top-actions">
        <button class="global-search-trigger" type="button" (click)="openSearch.emit()"><i-lucide [img]="Search" [size]="17"></i-lucide><span>جستجو در سامانه...</span><kbd><i-lucide [img]="Command" [size]="10"></i-lucide> K</kbd></button>
        <button class="icon-button theme-button" type="button" aria-label="تغییر پوسته" (click)="toggleTheme.emit()"><i-lucide [img]="darkMode ? Sun : Moon" [size]="19"></i-lucide></button>
        <div class="header-popover-anchor">
          <button class="icon-button notification-button" type="button" aria-label="اعلان‌ها" [attr.aria-expanded]="notificationsOpen" (click)="toggleNotifications.emit()"><i-lucide [img]="Bell" [size]="19"></i-lucide>@if (unreadCount > 0) { <span class="notification-dot"></span> }</button>
          @if (notificationsOpen) {
            <section class="notification-popover" aria-label="اعلان‌های اخیر">
              <div class="popover-heading"><div><strong>اعلان‌ها</strong><small>{{ unreadCount }} اعلان خوانده‌نشده</small></div><button type="button" class="text-action" (click)="markAllRead.emit()"><i-lucide [img]="CheckCheck" [size]="14"></i-lucide> خواندن همه</button></div>
              <div class="notification-item"><span class="notification-icon notification-blue"><i-lucide [img]="Bell" [size]="15"></i-lucide></span><div><strong>تیکت جدید دریافت شد</strong><p>درخواست #AH-2048 در صف بررسی شما قرار گرفت.</p><small>۵ دقیقه پیش</small></div><i class="unread-mark"></i></div>
              <div class="notification-item"><span class="notification-icon notification-orange">!</span><div><strong>هشدار نزدیک شدن به SLA</strong><p>زمان پاسخ‌گویی تیکت #AH-2031 رو به پایان است.</p><small>۲۵ دقیقه پیش</small></div><i class="unread-mark"></i></div>
              <div class="notification-item"><span class="notification-icon notification-green"><i-lucide [img]="CheckCheck" [size]="15"></i-lucide></span><div><strong>درخواست با موفقیت بسته شد</strong><p>تیکت #AH-2026 توسط تیم زیرساخت حل شد.</p><small>۱ ساعت پیش</small></div></div>
              <button class="popover-footer-action" type="button" (click)="viewAllNotifications.emit()">مشاهده همه اعلان‌ها <i-lucide [img]="ArrowUpLeft" [size]="14"></i-lucide></button>
            </section>
          }
        </div>
        <div class="top-divider"></div>
        <div class="header-popover-anchor">
          <button class="top-user" type="button" (click)="toggleProfile.emit()" [attr.aria-expanded]="profileOpen"><div class="avatar avatar-purple">م</div><span class="top-user-copy"><strong>محمد رضایی</strong><small>مدیر سامانه</small></span><i-lucide [img]="ChevronDown" [size]="15"></i-lucide></button>
          @if (profileOpen) {
            <div class="profile-popover"><div class="profile-popover-user"><div class="avatar avatar-purple">م</div><div><strong>محمد رضایی</strong><small>admin&#64;ashkan.local</small></div></div><button type="button" (click)="profileAction.emit('پروفایل کاربری')"><i-lucide [img]="UserRound" [size]="16"></i-lucide> پروفایل کاربری</button><button type="button" (click)="profileAction.emit('تنظیمات حساب')"><i-lucide [img]="Settings" [size]="16"></i-lucide> تنظیمات حساب</button><div class="profile-menu-divider"></div><button class="logout-action" type="button" (click)="profileAction.emit('خروج از حساب')"><i-lucide [img]="LogOut" [size]="16"></i-lucide> خروج از حساب</button></div>
          }
        </div>
      </div>
    </header>
  `
})
export class AppHeaderComponent {
  @Input() pageTitle = 'داشبورد';
  @Input() darkMode = false;
  @Input() notificationsOpen = false;
  @Input() profileOpen = false;
  @Input() unreadCount = 2;
  @Output() mobileMenu = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleNotifications = new EventEmitter<void>();
  @Output() toggleProfile = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();
  @Output() markAllRead = new EventEmitter<void>();
  @Output() viewAllNotifications = new EventEmitter<void>();
  @Output() profileAction = new EventEmitter<string>();
  readonly Search = Search; readonly Bell = Bell; readonly Sun = Sun; readonly Moon = Moon; readonly ChevronDown = ChevronDown;
  readonly Menu = Menu; readonly Command = Command; readonly CheckCheck = CheckCheck; readonly UserRound = UserRound;
  readonly Settings = Settings; readonly LogOut = LogOut; readonly X = X; readonly ArrowUpLeft = ArrowUpLeft;
}
