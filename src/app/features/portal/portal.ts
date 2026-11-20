import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TicketStatus = 'در حال بررسی' | 'منتظر پاسخ شما' | 'حل‌شده';
interface PortalTicket { id: string; title: string; category: string; priority: string; status: TicketStatus; date: string; description: string; messages: { author: string; text: string; time: string; mine: boolean }[]; rating?: number; }

@Component({
  selector: 'ah-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal.html',
  styleUrl: './portal.scss'
})
export class PortalComponent {
  activeTab = 'درخواست‌های من';
  query = '';
  statusFilter = 'همه';
  showTicketForm = false;
  selectedTicket: PortalTicket | null = null;
  toast = '';
  attachmentName = '';
  replyText = '';
  profileEditing = false;
  profile = { name: 'سارا احمدی', email: 's.ahmadi@ashian.ir', phone: '۰۹۱۲۱۲۳۴۵۶۷', department: 'واحد مالی' };
  ticketDraft = { title: '', category: 'نرم‌افزار و سیستم‌ها', priority: 'متوسط', description: '' };
  serviceDraft = { service: 'درخواست دسترسی به سامانه', details: '' };
  readonly services = [
    { icon: '🔐', name: 'درخواست دسترسی به سامانه', desc: 'ایجاد یا تغییر سطح دسترسی به نرم‌افزارهای سازمانی', eta: '۱ روز کاری' },
    { icon: '💻', name: 'درخواست تجهیزات IT', desc: 'درخواست لپ‌تاپ، مانیتور و تجهیزات جانبی', eta: '۳ روز کاری' },
    { icon: '📧', name: 'ایمیل و حساب کاربری', desc: 'ایجاد، بازیابی یا رفع مشکل حساب سازمانی', eta: '۴ ساعت' },
    { icon: '🌐', name: 'شبکه و اینترنت', desc: 'گزارش قطعی، کندی یا درخواست اتصال شبکه', eta: '۲ ساعت' }
  ];
  readonly articles = [
    { title: 'راهنمای اتصال امن به شبکه سازمان', category: 'شبکه و امنیت', views: 1240, time: '۵ دقیقه مطالعه' },
    { title: 'بازیابی رمز عبور حساب کاربری', category: 'حساب کاربری', views: 980, time: '۳ دقیقه مطالعه' },
    { title: 'نصب و راه‌اندازی نرم‌افزارهای سازمانی', category: 'نرم‌افزار', views: 760, time: '۷ دقیقه مطالعه' }
  ];
  tickets: PortalTicket[] = [
    { id: 'HD-2481', title: 'عدم دسترسی به سامانه مالی', category: 'نرم‌افزار و سیستم‌ها', priority: 'زیاد', status: 'منتظر پاسخ شما', date: '۱۴۰۵/۰۸/۲۸', description: 'هنگام ورود به سامانه مالی پیام عدم مجوز نمایش داده می‌شود.', messages: [{ author: 'کارشناس پشتیبانی', text: 'لطفاً تصویر خطا و نام مرورگر خود را ارسال کنید.', time: 'امروز، ۱۰:۲۰', mine: false }] },
    { id: 'HD-2468', title: 'کندی اتصال شبکه در طبقه دوم', category: 'شبکه و اینترنت', priority: 'متوسط', status: 'در حال بررسی', date: '۱۴۰۵/۰۸/۲۶', description: 'اتصال شبکه در ساعات ابتدایی روز با کندی مواجه است.', messages: [{ author: 'کارشناس پشتیبانی', text: 'موضوع به تیم شبکه ارجاع شد.', time: 'دیروز، ۱۵:۱۰', mine: false }] },
    { id: 'HD-2394', title: 'نصب نرم‌افزار حسابداری', category: 'نرم‌افزار و سیستم‌ها', priority: 'عادی', status: 'حل‌شده', date: '۱۴۰۵/۰۸/۱۹', description: 'نصب نسخه جدید نرم‌افزار حسابداری روی سیستم.', messages: [{ author: 'کارشناس پشتیبانی', text: 'نصب با موفقیت انجام شد.', time: '۱۴۰۵/۰۸/۱۹، ۱۲:۳۰', mine: false }] }
  ];
  get filteredTickets(): PortalTicket[] {
    return this.tickets.filter(t => (this.statusFilter === 'همه' || t.status === this.statusFilter) && `${t.id} ${t.title} ${t.category}`.toLowerCase().includes(this.query.toLowerCase()));
  }
  get openCount(): number { return this.tickets.filter(t => t.status !== 'حل‌شده').length; }
  get waitingCount(): number { return this.tickets.filter(t => t.status === 'منتظر پاسخ شما').length; }
  notify(message: string): void { this.toast = message; setTimeout(() => this.toast = '', 2800); }
  createTicket(): void {
    if (!this.ticketDraft.title.trim() || !this.ticketDraft.description.trim()) { this.notify('عنوان و شرح درخواست را تکمیل کنید.'); return; }
    const ticket: PortalTicket = { id: `HD-${2500 + this.tickets.length}`, title: this.ticketDraft.title, category: this.ticketDraft.category, priority: this.ticketDraft.priority, status: 'در حال بررسی', date: 'امروز', description: this.ticketDraft.description, messages: [] };
    this.tickets.unshift(ticket); this.ticketDraft = { title: '', category: 'نرم‌افزار و سیستم‌ها', priority: 'متوسط', description: '' }; this.showTicketForm = false; this.activeTab = 'درخواست‌های من'; this.notify('درخواست شما با موفقیت ثبت شد.');
  }
  openTicket(ticket: PortalTicket): void { this.selectedTicket = ticket; this.replyText = ''; }
  sendReply(): void {
    if (!this.selectedTicket || !this.replyText.trim()) return;
    this.selectedTicket.messages.push({ author: this.profile.name, text: this.replyText.trim() + (this.attachmentName ? ` (پیوست: ${this.attachmentName})` : ''), time: 'هم‌اکنون', mine: true });
    if (this.selectedTicket.status === 'منتظر پاسخ شما') this.selectedTicket.status = 'در حال بررسی';
    this.replyText = ''; this.attachmentName = ''; this.notify('پاسخ شما ثبت شد.');
  }
  onAttachment(event: Event): void { const file = (event.target as HTMLInputElement).files?.[0]; this.attachmentName = file?.name ?? ''; }
  submitService(): void { if (!this.serviceDraft.details.trim()) { this.notify('لطفاً جزئیات درخواست را وارد کنید.'); return; } this.notify(`درخواست «${this.serviceDraft.service}» ثبت شد.`); this.serviceDraft.details = ''; this.activeTab = 'درخواست‌های من'; }
  rateTicket(ticket: PortalTicket, rating: number): void { ticket.rating = rating; this.notify('از ثبت بازخورد شما سپاسگزاریم.'); }
  saveProfile(): void { this.profileEditing = false; this.notify('اطلاعات پروفایل ذخیره شد.'); }
}
