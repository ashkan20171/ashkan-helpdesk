import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Plus, Filter, Download, ClipboardList, CheckCircle2, Clock3, X, ArrowUpRight, Eye, CalendarDays, UserRound, FileText, AlertCircle, Check, XCircle, RefreshCw } from 'lucide-angular';

type RequestStatus = 'جدید' | 'در انتظار تأیید' | 'در حال انجام' | 'تکمیل‌شده' | 'ردشده';
type RequestPriority = 'فوری' | 'بالا' | 'متوسط' | 'پایین';
interface ServiceCatalogItem { id: string; name: string; description: string; category: string; eta: string; approval: string; icon: string; }
interface ServiceRequest { id: string; title: string; service: string; requester: string; department: string; assignee: string; status: RequestStatus; priority: RequestPriority; createdAt: string; dueAt: string; description: string; approver: string; }

@Component({
  selector: 'ah-service-requests', standalone: true, imports: [FormsModule, LucideAngularModule], styleUrl: './service-requests.scss',
  template: `
  <div class="service-requests-page" dir="rtl">
    <header class="page-heading service-heading">
      <div><div class="eyebrow"><span class="eyebrow-dot"></span> مرکز خدمات سازمانی</div><h1>درخواست‌های خدمات</h1><p>کاتالوگ خدمات، درخواست‌های کارکنان و گردش تأیید را در یک فضای یکپارچه مدیریت کنید.</p></div>
      <div class="heading-actions"><button class="sr-button sr-button-ghost" type="button" (click)="exportCsv()"><i-lucide [img]="Download" [size]="17"></i-lucide> خروجی CSV</button><button class="sr-button sr-button-primary" type="button" (click)="openCreate()"><i-lucide [img]="Plus" [size]="18"></i-lucide> درخواست جدید</button></div>
    </header>

    <section class="sr-kpis">
      <article class="sr-kpi"><span class="sr-kpi-icon blue"><i-lucide [img]="ClipboardList" [size]="19"></i-lucide></span><div><small>کل درخواست‌ها</small><strong>{{ requests().length.toLocaleString('fa-IR') }}</strong><em>تمام دوره‌ها</em></div></article>
      <article class="sr-kpi"><span class="sr-kpi-icon amber"><i-lucide [img]="Clock3" [size]="19"></i-lucide></span><div><small>در انتظار تأیید</small><strong>{{ pendingCount().toLocaleString('fa-IR') }}</strong><em>نیازمند تصمیم مدیر</em></div></article>
      <article class="sr-kpi"><span class="sr-kpi-icon green"><i-lucide [img]="CheckCircle2" [size]="19"></i-lucide></span><div><small>تکمیل‌شده</small><strong>{{ completedCount().toLocaleString('fa-IR') }}</strong><em>خدمات ارائه‌شده</em></div></article>
      <article class="sr-kpi"><span class="sr-kpi-icon violet"><i-lucide [img]="FileText" [size]="19"></i-lucide></span><div><small>کاتالوگ خدمات</small><strong>{{ catalog.length.toLocaleString('fa-IR') }}</strong><em>خدمات قابل درخواست</em></div></article>
    </section>

    <section class="catalog-section">
      <div class="sr-section-heading"><div><span class="sr-eyebrow">SERVICE CATALOG</span><h2>کاتالوگ خدمات</h2><p>برای شروع، یکی از خدمات سازمان را انتخاب کنید.</p></div><span class="catalog-count">{{ catalog.length.toLocaleString('fa-IR') }} خدمت فعال</span></div>
      <div class="catalog-grid">
        @for (item of catalog; track item.id) {
          <article class="catalog-card">
            <div class="catalog-card-top"><span class="catalog-icon" [class]="'catalog-icon ' + item.categoryClass">{{ item.icon }}</span><span class="catalog-category">{{ item.category }}</span></div>
            <h3>{{ item.name }}</h3><p>{{ item.description }}</p>
            <div class="catalog-meta"><span><i-lucide [img]="Clock3" [size]="13"></i-lucide>{{ item.eta }}</span><span><i-lucide [img]="CheckCircle2" [size]="13"></i-lucide>{{ item.approval }}</span></div>
            <button type="button" class="catalog-action" (click)="openCreate(item)">ثبت درخواست <i-lucide [img]="ArrowUpRight" [size]="15"></i-lucide></button>
          </article>
        }
      </div>
    </section>

    <section class="sr-list-section panel">
      <div class="sr-list-heading"><div><h2>درخواست‌های ثبت‌شده</h2><p>وضعیت و روند رسیدگی درخواست‌های سازمان را دنبال کنید.</p></div><button class="sr-button sr-button-ghost sr-filter-button" type="button" (click)="filtersOpen.update(v => !v)"><i-lucide [img]="Filter" [size]="16"></i-lucide> فیلترها</button></div>
      <div class="sr-toolbar">
        <div class="sr-tabs" role="tablist" aria-label="فیلتر درخواست‌ها">
          <button type="button" [class.active]="activeTab() === 'همه'" (click)="activeTab.set('همه')">همه <b>{{ requests().length }}</b></button>
          <button type="button" [class.active]="activeTab() === 'در انتظار تأیید'" (click)="activeTab.set('در انتظار تأیید')">در انتظار تأیید</button>
          <button type="button" [class.active]="activeTab() === 'در حال انجام'" (click)="activeTab.set('در حال انجام')">در حال انجام</button>
          <button type="button" [class.active]="activeTab() === 'تکمیل‌شده'" (click)="activeTab.set('تکمیل‌شده')">تکمیل‌شده</button>
        </div>
        <label class="sr-search"><i-lucide [img]="Search" [size]="16"></i-lucide><input type="search" [(ngModel)]="query" placeholder="جستجوی درخواست، کد یا متقاضی..." aria-label="جستجوی درخواست"></label>
      </div>
      @if (filtersOpen()) { <div class="sr-filter-row"><label>اولویت<select [(ngModel)]="priorityFilter"><option value="همه">همه اولویت‌ها</option><option>فوری</option><option>بالا</option><option>متوسط</option><option>پایین</option></select></label><label>واحد سازمانی<select [(ngModel)]="departmentFilter"><option value="همه">همه واحدها</option><option>فناوری اطلاعات</option><option>منابع انسانی</option><option>مالی</option><option>اداری</option></select></label><button type="button" class="sr-reset" (click)="priorityFilter='همه'; departmentFilter='همه'; query=''">پاک کردن فیلترها</button></div> }
      <div class="sr-table-wrap"><table class="sr-table"><thead><tr><th>شناسه / عنوان درخواست</th><th>متقاضی</th><th>خدمت</th><th>اولویت</th><th>وضعیت</th><th>تاریخ ثبت</th><th>مهلت</th><th></th></tr></thead><tbody>
        @for (request of filteredRequests(); track request.id) {
          <tr><td><button class="sr-title-button" type="button" (click)="selectedRequest.set(request)"><strong>{{ request.title }}</strong><small>{{ request.id }}</small></button></td><td><span class="requester-cell"><span class="requester-avatar">{{ request.requester.slice(0,1) }}</span><span>{{ request.requester }}<small>{{ request.department }}</small></span></span></td><td>{{ request.service }}</td><td><span class="priority-pill" [class]="'priority-pill ' + priorityClass(request.priority)">{{ request.priority }}</span></td><td><span class="status-pill" [class]="'status-pill ' + statusClass(request.status)"><i></i>{{ request.status }}</span></td><td>{{ request.createdAt }}</td><td>{{ request.dueAt }}</td><td><button class="sr-icon-button" type="button" aria-label="مشاهده جزئیات" (click)="selectedRequest.set(request)"><i-lucide [img]="Eye" [size]="16"></i-lucide></button></td></tr>
        } @empty { <tr><td colspan="8"><div class="sr-empty"><i-lucide [img]="ClipboardList" [size]="28"></i-lucide><strong>درخواستی پیدا نشد</strong><span>فیلترها را تغییر دهید یا درخواست جدیدی ثبت کنید.</span></div></td></tr> }
      </tbody></table></div>
      <div class="sr-table-footer"><span>نمایش {{ filteredRequests().length }} از {{ requests().length }} درخواست</span><span>اطلاعات نمونه · نسخه نمایشی فرانت‌اند</span></div>
    </section>

    @if (createOpen()) {
      <div class="sr-overlay" (click)="closeCreate()"><section class="sr-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" (click)="$event.stopPropagation()">
        <header class="sr-modal-header"><div><span class="sr-eyebrow">NEW SERVICE REQUEST</span><h2 id="create-title">ثبت درخواست خدمات</h2><p>اطلاعات درخواست را وارد کنید تا در گردش کار قرار بگیرد.</p></div><button class="sr-icon-button" type="button" aria-label="بستن" (click)="closeCreate()"><i-lucide [img]="X" [size]="18"></i-lucide></button></header>
        <form (ngSubmit)="submitRequest()" #requestForm="ngForm"><div class="sr-form-grid">
          <label class="sr-field full">نوع خدمت<select name="service" [(ngModel)]="draft.service" required><option value="">انتخاب خدمت</option>@for (item of catalog; track item.id) { <option [value]="item.name">{{ item.name }}</option> }</select></label>
          <label class="sr-field full">عنوان درخواست<input name="title" [(ngModel)]="draft.title" required minlength="4" placeholder="مثلاً درخواست لپ‌تاپ برای همکار جدید"></label>
          <label class="sr-field">واحد سازمانی<select name="department" [(ngModel)]="draft.department" required><option>فناوری اطلاعات</option><option>منابع انسانی</option><option>مالی</option><option>اداری</option></select></label>
          <label class="sr-field">اولویت<select name="priority" [(ngModel)]="draft.priority"><option>متوسط</option><option>پایین</option><option>بالا</option><option>فوری</option></select></label>
          <label class="sr-field full">شرح درخواست<textarea name="description" [(ngModel)]="draft.description" required minlength="10" rows="4" placeholder="نیاز خود را با جزئیات توضیح دهید..."></textarea></label>
        </div><div class="sr-form-note"><i-lucide [img]="AlertCircle" [size]="16"></i-lucide><span>درخواست‌هایی که نیازمند تأیید مدیر هستند، پس از ثبت در صف تأیید قرار می‌گیرند.</span></div><footer class="sr-modal-actions"><button type="button" class="sr-button sr-button-ghost" (click)="closeCreate()">انصراف</button><button type="submit" class="sr-button sr-button-primary" [disabled]="requestForm.invalid">ثبت درخواست <i-lucide [img]="ArrowUpRight" [size]="16"></i-lucide></button></footer></form>
      </section></div>
    }

    @if (selectedRequest(); as request) {
      <div class="sr-overlay" (click)="selectedRequest.set(null)"><section class="sr-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title" (click)="$event.stopPropagation()">
        <header class="sr-drawer-header"><div><span class="sr-eyebrow">{{ request.id }}</span><h2 id="detail-title">{{ request.title }}</h2><span class="status-pill" [class]="'status-pill ' + statusClass(request.status)"><i></i>{{ request.status }}</span></div><button class="sr-icon-button" type="button" aria-label="بستن جزئیات" (click)="selectedRequest.set(null)"><i-lucide [img]="X" [size]="18"></i-lucide></button></header>
        <div class="sr-detail-content"><div class="sr-detail-block"><h3>شرح درخواست</h3><p>{{ request.description }}</p></div><div class="sr-detail-grid"><div><small>خدمت</small><strong>{{ request.service }}</strong></div><div><small>متقاضی</small><strong>{{ request.requester }}</strong></div><div><small>واحد سازمانی</small><strong>{{ request.department }}</strong></div><div><small>کارشناس مسئول</small><strong>{{ request.assignee }}</strong></div><div><small>تاریخ ثبت</small><strong>{{ request.createdAt }}</strong></div><div><small>مهلت انجام</small><strong>{{ request.dueAt }}</strong></div></div><div class="sr-detail-block"><h3>گردش تأیید</h3><div class="approval-step"><span class="approval-dot" [class.done]="request.status !== 'در انتظار تأیید'"></span><div><strong>بررسی مدیر واحد</strong><small>{{ request.approver }} · {{ request.status === 'در انتظار تأیید' ? 'در انتظار تصمیم' : 'بررسی انجام شده' }}</small></div></div></div></div>
        @if (request.status === 'در انتظار تأیید') { <footer class="sr-drawer-actions"><button class="sr-button sr-button-danger" type="button" (click)="decideRequest(request, false)"><i-lucide [img]="XCircle" [size]="16"></i-lucide> رد درخواست</button><button class="sr-button sr-button-primary" type="button" (click)="decideRequest(request, true)"><i-lucide [img]="Check" [size]="16"></i-lucide> تأیید درخواست</button></footer> }
        @if (request.status === 'در حال انجام') { <footer class="sr-drawer-actions"><button class="sr-button sr-button-primary" type="button" (click)="completeRequest(request)"><i-lucide [img]="CheckCircle2" [size]="16"></i-lucide> ثبت تکمیل خدمت</button></footer> }
      </section></div>
    }
    @if (toast()) { <div class="sr-toast" role="status">✦ {{ toast() }}</div> }
  </div>
  `
})
export class ServiceRequestsComponent {
  readonly Search = Search; readonly Plus = Plus; readonly Filter = Filter; readonly Download = Download; readonly ClipboardList = ClipboardList;
  readonly CheckCircle2 = CheckCircle2; readonly Clock3 = Clock3; readonly X = X; readonly ArrowUpRight = ArrowUpRight; readonly Eye = Eye;
  readonly CalendarDays = CalendarDays; readonly UserRound = UserRound; readonly FileText = FileText; readonly AlertCircle = AlertCircle;
  readonly Check = Check; readonly XCircle = XCircle; readonly RefreshCw = RefreshCw;

