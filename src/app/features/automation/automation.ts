import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type RuleStatus = 'فعال' | 'متوقف';
type RunStatus = 'موفق' | 'ناموفق' | 'در حال اجرا';

interface RuleCondition { field: string; operator: string; value: string; }
interface AutomationRule {
  id: number; name: string; description: string; trigger: string; logic: 'AND' | 'OR';
  conditions: RuleCondition[]; actions: string[]; status: RuleStatus; version: number;
  runs: number; lastRun: string; category: string;
}
interface Execution {
  id: number; rule: string; trigger: string; target: string; status: RunStatus;
  time: string; duration: number; message: string;
}
interface ScheduledJob {
  id: number; name: string; schedule: string; nextRun: string; status: 'فعال' | 'متوقف';
}

@Component({
  selector: 'ah-automation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './automation.html',
  styleUrl: './automation.scss'
})
export class AutomationComponent {
  activeTab: 'rules' | 'history' | 'schedules' | 'templates' = 'rules';
  search = '';
  statusFilter = 'همه';
  runFilter = 'همه';
  showEditor = false;
  showRunDetail = false;
  editingId: number | null = null;
  selectedRun: Execution | null = null;
  notice = '';
  ruleForm: AutomationRule = this.emptyRule();

  rules: AutomationRule[] = [
    { id: 1, name: 'تخصیص هوشمند تیکت‌های مالی', description: 'ارسال تیکت‌های مالی به تیم تخصصی حسابداری', trigger: 'ایجاد تیکت', logic: 'AND', conditions: [{ field: 'دسته‌بندی', operator: 'برابر با', value: 'مالی' }, { field: 'اولویت', operator: 'یکی از', value: 'زیاد، فوری' }], actions: ['تخصیص به تیم مالی', 'افزودن برچسب: finance'], status: 'فعال', version: 3, runs: 128, lastRun: 'امروز، ۱۴:۳۲', category: 'تخصیص' },
    { id: 2, name: 'هشدار نزدیک‌شدن به SLA', description: 'اطلاع‌رسانی پیش از نقض زمان تعهد', trigger: 'زمان‌بندی‌شده', logic: 'AND', conditions: [{ field: 'زمان باقی‌مانده SLA', operator: 'کمتر از', value: '۳۰ دقیقه' }, { field: 'وضعیت', operator: 'برابر با', value: 'باز' }], actions: ['ارسال اعلان به مسئول', 'افزایش سطح اهمیت'], status: 'فعال', version: 2, runs: 86, lastRun: 'امروز، ۱۳:۵۰', category: 'SLA' },
    { id: 3, name: 'بستن خودکار درخواست‌های تأییدشده', description: 'تغییر وضعیت پس از تأیید نهایی کاربر', trigger: 'تغییر وضعیت تیکت', logic: 'OR', conditions: [{ field: 'آخرین پاسخ', operator: 'برابر با', value: 'تأیید شد' }], actions: ['تغییر وضعیت به بسته‌شده', 'ارسال اعلان پایان کار'], status: 'متوقف', version: 1, runs: 42, lastRun: 'دیروز، ۱۷:۲۰', category: 'چرخه عمر' },
    { id: 4, name: 'اطلاع‌رسانی تیکت‌های فوری', description: 'ارسال اعلان به سرپرست در زمان ثبت تیکت فوری', trigger: 'ایجاد تیکت', logic: 'AND', conditions: [{ field: 'اولویت', operator: 'برابر با', value: 'فوری' }], actions: ['ارسال اعلان به سرپرست', 'افزودن برچسب: urgent'], status: 'فعال', version: 1, runs: 64, lastRun: 'امروز، ۱۱:۰۸', category: 'اعلان' }
  ];

