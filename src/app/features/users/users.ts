import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type UserStatus = 'فعال' | 'دعوت‌شده' | 'غیرفعال';
type UserRole = 'مدیر سامانه' | 'مدیر پشتیبانی' | 'سرپرست تیم' | 'کارشناس' | 'مشتری' | 'ممیز';
type TabKey = 'users' | 'roles' | 'permissions';
interface UserRecord { id: number; name: string; email: string; role: UserRole; department: string; team: string; status: UserStatus; lastSeen: string; initials: string; }
interface RoleRecord { name: UserRole; description: string; members: number; color: string; }
interface PermissionGroup { title: string; permissions: { key: string; label: string }[]; }

@Component({
  selector: 'ah-users', standalone: true, imports: [FormsModule], styleUrl: './users.scss',
  template: `
    <div class="users-page" dir="rtl">
      <header class="page-heading">
        <div><div class="eyebrow"><span class="eyebrow-dot"></span> مدیریت هویت و دسترسی</div><h1>کاربران و دسترسی‌ها</h1><p>اعضا، نقش‌ها و مجوزهای فضای کاری را از یک نقطه مدیریت کنید.</p></div>
        <div class="heading-actions"><button class="button button-ghost" type="button" (click)="exportUsers()">↓ خروجی کاربران</button><button class="button button-primary" type="button" (click)="openCreate()">＋ افزودن کاربر</button></div>
      </header>

      <section class="user-stats">
        <article><span class="stat-icon blue">♙</span><div><small>کل کاربران</small><strong>{{ users().length }}</strong><em>در فضای کاری</em></div></article>
        <article><span class="stat-icon green">✓</span><div><small>کاربران فعال</small><strong>{{ activeCount() }}</strong><em>دارای دسترسی</em></div></article>
        <article><span class="stat-icon amber">✉</span><div><small>دعوت‌های در انتظار</small><strong>{{ invitedCount() }}</strong><em>منتظر پذیرش</em></div></article>
        <article><span class="stat-icon violet">♧</span><div><small>نقش‌های تعریف‌شده</small><strong>{{ roles.length }}</strong><em>قابل سفارشی‌سازی</em></div></article>
      </section>

      <nav class="management-tabs" aria-label="بخش‌های مدیریت کاربران">
        <button type="button" [class.active]="activeTab()==='users'" (click)="activeTab.set('users')">کاربران <span>{{ users().length }}</span></button>
        <button type="button" [class.active]="activeTab()==='roles'" (click)="activeTab.set('roles')">نقش‌ها <span>{{ roles.length }}</span></button>
        <button type="button" [class.active]="activeTab()==='permissions'" (click)="activeTab.set('permissions')">ماتریس مجوزها</button>
      </nav>

      @if (activeTab() === 'users') {
        <section class="management-panel">
          <div class="panel-toolbar"><div><h2>اعضای فضای کاری</h2><p>اطلاعات و وضعیت دسترسی اعضا را مدیریت کنید.</p></div><div class="toolbar-controls"><label class="search-box"><span>⌕</span><input [value]="searchTerm()" (input)="searchTerm.set(inputValue($event))" placeholder="جستجوی نام، ایمیل یا واحد..." aria-label="جستجوی کاربران"></label><select [value]="roleFilter()" (change)="roleFilter.set(inputValue($event))" aria-label="فیلتر نقش"><option value="">همه نقش‌ها</option>@for (role of roles; track role.name) {<option [value]="role.name">{{ role.name }}</option>}</select><select [value]="statusFilter()" (change)="statusFilter.set(inputValue($event))" aria-label="فیلتر وضعیت"><option value="">همه وضعیت‌ها</option><option>فعال</option><option>دعوت‌شده</option><option>غیرفعال</option></select></div></div>
          <div class="users-table-wrap"><table class="users-table"><thead><tr><th>کاربر</th><th>نقش</th><th>واحد / تیم</th><th>وضعیت</th><th>آخرین فعالیت</th><th>عملیات</th></tr></thead><tbody>
            @for (user of filteredUsers(); track user.id) {
              <tr><td><div class="member-cell"><span class="member-avatar" [class.avatar-green]="user.id%3===0" [class.avatar-orange]="user.id%3===1">{{ user.initials }}</span><span><strong>{{ user.name }}</strong><small>{{ user.email }}</small></span></div></td><td><span class="role-pill" [class.role-admin]="user.role==='مدیر سامانه'" [class.role-manager]="user.role==='مدیر پشتیبانی'">{{ user.role }}</span></td><td><span class="department-cell">{{ user.department }}<small>{{ user.team }}</small></span></td><td><span class="status-pill" [class.status-active]="user.status==='فعال'" [class.status-invited]="user.status==='دعوت‌شده'" [class.status-disabled]="user.status==='غیرفعال'"><i></i>{{ user.status }}</span></td><td class="last-seen">{{ user.lastSeen }}</td><td><div class="row-actions"><button type="button" (click)="editUser(user)" aria-label="ویرایش کاربر">✎</button><button type="button" (click)="toggleStatus(user)" [attr.aria-label]="user.status==='غیرفعال'?'فعال‌سازی کاربر':'غیرفعال‌سازی کاربر'">{{ user.status==='غیرفعال' ? '↻' : '⋯' }}</button></div></td></tr>
            } @empty { <tr><td colspan="6"><div class="users-empty"><strong>کاربری پیدا نشد</strong><span>عبارت جستجو یا فیلترها را تغییر دهید.</span></div></td></tr> }
          </tbody></table></div>
          <footer class="table-footer"><span>نمایش {{ filteredUsers().length }} کاربر از {{ users().length }} عضو</span><span>اطلاعات این صفحه نمونه و محلی است.</span></footer>
        </section>
      }

      @if (activeTab() === 'roles') {
        <section class="roles-layout"><div class="roles-intro"><div><h2>نقش‌های دسترسی</h2><p>نقش‌ها مجموعه‌ای از مجوزها هستند که به کاربران اختصاص داده می‌شوند.</p></div><button class="button button-primary" type="button" (click)="showToast('ساخت نقش سفارشی در نسخه بعدی این ماژول تکمیل می‌شود.')">＋ ایجاد نقش</button></div>
          <div class="role-grid">@for (role of roles; track role.name) {<article class="role-card"><div class="role-card-top"><span class="role-symbol" [style.background]="role.color">♙</span><span class="role-member-count">{{ role.members }} عضو</span></div><h3>{{ role.name }}</h3><p>{{ role.description }}</p><div class="role-card-bottom"><span>دسترسی‌های تعریف‌شده</span><button type="button" (click)="selectRole(role.name)">مشاهده مجوزها ←</button></div></article>}</div>
        </section>
      }

      @if (activeTab() === 'permissions') {
        <section class="management-panel permission-panel"><div class="panel-toolbar"><div><h2>ماتریس مجوزها</h2><p>نمایش نمونه مجوزهای هر نقش؛ تغییرات واقعی پس از اتصال Backend اعمال می‌شوند.</p></div><select [value]="selectedRole()" (change)="setSelectedRole(inputValue($event))" aria-label="انتخاب نقش">@for (role of roles; track role.name) {<option [value]="role.name">{{ role.name }}</option>}</select></div>
          @for (group of permissionGroups; track group.title) {<div class="permission-group"><h3>{{ group.title }}</h3><div class="permission-grid">@for (permission of group.permissions; track permission.key) {<label class="permission-item"><span>{{ permission.label }}</span><input type="checkbox" [checked]="hasPermission(selectedRole(), permission.key)" (change)="togglePermission(selectedRole(), permission.key, $event)"><i></i></label>}</div></div>}
          <div class="permission-note">ⓘ این ماتریس صرفاً پیش‌نمایش رابط کاربری است. کنترل نهایی مجوزها باید در API و سمت سرور انجام شود.</div>
        </section>
      }

      @if (dialogOpen()) {
        <div class="dialog-backdrop" (click)="closeDialog()"><section class="user-dialog" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title" (click)="$event.stopPropagation()">
          <header><div><h2 id="user-dialog-title">{{ editingId() ? 'ویرایش اطلاعات کاربر' : 'افزودن کاربر جدید' }}</h2><p>اطلاعات پایه و سطح دسترسی عضو را مشخص کنید.</p></div><button type="button" class="dialog-close" (click)="closeDialog()" aria-label="بستن">×</button></header>
          <form (ngSubmit)="saveUser()"><div class="form-grid"><label>نام و نام خانوادگی<input name="name" [(ngModel)]="form.name" required minlength="2" placeholder="مثلاً سارا محمدی"></label><label>ایمیل سازمانی<input name="email" [(ngModel)]="form.email" type="email" required placeholder="name@company.com"></label><label>نقش کاربری<select name="role" [(ngModel)]="form.role">@for (role of roles; track role.name) {<option [value]="role.name">{{ role.name }}</option>}</select></label><label>واحد سازمانی<input name="department" [(ngModel)]="form.department" required placeholder="مثلاً فناوری اطلاعات"></label><label>تیم<input name="team" [(ngModel)]="form.team" placeholder="مثلاً پشتیبانی نرم‌افزار"></label><label>وضعیت حساب<select name="status" [(ngModel)]="form.status"><option>فعال</option><option>دعوت‌شده</option><option>غیرفعال</option></select></label></div><div class="dialog-actions"><button class="button button-ghost" type="button" (click)="closeDialog()">انصراف</button><button class="button button-primary" type="submit">{{ editingId() ? 'ذخیره تغییرات' : 'افزودن کاربر' }}</button></div></form>
        </section></div>
      }
      @if (toast()) {<div class="users-toast" role="status">✦ {{ toast() }}</div>}
    </div>
  `
})
export class UsersComponent {
  readonly activeTab = signal<TabKey>('users');
  readonly searchTerm = signal(''); readonly roleFilter = signal(''); readonly statusFilter = signal('');
  readonly dialogOpen = signal(false); readonly editingId = signal<number | null>(null); readonly toast = signal('');
  readonly selectedRole = signal<UserRole>('مدیر پشتیبانی');
  private nextId = 8;
  private toastTimer?: ReturnType<typeof setTimeout>;
  readonly users = signal<UserRecord[]>([
    { id: 1, name: 'محمد رضایی', email: 'm.rezaei@ashkan.ir', role: 'مدیر سامانه', department: 'مدیریت فناوری', team: 'راهبران سامانه', status: 'فعال', lastSeen: 'هم‌اکنون', initials: 'مر' },
    { id: 2, name: 'سارا محمدی', email: 's.mohammadi@ashkan.ir', role: 'مدیر پشتیبانی', department: 'خدمات فناوری', team: 'مدیریت پشتیبانی', status: 'فعال', lastSeen: '۱۰ دقیقه پیش', initials: 'سم' },
    { id: 3, name: 'علی کریمی', email: 'a.karimi@ashkan.ir', role: 'سرپرست تیم', department: 'فناوری اطلاعات', team: 'زیرساخت و شبکه', status: 'فعال', lastSeen: '۲۵ دقیقه پیش', initials: 'عک' },
    { id: 4, name: 'نازنین احمدی', email: 'n.ahmadi@ashkan.ir', role: 'کارشناس', department: 'خدمات نرم‌افزار', team: 'پشتیبانی نرم‌افزار', status: 'فعال', lastSeen: '۱ ساعت پیش', initials: 'نآ' },
    { id: 5, name: 'امیر حسینی', email: 'a.hosseini@ashkan.ir', role: 'کارشناس', department: 'خدمات فناوری', team: 'میز خدمت', status: 'دعوت‌شده', lastSeen: 'دعوت ارسال شده', initials: 'اح' },
    { id: 6, name: 'نگار احمدی', email: 'n.ahmadi2@ashkan.ir', role: 'مشتری', department: 'منابع انسانی', team: 'کاربران سازمانی', status: 'فعال', lastSeen: 'دیروز', initials: 'نآ' },
    { id: 7, name: 'رضا موسوی', email: 'r.mousavi@ashkan.ir', role: 'ممیز', department: 'کنترل داخلی', team: 'ممیزی و انطباق', status: 'غیرفعال', lastSeen: '۲ هفته پیش', initials: 'رم' }
  ]);
  readonly roles: RoleRecord[] = [
    { name: 'مدیر سامانه', description: 'مدیریت کامل تنظیمات، کاربران، امنیت و تمام بخش‌های سامانه.', members: 1, color: '#e9e5ff' },
    { name: 'مدیر پشتیبانی', description: 'نظارت بر عملیات پشتیبانی، SLA، تیم‌ها و گزارش‌های عملکرد.', members: 1, color: '#e4efff' },
    { name: 'سرپرست تیم', description: 'مدیریت اعضا، توزیع کار و پیگیری عملکرد تیم تخصصی.', members: 1, color: '#e2f6ef' },
    { name: 'کارشناس', description: 'رسیدگی به تیکت‌ها، درخواست‌ها و ارتباط با درخواست‌دهندگان.', members: 2, color: '#fff0df' },
    { name: 'مشتری', description: 'ثبت درخواست، مشاهده وضعیت و تعامل در تیکت‌های خود.', members: 1, color: '#fce8ef' },
    { name: 'ممیز', description: 'مشاهده سوابق و گزارش‌ها بدون امکان تغییر اطلاعات عملیاتی.', members: 1, color: '#e9edf3' }
  ];
  readonly permissionGroups: PermissionGroup[] = [
    { title: 'مدیریت تیکت‌ها', permissions: [{ key: 'tickets.view', label: 'مشاهده تیکت‌ها' }, { key: 'tickets.create', label: 'ایجاد تیکت' }, { key: 'tickets.edit', label: 'ویرایش تیکت' }, { key: 'tickets.assign', label: 'ارجاع به کارشناس' }, { key: 'tickets.close', label: 'بستن تیکت' }, { key: 'tickets.delete', label: 'حذف تیکت' }] },
    { title: 'مدیریت کاربران و سازمان', permissions: [{ key: 'users.view', label: 'مشاهده کاربران' }, { key: 'users.manage', label: 'مدیریت کاربران' }, { key: 'roles.manage', label: 'مدیریت نقش‌ها' }, { key: 'org.manage', label: 'مدیریت واحدها و تیم‌ها' }] },
    { title: 'گزارش‌ها و تنظیمات', permissions: [{ key: 'reports.view', label: 'مشاهده گزارش‌ها' }, { key: 'reports.export', label: 'خروجی گزارش‌ها' }, { key: 'sla.manage', label: 'مدیریت SLA' }, { key: 'settings.manage', label: 'مدیریت تنظیمات' }] }
  ];
  private readonly rolePermissions: Record<UserRole, Set<string>> = {
    'مدیر سامانه': new Set(this.permissionGroups.flatMap(group => group.permissions.map(item => item.key))),
    'مدیر پشتیبانی': new Set(['tickets.view','tickets.create','tickets.edit','tickets.assign','tickets.close','users.view','org.manage','reports.view','reports.export','sla.manage']),
    'سرپرست تیم': new Set(['tickets.view','tickets.create','tickets.edit','tickets.assign','tickets.close','users.view','reports.view']),
    'کارشناس': new Set(['tickets.view','tickets.create','tickets.edit','tickets.close']),
    'مشتری': new Set(['tickets.view','tickets.create']),
    'ممیز': new Set(['tickets.view','users.view','reports.view','reports.export'])
  };
  form = { name: '', email: '', role: 'کارشناس' as UserRole, department: '', team: '', status: 'دعوت‌شده' as UserStatus };
  readonly activeCount = computed(() => this.users().filter(user => user.status === 'فعال').length);
  readonly invitedCount = computed(() => this.users().filter(user => user.status === 'دعوت‌شده').length);
  readonly filteredUsers = computed(() => this.users().filter(user => {
    const query = this.searchTerm().trim().toLocaleLowerCase('fa');
    const matchesQuery = !query || [user.name, user.email, user.department, user.team].some(value => value.toLocaleLowerCase('fa').includes(query));
    return matchesQuery && (!this.roleFilter() || user.role === this.roleFilter()) && (!this.statusFilter() || user.status === this.statusFilter());
  }));
  inputValue(event: Event): string { return (event.target as HTMLInputElement).value; }
  openCreate(): void { this.editingId.set(null); this.form = { name: '', email: '', role: 'کارشناس', department: '', team: '', status: 'دعوت‌شده' }; this.dialogOpen.set(true); }
  editUser(user: UserRecord): void { this.editingId.set(user.id); this.form = { name: user.name, email: user.email, role: user.role, department: user.department, team: user.team, status: user.status }; this.dialogOpen.set(true); }
  closeDialog(): void { this.dialogOpen.set(false); }
  saveUser(): void {
    const email = this.form.email.trim().toLocaleLowerCase();
    if (this.users().some(user => user.email.toLocaleLowerCase() === email && user.id !== this.editingId())) { this.showToast('این نشانی ایمیل قبلاً ثبت شده است.'); return; }
    if (this.editingId()) {
      this.users.update(items => items.map(user => user.id === this.editingId() ? { ...user, ...this.form, email, initials: this.initials(this.form.name) } : user));
      this.showToast('اطلاعات کاربر به‌روزرسانی شد.');
    } else {
      this.users.update(items => [...items, { id: this.nextId++, ...this.form, email, lastSeen: 'هنوز وارد نشده', initials: this.initials(this.form.name) }]);
      this.showToast('کاربر جدید به فهرست نمایشی اضافه شد.');
    }
    this.closeDialog();
  }
  toggleStatus(user: UserRecord): void {
    const status: UserStatus = user.status === 'غیرفعال' ? 'فعال' : 'غیرفعال';
    this.users.update(items => items.map(item => item.id === user.id ? { ...item, status } : item));
    this.showToast(`وضعیت ${user.name} به «${status}» تغییر کرد.`);
  }
  selectRole(role: UserRole): void { this.selectedRole.set(role); this.activeTab.set('permissions'); }
  setSelectedRole(value: string): void { if (this.roles.some(role => role.name === value)) this.selectedRole.set(value as UserRole); }
  hasPermission(role: UserRole, permission: string): boolean { return this.rolePermissions[role].has(permission); }
  togglePermission(role: UserRole, permission: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    checked ? this.rolePermissions[role].add(permission) : this.rolePermissions[role].delete(permission);
    this.showToast('تغییر مجوز فقط در پیش‌نمایش محلی ثبت شد.');
  }
  initials(name: string): string { return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] ?? '').join(''); }
  exportUsers(): void {
    const header = ['نام','ایمیل','نقش','واحد','تیم','وضعیت'];
    const rows = this.filteredUsers().map(user => [user.name,user.email,user.role,user.department,user.team,user.status]);
    const csv = '\uFEFF' + [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ashkan-users.csv'; anchor.click(); URL.revokeObjectURL(url);
  }
  showToast(message: string): void { this.toast.set(message); if (this.toastTimer) clearTimeout(this.toastTimer); this.toastTimer = setTimeout(() => this.toast.set(''), 2800); }
}
