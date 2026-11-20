import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Archive, Bell, BellRing, Check, CheckCheck, Clock3, FileText, Filter, Info, Mail, Edit3, MessageSquare, Plus, Search, Settings2, ShieldAlert, Ticket, Trash2, UserRound, Send, Users, X, Zap } from 'lucide-angular';

type NotificationKind = 'ticket' | 'approval' | 'system' | 'mention' | 'security';
type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
type NotificationTab = 'inbox' | 'templates' | 'preferences' | 'channels' | 'rules';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  kind: NotificationKind;
  priority: NotificationPriority;
  date: string;
  time: string;
  read: boolean;
  archived: boolean;
  sender: string;
  reference: string;
}

interface NotificationTemplate {
  id: number;
  name: string;
  channel: string;
  subject: string;
  body: string;
  active: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class NotificationsComponent {
  readonly icons = {
    archive: Archive, edit: Edit3, bell: Bell, bellRing: BellRing, check: Check, checkAll: CheckCheck,
    clock: Clock3, file: FileText, filter: Filter, info: Info, mail: Mail,
    message: MessageSquare, plus: Plus, search: Search, settings: Settings2,
    security: ShieldAlert, ticket: Ticket, trash: Trash2, user: UserRound,
    users: Users, x: X, zap: Zap, send: Send
  };

  activeTab: NotificationTab = 'inbox';
  showComposer = false;
  composer = { channel: 'درون‌برنامه‌ای', recipient: '', subject: '', message: '' };
  rules = [
    { id: 1, name: 'هشدار SLA نزدیک به نقض', event: 'SLA کمتر از ۳۰ دقیقه', channels: 'درون‌برنامه‌ای + ایمیل', audience: 'کارشناس مسئول', active: true },
    { id: 2, name: 'تیکت فوری جدید', event: 'اولویت فوری', channels: 'درون‌برنامه‌ای + پیامک', audience: 'سرپرست شیفت', active: true },
    { id: 3, name: 'گزارش روزانه مدیران', event: 'هر روز ساعت ۸:۰۰', channels: 'ایمیل', audience: 'مدیران', active: false }
  ];
  channels = [
    { name: 'درون‌برنامه‌ای', status: 'متصل', detail: 'تحویل فوری در مرکز اعلان', health: '99.9%', enabled: true },
    { name: 'Email', status: 'متصل', detail: 'SMTP سازمانی', health: '99.7%', enabled: true },
    { name: 'SMS', status: 'آماده اتصال', detail: 'ارائه‌دهنده پیامک هنوز تنظیم نشده', health: '—', enabled: false },
    { name: 'WhatsApp', status: 'آماده اتصال', detail: 'Business API در انتظار پیکربندی', health: '—', enabled: false }
  ];
  query = '';
  kindFilter = 'all';
  readFilter = 'all';
  selected: NotificationItem | null = null;
  showTemplateModal = false;
  editingTemplate = false;
  templateForm: Partial<NotificationTemplate> = this.emptyTemplate();

  notifications: NotificationItem[] = [
    { id: 1, title: 'تیکت جدید به شما ارجاع شد', message: 'تیکت HD-10528 با موضوع «اختلال در سرویس گزارش‌گیری» به شما واگذار شد.', kind: 'ticket', priority: 'high', date: '1405/09/12', time: '۱۰:۴۲', read: false, archived: false, sender: 'سیستم تیکتینگ', reference: 'HD-10528' },
    { id: 2, title: 'درخواست مرخصی نیازمند تأیید است', message: 'درخواست مرخصی مریم رضایی برای تاریخ ۱۴۰۵/۰۹/۱۸ در انتظار بررسی شماست.', kind: 'approval', priority: 'normal', date: '1405/09/12', time: '۰۹:۱۸', read: false, archived: false, sender: 'منابع انسانی', reference: 'LEAVE-208' },
    { id: 3, title: 'در تیکت به شما اشاره شده است', message: 'رضا کریمی در گفتگو تیکت HD-10498 شما را mention کرده است.', kind: 'mention', priority: 'normal', date: '1405/09/11', time: '۱۶:۳۵', read: false, archived: false, sender: 'رضا کریمی', reference: 'HD-10498' },
    { id: 4, title: 'پشتیبان‌گیری با موفقیت انجام شد', message: 'نسخه پشتیبان پایگاه داده در ساعت ۰۲:۰۰ با موفقیت ایجاد شد.', kind: 'system', priority: 'low', date: '1405/09/11', time: '۰۲:۰۵', read: true, archived: false, sender: 'مانیتورینگ سیستم', reference: 'BACKUP-0911' },
    { id: 5, title: 'هشدار ورود غیرمعمول', message: 'ورود جدیدی از یک دستگاه ثبت‌نشده شناسایی شد. در صورت عدم شناسایی، رمز عبور خود را تغییر دهید.', kind: 'security', priority: 'urgent', date: '1405/09/10', time: '۲۱:۱۴', read: true, archived: false, sender: 'مرکز امنیت', reference: 'SEC-771' },
    { id: 6, title: 'SLA یک درخواست نزدیک به پایان است', message: 'زمان پاسخ‌گویی تیکت HD-10473 کمتر از ۳۰ دقیقه باقی مانده است.', kind: 'ticket', priority: 'urgent', date: '1405/09/10', time: '۱۴:۲۲', read: true, archived: false, sender: 'موتور SLA', reference: 'HD-10473' },
    { id: 7, title: 'گزارش ماهانه آماده شد', message: 'گزارش عملکرد تیم پشتیبانی برای دوره آبان آماده دریافت است.', kind: 'system', priority: 'low', date: '1405/09/09', time: '۱۱:۰۲', read: true, archived: true, sender: 'گزارش‌ساز', reference: 'RPT-1405-08' }
  ];

  templates: NotificationTemplate[] = [
    { id: 1, name: 'ارجاع تیکت', channel: 'درون‌برنامه‌ای و ایمیل', subject: 'تیکت جدید به شما ارجاع شد', body: 'تیکت {{ticket.number}} با موضوع {{ticket.subject}} به شما واگذار شد.', active: true },
    { id: 2, name: 'نزدیک‌شدن به نقض SLA', channel: 'درون‌برنامه‌ای', subject: 'هشدار SLA', body: 'زمان پاسخ‌گویی تیکت {{ticket.number}} رو به پایان است.', active: true },
    { id: 3, name: 'تأیید درخواست', channel: 'ایمیل', subject: 'درخواست شما تأیید شد', body: 'درخواست {{request.number}} تأیید شده است.', active: false }
  ];

  preferences = [
    { key: 'ticket', label: 'رویدادهای تیکت', description: 'ارجاع، پاسخ جدید، تغییر وضعیت و SLA', inApp: true, email: true },
    { key: 'approval', label: 'درخواست‌های تأیید', description: 'مرخصی، خرید و گردش‌های کاری', inApp: true, email: true },
    { key: 'mention', label: 'اشاره و پیام مستقیم', description: 'وقتی کاربری شما را در گفتگو خطاب می‌کند', inApp: true, email: false },
    { key: 'system', label: 'اطلاعیه‌های سیستمی', description: 'گزارش‌ها، نگهداری و عملیات سامانه', inApp: true, email: false },
    { key: 'security', label: 'هشدارهای امنیتی', description: 'ورودهای غیرمعمول و رخدادهای امنیتی', inApp: true, email: true }
  ];

  get visibleNotifications(): NotificationItem[] {
    const q = this.query.trim().toLowerCase();
    return this.notifications.filter(n => {
      const textMatch = !q || [n.title, n.message, n.sender, n.reference].join(' ').toLowerCase().includes(q);
      const kindMatch = this.kindFilter === 'all' || n.kind === this.kindFilter;
      const readMatch = this.readFilter === 'all'
        || (this.readFilter === 'unread' && !n.read)
        || (this.readFilter === 'read' && n.read);
      return textMatch && kindMatch && readMatch && (this.activeTab !== 'inbox' || !n.archived);
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read && !n.archived).length;
  }

  get archivedCount(): number {
    return this.notifications.filter(n => n.archived).length;
  }

  get todayCount(): number {
    return this.notifications.filter(n => n.date === '1405/09/12' && !n.archived).length;
  }

  setTab(tab: NotificationTab) {
    this.activeTab = tab;
    this.selected = null;
  }

  openNotification(item: NotificationItem) {
    this.selected = item;
    item.read = true;
  }

  markRead(item: NotificationItem) {
    item.read = true;
  }

  markUnread(item: NotificationItem) {
    item.read = false;
  }

  markAllRead() {
    this.notifications.filter(n => !n.archived).forEach(n => n.read = true);
  }

  archive(item: NotificationItem) {
    item.archived = true;
    if (this.selected?.id === item.id) this.selected = null;
  }

  restore(item: NotificationItem) {
    item.archived = false;
  }

  delete(item: NotificationItem) {
    this.notifications = this.notifications.filter(n => n.id !== item.id);
    if (this.selected?.id === item.id) this.selected = null;
  }

  kindLabel(kind: NotificationKind): string {
    return ({ ticket: 'تیکت', approval: 'تأیید', system: 'سیستم', mention: 'اشاره', security: 'امنیت' } as Record<NotificationKind, string>)[kind];
  }

  priorityLabel(priority: NotificationPriority): string {
    return ({ low: 'کم', normal: 'عادی', high: 'زیاد', urgent: 'فوری' } as Record<NotificationPriority, string>)[priority];
  }

  priorityClass(priority: NotificationPriority): string {
    return `priority-${priority}`;
  }

  kindClass(kind: NotificationKind): string {
    return `kind-${kind}`;
  }

  iconFor(kind: NotificationKind) {
    return ({ ticket: this.icons.ticket, approval: this.icons.file, system: this.icons.info, mention: this.icons.message, security: this.icons.security })[kind];
  }

  openComposer() {
    this.composer = { channel: 'درون‌برنامه‌ای', recipient: '', subject: '', message: '' };
    this.showComposer = true;
  }

  sendMessage() {
    if (!this.composer.recipient.trim() || !this.composer.message.trim()) return;
    this.notifications.unshift({
      id: Math.max(...this.notifications.map(n => n.id), 0) + 1,
      title: this.composer.subject.trim() || 'پیام جدید',
      message: this.composer.message.trim(),
      kind: 'system',
      priority: 'normal',
      date: '1405/09/12',
      time: 'اکنون',
      read: false,
      archived: false,
      sender: 'مرکز ارتباطات',
      reference: `MSG-${Date.now().toString().slice(-5)}`
    });
    this.showComposer = false;
  }

  toggleRule(rule: { active: boolean }) {
    rule.active = !rule.active;
  }

  openCreateTemplate() {
    this.editingTemplate = false;
    this.templateForm = this.emptyTemplate();
    this.showTemplateModal = true;
  }

  openEditTemplate(template: NotificationTemplate) {
    this.editingTemplate = true;
    this.templateForm = { ...template };
    this.showTemplateModal = true;
  }

  saveTemplate() {
    const name = (this.templateForm.name || '').trim();
    if (!name) return;
    if (this.editingTemplate && this.templateForm.id) {
      const index = this.templates.findIndex(t => t.id === this.templateForm.id);
      if (index >= 0) this.templates[index] = { ...this.templates[index], ...this.templateForm } as NotificationTemplate;
    } else {
      this.templates = [{
        id: Math.max(...this.templates.map(t => t.id), 0) + 1,
        name,
        channel: this.templateForm.channel || 'درون‌برنامه‌ای',
        subject: this.templateForm.subject || '',
        body: this.templateForm.body || '',
        active: true
      }, ...this.templates];
    }
    this.showTemplateModal = false;
  }

  toggleTemplate(template: NotificationTemplate) {
    template.active = !template.active;
  }

  private emptyTemplate(): Partial<NotificationTemplate> {
    return { name: '', channel: 'درون‌برنامه‌ای', subject: '', body: '', active: true };
  }
}