  executions: Execution[] = [
    { id: 9001, rule: 'تخصیص هوشمند تیکت‌های مالی', trigger: 'ایجاد تیکت', target: 'HD-2048', status: 'موفق', time: 'امروز، ۱۴:۳۲:۱۸', duration: 124, message: 'تیکت به تیم مالی تخصیص یافت و برچسب finance ثبت شد.' },
    { id: 9002, rule: 'هشدار نزدیک‌شدن به SLA', trigger: 'زمان‌بندی‌شده', target: 'HD-2039', status: 'موفق', time: 'امروز، ۱۳:۵۰:۰۲', duration: 89, message: 'اعلان SLA برای مسئول تیکت ارسال شد.' },
    { id: 9003, rule: 'اطلاع‌رسانی تیکت‌های فوری', trigger: 'ایجاد تیکت', target: 'HD-2037', status: 'ناموفق', time: 'امروز، ۱۲:۱۱:۴۵', duration: 310, message: 'ارسال اعلان انجام نشد؛ کانال پیام‌رسان در حالت آزمایشی است.' },
    { id: 9004, rule: 'بستن خودکار درخواست‌های تأییدشده', trigger: 'تغییر وضعیت تیکت', target: 'HD-2021', status: 'موفق', time: 'دیروز، ۱۷:۲۰:۱۰', duration: 76, message: 'وضعیت تیکت به بسته‌شده تغییر کرد.' }
  ];

  schedules: ScheduledJob[] = [
    { id: 1, name: 'بررسی مهلت SLA', schedule: 'هر ۵ دقیقه', nextRun: '۱۴:۴۰ امروز', status: 'فعال' },
    { id: 2, name: 'یادآوری درخواست‌های بدون پاسخ', schedule: 'هر روز، ساعت ۰۹:۰۰', nextRun: 'فردا، ۰۹:۰۰', status: 'فعال' },
    { id: 3, name: 'پاک‌سازی صف آزمایشی', schedule: 'هر هفته، جمعه', nextRun: 'جمعه، ۰۲:۰۰', status: 'متوقف' }
  ];

  templates = [
    { name: 'تخصیص بر اساس دسته‌بندی', description: 'تخصیص خودکار درخواست‌ها به تیم مرتبط', trigger: 'ایجاد تیکت', actions: ['تخصیص به تیم', 'افزودن برچسب'] },
    { name: 'هشدار نقض SLA', description: 'هشدار به مسئول و سرپرست پیش از پایان مهلت', trigger: 'زمان‌بندی‌شده', actions: ['ارسال اعلان', 'افزایش اهمیت'] },
    { name: 'پیگیری تیکت بدون پاسخ', description: 'یادآوری برای درخواست‌هایی که مدتی بی‌پاسخ مانده‌اند', trigger: 'زمان‌بندی‌شده', actions: ['ارسال اعلان به مسئول'] }
  ];

  get filteredRules(): AutomationRule[] {
    const q = this.search.trim().toLocaleLowerCase('fa');
    return this.rules.filter(r => (this.statusFilter === 'همه' || r.status === this.statusFilter) &&
      (!q || `${r.name} ${r.description} ${r.category} ${r.trigger}`.toLocaleLowerCase('fa').includes(q)));
  }
  get filteredExecutions(): Execution[] {
    const q = this.search.trim().toLocaleLowerCase('fa');
    return this.executions.filter(e => (this.runFilter === 'همه' || e.status === this.runFilter) &&
      (!q || `${e.rule} ${e.target} ${e.message}`.toLocaleLowerCase('fa').includes(q)));
  }
  get activeCount(): number { return this.rules.filter(r => r.status === 'فعال').length; }
  get totalRuns(): number { return this.rules.reduce((sum, r) => sum + r.runs, 0); }
  get successCount(): number { return this.executions.filter(e => e.status === 'موفق').length; }
  get failureCount(): number { return this.executions.filter(e => e.status === 'ناموفق').length; }

