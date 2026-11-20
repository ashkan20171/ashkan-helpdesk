import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChartNoAxesCombined, Download, FileSpreadsheet, CalendarClock, Users, Ticket, ShieldCheck, Clock3, Star, Filter, RefreshCw, Plus, Pause, Play, X, TrendingUp, BarChart3 } from 'lucide-angular';

type ReportKind = 'overview' | 'tickets' | 'sla' | 'agents' | 'satisfaction' | 'categories';
type ScheduleFrequency = 'روزانه' | 'هفتگی' | 'ماهانه';
interface ReportRow { label: string; value: number; previous: number; }
interface Schedule { id: number; name: string; report: string; frequency: ScheduleFrequency; recipient: string; active: boolean; nextRun: string; }

@Component({
  selector: 'ah-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent {
  readonly ChartNoAxesCombined = ChartNoAxesCombined;
  readonly Download = Download;
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly CalendarClock = CalendarClock;
  readonly Users = Users;
  readonly Ticket = Ticket;
  readonly ShieldCheck = ShieldCheck;
  readonly Clock3 = Clock3;
  readonly Star = Star;
  readonly Filter = Filter;
  readonly RefreshCw = RefreshCw;
  readonly Plus = Plus;
  readonly Pause = Pause;
  readonly Play = Play;
  readonly X = X;
  readonly TrendingUp = TrendingUp;
  readonly BarChart3 = BarChart3;

  readonly reportKind = signal<ReportKind>('overview');
  readonly dateRange = signal('30');
  readonly teamFilter = signal('همه تیم‌ها');
  readonly priorityFilter = signal('همه اولویت‌ها');
  readonly statusFilter = signal('همه وضعیت‌ها');
  readonly search = signal('');
  readonly scheduleDialog = signal(false);
  readonly toast = signal('');
  readonly schedules = signal<Schedule[]>([
    { id: 1, name: 'گزارش هفتگی عملیات', report: 'عملکرد تیم‌ها', frequency: 'هفتگی', recipient: 'ops@ashkan.local', active: true, nextRun: 'شنبه ۰۹:۰۰' },
    { id: 2, name: 'پایش ماهانه SLA', report: 'تحلیل SLA', frequency: 'ماهانه', recipient: 'service@ashkan.local', active: true, nextRun: 'اول ماه ۰۸:۳۰' },
    { id: 3, name: 'رضایت مشتریان', report: 'تحلیل رضایت', frequency: 'هفتگی', recipient: 'cx@ashkan.local', active: false, nextRun: '—' }
  ]);
  readonly scheduleForm = { name: '', report: 'نمای کلی تیکت‌ها', frequency: 'هفتگی' as ScheduleFrequency, recipient: '' };

  readonly kpis = [
    { label: 'کل تیکت‌ها', value: '۲٬۴۸۶', change: '+۱۲.۴٪', positive: true, icon: Ticket, tone: 'blue' },
    { label: 'حل‌شده‌ها', value: '۲٬۱۱۴', change: '+۸.۲٪', positive: true, icon: ShieldCheck, tone: 'green' },
    { label: 'رعایت SLA', value: '۹۴.۶٪', change: '+۲.۱٪', positive: true, icon: Clock3, tone: 'teal' },
    { label: 'رضایت کاربران', value: '۴.۷ از ۵', change: '+۰.۳', positive: true, icon: Star, tone: 'amber' }
  ];

  readonly trend = [
    { day: '۱', opened: 42, resolved: 36 }, { day: '۳', opened: 55, resolved: 48 },
    { day: '۵', opened: 48, resolved: 51 }, { day: '۷', opened: 68, resolved: 58 },
    { day: '۹', opened: 61, resolved: 56 }, { day: '۱۱', opened: 74, resolved: 69 },
    { day: '۱۳', opened: 59, resolved: 63 }, { day: '۱۵', opened: 82, resolved: 72 },
    { day: '۱۷', opened: 70, resolved: 66 }, { day: '۱۹', opened: 91, resolved: 78 },
    { day: '۲۱', opened: 77, resolved: 81 }, { day: '۲۳', opened: 86, resolved: 75 }
  ];

  readonly teams = [
    { name: 'پشتیبانی فنی', tickets: 684, resolved: 642, sla: 97, satisfaction: 4.8 },
    { name: 'زیرساخت', tickets: 512, resolved: 473, sla: 95, satisfaction: 4.7 },
    { name: 'نرم‌افزار', tickets: 438, resolved: 389, sla: 91, satisfaction: 4.6 },
    { name: 'خدمات کاربران', tickets: 396, resolved: 352, sla: 94, satisfaction: 4.5 }
  ];

  readonly categories = [
    { name: 'دسترسی و حساب کاربری', count: 612, percent: 88, color: 'indigo' },
    { name: 'سخت‌افزار و تجهیزات', count: 488, percent: 70, color: 'teal' },
    { name: 'شبکه و ارتباطات', count: 421, percent: 60, color: 'amber' },
    { name: 'نرم‌افزارهای سازمانی', count: 365, percent: 52, color: 'purple' },
    { name: 'سایر موارد', count: 240, percent: 34, color: 'slate' }
  ];

  readonly agents = [
    { name: 'نگار احمدی', team: 'پشتیبانی فنی', assigned: 128, resolved: 121, firstResponse: '۱۸ دقیقه', score: 98 },
    { name: 'علی کریمی', team: 'زیرساخت', assigned: 116, resolved: 108, firstResponse: '۲۲ دقیقه', score: 95 },
    { name: 'سارا محمدی', team: 'نرم‌افزار', assigned: 104, resolved: 96, firstResponse: '۲۶ دقیقه', score: 92 },
    { name: 'رضا مرادی', team: 'خدمات کاربران', assigned: 98, resolved: 87, firstResponse: '۳۱ دقیقه', score: 89 }
  ];

  readonly filteredTeams = computed(() => this.teams.filter(t =>
    (this.teamFilter() === 'همه تیم‌ها' || t.name === this.teamFilter()) &&
    (!this.search() || t.name.toLocaleLowerCase('fa').includes(this.search().trim().toLocaleLowerCase('fa')))
  ));
  readonly filteredAgents = computed(() => this.agents.filter(a =>
    (this.teamFilter() === 'همه تیم‌ها' || a.team === this.teamFilter()) &&
    (!this.search() || `${a.name} ${a.team}`.toLocaleLowerCase('fa').includes(this.search().trim().toLocaleLowerCase('fa')))
  ));
  readonly maxTrend = Math.max(...this.trend.map(x => Math.max(x.opened, x.resolved)));
  readonly reportTitle = computed(() => ({
    overview: 'نمای کلی عملکرد', tickets: 'تحلیل حجم تیکت‌ها', sla: 'تحلیل تعهدات SLA',
    agents: 'عملکرد کارشناسان و تیم‌ها', satisfaction: 'تحلیل رضایت کاربران', categories: 'توزیع موضوعی درخواست‌ها'
  }[this.reportKind()]));

  selectReport(kind: ReportKind): void { this.reportKind.set(kind); }
  barHeight(value: number): string { return `${Math.max(5, Math.round(value / this.maxTrend * 100))}%`; }
  exportCsv(): void {
    const rows = this.reportKind() === 'agents'
      ? [['کارشناس', 'تیم', 'تیکت تخصیص‌یافته', 'حل‌شده', 'میانگین پاسخ', 'امتیاز'], ...this.filteredAgents().map(a => [a.name, a.team, a.assigned, a.resolved, a.firstResponse, a.score])]
      : [['تیم', 'تیکت‌ها', 'حل‌شده', 'رعایت SLA', 'رضایت'], ...this.filteredTeams().map(t => [t.name, t.tickets, t.resolved, `${t.sla}%`, t.satisfaction])];
    const csv = '\uFEFF' + rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `ashkan-report-${this.reportKind()}.csv`; a.click(); URL.revokeObjectURL(url);
    this.notify('خروجی CSV گزارش آماده شد.');
  }
  openSchedule(): void { this.scheduleForm.name = ''; this.scheduleForm.report = 'نمای کلی تیکت‌ها'; this.scheduleForm.frequency = 'هفتگی'; this.scheduleForm.recipient = ''; this.scheduleDialog.set(true); }
  saveSchedule(): void {
    const f = this.scheduleForm;
    if (!f.name.trim() || !f.recipient.trim() || !f.recipient.includes('@')) { this.notify('نام گزارش و ایمیل معتبر گیرنده الزامی است.'); return; }
    this.schedules.update(items => [{ id: Math.max(0, ...items.map(x => x.id)) + 1, name: f.name.trim(), report: f.report, frequency: f.frequency, recipient: f.recipient.trim(), active: true, nextRun: f.frequency === 'روزانه' ? 'فردا ۰۸:۰۰' : f.frequency === 'هفتگی' ? 'شنبه ۰۹:۰۰' : 'اول ماه ۰۸:۳۰' }, ...items]);
    this.scheduleDialog.set(false); this.notify('برنامه گزارش‌گیری ثبت شد.');
  }
  toggleSchedule(item: Schedule): void { this.schedules.update(items => items.map(x => x.id === item.id ? { ...x, active: !x.active } : x)); }
  removeSchedule(item: Schedule): void { this.schedules.update(items => items.filter(x => x.id !== item.id)); this.notify('برنامه گزارش حذف شد.'); }
  resetFilters(): void { this.dateRange.set('30'); this.teamFilter.set('همه تیم‌ها'); this.priorityFilter.set('همه اولویت‌ها'); this.statusFilter.set('همه وضعیت‌ها'); this.search.set(''); }
  private notify(message: string): void { this.toast.set(message); setTimeout(() => this.toast.set(''), 2800); }
}
