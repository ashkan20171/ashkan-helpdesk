import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TabKey = 'teams' | 'departments' | 'structure';
type EntityKind = 'team' | 'department';
interface Department { id: number; name: string; code: string; manager: string; parent: string; teams: number; members: number; status: 'فعال' | 'غیرفعال'; color: string; }
interface Team { id: number; name: string; code: string; department: string; lead: string; members: string[]; capacity: number; status: 'فعال' | 'غیرفعال'; color: string; focus: string; }
interface OrganizationForm { kind: EntityKind; name: string; code: string; department: string; lead: string; capacity: number; focus: string; membersText: string; manager: string; parent: string; status: 'فعال' | 'غیرفعال'; }

@Component({
  selector: 'ah-organization', standalone: true, imports: [FormsModule], styleUrl: './organization.scss',
  template: `
    <div class="org-page" dir="rtl">
      <header class="page-heading">
        <div><div class="eyebrow"><span class="eyebrow-dot"></span> ساختار و سرمایه انسانی</div><h1>تیم‌ها و دپارتمان‌ها</h1><p>ساختار سازمانی، تیم‌های تخصصی، سرپرستان و ظرفیت منابع انسانی را مدیریت کنید.</p></div>
        <div class="heading-actions"><button class="button button-ghost" type="button" (click)="exportData()">↓ خروجی اطلاعات</button><button class="button button-primary" type="button" (click)="openCreate(activeTab() === 'departments' ? 'department' : 'team')">＋ {{ activeTab() === 'departments' ? 'دپارتمان جدید' : 'تیم جدید' }}</button></div>
      </header>

      <section class="org-stats">
        <article><span class="stat-icon blue">▦</span><div><small>دپارتمان‌ها</small><strong>{{ departments().length }}</strong><em>واحدهای سازمانی</em></div></article>
        <article><span class="stat-icon violet">♧</span><div><small>تیم‌های فعال</small><strong>{{ activeTeamsCount() }}</strong><em>تیم تخصصی</em></div></article>
        <article><span class="stat-icon green">♙</span><div><small>اعضای تخصیص‌یافته</small><strong>{{ totalMembers() }}</strong><em>در تیم‌های سازمان</em></div></article>
        <article><span class="stat-icon amber">◷</span><div><small>ظرفیت استفاده‌شده</small><strong>{{ capacityPercent() }}٪</strong><em>از ظرفیت تیم‌ها</em></div></article>
      </section>

      <nav class="management-tabs" aria-label="بخش‌های ساختار سازمانی">
        <button type="button" [class.active]="activeTab() === 'teams'" (click)="activeTab.set('teams')">تیم‌ها <span>{{ teams().length }}</span></button>
        <button type="button" [class.active]="activeTab() === 'departments'" (click)="activeTab.set('departments')">دپارتمان‌ها <span>{{ departments().length }}</span></button>
        <button type="button" [class.active]="activeTab() === 'structure'" (click)="activeTab.set('structure')">نمودار سازمانی</button>
      </nav>

      @if (activeTab() === 'teams') {
        <section class="management-panel">
          <div class="panel-toolbar"><div><h2>تیم‌های سازمان</h2><p>تیم‌ها را ایجاد کنید، سرپرست تعیین کنید و ظرفیت اعضا را زیر نظر بگیرید.</p></div><div class="toolbar-controls"><label class="search-box"><span>⌕</span><input [value]="searchTerm()" (input)="searchTerm.set(inputValue($event))" placeholder="جستجوی نام تیم، سرپرست یا واحد..." aria-label="جستجوی تیم‌ها"></label><select [value]="departmentFilter()" (change)="departmentFilter.set(inputValue($event))" aria-label="فیلتر دپارتمان"><option value="">همه دپارتمان‌ها</option>@for (department of departments(); track department.id) {<option [value]="department.name">{{ department.name }}</option>}</select><select [value]="statusFilter()" (change)="statusFilter.set(inputValue($event))" aria-label="فیلتر وضعیت"><option value="">همه وضعیت‌ها</option><option>فعال</option><option>غیرفعال</option></select></div></div>
          <div class="team-grid">
            @for (team of filteredTeams(); track team.id) {
              <article class="team-card">
                <div class="team-card-top"><span class="team-symbol" [style.background]="team.color + '20'" [style.color]="team.color">♧</span><span class="status-pill" [class.status-active]="team.status === 'فعال'" [class.status-disabled]="team.status === 'غیرفعال'"><i></i>{{ team.status }}</span><button class="more-button" type="button" (click)="editTeam(team)" aria-label="ویرایش تیم">•••</button></div>
                <h3>{{ team.name }}</h3><div class="team-code">{{ team.code }} <span>·</span> {{ team.department }}</div>
                <div class="team-lead"><span class="lead-avatar">{{ initials(team.lead) }}</span><span><small>سرپرست تیم</small><strong>{{ team.lead }}</strong></span></div>
                <div class="capacity-row"><span>ظرفیت تیم</span><strong>{{ team.members.length }} از {{ team.capacity }} نفر</strong></div><div class="capacity-track"><i [style.width.%]="capacity(team)"></i></div>
                <div class="team-card-bottom"><div class="member-stack">@for (member of team.members.slice(0, 4); track member) {<span [title]="member">{{ initials(member) }}</span>} @if (team.members.length > 4) {<span class="more-members">+{{ team.members.length - 4 }}</span>}</div><button type="button" (click)="editTeam(team)">مدیریت تیم ←</button></div>
              </article>
            } @empty { <div class="empty-state"><strong>تیمی پیدا نشد</strong><span>فیلترها را تغییر دهید یا یک تیم جدید ایجاد کنید.</span></div> }
          </div>
          <div class="table-footer"><span>نمایش {{ filteredTeams().length }} تیم از {{ teams().length }} تیم</span><span>اطلاعات نمایشی · آماده اتصال به API</span></div>
        </section>
      }

      @if (activeTab() === 'departments') {
        <section class="management-panel">
          <div class="panel-toolbar"><div><h2>دپارتمان‌ها و واحدهای سازمانی</h2><p>واحدهای اصلی و ارتباط آن‌ها با تیم‌های تخصصی را مدیریت کنید.</p></div><div class="toolbar-controls"><label class="search-box"><span>⌕</span><input [value]="searchTerm()" (input)="searchTerm.set(inputValue($event))" placeholder="جستجوی دپارتمان..." aria-label="جستجوی دپارتمان"></label><button class="button button-primary" type="button" (click)="openCreate('department')">＋ افزودن دپارتمان</button></div></div>
          <div class="department-grid">
            @for (department of filteredDepartments(); track department.id) {
              <article class="department-card"><div class="department-top"><span class="department-icon" [style.background]="department.color + '20'" [style.color]="department.color">▦</span><span class="status-pill" [class.status-active]="department.status === 'فعال'" [class.status-disabled]="department.status === 'غیرفعال'"><i></i>{{ department.status }}</span><button class="more-button" type="button" (click)="editDepartment(department)" aria-label="ویرایش دپارتمان">•••</button></div><h3>{{ department.name }}</h3><span class="department-code">{{ department.code }}</span><div class="department-manager"><small>مدیر واحد</small><strong>{{ department.manager }}</strong></div><div class="department-metrics"><div><strong>{{ department.teams }}</strong><small>تیم</small></div><div><strong>{{ department.members }}</strong><small>عضو</small></div><div><strong>{{ teamsInDepartment(department.name) }}</strong><small>تیم ثبت‌شده</small></div></div><button class="department-action" type="button" (click)="showDepartmentTeams(department.name)">مشاهده تیم‌های این واحد <span>←</span></button></article>
            } @empty { <div class="empty-state"><strong>دپارتمانی پیدا نشد</strong><span>برای شروع، یک دپارتمان ایجاد کنید.</span></div> }
          </div>
        </section>
      }

      @if (activeTab() === 'structure') {
        <section class="structure-panel"><div class="structure-heading"><div><h2>ساختار سازمانی شرکت آشیان</h2><p>نمای سلسله‌مراتبی واحدها و تیم‌های تخصصی</p></div><span class="structure-legend"><i></i> واحد فعال</span></div>
          <div class="org-tree"><div class="tree-root"><span class="tree-icon">A</span><div><strong>شرکت آشیان</strong><small>سازمان اصلی · {{ totalMembers() }} عضو تخصیص‌یافته</small></div></div><div class="tree-connector"></div><div class="tree-departments">
            @for (department of departments(); track department.id) {<div class="tree-branch"><div class="tree-department"><span class="tree-node-icon" [style.background]="department.color + '20'" [style.color]="department.color">▦</span><div><strong>{{ department.name }}</strong><small>{{ department.manager }} · {{ teamsInDepartment(department.name) }} تیم</small></div><span class="tree-count">{{ department.members }} نفر</span></div><div class="tree-teams">@for (team of teamsForDepartment(department.name); track team.id) {<div class="tree-team"><span class="team-dot" [style.background]="team.color"></span><div><strong>{{ team.name }}</strong><small>{{ team.lead }} · {{ team.members.length }} عضو</small></div><span class="tree-team-status" [class.offline]="team.status === 'غیرفعال'"></span></div>}</div></div>}
          </div></div><div class="structure-note">این نمودار بر اساس داده‌های آزمایشی همین صفحه ساخته شده و با تغییر دپارتمان‌ها و تیم‌ها به‌روزرسانی می‌شود.</div>
        </section>
      }

      @if (dialogOpen()) {<div class="dialog-backdrop" (click)="closeDialog()"><section class="org-dialog" role="dialog" aria-modal="true" aria-labelledby="org-dialog-title" (click)="$event.stopPropagation()"><header><div><h2 id="org-dialog-title">{{ editingId() ? 'ویرایش اطلاعات' : (form.kind === 'team' ? 'ایجاد تیم جدید' : 'ایجاد دپارتمان جدید') }}</h2><p>اطلاعات ساختار سازمانی را وارد کنید.</p></div><button class="dialog-close" type="button" (click)="closeDialog()" aria-label="بستن">×</button></header>
        <form (ngSubmit)="saveEntity()"><div class="form-grid"><label>نام {{ form.kind === 'team' ? 'تیم' : 'دپارتمان' }}<input name="name" [(ngModel)]="form.name" required minlength="2" placeholder="نام را وارد کنید"></label><label>کد شناسایی<input name="code" [(ngModel)]="form.code" required placeholder="مثلاً IT-SUP"></label>
          @if (form.kind === 'team') {<label>دپارتمان<select name="department" [(ngModel)]="form.department" required>@for (department of departments(); track department.id) {<option [value]="department.name">{{ department.name }}</option>}</select></label><label>سرپرست تیم<input name="lead" [(ngModel)]="form.lead" required placeholder="نام سرپرست"></label><label>ظرفیت تیم<input name="capacity" [(ngModel)]="form.capacity" type="number" min="1" required></label><label>حوزه فعالیت<input name="focus" [(ngModel)]="form.focus" placeholder="مثلاً پشتیبانی نرم‌افزار"></label><label class="full-field">اعضای تیم<input name="membersText" [(ngModel)]="form.membersText" placeholder="نام اعضا را با ویرگول جدا کنید"></label>} @else {<label>مدیر واحد<input name="manager" [(ngModel)]="form.manager" required placeholder="نام مدیر دپارتمان"></label><label>واحد بالادستی<input name="parent" [(ngModel)]="form.parent" placeholder="مثلاً معاونت فناوری"></label>}
          <label>وضعیت<select name="status" [(ngModel)]="form.status"><option>فعال</option><option>غیرفعال</option></select></label></div><div class="dialog-actions"><button class="button button-ghost" type="button" (click)="closeDialog()">انصراف</button><button class="button button-primary" type="submit">{{ editingId() ? 'ذخیره تغییرات' : 'ایجاد' }}</button></div></form></section></div>}
      @if (toast()) {<div class="org-toast" role="status">✦ {{ toast() }}</div>}
    </div>
  `
})
export class OrganizationComponent {
  readonly activeTab = signal<TabKey>('teams'); readonly searchTerm = signal(''); readonly departmentFilter = signal(''); readonly statusFilter = signal('');
  readonly dialogOpen = signal(false); readonly editingId = signal<number | null>(null); readonly toast = signal('');
  private nextTeamId = 7; private nextDepartmentId = 6; private toastTimer?: ReturnType<typeof setTimeout>;
  readonly departments = signal<Department[]>([
    { id: 1, name: 'مدیریت فناوری اطلاعات', code: 'IT-MGT', manager: 'محمد رضایی', parent: 'مدیریت ارشد', teams: 2, members: 9, status: 'فعال', color: '#557ee8' },
    { id: 2, name: 'خدمات و پشتیبانی', code: 'SUP-OPS', manager: 'سارا محمدی', parent: 'مدیریت فناوری اطلاعات', teams: 3, members: 14, status: 'فعال', color: '#19a47b' },
    { id: 3, name: 'زیرساخت و شبکه', code: 'INF-NET', manager: 'علی کریمی', parent: 'مدیریت فناوری اطلاعات', teams: 1, members: 7, status: 'فعال', color: '#9874df' },
    { id: 4, name: 'منابع انسانی', code: 'HR-ORG', manager: 'نگار احمدی', parent: 'مدیریت اداری', teams: 1, members: 5, status: 'فعال', color: '#d99643' },
    { id: 5, name: 'مالی و اداری', code: 'FIN-ADM', manager: 'رضا موسوی', parent: 'مدیریت اداری', teams: 1, members: 4, status: 'غیرفعال', color: '#6f879f' }
  ]);
  readonly teams = signal<Team[]>([
    { id: 1, name: 'میز خدمت', code: 'HD-SD-01', department: 'خدمات و پشتیبانی', lead: 'سارا محمدی', members: ['سارا محمدی','امیر حسینی','مریم شریفی'], capacity: 6, status: 'فعال', color: '#4b83e8', focus: 'پذیرش و دسته‌بندی درخواست‌ها' },
    { id: 2, name: 'پشتیبانی نرم‌افزار', code: 'HD-SW-02', department: 'خدمات و پشتیبانی', lead: 'نازنین احمدی', members: ['نازنین احمدی','آرمان نوری','پریسا اکبری','علی رستمی'], capacity: 6, status: 'فعال', color: '#17a27a', focus: 'نرم‌افزارهای سازمانی' },
    { id: 3, name: 'پشتیبانی سخت‌افزار', code: 'HD-HW-03', department: 'خدمات و پشتیبانی', lead: 'امیر حسینی', members: ['امیر حسینی','حامد صالحی'], capacity: 5, status: 'فعال', color: '#d99743', focus: 'تجهیزات و سیستم‌های کاربران' },
    { id: 4, name: 'زیرساخت و شبکه', code: 'IT-NW-01', department: 'زیرساخت و شبکه', lead: 'علی کریمی', members: ['علی کریمی','مهدی صادقی','پویا احمدی'], capacity: 5, status: 'فعال', color: '#9271dc', focus: 'شبکه، سرورها و ارتباطات' },
    { id: 5, name: 'راهبران سامانه', code: 'IT-ADM-01', department: 'مدیریت فناوری اطلاعات', lead: 'محمد رضایی', members: ['محمد رضایی','کیوان مرادی'], capacity: 4, status: 'فعال', color: '#537ee8', focus: 'مدیریت و نگهداری سامانه‌ها' },
    { id: 6, name: 'جذب و توسعه', code: 'HR-TAL-01', department: 'منابع انسانی', lead: 'نگار احمدی', members: ['نگار احمدی','الهام زمانی'], capacity: 4, status: 'غیرفعال', color: '#d58baf', focus: 'جذب و توسعه سرمایه انسانی' }
  ]);
  form: OrganizationForm = { kind: 'team', name: '', code: '', department: 'خدمات و پشتیبانی', lead: '', capacity: 5, focus: '', membersText: '', manager: '', parent: 'مدیریت ارشد', status: 'فعال' };
  readonly activeTeamsCount = computed(() => this.teams().filter(team => team.status === 'فعال').length);
  readonly totalMembers = computed(() => this.teams().reduce((sum, team) => sum + team.members.length, 0));
  readonly capacityPercent = computed(() => { const used = this.totalMembers(); const capacity = this.teams().reduce((sum, team) => sum + team.capacity, 0); return capacity ? Math.round(used / capacity * 100) : 0; });
  readonly filteredTeams = computed(() => this.teams().filter(team => { const q = this.searchTerm().trim().toLocaleLowerCase('fa'); return (!q || [team.name, team.code, team.department, team.lead].some(value => value.toLocaleLowerCase('fa').includes(q))) && (!this.departmentFilter() || team.department === this.departmentFilter()) && (!this.statusFilter() || team.status === this.statusFilter()); }));
  readonly filteredDepartments = computed(() => this.departments().filter(department => { const q = this.searchTerm().trim().toLocaleLowerCase('fa'); return !q || [department.name, department.code, department.manager, department.parent].some(value => value.toLocaleLowerCase('fa').includes(q)); }));
  inputValue(event: Event): string { return (event.target as HTMLInputElement).value; }
  teamsInDepartment(name: string): number { return this.teams().filter(team => team.department === name).length; }
  teamsForDepartment(name: string): Team[] { return this.teams().filter(team => team.department === name); }
  capacity(team: Team): number { return Math.min(100, Math.round(team.members.length / Math.max(team.capacity, 1) * 100)); }
  initials(name: string): string { return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] ?? '').join(''); }
  openCreate(kind: EntityKind): void { this.editingId.set(null); this.form = { kind, name: '', code: '', department: this.departments()[0]?.name ?? '', lead: '', capacity: 5, focus: '', membersText: '', manager: '', parent: 'مدیریت ارشد', status: 'فعال' }; this.dialogOpen.set(true); }
  editTeam(team: Team): void { this.form = { kind: 'team', name: team.name, code: team.code, department: team.department, lead: team.lead, capacity: team.capacity, focus: team.focus, membersText: team.members.join('، '), manager: '', parent: '', status: team.status }; this.editingId.set(team.id); this.dialogOpen.set(true); }
  editDepartment(department: Department): void { this.form = { kind: 'department', name: department.name, code: department.code, department: '', lead: '', capacity: 5, focus: '', membersText: '', manager: department.manager, parent: department.parent, status: department.status }; this.editingId.set(department.id); this.dialogOpen.set(true); }
  closeDialog(): void { this.dialogOpen.set(false); }
  saveEntity(): void {
    const name = this.form.name.trim(); const code = this.form.code.trim().toUpperCase();
    if (this.form.kind === 'team') {
      if (this.teams().some(team => team.code.toLowerCase() === code.toLowerCase() && team.id !== this.editingId())) { this.showToast('کد این تیم قبلاً استفاده شده است.'); return; }
      if (this.editingId()) this.teams.update(items => items.map(team => team.id === this.editingId() ? { ...team, name, code, department: this.form.department, lead: this.form.lead, capacity: Number(this.form.capacity), focus: this.form.focus, members: this.parseMembers(this.form.membersText, this.form.lead), status: this.form.status } : team));
      else this.teams.update(items => [...items, { id: this.nextTeamId++, name, code, department: this.form.department, lead: this.form.lead, members: this.parseMembers(this.form.membersText, this.form.lead), capacity: Number(this.form.capacity), status: this.form.status, color: '#537ee8', focus: this.form.focus }]);
      this.showToast(this.editingId() ? 'اطلاعات تیم به‌روزرسانی شد.' : 'تیم جدید ایجاد شد.');
    } else {
      if (this.departments().some(department => department.code.toLowerCase() === code.toLowerCase() && department.id !== this.editingId())) { this.showToast('کد این دپارتمان قبلاً استفاده شده است.'); return; }
      if (this.editingId()) this.departments.update(items => items.map(department => department.id === this.editingId() ? { ...department, name, code, manager: this.form.manager, parent: this.form.parent, status: this.form.status } : department));
      else this.departments.update(items => [...items, { id: this.nextDepartmentId++, name, code, manager: this.form.manager, parent: this.form.parent, teams: 0, members: 0, status: this.form.status, color: '#537ee8' }]);
      this.showToast(this.editingId() ? 'اطلاعات دپارتمان به‌روزرسانی شد.' : 'دپارتمان جدید ایجاد شد.');
    }
    this.closeDialog();
  }
  parseMembers(value: string, lead: string): string[] { const names = value.split(/[،,]/).map(item => item.trim()).filter(Boolean); return [...new Set([lead.trim(), ...names].filter(Boolean))]; }
  showDepartmentTeams(name: string): void { this.activeTab.set('teams'); this.departmentFilter.set(name); this.searchTerm.set(''); }
  exportData(): void { const rows = [['نوع','نام','کد','واحد / مدیر','وضعیت'], ...this.departments().map(d => ['دپارتمان',d.name,d.code,d.manager,d.status]), ...this.teams().map(t => ['تیم',t.name,t.code,`${t.department} / ${t.lead}`,t.status])]; const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ashkan-organization.csv'; anchor.click(); URL.revokeObjectURL(url); }
  showToast(message: string): void { this.toast.set(message); if (this.toastTimer) clearTimeout(this.toastTimer); this.toastTimer = setTimeout(() => this.toast.set(''), 2800); }
}
