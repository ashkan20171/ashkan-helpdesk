import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Settings, Building2, Palette, Globe2, ShieldCheck, Bell, Mail, Workflow, Save, RotateCcw, Check, Eye, EyeOff, LockKeyhole, Clock3, Languages, Smartphone, Server, SlidersHorizontal } from 'lucide-angular';

type SettingsTab = 'general' | 'branding' | 'localization' | 'security' | 'notifications' | 'channels' | 'workflow';
@Component({
  selector: 'ah-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  readonly Settings = Settings; readonly Building2 = Building2; readonly Palette = Palette; readonly Globe2 = Globe2;
  readonly ShieldCheck = ShieldCheck; readonly Bell = Bell; readonly Mail = Mail; readonly Workflow = Workflow;
  readonly Save = Save; readonly RotateCcw = RotateCcw; readonly Check = Check; readonly Eye = Eye; readonly EyeOff = EyeOff;
  readonly LockKeyhole = LockKeyhole; readonly Clock3 = Clock3; readonly Languages = Languages; readonly Smartphone = Smartphone;
  readonly Server = Server; readonly SlidersHorizontal = SlidersHorizontal;

  readonly activeTab = signal<SettingsTab>('general');
  readonly toast = signal('');
  readonly showSecret = signal(false);
  readonly saving = signal(false);

  general = { organizationName: 'شرکت آشیان', displayName: 'Ashkan HelpDesk', supportEmail: 'support@ashian.example', supportPhone: '۰۲۱-۸۸۷۷۰۰۰۰', defaultLanguage: 'fa', defaultTheme: 'light', allowRegistration: false, enableGuestPortal: true, maintenanceMode: false };
  branding = { primaryColor: '#0f766e', accentColor: '#e2a93b', logoText: 'ashkan.', tagline: 'HELPDESK PLATFORM', compactSidebar: false, showPoweredBy: true };
  localization = { language: 'fa-IR', timezone: 'Asia/Tehran', calendar: 'jalali', dateFormat: 'yyyy/MM/dd', timeFormat: '24', weekStart: 'saturday', currency: 'IRR' };
  security = { minLength: 10, requireUppercase: true, requireNumber: true, requireSymbol: true, passwordExpiry: 90, sessionTimeout: 30, maxAttempts: 5, lockoutMinutes: 15, twoFactor: true, enforceSso: false, ipRestriction: false };
  notifications = { inApp: true, email: true, sms: false, ticketAssigned: true, ticketUpdated: true, slaWarning: true, dailyDigest: false, quietHours: true, quietStart: '22:00', quietEnd: '08:00' };
  channels = { smtpHost: 'smtp.example.com', smtpPort: 587, smtpUser: 'notifications@ashian.example', smtpPassword: '', smtpEncryption: 'STARTTLS', smsProvider: 'پنل پیامکی سازمان', smsSender: 'ASHKAN', webhookUrl: '', webhookEnabled: false };
  workflow = { autoAssign: true, assignmentStrategy: 'round-robin', reopenWindow: 72, autoCloseAfter: 7, approvalRequired: true, escalationEnabled: true, escalationAfter: 4, defaultPriority: 'medium', allowRequesterReopen: true };

  readonly tabs = [
    { id: 'general' as const, label: 'عمومی', icon: Building2, description: 'اطلاعات پایه و رفتار سامانه' },
    { id: 'branding' as const, label: 'هویت بصری', icon: Palette, description: 'رنگ‌ها و نمایش برند' },
    { id: 'localization' as const, label: 'زبان و منطقه', icon: Globe2, description: 'تقویم، زمان و قالب‌ها' },
    { id: 'security' as const, label: 'امنیت', icon: ShieldCheck, description: 'سیاست رمز عبور و نشست‌ها' },
    { id: 'notifications' as const, label: 'اعلان‌ها', icon: Bell, description: 'قواعد اطلاع‌رسانی' },
    { id: 'channels' as const, label: 'کانال‌های ارتباطی', icon: Mail, description: 'ایمیل، پیامک و وب‌هوک' },
    { id: 'workflow' as const, label: 'گردش کار', icon: Workflow, description: 'رفتار پیش‌فرض فرایندها' }
  ];

  setTab(tab: SettingsTab): void { this.activeTab.set(tab); }
  save(): void {
    this.saving.set(true);
    setTimeout(() => { this.saving.set(false); this.toast.set('تنظیمات این بخش در نسخه نمایشی اعمال شد.'); setTimeout(() => this.toast.set(''), 2800); }, 350);
  }
  resetCurrent(): void {
    if (this.activeTab() === 'general') Object.assign(this.general, { organizationName: 'شرکت آشیان', displayName: 'Ashkan HelpDesk', supportEmail: 'support@ashian.example', supportPhone: '۰۲۱-۸۸۷۷۰۰۰۰', defaultLanguage: 'fa', defaultTheme: 'light', allowRegistration: false, enableGuestPortal: true, maintenanceMode: false });
    if (this.activeTab() === 'security') Object.assign(this.security, { minLength: 10, requireUppercase: true, requireNumber: true, requireSymbol: true, passwordExpiry: 90, sessionTimeout: 30, maxAttempts: 5, lockoutMinutes: 15, twoFactor: true, enforceSso: false, ipRestriction: false });
    this.toast.set('مقادیر پیش‌فرض این بخش بازیابی شد.'); setTimeout(() => this.toast.set(''), 2800);
  }
}
