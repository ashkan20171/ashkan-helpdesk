import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Activity, Search, Download, ShieldCheck, UserRound, Ticket, Settings, FileText, Clock3, Eye, X, Filter, LogIn, Pencil, Trash2, LockKeyhole, RefreshCw } from 'lucide-angular';

type EventType = 'ticket' | 'user' | 'security' | 'settings' | 'document' | 'workflow';
type Severity = 'info' | 'warning' | 'critical' | 'success';
interface AuditEvent {
  id: number; event: string; description: string; actor: string; role: string; target: string;
  type: EventType; severity: Severity; ip: string; time: string; date: string; changes?: { field: string; before: string; after: string }[];
}
@Component({
  selector: 'ah-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.scss'
})
export class AuditLogComponent {
  readonly Activity = Activity; readonly Search = Search; readonly Download = Download; readonly ShieldCheck = ShieldCheck;
  readonly UserRound = UserRound; readonly Ticket = Ticket; readonly Settings = Settings; readonly FileText = FileText;
  readonly Clock3 = Clock3; readonly Eye = Eye; readonly X = X; readonly Filter = Filter; readonly LogIn = LogIn;
  readonly Pencil = Pencil; readonly Trash2 = Trash2; readonly LockKeyhole = LockKeyhole; readonly RefreshCw = RefreshCw;

  readonly query = signal('');
  readonly typeFilter = signal('all');
  readonly severityFilter = signal('all');
  readonly actorFilter = signal('all');
  readonly dateFilter = signal('30');
  readonly selected = signal<AuditEvent | null>(null);
  readonly toast = signal('');
  readonly events = signal<AuditEvent[]>([
    { id: 10248, event: 'تغییر وضعیت تیکت', description: 'وضعیت درخواست از «در حال بررسی» به «حل‌شده» تغییر کرد.', actor: 'نگار احمدی', role: 'کارشناس پشتیبانی', target: 'TKT-2481 · اختلال در دسترسی VPN', type: 'ticket', severity: 'success', ip: '192.168.10.24', time: '۱۴:۳۲:۱۸', date: '۱۴۰۵/۰۸/۲۹', changes: [{field:'وضعیت',before:'در حال بررسی',after:'حل‌شده'},{field:'کارشناس مسئول',before:'علی کریمی',after:'نگار احمدی'}] },
    { id: 10247, event: 'ورود موفق به سامانه', description: 'ورود کاربر با روش احراز هویت دومرحله‌ای انجام شد.', actor: 'محمد رضایی', role: 'مدیر سامانه', target: 'نشست کاربری · مرورگر Chrome', type: 'security', severity: 'info', ip: '192.168.10.11', time: '۱۴:۲۸:۰۵', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10246, event: 'ویرایش اطلاعات کاربر', description: 'اطلاعات تماس و واحد سازمانی کاربر به‌روزرسانی شد.', actor: 'محمد رضایی', role: 'مدیر سامانه', target: 'USR-0082 · سارا محمدی', type: 'user', severity: 'warning', ip: '192.168.10.11', time: '۱۳:۵۶:۴۲', date: '۱۴۰۵/۰۸/۲۹', changes: [{field:'واحد سازمانی',before:'عملیات',after:'فناوری اطلاعات'},{field:'شماره تماس',before:'۰۹۱۲۱۲۳۴۵۶۷',after:'۰۹۱۲۱۲۳۴۵۸۸'}] },
    { id: 10245, event: 'تغییر سیاست امنیتی', description: 'الزام احراز هویت دومرحله‌ای برای مدیران فعال شد.', actor: 'محمد رضایی', role: 'مدیر سامانه', target: 'تنظیمات امنیت · MFA', type: 'settings', severity: 'critical', ip: '192.168.10.11', time: '۱۳:۴۰:۱۹', date: '۱۴۰۵/۰۸/۲۹', changes: [{field:'احراز هویت دومرحله‌ای',before:'غیرفعال',after:'فعال'}] },
    { id: 10244, event: 'بارگذاری نسخه جدید سند', description: 'نسخه جدید دستورالعمل پشتیبانی در مخزن اسناد ثبت شد.', actor: 'علی کریمی', role: 'کارشناس زیرساخت', target: 'DOC-0145 · دستورالعمل VPN', type: 'document', severity: 'success', ip: '192.168.10.36', time: '۱۲:۱۷:۵۳', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10243, event: 'تخصیص خودکار درخواست', description: 'درخواست بر اساس مهارت به تیم پشتیبانی فنی ارجاع شد.', actor: 'موتور گردش کار', role: 'سرویس سیستمی', target: 'TKT-2479 · نصب نرم‌افزار', type: 'workflow', severity: 'info', ip: '10.0.0.5', time: '۱۱:۴۸:۲۱', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10242, event: 'تلاش ناموفق ورود', description: 'رمز عبور واردشده معتبر نبود؛ تلاش پنجم ثبت شد.', actor: 'کاربر ناشناس', role: 'نامشخص', target: 'حساب کاربری · m.rahimi', type: 'security', severity: 'critical', ip: '185.12.44.91', time: '۱۱:۲۲:۰۹', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10241, event: 'حذف عضو از تیم', description: 'عضویت کاربر از تیم خدمات کاربران حذف شد.', actor: 'محمد رضایی', role: 'مدیر سامانه', target: 'USR-0104 · رضا مرادی', type: 'user', severity: 'warning', ip: '192.168.10.11', time: '۱۰:۵۱:۳۷', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10240, event: 'تغییر اولویت تیکت', description: 'اولویت درخواست از «متوسط» به «بحرانی» تغییر یافت.', actor: 'سارا محمدی', role: 'کارشناس نرم‌افزار', target: 'TKT-2476 · قطعی سرویس مالی', type: 'ticket', severity: 'warning', ip: '192.168.10.42', time: '۱۰:۲۳:۱۴', date: '۱۴۰۵/۰۸/۲۹', changes: [{field:'اولویت',before:'متوسط',after:'بحرانی'}] },
    { id: 10239, event: 'تغییر گردش کار', description: 'شرط ارجاع خودکار در فرایند رسیدگی ویرایش شد.', actor: 'محمد رضایی', role: 'مدیر سامانه', target: 'WF-0008 · رسیدگی به رخداد', type: 'workflow', severity: 'info', ip: '192.168.10.11', time: '۰۹:۴۰:۰۲', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10238, event: 'خروج از سامانه', description: 'نشست کاربری به‌صورت عادی خاتمه یافت.', actor: 'نگار احمدی', role: 'کارشناس پشتیبانی', target: 'نشست کاربری · Chrome', type: 'security', severity: 'info', ip: '192.168.10.24', time: '۰۹:۱۵:۴۴', date: '۱۴۰۵/۰۸/۲۹' },
    { id: 10237, event: 'ویرایش تنظیمات اعلان', description: 'ارسال خلاصه روزانه ایمیل برای مدیران فعال شد.', actor: 'محمد رضایی', role: 'مدیر سامانه', target: 'تنظیمات اعلان‌ها · خلاصه روزانه', type: 'settings', severity: 'success', ip: '192.168.10.11', time: '۰۸:۵۷:۳۱', date: '۱۴۰۵/۰۸/۲۹' }
  ]);

