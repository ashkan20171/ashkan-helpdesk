import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TenantStatus = 'فعال' | 'آزمایشی' | 'تعلیق‌شده';
interface Tenant {
  id: string; name: string; slug: string; domain: string; plan: string; status: TenantStatus;
  users: number; tickets: number; region: string; created: string; owner: string; color: string;
}
@Component({
  selector: 'ah-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenants.html',
  styleUrl: './tenants.scss'
})
export class TenantsComponent {
  activeTab = 'سازمان‌ها';
  search = '';
  statusFilter = 'همه';
  selected: Tenant | null = null;
  showForm = false;
  editingId: string | null = null;
  toast = '';
  domainDraft = { domain: '', tenantId: 'org-ashian', type: 'اصلی' };
  settings = { isolation: 'پایگاه داده مستقل منطقی', defaultPlan: 'Professional', trialDays: 14, allowCustomDomain: true, enforceMfa: true, signupApproval: true };
  draft: Omit<Tenant, 'id' | 'created' | 'users' | 'tickets'> = {
    name: '', slug: '', domain: '', plan: 'Professional', status: 'آزمایشی',
    region: 'ایران - تهران', owner: '', color: '#0f8278'
  };
  tenants: Tenant[] = [
    { id: 'org-ashian', name: 'شرکت آشیان', slug: 'ashian', domain: 'ashian.ashkan.app', plan: 'Enterprise', status: 'فعال', users: 128, tickets: 2481, region: 'ایران - تهران', created: '۱۴۰۵/۰۲/۱۲', owner: 'محمد رضایی', color: '#0f8278' },
    { id: 'org-paya', name: 'گروه صنعتی پایا', slug: 'paya', domain: 'paya.ashkan.app', plan: 'Professional', status: 'فعال', users: 64, tickets: 936, region: 'ایران - اصفهان', created: '۱۴۰۵/۰۴/۰۸', owner: 'نگار صادقی', color: '#5276c8' },
    { id: 'org-novin', name: 'فناوری نوین شرق', slug: 'novin', domain: 'novin.ashkan.app', plan: 'Starter', status: 'آزمایشی', users: 12, tickets: 84, region: 'ایران - مشهد', created: '۱۴۰۵/۰۸/۲۱', owner: 'علی کاظمی', color: '#b8843d' },
    { id: 'org-atlas', name: 'هلدینگ اطلس', slug: 'atlas', domain: 'atlas.ashkan.app', plan: 'Professional', status: 'تعلیق‌شده', users: 0, tickets: 0, region: 'ایران - شیراز', created: '۱۴۰۵/۰۳/۱۶', owner: 'مریم حیدری', color: '#8c6bb4' }
  ];
  domains = [
    { domain: 'ashian.ashkan.app', tenant: 'شرکت آشیان', type: 'زیردامنه', verified: true, ssl: true },
    { domain: 'paya.ashkan.app', tenant: 'گروه صنعتی پایا', type: 'زیردامنه', verified: true, ssl: true },
    { domain: 'support.ashian.ir', tenant: 'شرکت آشیان', type: 'دامنه اختصاصی', verified: true, ssl: true },
    { domain: 'novin.ashkan.app', tenant: 'فناوری نوین شرق', type: 'زیردامنه', verified: false, ssl: false }
  ];
  get filteredTenants(): Tenant[] {
    return this.tenants.filter(t => (this.statusFilter === 'همه' || t.status === this.statusFilter) &&
      `${t.name} ${t.slug} ${t.domain} ${t.owner}`.toLowerCase().includes(this.search.toLowerCase()));
  }
  get activeCount(): number { return this.tenants.filter(t => t.status === 'فعال').length; }
  get totalUsers(): number { return this.tenants.reduce((sum, t) => sum + t.users, 0); }
  get totalTickets(): number { return this.tenants.reduce((sum, t) => sum + t.tickets, 0); }
  get starterCount(): number { return this.tenants.filter(t => t.plan === 'Starter').length; }
  get professionalCount(): number { return this.tenants.filter(t => t.plan === 'Professional').length; }
  get enterpriseCount(): number { return this.tenants.filter(t => t.plan === 'Enterprise').length; }
  notify(message: string): void { this.toast = message; setTimeout(() => this.toast = '', 2800); }
  newTenant(): void {
    this.editingId = null;
    this.draft = { name: '', slug: '', domain: '', plan: 'Professional', status: 'آزمایشی', region: 'ایران - تهران', owner: '', color: '#0f8278' };
    this.showForm = true;
  }
  editTenant(tenant: Tenant): void {
    this.editingId = tenant.id;
    this.draft = { name: tenant.name, slug: tenant.slug, domain: tenant.domain, plan: tenant.plan, status: tenant.status, region: tenant.region, owner: tenant.owner, color: tenant.color };
    this.showForm = true;
  }
  saveTenant(): void {
    if (!this.draft.name.trim() || !this.draft.slug.trim() || !this.draft.owner.trim()) { this.notify('نام سازمان، شناسه و مدیر سازمان الزامی است.'); return; }
    if (this.tenants.some(t => t.slug === this.draft.slug.trim() && t.id !== this.editingId)) { this.notify('این شناسه سازمان قبلاً استفاده شده است.'); return; }
    if (this.editingId) {
      const item = this.tenants.find(t => t.id === this.editingId);
      if (item) Object.assign(item, this.draft);
      this.notify('اطلاعات سازمان به‌روزرسانی شد.');
    } else {
      this.tenants.unshift({ ...this.draft, id: `org-${Date.now()}`, created: 'امروز', users: 0, tickets: 0 });
      this.notify('سازمان جدید ایجاد شد.');
    }
    this.showForm = false;
  }
  toggleStatus(tenant: Tenant): void {
    tenant.status = tenant.status === 'فعال' ? 'تعلیق‌شده' : 'فعال';
    this.notify(`وضعیت ${tenant.name} به «${tenant.status}» تغییر کرد.`);
  }
  switchTenant(tenant: Tenant): void {
    if (tenant.status !== 'فعال') { this.notify('برای ورود به فضای کاری، سازمان باید فعال باشد.'); return; }
    this.notify(`فضای کاری «${tenant.name}» انتخاب شد. (نمایش آزمایشی)`);
  }
  addDomain(): void {
    const domain = this.domainDraft.domain.trim().toLowerCase();
    if (!domain || !domain.includes('.') || this.domains.some(d => d.domain === domain)) { this.notify('دامنه معتبر و یکتا وارد کنید.'); return; }
    const tenant = this.tenants.find(t => t.id === this.domainDraft.tenantId);
    if (!tenant) return;
    this.domains.unshift({ domain, tenant: tenant.name, type: this.domainDraft.type, verified: false, ssl: false });
    this.domainDraft.domain = '';
    this.notify('دامنه اضافه شد؛ برای فعال‌سازی باید مالکیت آن تأیید شود.');
  }
  removeDomain(domain: string): void { this.domains = this.domains.filter(d => d.domain !== domain); this.notify('دامنه از فهرست نمایشی حذف شد.'); }
  exportCsv(): void {
    const rows = [['نام سازمان','شناسه','دامنه','طرح','وضعیت','کاربران','تیکت‌ها','مدیر'], ...this.filteredTenants.map(t => [t.name,t.slug,t.domain,t.plan,t.status,String(t.users),String(t.tickets),t.owner])];
    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'ashkan-tenants.csv'; a.click(); URL.revokeObjectURL(url);
  }
}
