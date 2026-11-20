import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ShieldCheck, UserRound, UsersRound, Headset, BriefcaseBusiness, Eye, CheckCircle2 } from 'lucide-angular';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'invite';
type UserRole = 'admin' | 'manager' | 'agent' | 'customer';
type PermissionKey =
  | 'dashboard.view' | 'tickets.view' | 'tickets.create' | 'tickets.manage'
  | 'users.view' | 'users.manage' | 'roles.manage' | 'reports.view'
  | 'billing.view' | 'settings.manage' | 'audit.view' | 'knowledge.manage' | 'portal.use';

const PERMISSIONS: Record<PermissionKey, string> = {
  'dashboard.view':'مشاهده داشبورد','tickets.view':'مشاهده تیکت‌ها','tickets.create':'ایجاد تیکت','tickets.manage':'مدیریت تیکت‌ها',
  'users.view':'مشاهده کاربران','users.manage':'مدیریت کاربران','roles.manage':'مدیریت نقش‌ها','reports.view':'گزارش‌ها',
  'billing.view':'مالی و صورتحساب','settings.manage':'تنظیمات سامانه','audit.view':'لاگ ممیزی','knowledge.manage':'مدیریت دانش','portal.use':'پورتال کاربر'
};
const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  admin:['dashboard.view','tickets.view','tickets.create','tickets.manage','users.view','users.manage','roles.manage','reports.view','billing.view','settings.manage','audit.view','knowledge.manage','portal.use'],
  manager:['dashboard.view','tickets.view','tickets.create','tickets.manage','users.view','reports.view','audit.view','knowledge.manage','portal.use'],
  agent:['dashboard.view','tickets.view','tickets.create','tickets.manage','reports.view','knowledge.manage','portal.use'],
  customer:['dashboard.view','tickets.view','tickets.create','portal.use']
};
interface SessionDevice {id:string;device:string;browser:string;location:string;lastSeen:string;current:boolean;}


const ROLE_META: Record<UserRole, {label:string; description:string; permissions:string[]}> = {
  admin: { label:'مدیر سامانه', description:'دسترسی کامل به مدیریت، امنیت، تنظیمات و گزارش‌ها.', permissions:['مدیریت کاربران و نقش‌ها','تنظیمات و امنیت سازمان','گزارش‌ها، مالی و ممیزی','مدیریت تیکت و SLA'] },
  manager: { label:'مدیر پشتیبانی', description:'مدیریت تیم‌ها، صف‌ها، SLA و عملکرد کارشناسان.', permissions:['مدیریت تیم و صف','SLA و Escalation','گزارش عملکرد','مدیریت تیکت‌ها'] },
  agent: { label:'کارشناس پشتیبانی', description:'رسیدگی به تیکت‌های تخصیص‌یافته و ارتباط با مشتری.', permissions:['مشاهده و پاسخ تیکت','Knowledge Base','Live Chat و Macro','مشاهده SLA تیکت'] },
  customer: { label:'کاربر / مشتری', description:'ثبت درخواست و پیگیری خدمات در پورتال شخصی.', permissions:['ثبت تیکت','پیگیری درخواست‌ها','پایگاه دانش','ثبت رضایت'] }
};

