import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Check, Clock3, GitBranch, UsersRound, ShieldCheck, ArrowLeftRight, Plus, Search, Filter, MoreHorizontal, CircleAlert, CheckCircle2, XCircle } from 'lucide-angular';

type ApprovalStatus = 'در انتظار' | 'تأیید شد' | 'رد شد' | 'منقضی';
interface ApprovalItem { id: string; title: string; type: string; requester: string; owner: string; level: string; due: string; status: ApprovalStatus; priority: string; }
interface Workflow { name: string; scope: string; steps: number; active: boolean; approvals: number; sla: string; }

@Component({
  selector: 'ah-approval-center',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './approval-center.html',
  styleUrl: './approval-center.scss'
})
export class ApprovalCenterComponent {
  readonly Check = Check; readonly Clock3 = Clock3; readonly GitBranch = GitBranch; readonly UsersRound = UsersRound;
  readonly ShieldCheck = ShieldCheck; readonly ArrowLeftRight = ArrowLeftRight; readonly Plus = Plus; readonly Search = Search;
  readonly Filter = Filter; readonly MoreHorizontal = MoreHorizontal; readonly CircleAlert = CircleAlert;
  readonly CheckCircle2 = CheckCircle2; readonly XCircle = XCircle;

  search = '';
  statusFilter = 'همه';
  activeTab: 'inbox' | 'workflows' = 'inbox';
  selected: ApprovalItem | null = null;
  toast = '';

  approvals: ApprovalItem[] = [
    { id: 'APR-1048', title: 'افزایش سقف قرارداد پشتیبانی', type: 'قرارداد', requester: 'سارا احمدی', owner: 'مدیر مالی', level: 'سطح ۲ از ۳', due: 'امروز · ۱۶:۳۰', status: 'در انتظار', priority: 'بالا' },
    { id: 'APR-1047', title: 'خرید ۱۲ دستگاه لپ‌تاپ', type: 'خرید', requester: 'امیرحسین مرادی', owner: 'مدیر عملیات', level: 'سطح ۱ از ۲', due: 'فردا · ۱۰:۰۰', status: 'در انتظار', priority: 'متوسط' },
    { id: 'APR-1045', title: 'درخواست دسترسی ادمین موقت', type: 'دسترسی', requester: 'نگار موسوی', owner: 'امنیت اطلاعات', level: 'سطح ۲ از ۲', due: 'امروز · ۱۴:۰۰', status: 'در انتظار', priority: 'بحرانی' },
    { id: 'APR-1042', title: 'تأیید اضافه‌کاری تیم پشتیبانی', type: 'منابع انسانی', requester: 'محمد رضایی', owner: 'مدیر منابع انسانی', level: 'سطح ۳ از ۳', due: 'تکمیل شد', status: 'تأیید شد', priority: 'متوسط' },
    { id: 'APR-1039', title: 'انتقال دارایی به شعبه غرب', type: 'دارایی', requester: 'رضا کریمی', owner: 'مدیر دارایی', level: 'سطح ۱ از ۱', due: 'تکمیل شد', status: 'رد شد', priority: 'پایین' }
  ];

  workflows: Workflow[] = [
    { name: 'خرید و سفارشات', scope: 'Procurement', steps: 4, active: true, approvals: 128, sla: '۸ ساعت' },
    { name: 'قراردادهای سازمانی', scope: 'Contracts', steps: 5, active: true, approvals: 76, sla: '۲۴ ساعت' },
    { name: 'دسترسی‌های حساس', scope: 'Security', steps: 3, active: true, approvals: 41, sla: '۲ ساعت' },
    { name: 'اضافه‌کاری و مرخصی خاص', scope: 'HR', steps: 3, active: false, approvals: 19, sla: '۱۲ ساعت' }
  ];

  get filteredApprovals(): ApprovalItem[] {
    const q = this.search.trim().toLowerCase();
    return this.approvals.filter(item =>
      (this.statusFilter === 'همه' || item.status === this.statusFilter) &&
      (!q || `${item.id} ${item.title} ${item.type} ${item.requester} ${item.owner}`.toLowerCase().includes(q))
    );
  }

  get pendingCount(): number { return this.approvals.filter(x => x.status === 'در انتظار').length; }
  get criticalCount(): number { return this.approvals.filter(x => x.priority === 'بحرانی' && x.status === 'در انتظار').length; }
  get completedToday(): number { return this.approvals.filter(x => x.status === 'تأیید شد').length; }

  open(item: ApprovalItem): void { this.selected = item; }
  decide(status: 'تأیید شد' | 'رد شد'): void {
    if (!this.selected) return;
    const item = this.approvals.find(x => x.id === this.selected?.id);
    if (item) item.status = status;
    this.toast = `${this.selected.id} با موفقیت ${status} شد.`;
    this.selected = null;
    setTimeout(() => this.toast = '', 2600);
  }

  createWorkflow(): void {
    this.toast = 'طراحی Workflow جدید آماده است؛ اتصال Drag & Drop در نسخه Backend تکمیل می‌شود.';
    setTimeout(() => this.toast = '', 3200);
  }
}