  readonly catalog: (ServiceCatalogItem & { categoryClass: string })[] = [
    { id: 'SVC-001', name: 'تجهیزات و سخت‌افزار', description: 'درخواست لپ‌تاپ، مانیتور، لوازم جانبی و تجهیزات اداری.', category: 'فناوری اطلاعات', categoryClass: 'catalog-blue', eta: '۳ تا ۵ روز کاری', approval: 'نیازمند تأیید', icon: '⌘' },
    { id: 'SVC-002', name: 'دسترسی به سامانه‌ها', description: 'ایجاد، تغییر یا لغو دسترسی به نرم‌افزارها و منابع سازمان.', category: 'دسترسی و امنیت', categoryClass: 'catalog-violet', eta: '۱ روز کاری', approval: 'نیازمند تأیید', icon: '⌁' },
    { id: 'SVC-003', name: 'درخواست نیروی جدید', description: 'آغاز فرایند جذب و آماده‌سازی همکار جدید در سازمان.', category: 'منابع انسانی', categoryClass: 'catalog-green', eta: '۵ تا ۷ روز کاری', approval: 'تأیید مدیر', icon: '＋' },
    { id: 'SVC-004', name: 'خدمات اداری', description: 'درخواست کارت تردد، فضای کار، ملزومات و خدمات عمومی.', category: 'امور اداری', categoryClass: 'catalog-amber', eta: '۲ روز کاری', approval: 'بدون تأیید', icon: '▤' }
  ];
  readonly requests = signal<ServiceRequest[]>([
    { id: 'SR-1048', title: 'درخواست لپ‌تاپ برای همکار جدید', service: 'تجهیزات و سخت‌افزار', requester: 'سارا محمدی', department: 'منابع انسانی', assignee: 'تیم پشتیبانی IT', status: 'در انتظار تأیید', priority: 'بالا', createdAt: '۱۴۰۵/۰۸/۲۸', dueAt: '۱۴۰۵/۰۹/۰۳', description: 'برای همکار جدید واحد فروش به یک لپ‌تاپ سازمانی به همراه کیف و ماوس نیاز داریم.', approver: 'مدیر منابع انسانی' },
    { id: 'SR-1047', title: 'دسترسی به سامانه مالی', service: 'دسترسی به سامانه‌ها', requester: 'علی کریمی', department: 'مالی', assignee: 'امنیت اطلاعات', status: 'در حال انجام', priority: 'فوری', createdAt: '۱۴۰۵/۰۸/۲۷', dueAt: '۱۴۰۵/۰۸/۲۹', description: 'ایجاد دسترسی مشاهده و ثبت اسناد در سامانه مالی برای کارشناس جدید.', approver: 'مدیر مالی' },
    { id: 'SR-1046', title: 'صدور کارت تردد', service: 'خدمات اداری', requester: 'مریم احمدی', department: 'اداری', assignee: 'امور اداری', status: 'تکمیل‌شده', priority: 'متوسط', createdAt: '۱۴۰۵/۰۸/۲۶', dueAt: '۱۴۰۵/۰۸/۲۸', description: 'صدور کارت تردد جایگزین به دلیل مفقود شدن کارت قبلی.', approver: 'مدیر اداری' },
    { id: 'SR-1045', title: 'درخواست مانیتور دوم', service: 'تجهیزات و سخت‌افزار', requester: 'رضا نادری', department: 'فناوری اطلاعات', assignee: 'تیم پشتیبانی IT', status: 'جدید', priority: 'پایین', createdAt: '۱۴۰۵/۰۸/۲۵', dueAt: '۱۴۰۵/۰۹/۰۲', description: 'برای افزایش بهره‌وری در کارهای تحلیلی، درخواست مانیتور دوم دارم.', approver: 'مدیر فناوری اطلاعات' },
    { id: 'SR-1044', title: 'ایجاد حساب کاربری سازمانی', service: 'دسترسی به سامانه‌ها', requester: 'نگار حسینی', department: 'منابع انسانی', assignee: 'تیم زیرساخت', status: 'ردشده', priority: 'متوسط', createdAt: '۱۴۰۵/۰۸/۲۴', dueAt: '۱۴۰۵/۰۸/۲۷', description: 'ایجاد حساب کاربری و ایمیل سازمانی برای نیروی پیمانکار.', approver: 'مدیر منابع انسانی' }
  ]);
  readonly activeTab = signal('همه'); readonly filtersOpen = signal(false); readonly createOpen = signal(false);
  readonly selectedRequest = signal<ServiceRequest | null>(null); readonly toast = signal('');
  query = ''; priorityFilter = 'همه'; departmentFilter = 'همه';
  draft = { service: '', title: '', department: 'فناوری اطلاعات', priority: 'متوسط' as RequestPriority, description: '' };
  private sequence = 1049;
  readonly pendingCount = computed(() => this.requests().filter(item => item.status === 'در انتظار تأیید').length);
  readonly completedCount = computed(() => this.requests().filter(item => item.status === 'تکمیل‌شده').length);
  readonly filteredRequests = computed(() => {
    const q = this.query.trim().toLocaleLowerCase('fa');
    return this.requests().filter(item => (this.activeTab() === 'همه' || item.status === this.activeTab()) &&
      (!q || `${item.id} ${item.title} ${item.requester} ${item.service}`.toLocaleLowerCase('fa').includes(q)) &&
      (this.priorityFilter === 'همه' || item.priority === this.priorityFilter) &&
      (this.departmentFilter === 'همه' || item.department === this.departmentFilter));
  });

