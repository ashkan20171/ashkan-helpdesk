import { NotificationsComponent } from './features/notifications/notifications';
import { SurveysComponent } from './features/surveys/surveys';
import { KnowledgeBaseComponent } from './features/knowledge-base/knowledge-base';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AppSidebarComponent } from './layout/sidebar/app-sidebar';
import { AppHeaderComponent } from './layout/header/app-header';
import { DocumentsComponent } from './features/documents/documents';

interface QuickCommand { label: string; description: string; path?: string; keywords: string; group: string; }

@Component({
  selector: 'ah-root',
  standalone: true,
  imports: [RouterOutlet, AppSidebarComponent, AppHeaderComponent],
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
  template: `
    @if (isAuthPage()) {
      <router-outlet></router-outlet>
    } @else {
    <div class="app-shell" [class.sidebar-collapsed]="collapsed()" [class.dark-theme]="darkMode()" [class.mobile-navigation-open]="mobileMenuOpen()">
      <ah-app-sidebar [collapsed]="collapsed()" [mobileOpen]="mobileMenuOpen()" (toggleCollapsed)="collapsed.set(!collapsed())" (closeMobile)="mobileMenuOpen.set(false)" (toast)="showToast($event)"></ah-app-sidebar>
      @if (mobileMenuOpen()) { <button class="mobile-scrim" type="button" aria-label="بستن منو" (click)="mobileMenuOpen.set(false)"></button> }
      <main class="main-area">
        <ah-app-header [pageTitle]="pageTitle()" [darkMode]="darkMode()" [notificationsOpen]="showNotice()" [profileOpen]="profileOpen()" [unreadCount]="unreadCount()"
          (mobileMenu)="mobileMenuOpen.set(true)" (toggleTheme)="toggleTheme()" (toggleNotifications)="toggleNotice()" (toggleProfile)="toggleProfile()"
          (openSearch)="openCommandPalette()" (markAllRead)="markAllRead()" (viewAllNotifications)="showToast('مرکز اعلان‌ها در مرحله بعدی تکمیل می‌شود.')"
          (profileAction)="handleProfileAction($event)"></ah-app-header>
        <section class="page-content"><router-outlet></router-outlet></section>
        <footer class="app-footer"><span>© ۱۴۰۵ Ashkan HelpDesk</span><span>ساخته‌شده برای تجربه‌ای بهتر در پشتیبانی <b>✦</b></span><span>نسخه نمایشی ۰.۹.۰</span></footer>
      </main>

      @if (commandPaletteOpen()) {
        <div class="command-overlay" (click)="closeCommandPalette()">
          <section class="command-dialog" role="dialog" aria-modal="true" aria-label="جستجوی سریع" (click)="$event.stopPropagation()">
            <div class="command-search-row"><span class="command-search-icon">⌕</span><input #commandInput autofocus [value]="searchQuery()" (input)="updateSearch($event)" placeholder="چه کاری می‌خواهید انجام دهید؟" aria-label="جستجو در فرمان‌ها"><kbd>ESC</kbd><button type="button" aria-label="بستن" (click)="closeCommandPalette()">×</button></div>
            <div class="command-results">
              @if (filteredCommands().length) {
                @for (command of filteredCommands(); track command.label) {
                  <button class="command-result" type="button" (click)="executeCommand(command)"><span class="command-result-icon">{{ command.group === 'ناوبری' ? '↗' : '＋' }}</span><span class="command-result-copy"><strong>{{ command.label }}</strong><small>{{ command.description }}</small></span><kbd>↵</kbd></button>
                }
              } @else { <div class="command-empty"><strong>نتیجه‌ای پیدا نشد</strong><span>عبارت دیگری را جستجو کنید.</span></div> }
            </div>
            <div class="command-hint"><span>برای انتخاب از کلیدهای جهت‌نما استفاده کنید</span><span><kbd>⌘</kbd> + <kbd>K</kbd> جستجوی سریع</span></div>
          </section>
        </div>
      }
      @if (toast()) { <div class="toast" role="status"><span>✦</span>{{ toast() }}</div> }
    </div>
    }
  `
})
export class AppComponent {
  constructor(private readonly router: Router) {
    this.updatePageTitle();
    this.isAuthPage.set(this.router.url.startsWith('/auth/'));
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      this.updatePageTitle(); this.isAuthPage.set(this.router.url.startsWith('/auth/')); this.showNotice.set(false); this.profileOpen.set(false); this.mobileMenuOpen.set(false);
    });
  }

  readonly isAuthPage = signal(false);
  readonly collapsed = signal(false);
  readonly darkMode = signal(false);
  readonly showNotice = signal(false);
  readonly profileOpen = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly commandPaletteOpen = signal(false);
  readonly toast = signal('');
  readonly pageTitle = signal('داشبورد');
  readonly unreadCount = signal(2);
  readonly searchQuery = signal('');
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly commands: QuickCommand[] = [
    { label: 'جستجوی سراسری', description: 'جستجو در تیکت‌ها، کاربران، سازمان‌ها، دارایی‌ها، قراردادها و دانش', path: '/search', keywords: 'جستجو search global command center تیکت کاربر سازمان دارایی قرارداد دانش', group: 'ناوبری' },
    { label: 'موتور قوانین و اتوماسیون', description: 'ساخت قوانین شرطی، اقدام‌های خودکار و زمان‌بندی اجرا', path: '/automation', keywords: 'automation اتوماسیون قانون شرط رویداد محرک اقدام زمان بندی', group: 'ناوبری' },
    { label: 'اشتراک‌ها و صورتحساب‌ها', description: 'مدیریت پلن‌ها، تمدیدها، فاکتورها و پرداخت‌ها', path: '/billing', keywords: 'اشتراک صورتحساب فاکتور پرداخت تعرفه درآمد subscription billing invoice', group: 'ناوبری' },
    { label: 'مدیریت سازمان‌ها', description: 'مدیریت مستأجرها، دامنه‌ها و طرح‌های اشتراک', path: '/tenants', keywords: 'چندسازمانی چند مستاجری tenant organization workspace saas', group: 'ناوبری' },
    { label: 'پورتال خدمات کاربران', description: 'ثبت و پیگیری درخواست‌ها و دریافت خدمات', path: '/portal', keywords: 'پورتال کاربر مشتری سلف سرویس self service', group: 'ناوبری' },
    { label: 'رفتن به داشبورد', description: 'نمای کلی عملکرد و شاخص‌های پشتیبانی', path: '/dashboard', keywords: 'داشبورد خانه آمار', group: 'ناوبری' },
    { label: 'مدیریت تیکت‌ها', description: 'مشاهده، فیلتر و پیگیری درخواست‌ها', path: '/tickets', keywords: 'تیکت درخواست پشتیبانی', group: 'ناوبری' },
    { label: 'درخواست‌های خدمات', description: 'کاتالوگ خدمات، ثبت و تأیید درخواست‌ها', path: '/requests', keywords: 'درخواست خدمات کاتالوگ تأیید سرویس', group: 'ناوبری' },
    { label: 'کاربران و دسترسی‌ها', description: 'مدیریت اعضا، نقش‌ها و مجوزهای سازمان', path: '/users', keywords: 'کاربر نقش مجوز دسترسی permission', group: 'ناوبری' },
    { label: 'تیم‌ها و دپارتمان‌ها', description: 'مدیریت ساختار سازمانی، تیم‌ها و سرپرستان', path: '/organization', keywords: 'تیم دپارتمان واحد سازمان ساختار سرپرست', group: 'ناوبری' },
    { label: 'مدیریت SLA', description: 'تعریف زمان پاسخ اولیه و مهلت حل بر اساس اولویت', path: '/sla', keywords: 'sla سطح خدمات زمان پاسخ مهلت حل تعهد', group: 'ناوبری' },
    { label: 'موتور گردش کار', description: 'طراحی مراحل، شرط‌ها و تأییدهای خودکار', path: '/workflows', keywords: 'workflow گردش کار فرایند اتوماسیون تأیید مرحله', group: 'ناوبری' },
    { label: 'پایگاه دانش', description: 'مدیریت مقالات، راهنماها و محتوای آموزشی', path: '/knowledge', keywords: 'دانش مقاله راهنما مستندات knowledge base wiki', group: 'ناوبری' },
    { label: 'نظرسنجی و رضایت کاربران', description: 'مدیریت مقالات، راهنماها و محتوای آموزشی', path: '/knowledge', keywords: 'دانش مقاله راهنما مستندات knowledge base wiki', group: 'ناوبری' },
    { label: 'مرکز اطلاع‌رسانی', description: 'مدیریت مقالات، راهنماها و محتوای آموزشی', path: '/knowledge', keywords: 'دانش مقاله راهنما مستندات knowledge base wiki', group: 'ناوبری' },
    { label: 'مدیریت دارایی‌ها', description: 'ثبت تجهیزات، تخصیص، گارانتی و سوابق تعمیرات', path: '/assets', keywords: 'دارایی اموال تجهیزات سخت افزار لپ تاپ سریال گارانتی تعمیرات', group: 'ناوبری' },
    { label: 'قراردادها و تأمین‌کنندگان', description: 'مدیریت قراردادهای خرید، خدمات، تمدید و طرف‌های قرارداد', path: '/contracts', keywords: 'قرارداد تأمین کننده فروشنده خرید تمدید گارانتی تعهدات supplier contract', group: 'ناوبری' },
    { label: 'اسناد و آرشیو', description: 'مدیریت قراردادهای خرید، خدمات، تمدید و طرف‌های قرارداد', path: '/contracts', keywords: 'قرارداد تأمین کننده فروشنده خرید تمدید گارانتی تعهدات supplier contract', group: 'ناوبری' },
    { label: 'مدیریت خرید و سفارشات', description: 'درخواست خرید، مقایسه پیشنهادها، سفارش و رسید تحویل', path: '/procurement', keywords: 'تدارکات خرید سفارش خرید درخواست استعلام پیش فاکتور تأمین کالا procurement purchase order', group: 'ناوبری' },
    { label: 'مدیریت انبار و موجودی', description: 'فهرست کالاها، انبارها، گردش ورود و خروج و انتقال موجودی', path: '/inventory', keywords: 'انبار موجودی کالا ورود خروج انتقال انبارگردانی حداقل موجودی inventory warehouse stock', group: 'ناوبری' },
    { label: 'تعمیرات و نگهداری', description: 'دستورکار تعمیر، برنامه نگهداری پیشگیرانه و تاریخچه فنی دارایی‌ها', path: '/maintenance', keywords: 'تعمیرات نگهداری سرویس دوره ای پیشگیرانه تکنسین دستورکار maintenance preventive repair', group: 'ناوبری' },
    { label: 'مدیریت مالی و هزینه‌ها', description: 'دفتر هزینه، فاکتورها، پرداخت‌ها، بودجه و مراکز هزینه', path: '/finance', keywords: 'مالی هزینه پرداخت فاکتور بودجه مرکز هزینه حسابداری finance expense invoice payment budget', group: 'ناوبری' },
    { label: 'مدیریت API و یکپارچه‌سازی‌ها', description: 'کلیدهای دسترسی، وب‌هوک‌ها، اتصال سرویس‌ها و گزارش API', path: '/api-management', keywords: 'api key token webhook integration اتصال یکپارچه سازی کلید دسترسی مستندات', group: 'ناوبری' },
    { label: 'ثبت رویدادها و ممیزی', description: 'تاریخچه فعالیت کاربران، تغییرات و رویدادهای امنیتی', path: '/audit-log', keywords: 'audit log ممیزی رویداد تاریخچه فعالیت امنیت امنیتی ورود تغییرات', group: 'ناوبری' },
    { label: 'تنظیمات سامانه', description: 'پیکربندی عمومی، برندینگ، امنیت و کانال‌های ارتباطی', path: '/settings', keywords: 'تنظیمات پیکربندی امنیت ایمیل پیامک برندینگ timezone system settings', group: 'ناوبری' },
    { label: 'گزارش‌گیری و تحلیل', description: 'گزارش‌های مدیریتی، عملکرد تیم‌ها، SLA و رضایت کاربران', path: '/reports', keywords: 'گزارش تحلیل آمار نمودار عملکرد گزارش گیری analytics reports sla', group: 'ناوبری' },
    { label: 'کتابخانه طراحی', description: 'مشاهده کامپوننت‌ها و استانداردهای رابط کاربری', path: '/design-system', keywords: 'طراحی کامپوننت ui', group: 'ناوبری' },
    { label: 'ثبت تیکت جدید', description: 'ایجاد درخواست پشتیبانی جدید', keywords: 'ایجاد افزودن تیکت جدید', group: 'عملیات' },
    { label: 'دعوت از کاربر', description: 'افزودن عضو جدید به فضای کاری', keywords: 'کاربر دعوت عضو', group: 'عملیات' },
    { label: 'مشاهده گزارش‌ها', description: 'گزارش عملکرد و شاخص‌های کلیدی', keywords: 'گزارش تحلیل نمودار', group: 'عملیات' }
  ];
  readonly filteredCommands = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('fa');
    if (!query) return this.commands;
    return this.commands.filter(item => `${item.label} ${item.description} ${item.keywords}`.toLocaleLowerCase('fa').includes(query));
  });

  onDocumentKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); this.openCommandPalette();
    } else if (event.key === 'Escape') {
      this.closeCommandPalette(); this.showNotice.set(false); this.profileOpen.set(false);
    }
  }

  updatePageTitle(): void {
    const url = this.router.url;
    this.pageTitle.set(url.startsWith('/automation') ? 'موتور قوانین و اتوماسیون' : url.startsWith('/billing') ? 'اشتراک‌ها و صورتحساب‌ها' : url.startsWith('/tenants') ? 'مدیریت سازمان‌ها' : url.startsWith('/portal') ? 'پورتال خدمات کاربران' : url.startsWith('/tickets') ? 'مدیریت تیکت‌ها' : url.startsWith('/requests') ? 'درخواست‌های خدمات' : url.startsWith('/users') ? 'کاربران و دسترسی‌ها' : url.startsWith('/organization') ? 'تیم‌ها و دپارتمان‌ها' : url.startsWith('/sla') ? 'مدیریت SLA' : url.startsWith('/workflows') ? 'موتور گردش کار' : url.startsWith('/knowledge') ? 'پایگاه دانش' : url.startsWith('/assets') ? 'مدیریت دارایی‌ها' : url.startsWith('/contracts') ? 'قراردادها و تأمین‌کنندگان' : url.startsWith('/procurement') ? 'مدیریت خرید و سفارشات' : url.startsWith('/inventory') ? 'مدیریت انبار و موجودی' : url.startsWith('/maintenance') ? 'تعمیرات و نگهداری' : url.startsWith('/hr') ? 'منابع انسانی' : url.startsWith('/payroll') ? 'حقوق و دستمزد' : url.startsWith('/finance') ? 'مدیریت مالی و هزینه‌ها' : url.startsWith('/api-management') ? 'مدیریت API و یکپارچه‌سازی‌ها' : url.startsWith('/audit-log') ? 'ثبت رویدادها و ممیزی' : url.startsWith('/settings') ? 'تنظیمات سامانه' : url.startsWith('/reports') ? 'گزارش‌گیری و تحلیل' : url.startsWith('/design-system') ? 'کتابخانه طراحی' : url.startsWith('/search') ? 'جستجوی سراسری' : url.startsWith('/dashboard') || url === '/' ? 'داشبورد' : 'فضای کاری');
  }
  toggleTheme(): void { this.darkMode.update(value => !value); }
  toggleNotice(): void { this.showNotice.update(value => !value); this.profileOpen.set(false); }
  toggleProfile(): void { this.profileOpen.update(value => !value); this.showNotice.set(false); }
  markAllRead(): void { this.unreadCount.set(0); this.showNotice.set(false); this.showToast('همه اعلان‌ها خوانده شدند.'); }
  openCommandPalette(): void { this.searchQuery.set(''); this.commandPaletteOpen.set(true); this.showNotice.set(false); this.profileOpen.set(false); }
  closeCommandPalette(): void { this.commandPaletteOpen.set(false); this.searchQuery.set(''); }
  updateSearch(event: Event): void { this.searchQuery.set((event.target as HTMLInputElement).value); }
  executeCommand(command: QuickCommand): void {
    this.closeCommandPalette();
    if (command.path) this.router.navigateByUrl(command.path);
    else this.showToast(`${command.label} در فازهای بعدی فعال می‌شود.`);
  }
  handleProfileAction(action: string): void {
    this.profileOpen.set(false);
    this.showToast(action === 'خروج از حساب' ? 'خروج از حساب در نسخه متصل به سرویس احراز هویت فعال خواهد شد.' : `${action} در فازهای بعدی تکمیل می‌شود.`);
  }
  showToast(message: string): void {
    this.toast.set(message);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(''), 3000);
  }
}