@Component({
  selector: 'ah-auth',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule],
  template: `
    <main class="auth-page" dir="rtl">
      <section class="auth-visual" aria-label="معرفی Ashkan HelpDesk">
        <a class="auth-brand" routerLink="/auth/login" aria-label="Ashkan HelpDesk">
          <span class="brand-symbol">A</span><span class="brand-name">Ashkan<span>HelpDesk</span></span>
        </a>
        <div class="visual-copy">
          <span class="visual-eyebrow"><i></i> پلتفرم یکپارچه خدمات و پشتیبانی</span>
          <h1>پشتیبانی هوشمند،<br><em>تجربه‌ای متفاوت.</em></h1>
          <p>درخواست‌ها، تیم‌ها و تجربه مشتریان را در یک فضای کاری منسجم مدیریت کنید.</p>
          <div class="visual-metrics">
            <div><strong>24/7</strong><small>دسترسی به فضای کاری</small></div>
            <div><strong>360°</strong><small>دید یکپارچه پشتیبانی</small></div>
            <div><strong>۱۰۰٪</strong><small>قابل مدیریت و توسعه</small></div>
          </div>
        </div>
        <div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
        <div class="visual-card card-top"><span class="mini-icon">✦</span><span><b>مرکز کنترل پشتیبانی</b><small>همه چیز در یک نگاه</small></span><i class="live-dot"></i></div>
        <div class="visual-card card-bottom"><span class="mini-chart">↗</span><span><b>عملکرد تیم</b><small>شفاف، قابل سنجش، هوشمند</small></span></div>
        <div class="visual-footer"><span>ساخته‌شده برای تیم‌هایی که اهمیت می‌دهند.</span><span>© ۱۴۰۵ Ashkan</span></div>
      </section>

      <section class="auth-content">
        <div class="auth-mobile-brand"><span class="brand-symbol">A</span><span class="brand-name">Ashkan<span>HelpDesk</span></span></div>
        <div class="auth-form-wrap">
          <div class="form-heading">
            <span class="form-kicker">{{ kicker() }}</span>
            <h2>{{ heading() }}</h2>
            <p>{{ description() }}</p>
          </div>

          @if (mode() === 'login') {
            <form class="auth-form" (ngSubmit)="submit()">
              <label class="field-label" for="login-email">ایمیل سازمانی</label>
              <div class="input-wrap"><span class="input-icon">✉</span><input id="login-email" name="email" type="email" [(ngModel)]="email" placeholder="name@company.com" autocomplete="username" required></div>
              <div class="label-row"><label class="field-label" for="login-password">رمز عبور</label><a routerLink="/auth/forgot-password">فراموشی رمز عبور؟</a></div>
              <div class="input-wrap"><span class="input-icon">♧</span><input id="login-password" name="password" [type]="passwordVisible() ? 'text' : 'password'" [(ngModel)]="password" placeholder="رمز عبور خود را وارد کنید" autocomplete="current-password" required minlength="8"><button class="visibility-button" type="button" (click)="passwordVisible.update(v => !v)" [attr.aria-label]="passwordVisible() ? 'مخفی کردن رمز' : 'نمایش رمز'">{{ passwordVisible() ? 'پنهان' : 'نمایش' }}</button></div>

              <div class="role-picker">
                <div class="role-picker-head"><div><strong>نوع دسترسی</strong><small>برای دمو، نقش کاربری را انتخاب کنید</small></div><i-lucide [img]="ShieldCheck" [size]="17"></i-lucide></div>
                <div class="role-options">
                  @for (role of roleOptions; track role.key) {
                    <button type="button" class="role-option" [class.selected]="selectedRole === role.key" (click)="selectRole(role.key)">
                      <span class="role-icon"><i-lucide [img]="role.icon" [size]="16"></i-lucide></span>
                      <span><strong>{{ role.label }}</strong><small>{{ role.description }}</small></span>
                      @if (selectedRole === role.key) { <i-lucide class="role-check" [img]="CheckCircle2" [size]="16"></i-lucide> }
                    </button>
                  }
                </div>
                <div class="permission-preview"><strong>دسترسی‌های این نقش</strong><div>@for (permission of selectedPermissions(); track permission) { <span><i>✓</i>{{ permission }}</span> }</div></div>
              </div>

              <label class="remember-row"><input type="checkbox" name="remember" [(ngModel)]="rememberMe"><span class="custom-check"></span><span>مرا به خاطر بسپار</span></label>
              <button class="submit-button" type="submit" [disabled]="busy()">{{ busy() ? 'در حال بررسی...' : 'ورود به فضای کاری' }}<span>←</span></button>
            </form>
            <div class="form-bottom">هنوز حساب کاربری ندارید؟ <a routerLink="/auth/register">ایجاد حساب کاربری</a></div>
          } @else if (mode() === 'register') {
            <form class="auth-form" (ngSubmit)="submit()">
              <div class="two-fields"><div><label class="field-label" for="first-name">نام</label><div class="input-wrap"><input id="first-name" name="firstName" [(ngModel)]="firstName" placeholder="نام" required></div></div><div><label class="field-label" for="last-name">نام خانوادگی</label><div class="input-wrap"><input id="last-name" name="lastName" [(ngModel)]="lastName" placeholder="نام خانوادگی" required></div></div></div>
              <label class="field-label" for="register-email">ایمیل سازمانی</label><div class="input-wrap"><span class="input-icon">✉</span><input id="register-email" name="email" type="email" [(ngModel)]="email" placeholder="name@company.com" autocomplete="email" required></div>
              <label class="field-label" for="register-password">رمز عبور</label><div class="input-wrap"><span class="input-icon">♧</span><input id="register-password" name="password" [type]="passwordVisible() ? 'text' : 'password'" [(ngModel)]="password" (input)="updatePasswordStrength()" placeholder="حداقل ۸ کاراکتر" autocomplete="new-password" required minlength="8"><button class="visibility-button" type="button" (click)="passwordVisible.update(v => !v)">نمایش</button></div>
              <div class="strength-track"><span [style.width.%]="passwordStrength() * 25"></span></div><small class="strength-label">قدرت رمز عبور: {{ strengthLabel() }}</small>

              <div class="register-role-note"><i-lucide [img]="UserRound" [size]="16"></i-lucide><div><strong>نقش حساب</strong><span>در ثبت‌نام سازمانی، نقش نهایی توسط مدیر تأیید می‌شود.</span></div></div>
              <label class="remember-row terms-row"><input type="checkbox" name="terms" [(ngModel)]="acceptedTerms" required><span class="custom-check"></span><span>با <a href="#terms" (click)="$event.preventDefault()">شرایط استفاده</a> و سیاست حفظ حریم خصوصی موافقم.</span></label>
              <button class="submit-button" type="submit" [disabled]="busy()">{{ busy() ? 'در حال ایجاد...' : 'ایجاد حساب کاربری' }}<span>←</span></button>
            </form>
            <div class="form-bottom">قبلاً ثبت‌نام کرده‌اید؟ <a routerLink="/auth/login">وارد شوید</a></div>
          } @else if (mode() === 'forgot') {
            <form class="auth-form" (ngSubmit)="submit()"><label class="field-label" for="forgot-email">آدرس ایمیل</label><div class="input-wrap"><span class="input-icon">✉</span><input id="forgot-email" name="email" type="email" [(ngModel)]="email" placeholder="name@company.com" autocomplete="email" required></div><button class="submit-button" type="submit" [disabled]="busy()">{{ busy() ? 'در حال ارسال...' : 'ارسال لینک بازیابی' }}<span>←</span></button></form>
            <div class="form-bottom"><a routerLink="/auth/login">→ بازگشت به صفحه ورود</a></div>
          } @else if (mode() === 'reset') {
            <form class="auth-form" (ngSubmit)="submit()"><label class="field-label" for="new-password">رمز عبور جدید</label><div class="input-wrap"><input id="new-password" name="password" [type]="passwordVisible() ? 'text' : 'password'" [(ngModel)]="password" placeholder="حداقل ۸ کاراکتر" required minlength="8"><button class="visibility-button" type="button" (click)="passwordVisible.update(v => !v)">نمایش</button></div><label class="field-label" for="confirm-password">تکرار رمز عبور</label><div class="input-wrap"><input id="confirm-password" name="confirmPassword" type="password" [(ngModel)]="confirmPassword" placeholder="رمز عبور را دوباره وارد کنید" required minlength="8"></div><button class="submit-button" type="submit" [disabled]="busy()">ثبت رمز عبور جدید<span>←</span></button></form><div class="form-bottom"><a routerLink="/auth/login">→ بازگشت به ورود</a></div>
          } @else {
            <div class="invite-panel"><span class="invite-icon">✦</span><h3>به فضای کاری دعوت شده‌اید</h3><p>برای پذیرش دعوت‌نامه و تکمیل اطلاعات حساب، ادامه دهید.</p><form class="auth-form" (ngSubmit)="submit()"><label class="field-label" for="invite-name">نام و نام خانوادگی</label><div class="input-wrap"><input id="invite-name" name="fullName" [(ngModel)]="fullName" placeholder="نام کامل شما" required></div><label class="field-label" for="invite-password">انتخاب رمز عبور</label><div class="input-wrap"><input id="invite-password" name="password" type="password" [(ngModel)]="password" placeholder="حداقل ۸ کاراکتر" required minlength="8"></div><button class="submit-button" type="submit">پذیرش دعوت‌نامه<span>←</span></button></form></div>
          }

          @if (feedback()) { <div class="feedback" [class.feedback-error]="feedbackType() === 'error'" role="status"><span>{{ feedbackType() === 'error' ? '!' : '✓' }}</span>{{ feedback() }}</div> }
          <div class="security-note"><span>♢</span><span>ارتباط شما در نسخه نهایی با رمزنگاری و سیاست‌های امنیتی سازمان محافظت می‌شود.</span></div>
        </div>
        <div class="auth-legal"><span>© ۱۴۰۵ Ashkan HelpDesk</span><span><a href="#privacy">حریم خصوصی</a><i></i><a href="#support">پشتیبانی</a></span></div>
      </section>
    </main>
  `,
  styleUrl: './auth.scss'
})
export class AuthComponent {
  readonly mode = signal<AuthMode>('login');
  readonly passwordVisible = signal(false);
  readonly busy = signal(false);
  readonly feedback = signal('');
  readonly feedbackType = signal<'success' | 'error'>('success');
  readonly passwordStrength = signal(0);
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  fullName = '';
  rememberMe = true;
  acceptedTerms = false;
  selectedRole: UserRole = 'agent';
  readonly roleOptions = [
    { key:'admin' as UserRole, icon: ShieldCheck, ...ROLE_META.admin },
    { key:'manager' as UserRole, icon: BriefcaseBusiness, ...ROLE_META.manager },
    { key:'agent' as UserRole, icon: Headset, ...ROLE_META.agent },
    { key:'customer' as UserRole, icon: UserRound, ...ROLE_META.customer }
  ];
  readonly ShieldCheck = ShieldCheck; readonly UserRound = UserRound; readonly UsersRound = UsersRound;
  readonly Headset = Headset; readonly BriefcaseBusiness = BriefcaseBusiness; readonly Eye = Eye; readonly CheckCircle2 = CheckCircle2;
  readonly selectedPermissions = computed(() => ROLE_META[this.selectedRole].permissions);
  readonly activeSessions = signal<SessionDevice[]>([
    {id:'s1',device:'Windows Desktop',browser:'Chrome',location:'Tehran',lastSeen:'همین الان',current:true},
    {id:'s2',device:'Android Mobile',browser:'Chrome Mobile',location:'Tehran',lastSeen:'۳۵ دقیقه پیش',current:false},
    {id:'s3',device:'MacBook',browser:'Safari',location:'تهران',lastSeen:'دیروز',current:false}
  ]);
  showSecurityPanel = signal(false);
  mfaEnabled = signal(false);
  readonly permissionGroups = computed(() => {
    const keys=ROLE_PERMISSIONS[this.selectedRole];
    return [
      {title:'داشبورد و تیکت',items:keys.filter(k=>k.startsWith('dashboard')||k.startsWith('tickets')).map(k=>PERMISSIONS[k])},
      {title:'کاربران و امنیت',items:keys.filter(k=>k.startsWith('users')||k.startsWith('roles')||k==='audit.view').map(k=>PERMISSIONS[k])},
      {title:'گزارش و تنظیمات',items:keys.filter(k=>k.startsWith('reports')||k.startsWith('billing')||k.startsWith('settings')).map(k=>PERMISSIONS[k])},
      {title:'دانش و پورتال',items:keys.filter(k=>k.startsWith('knowledge')||k.startsWith('portal')).map(k=>PERMISSIONS[k])}
    ].filter(x=>x.items.length);
  });
  toggleSecurityPanel():void{this.showSecurityPanel.update(v=>!v);}
  toggleMfa():void{this.mfaEnabled.update(v=>!v);}
  terminateSession(id:string):void{this.activeSessions.update(xs=>xs.filter(x=>x.id!==id));}
  terminateOtherSessions():void{this.activeSessions.update(xs=>xs.filter(x=>x.current));}