  openCreate(item?: ServiceCatalogItem): void { this.draft = { service: item?.name ?? '', title: '', department: 'فناوری اطلاعات', priority: 'متوسط', description: '' }; this.createOpen.set(true); }
  closeCreate(): void { this.createOpen.set(false); }
  submitRequest(): void {
    if (!this.draft.service || this.draft.title.trim().length < 4 || this.draft.description.trim().length < 10) return;
    const needsApproval = this.draft.service !== 'خدمات اداری';
    const record: ServiceRequest = { id: `SR-${this.sequence++}`, title: this.draft.title.trim(), service: this.draft.service, requester: 'محمد رضایی', department: this.draft.department, assignee: 'در انتظار تخصیص', status: needsApproval ? 'در انتظار تأیید' : 'جدید', priority: this.draft.priority, createdAt: '۱۴۰۵/۰۸/۲۹', dueAt: '۱۴۰۵/۰۹/۰۳', description: this.draft.description.trim(), approver: `مدیر ${this.draft.department}` };
    this.requests.update(items => [record, ...items]); this.createOpen.set(false); this.activeTab.set('همه'); this.showToast('درخواست با موفقیت ثبت شد.');
  }
  decideRequest(request: ServiceRequest, approved: boolean): void { this.updateRequest(request.id, { status: approved ? 'در حال انجام' : 'ردشده' }); this.selectedRequest.set(null); this.showToast(approved ? 'درخواست تأیید و به مرحله اجرا منتقل شد.' : 'درخواست رد شد.'); }
  completeRequest(request: ServiceRequest): void { this.updateRequest(request.id, { status: 'تکمیل‌شده' }); this.selectedRequest.set(null); this.showToast('تکمیل خدمت ثبت شد.'); }
  private updateRequest(id: string, changes: Partial<ServiceRequest>): void { this.requests.update(items => items.map(item => item.id === id ? { ...item, ...changes } : item)); }
  statusClass(status: RequestStatus): string { return status === 'تکمیل‌شده' ? 'status-done' : status === 'در انتظار تأیید' ? 'status-pending' : status === 'در حال انجام' ? 'status-progress' : status === 'ردشده' ? 'status-rejected' : 'status-new'; }
  priorityClass(priority: RequestPriority): string { return priority === 'فوری' ? 'priority-urgent' : priority === 'بالا' ? 'priority-high' : priority === 'پایین' ? 'priority-low' : 'priority-medium'; }
  showToast(message: string): void { this.toast.set(message); setTimeout(() => this.toast.set(''), 2800); }
  exportCsv(): void {
    const rows = [['شناسه', 'عنوان', 'خدمت', 'متقاضی', 'واحد', 'وضعیت', 'اولویت'], ...this.filteredRequests().map(item => [item.id, item.title, item.service, item.requester, item.department, item.status, item.priority])];
    const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const link = document.createElement('a'); link.href = url; link.download = 'ashkan-service-requests.csv'; link.click(); URL.revokeObjectURL(url);
  }
}