  readonly filteredEvents = computed(() => this.events().filter(e => {
    const q = this.query().trim().toLocaleLowerCase('fa');
    const matchesText = !q || `${e.event} ${e.description} ${e.actor} ${e.target} ${e.ip} ${e.id}`.toLocaleLowerCase('fa').includes(q);
    return matchesText && (this.typeFilter()==='all' || e.type===this.typeFilter()) &&
      (this.severityFilter()==='all' || e.severity===this.severityFilter()) &&
      (this.actorFilter()==='all' || e.actor===this.actorFilter());
  }));
  readonly stats = computed(() => ({
    total: this.events().length,
    critical: this.events().filter(e=>e.severity==='critical').length,
    security: this.events().filter(e=>e.type==='security').length,
    actors: new Set(this.events().map(e=>e.actor)).size
  }));

  typeLabel(type: EventType): string { return ({ticket:'تیکت',user:'کاربر',security:'امنیت',settings:'تنظیمات',document:'اسناد',workflow:'گردش کار'})[type]; }
  severityLabel(severity: Severity): string { return ({info:'اطلاعاتی',warning:'هشدار',critical:'بحرانی',success:'موفق'})[severity]; }
  typeIcon(type: EventType): any { return ({ticket:this.Ticket,user:this.UserRound,security:this.LockKeyhole,settings:this.Settings,document:this.FileText,workflow:this.Activity})[type]; }
  openDetail(item: AuditEvent): void { this.selected.set(item); }
  closeDetail(): void { this.selected.set(null); }
  resetFilters(): void { this.query.set(''); this.typeFilter.set('all'); this.severityFilter.set('all'); this.actorFilter.set('all'); this.dateFilter.set('30'); }
  exportCsv(): void {
    const rows = [['شناسه','رویداد','شرح','عامل','نقش','هدف','نوع','شدت','IP','تاریخ','ساعت'], ...this.filteredEvents().map(e=>[e.id,e.event,e.description,e.actor,e.role,e.target,this.typeLabel(e.type),this.severityLabel(e.severity),e.ip,e.date,e.time])];
    const csv = '\uFEFF' + rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='ashkan-audit-log.csv'; a.click(); URL.revokeObjectURL(url);
    this.notify('خروجی رویدادهای فیلترشده آماده شد.');
  }
  private notify(message: string): void { this.toast.set(message); setTimeout(()=>this.toast.set(''),2600); }
}