  private emptyRule(): AutomationRule {
    return { id: 0, name: '', description: '', trigger: 'ایجاد تیکت', logic: 'AND',
      conditions: [{ field: 'اولویت', operator: 'برابر با', value: 'زیاد' }],
      actions: ['ارسال اعلان به مسئول'], status: 'فعال', version: 1, runs: 0, lastRun: 'هرگز', category: 'عمومی' };
  }
  openNewRule(): void { this.editingId = null; this.ruleForm = this.emptyRule(); this.showEditor = true; }
  editRule(rule: AutomationRule): void {
    this.editingId = rule.id;
    this.ruleForm = { ...rule, conditions: rule.conditions.map(c => ({ ...c })), actions: [...rule.actions] };
    this.showEditor = true;
  }
  saveRule(): void {
    if (!this.ruleForm.name.trim() || !this.ruleForm.conditions.some(c => c.value.trim()) || !this.ruleForm.actions.length) {
      this.notify('نام قانون، حداقل یک شرط و یک اقدام الزامی است.'); return;
    }
    if (this.editingId !== null) {
      const index = this.rules.findIndex(r => r.id === this.editingId);
      if (index >= 0) this.rules[index] = { ...this.ruleForm, id: this.editingId, version: this.rules[index].version + 1 };
      this.notify('نسخه جدید قانون ذخیره شد.');
    } else {
      this.rules.unshift({ ...this.ruleForm, id: Math.max(0, ...this.rules.map(r => r.id)) + 1, version: 1 });
      this.notify('قانون جدید ایجاد شد.');
    }
    this.showEditor = false;
  }
  addCondition(): void { this.ruleForm.conditions.push({ field: 'وضعیت', operator: 'برابر با', value: '' }); }
  removeCondition(index: number): void { if (this.ruleForm.conditions.length > 1) this.ruleForm.conditions.splice(index, 1); }
  addAction(value: string): void { if (value && !this.ruleForm.actions.includes(value)) this.ruleForm.actions.push(value); }
  removeAction(index: number): void { this.ruleForm.actions.splice(index, 1); }
  toggleRule(rule: AutomationRule): void { rule.status = rule.status === 'فعال' ? 'متوقف' : 'فعال'; this.notify(`قانون «${rule.name}» ${rule.status} شد.`); }
  duplicateRule(rule: AutomationRule): void {
    this.rules.unshift({ ...rule, id: Math.max(0, ...this.rules.map(r => r.id)) + 1, name: `${rule.name} - نسخه کپی`, status: 'متوقف', version: 1, runs: 0, lastRun: 'هرگز', conditions: rule.conditions.map(c => ({ ...c })), actions: [...rule.actions] });
    this.notify('یک نسخه کپی از قانون ساخته شد.');
  }
  deleteRule(rule: AutomationRule): void { this.rules = this.rules.filter(r => r.id !== rule.id); this.notify('قانون حذف شد.'); }
  simulateRule(rule: AutomationRule): void {
    rule.runs++;
    rule.lastRun = 'همین لحظه';
    this.executions.unshift({ id: Math.max(9000, ...this.executions.map(e => e.id)) + 1, rule: rule.name, trigger: rule.trigger, target: `HD-${2049 + this.executions.length}`, status: 'موفق', time: 'همین لحظه', duration: 112, message: `اجرای آزمایشی انجام شد؛ ${rule.actions.length} اقدام در صف شبیه‌سازی قرار گرفت.` });
    this.notify('اجرای آزمایشی ثبت شد؛ هیچ تغییری روی تیکت واقعی اعمال نشد.');
  }
  inspectRun(run: Execution): void { this.selectedRun = run; this.showRunDetail = true; }
  toggleSchedule(job: ScheduledJob): void { job.status = job.status === 'فعال' ? 'متوقف' : 'فعال'; }
  runSchedule(job: ScheduledJob): void {
    this.executions.unshift({ id: Math.max(9000, ...this.executions.map(e => e.id)) + 1, rule: job.name, trigger: 'اجرای دستی زمان‌بندی', target: 'صف زمان‌بندی', status: 'موفق', time: 'همین لحظه', duration: 95, message: 'اجرای دستی زمان‌بندی به‌صورت نمایشی ثبت شد.' });
    this.notify('اجرای نمایشی زمان‌بندی ثبت شد.');
  }
  useTemplate(template: typeof this.templates[number]): void {
    this.ruleForm = { ...this.emptyRule(), name: template.name, description: template.description, trigger: template.trigger, actions: [...template.actions], category: 'قالب آماده' };
    this.editingId = null; this.activeTab = 'rules'; this.showEditor = true;
  }
  exportRuns(): void {
    const rows = [['شناسه', 'قانون', 'محرک', 'هدف', 'وضعیت', 'زمان', 'مدت (ms)', 'پیام'], ...this.filteredExecutions.map(e => [e.id, e.rule, e.trigger, e.target, e.status, e.time, e.duration, e.message])];
    const csv = '\ufeff' + rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'ashkan-automation-runs.csv'; a.click(); URL.revokeObjectURL(url);
  }
  private notify(message: string): void { this.notice = message; setTimeout(() => { if (this.notice === message) this.notice = ''; }, 3200); }
}