  readonly kicker = computed(() => ({ login: 'خوش آمدید', register: 'شروعی تازه', forgot: 'بازیابی دسترسی', reset: 'امنیت حساب', invite: 'دعوت‌نامه سازمانی' })[this.mode()]);
  readonly heading = computed(() => ({ login: 'ورود به حساب کاربری', register: 'حساب خود را بسازید', forgot: 'رمز عبور را فراموش کرده‌اید؟', reset: 'رمز عبور جدید بسازید', invite: 'عضویت در فضای کاری' })[this.mode()]);
  readonly description = computed(() => ({ login: 'برای ادامه، اطلاعات حساب کاربری خود را وارد کنید.', register: 'برای پیوستن به فضای کاری Ashkan اطلاعات زیر را تکمیل کنید.', forgot: 'ایمیل ثبت‌شده را وارد کنید تا راهنمای بازیابی برایتان ارسال شود.', reset: 'یک رمز عبور قوی و منحصربه‌فرد برای حساب خود انتخاب کنید.', invite: 'اطلاعات خود را تکمیل کنید تا به تیم سازمان بپیوندید.' })[this.mode()]);
  readonly strengthLabel = computed(() => ['—', 'ضعیف', 'متوسط', 'خوب', 'قوی'][this.passwordStrength()]);

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.mode.set((this.route.snapshot.data['mode'] as AuthMode | undefined) ?? 'login');
  }

  selectRole(role: UserRole): void { this.selectedRole = role; }
  roleLabel(): string { return ROLE_META[this.selectedRole].label; }

  updatePasswordStrength(): void { this.passwordStrength.set(this.passwordScore(this.password)); }

  passwordScore(value: string): number {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  submit(): void {
    this.feedback.set('');
    const mode = this.mode();
    if (mode === 'reset' && this.password !== this.confirmPassword) {
      this.setFeedback('تکرار رمز عبور با رمز جدید مطابقت ندارد.', 'error'); return;
    }
    if (mode === 'register' && !this.acceptedTerms) {
      this.setFeedback('برای ادامه، پذیرش شرایط استفاده الزامی است.', 'error'); return;
    }
    if ((mode === 'register' || mode === 'reset' || mode === 'invite') && this.password.length < 8) {
      this.setFeedback('رمز عبور باید حداقل ۸ کاراکتر داشته باشد.', 'error'); return;
    }
    this.busy.set(true);

    if (mode === 'login') {
      localStorage.setItem('ashkan.demo.session', 'true');
      localStorage.setItem('ashkan.demo.role', this.selectedRole);
      localStorage.setItem('ashkan.demo.name', this.email.split('@')[0] || 'کاربر');
      this.feedback.set(`ورود موفق با نقش «${this.roleLabel()}» انجام شد.`);
      this.feedbackType.set('success');
      this.busy.set(false);
      setTimeout(() => this.router.navigateByUrl('/dashboard'), 350);
      return;
    }

    if (mode === 'register') {
      const registeredRole: UserRole = 'customer';
      localStorage.setItem('ashkan.demo.session', 'true');
      localStorage.setItem('ashkan.demo.role', registeredRole);
      localStorage.setItem('ashkan.demo.name', `${this.firstName} ${this.lastName}`.trim() || 'کاربر جدید');
      this.feedback.set('حساب شما ایجاد شد و با دسترسی کاربر / مشتری وارد فضای کاری شدید.');
      this.feedbackType.set('success');
      this.busy.set(false);
      setTimeout(() => this.router.navigateByUrl('/dashboard'), 500);
      return;
    }

    const messages: Record<AuthMode, string> = {
      login: `ورود نمایشی با نقش «${this.roleLabel()}» انجام شد. ${ROLE_META[this.selectedRole].permissions.length} گروه دسترسی برای این نقش فعال است؛ احراز هویت و RBAC واقعی در Backend نهایی می‌شود.`,
      register: 'اطلاعات ثبت‌نام بررسی شد. ایجاد حساب واقعی پس از اتصال Backend فعال می‌شود.',
      forgot: 'در نسخه نمایشی، ایمیل ارسال نمی‌شود. ارسال لینک بازیابی پس از اتصال سرویس ایمیل فعال خواهد شد.',
      reset: 'اعتبارسنجی رمز جدید انجام شد. ثبت نهایی پس از اتصال Backend فعال می‌شود.',
      invite: 'فرم دعوت‌نامه آماده است. اعتبارسنجی توکن دعوت پس از اتصال Backend انجام می‌شود.'
    };
    this.setFeedback(messages[mode], 'success');
    this.busy.set(false);
  }

  private setFeedback(message: string, type: 'success' | 'error'): void {
    this.feedback.set(message); this.feedbackType.set(type);
  }
}
