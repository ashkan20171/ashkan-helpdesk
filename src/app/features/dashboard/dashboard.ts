import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule, Activity, AlertCircle, ArrowDownLeft, ArrowLeft,
  ArrowUpLeft, ArrowUpRight, Bell, CalendarDays, CheckCircle2, ChevronDown,
  Clock3, Download, Headset, LifeBuoy, MoreHorizontal, Plus, RefreshCw,
  Search, ShieldCheck, Sparkles, Ticket, TrendingUp, Users, UserRound,
  Workflow, Zap
} from 'lucide-angular';

type DashboardRole = 'admin' | 'manager' | 'lead' | 'agent' | 'customer';
type Period = '7' | '30' | '90';
interface TicketItem {
  id: string; title: string; requester: string; assignee: string;
  priority: 'بحرانی' | 'بالا' | 'متوسط' | 'پایین';
  status: 'در حال بررسی' | 'در انتظار' | 'حل‌شده'; age: string;
}

@Component({
  selector: 'ah-dashboard',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  styleUrl: './dashboard.scss',
  template: `
    <div class="dashboard-page">
      <header class="dashboard-heading">
        <div class="heading-copy">
          <div class="eyebrow"><span class="eyebrow-dot"></span> چهارشنبه، ۲۸ آبان ۱۴۰۵ <span class="heading-divider">/</span> فضای کاری آریا</div>
          <h1>{{ greeting() }}، {{ activeRole() === 'customer' ? 'سارا' : activeRole() === 'agent' ? 'علی' : 'محمد' }} <span class="wave">✦</span></h1>
          <p>{{ roleDescription() }}</p>
        </div>
        <div class="heading-actions">
          <label class="role-switcher"><i-lucide [img]="UserRound" [size]="16"></i-lucide><span class="sr-only">نمایش داشبورد نقش</span>
            <select [value]="activeRole()" (change)="changeRole($event)">
              <option value="admin">مدیر سامانه</option><option value="manager">مدیر پشتیبانی</option><option value="lead">سرپرست تیم</option><option value="agent">کارشناس</option><option value="customer">مشتری</option>
            </select><i-lucide [img]="ChevronDown" [size]="14"></i-lucide>
          </label>
          <label class="period-select"><i-lucide [img]="CalendarDays" [size]="16"></i-lucide><span class="sr-only">بازه زمانی</span>
            <select [value]="period()" (change)="changePeriod($event)"><option value="7">۷ روز گذشته</option><option value="30">۳۰ روز گذشته</option><option value="90">۹۰ روز گذشته</option></select><i-lucide [img]="ChevronDown" [size]="14"></i-lucide>
          </label>
          <button class="button button-primary" type="button" (click)="quickAction()"><i-lucide [img]="Plus" [size]="17"></i-lucide>{{ activeRole() === 'customer' ? 'ثبت درخواست' : 'ایجاد تیکت' }}</button>
        </div>
      </header>

      <section class="welcome-banner">
        <div class="banner-orb orb-one"></div><div class="banner-orb orb-two"></div>
        <div class="banner-content">
          <div class="banner-tag"><i-lucide [img]="Sparkles" [size]="14"></i-lucide> {{ bannerEyebrow() }}</div>
          <h2>{{ bannerTitle() }}</h2><p>{{ bannerDescription() }}</p>
          <div class="banner-meta"><span><i-lucide [img]="TrendingUp" [size]="15"></i-lucide> ۱۲٪ بهبود نسبت به دوره قبل</span><span class="banner-separator"></span><span>آخرین به‌روزرسانی: همین حالا</span></div>
        </div>
        <div class="banner-illustration"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="banner-symbol"><i-lucide [img]="Headset" [size]="52" strokeWidth="1.35"></i-lucide></div><div class="floating-chip chip-top">✦ پاسخ سریع</div><div class="floating-chip chip-bottom"><span></span> تیم آنلاین است</div></div>
      </section>

      <section class="stats-grid" aria-label="شاخص‌های کلیدی">
        @for (metric of metrics(); track metric.label) {
          <article [class]="'stat-card ' + metric.tone">
            <div class="stat-top"><span class="stat-icon"><i-lucide [img]="metric.icon" [size]="20"></i-lucide></span><span class="trend" [class.trend-down]="metric.direction === 'down'"><i-lucide [img]="metric.direction === 'down' ? ArrowDownLeft : ArrowUpRight" [size]="14"></i-lucide>{{ metric.change }}</span></div>
            <div class="stat-value">{{ metric.value }}</div><div class="stat-label">{{ metric.label }}</div>
            <div class="stat-foot"><span>{{ metric.note }}</span><span class="mini-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
          </article>
        }
      </section>

      <section class="analytics-section" aria-label="تحلیل پیشرفته مدیریتی">
        <div class="analytics-section-head">
          <div><span class="analytics-eyebrow"><i-lucide [img]="TrendingUp" [size]="14"></i-lucide> Executive Analytics</span><h2>تحلیل عملکرد و شاخص‌های مدیریتی</h2><p>نمایی عمیق‌تر از کیفیت خدمات، بار کاری و تجربه مشتری در بازه انتخاب‌شده.</p></div>
          <button class="analytics-export" type="button" (click)="downloadAnalytics()"><i-lucide [img]="Download" [size]="15"></i-lucide> خروجی تحلیل</button>
        </div>
        <div class="analytics-kpis">
          @for (kpi of analyticsKpis(); track kpi.label) {
            <article class="analytics-kpi"><div class="analytics-kpi-top"><span>{{ kpi.label }}</span><i-lucide [img]="kpi.icon" [size]="16"></i-lucide></div><strong>{{ kpi.value }}</strong><div class="kpi-meta"><span [class.positive]="kpi.positive">{{ kpi.change }}</span><small>{{ kpi.note }}</small></div></article>
          }
        </div>
        <div class="analytics-grid">
          <article class="panel analytics-chart-panel">
            <div class="panel-heading"><div><h3>روند حجم و بهره‌وری</h3><p>ورودی، حل‌شده و backlog در نقاط کلیدی دوره</p></div><span class="panel-kicker">{{ periodLabel() }}</span></div>
            <div class="trend-bars" aria-label="نمودار ستونی روند عملکرد">
              @for (point of analyticsTrend; track point.label) {
                <div class="trend-column"><div class="trend-stack"><i class="bar-in" [style.height.%]="point.incoming"></i><i class="bar-solved" [style.height.%]="point.solved"></i></div><strong>{{ point.value }}</strong><small>{{ point.label }}</small></div>
              }
            </div>
            <div class="chart-legend analytics-legend"><span><i class="legend-dot blue-dot"></i>ورودی</span><span><i class="legend-dot green-dot"></i>حل‌شده</span></div>
          </article>
          <article class="panel channel-panel">
            <div class="panel-heading"><div><h3>توزیع کانال‌ها</h3><p>سهم کانال‌های ارتباطی از درخواست‌ها</p></div><span class="panel-kicker">Omnichannel</span></div>
            <div class="channel-list">
              @for (channel of channelMix; track channel.name) {<div class="channel-row"><div class="channel-label"><span class="channel-dot" [class]="channel.tone"></span><span>{{ channel.name }}</span><strong>{{ channel.percent }}٪</strong></div><div class="channel-track"><i [class]="channel.tone" [style.width.%]="channel.percent"></i></div></div>}
            </div>
            <div class="channel-total"><span>کل تعاملات</span><strong>{{ channelTotal() }}</strong></div>
          </article>
        </div>
        <div class="analytics-grid analytics-grid-bottom">
          <article class="panel performance-table-panel">
            <div class="panel-heading"><div><h3>عملکرد کارشناسان</h3><p>مقایسه سرعت، SLA و رضایت مشتری</p></div><a class="text-link" routerLink="/user-management">مدیریت کاربران <i-lucide [img]="ArrowLeft" [size]="14"></i-lucide></a></div>
            <div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>کارشناس</th><th>حل‌شده</th><th>پاسخ اول</th><th>SLA</th><th>CSAT</th><th>امتیاز</th></tr></thead><tbody>@for (agent of analyticsAgents; track agent.name) {<tr><td><div class="person-cell"><span class="avatar avatar-blue">{{ agent.name.slice(0,1) }}</span><span>{{ agent.name }}</span></div></td><td>{{ agent.solved }}</td><td>{{ agent.firstResponse }}</td><td><span class="metric-pill metric-good">{{ agent.sla }}٪</span></td><td>{{ agent.csat }}/5</td><td><strong class="score-value">{{ agent.score }}</strong></td></tr>}</tbody></table></div>
          </article>
          <article class="panel critical-panel">
            <div class="panel-heading"><div><h3>نیازمند توجه</h3><p>مواردی که بیشترین اثر را بر KPI دارند</p></div><span class="attention-count">{{ criticalItems.length }} مورد</span></div>
            <div class="critical-list">@for (item of criticalItems; track item.title) {<div class="critical-row"><span class="critical-icon"><i-lucide [img]="item.icon" [size]="16"></i-lucide></span><div><strong>{{ item.title }}</strong><small>{{ item.description }}</small></div><span class="critical-time">{{ item.time }}</span></div>}</div>
          </article>
        </div>
      </section>

      <section class="dashboard-grid">
        <article class="panel performance-panel">
          <div class="panel-heading"><div><h3>روند درخواست‌ها</h3><p>مقایسه درخواست‌های دریافتی و حل‌شده در {{ periodLabel() }}</p></div><button class="icon-button" type="button" aria-label="تازه‌سازی نمودار" (click)="refreshData()"><i-lucide [img]="RefreshCw" [size]="18"></i-lucide></button></div>
          <div class="chart-legend"><span><i class="legend-dot blue-dot"></i> درخواست‌های دریافتی</span><span><i class="legend-dot violet-dot"></i> درخواست‌های حل‌شده</span></div>
          <div class="chart-area"><div class="y-labels"><span>۱۰۰</span><span>۷۵</span><span>۵۰</span><span>۲۵</span><span>۰</span></div><div class="chart-main">
            <div class="chart-grid-lines"><i></i><i></i><i></i><i></i><i></i></div>
            <svg viewBox="0 0 700 205" preserveAspectRatio="none" role="img" aria-label="نمودار روند درخواست‌های دریافتی و حل‌شده">
              <defs><linearGradient id="ahBlueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#4588f5" stop-opacity=".2"/><stop offset="100%" stop-color="#4588f5" stop-opacity="0"/></linearGradient><linearGradient id="ahVioletFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#9471e8" stop-opacity=".16"/><stop offset="100%" stop-color="#9471e8" stop-opacity="0"/></linearGradient></defs>
              <path [attr.d]="chartReceivedArea()" fill="url(#ahBlueFill)"/><path [attr.d]="chartSolvedArea()" fill="url(#ahVioletFill)"/>
              <path [attr.d]="chartReceivedLine()" fill="none" stroke="#4386f4" stroke-width="3" stroke-linecap="round"/><path [attr.d]="chartSolvedLine()" fill="none" stroke="#9270e5" stroke-width="3" stroke-linecap="round"/>
            </svg><div class="x-labels"><span>ابتدای دوره</span><span>۲۵٪</span><span>۵۰٪</span><span>۷۵٪</span><span>امروز</span></div>
          </div></div>
        </article>

        <article class="panel sla-panel"><div class="panel-heading"><div><h3>{{ activeRole() === 'customer' ? 'وضعیت درخواست‌های من' : 'وضعیت SLA' }}</h3><p>{{ activeRole() === 'customer' ? 'نمای کلی درخواست‌های ثبت‌شده' : 'عملکرد پاسخ‌گویی تیم' }}</p></div><span class="panel-kicker">{{ activeRole() === 'customer' ? 'شخصی' : 'ماه جاری' }}</span></div>
          <div class="sla-content"><div class="donut-wrap"><div class="donut" [style.--sla-value]="slaPercent() + '%'" [class.customer-donut]="activeRole() === 'customer'"><div class="donut-center"><strong>{{ slaPercent() }}٪</strong><small>{{ activeRole() === 'customer' ? 'رسیدگی‌شده' : 'رعایت SLA' }}</small></div></div></div>
            <div class="sla-legend"><div><span><i class="legend-dot green-dot"></i>{{ activeRole() === 'customer' ? 'حل‌شده' : 'در محدوده' }}</span><strong>{{ slaBreakdown().good }}</strong></div><div><span><i class="legend-dot orange-dot"></i>{{ activeRole() === 'customer' ? 'در حال بررسی' : 'نزدیک به مهلت' }}</span><strong>{{ slaBreakdown().warning }}</strong></div><div><span><i class="legend-dot red-dot"></i>{{ activeRole() === 'customer' ? 'نیازمند پاسخ' : 'خارج از محدوده' }}</span><strong>{{ slaBreakdown().late }}</strong></div></div>
          </div><div class="sla-footer"><span>هدف دوره: {{ activeRole() === 'customer' ? 'پیگیری شفاف' : '۹۰٪' }}</span><strong>{{ activeRole() === 'customer' ? 'وضعیت به‌روز است' : '۳٪ تا هدف باقی‌مانده' }}</strong></div>
        </article>
      </section>

      <section class="bottom-grid">
        <article class="panel recent-panel"><div class="panel-heading"><div><h3>{{ activeRole() === 'customer' ? 'درخواست‌های اخیر من' : 'آخرین تیکت‌ها' }}</h3><p>درخواست‌هایی که اخیراً ثبت یا به‌روزرسانی شده‌اند</p></div><a class="text-link" routerLink="/tickets">مشاهده همه <i-lucide [img]="ArrowLeft" [size]="15"></i-lucide></a></div>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>عنوان درخواست</th><th>درخواست‌دهنده</th><th>کارشناس</th><th>اولویت</th><th>وضعیت</th><th>زمان</th></tr></thead><tbody>
            @for (ticket of visibleTickets(); track ticket.id) {<tr><td><div class="ticket-title"><b>#{{ ticket.id }}</b><span>{{ ticket.title }}</span></div></td><td>{{ ticket.requester }}</td><td><div class="person-cell"><span class="avatar avatar-blue">{{ ticket.assignee.slice(0, 1) }}</span>{{ ticket.assignee }}</div></td><td><span class="priority" [class.priority-urgent]="ticket.priority === 'بحرانی'" [class.priority-high]="ticket.priority === 'بالا'" [class.priority-normal]="ticket.priority === 'متوسط'" [class.priority-low]="ticket.priority === 'پایین'"><i></i>{{ ticket.priority }}</span></td><td><span class="status" [class.status-progress]="ticket.status === 'در حال بررسی'" [class.status-waiting]="ticket.status === 'در انتظار'" [class.status-done]="ticket.status === 'حل‌شده'">{{ ticket.status }}</span></td><td class="ticket-age">{{ ticket.age }}</td></tr>}
          </tbody></table></div>
        </article>
        <article class="panel team-panel"><div class="panel-heading"><div><h3>{{ activeRole() === 'customer' ? 'راهنمای سریع' : 'عملکرد تیم' }}</h3><p>{{ activeRole() === 'customer' ? 'راه‌های دریافت کمک' : 'کارشناسان برتر این ماه' }}</p></div><button class="icon-button" type="button" aria-label="گزینه‌های بیشتر" (click)="showToast('گزارش کامل تیم در مراحل بعدی فعال می‌شود.')"><i-lucide [img]="MoreHorizontal" [size]="20"></i-lucide></button></div>
          @if (activeRole() === 'customer') {
            <div class="quick-help-list"><a routerLink="/tickets"><i-lucide [img]="Ticket" [size]="18"></i-lucide><span><strong>پیگیری درخواست‌ها</strong><small>مشاهده آخرین وضعیت تیکت‌ها</small></span><i-lucide [img]="ArrowLeft" [size]="15"></i-lucide></a><button type="button" (click)="showToast('مرکز دانش در فازهای بعدی اضافه می‌شود.')"><i-lucide [img]="LifeBuoy" [size]="18"></i-lucide><span><strong>مرکز راهنما</strong><small>پاسخ پرسش‌های پرتکرار</small></span><i-lucide [img]="ArrowLeft" [size]="15"></i-lucide></button><button type="button" (click)="showToast('درخواست تماس ثبت نمایشی شد.')"><i-lucide [img]="Headset" [size]="18"></i-lucide><span><strong>ارتباط با پشتیبانی</strong><small>گفت‌وگو با تیم پشتیبانی</small></span><i-lucide [img]="ArrowLeft" [size]="15"></i-lucide></button></div>
          } @else {
            <div class="team-list">@for (member of teamMembers(); track member.name) {<div class="team-member"><span class="avatar" [class.avatar-blue]="$index === 0" [class.avatar-pink]="$index === 1" [class.avatar-green]="$index === 2">{{ member.name.slice(0, 1) }}</span><div class="member-info"><strong>{{ member.name }}</strong><small>{{ member.role }}</small></div><div class="member-score"><strong>{{ member.solved }}</strong><small>تیکت حل‌شده</small></div></div><div class="member-progress"><i [style.width.%]="member.progress"></i></div>}</div><div class="team-footer"><span>{{ onlineAgents() }} کارشناس آنلاین</span><span class="online-indicator"></span></div>
          }
        </article>
      </section>

      <section class="dashboard-bottom-widgets">
        <article class="panel priority-panel"><div class="panel-heading"><div><h3>نیازمند توجه فوری</h3><p>مواردی که بهتر است در اولویت رسیدگی قرار گیرند</p></div><span class="attention-count">{{ urgentItems().length }} مورد</span></div>
          @for (item of urgentItems(); track item.title) {<div class="attention-item"><span class="attention-icon"><i-lucide [img]="item.icon" [size]="17"></i-lucide></span><span class="attention-copy"><strong>{{ item.title }}</strong><small>{{ item.description }}</small></span><span class="attention-time">{{ item.time }}</span></div>}
        </article>
        <article class="panel quick-actions-panel"><div class="panel-heading"><div><h3>دسترسی سریع</h3><p>کارهای پرتکرار در یک نگاه</p></div><i-lucide [img]="Zap" [size]="19" class="quick-zap"></i-lucide></div>
          <div class="quick-actions-grid"><button type="button" (click)="quickAction()"><i-lucide [img]="Plus" [size]="19"></i-lucide><span>ثبت تیکت</span></button><button type="button" (click)="downloadReport()"><i-lucide [img]="Download" [size]="19"></i-lucide><span>خروجی گزارش</span></button><button type="button" (click)="showToast('مرکز اعلان‌ها از نوار بالایی در دسترس است.')"><i-lucide [img]="Bell" [size]="19"></i-lucide><span>اعلان‌ها</span></button><button type="button" (click)="showToast('مرکز گردش کار در فازهای بعدی تکمیل می‌شود.')"><i-lucide [img]="Workflow" [size]="19"></i-lucide><span>گردش کار</span></button></div>
        </article>
      </section>
      <div class="dashboard-note"><i-lucide [img]="ShieldCheck" [size]="16"></i-lucide><span>این داشبورد با داده‌های نمایشی کار می‌کند. داده‌های واقعی و کنترل سطح دسترسی سمت سرور در فاز Backend متصل خواهند شد.</span></div>
      @if (toastMessage()) {<div class="dashboard-toast" role="status"><i-lucide [img]="CheckCircle2" [size]="17"></i-lucide>{{ toastMessage() }}</div>}
    </div>
  `
})
export class DashboardComponent {
  readonly activeRole = signal<DashboardRole>('manager');
  readonly period = signal<Period>('30');
  readonly toastMessage = signal('');
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly greeting = computed(() => 'روز بخیر');
  readonly roleDescription = computed(() => ({
    admin: 'سلامت سامانه، وضعیت سازمان‌ها و شاخص‌های کلیدی را از اینجا مدیریت کنید.',
    manager: 'وضعیت خدمات و عملکرد تیم پشتیبانی را در یک نگاه دنبال کنید.',
    lead: 'بار کاری اعضای تیم و درخواست‌های نیازمند توجه را مدیریت کنید.',
    agent: 'کارهای امروز، درخواست‌های تخصیص‌یافته و اولویت‌های خود را دنبال کنید.',
    customer: 'درخواست‌های خود را پیگیری کنید و در صورت نیاز از تیم پشتیبانی کمک بگیرید.'
  }[this.activeRole()]));
  readonly bannerEyebrow = computed(() => this.activeRole() === 'customer' ? 'فضای اختصاصی شما' : 'نمای کلی عملکرد');
  readonly bannerTitle = computed(() => this.activeRole() === 'customer' ? 'همیشه در جریان درخواست‌هایتان باشید.' : 'پشتیبانی بهتر، تجربه‌ای ماندگارتر.');
  readonly bannerDescription = computed(() => this.activeRole() === 'customer' ? 'درخواست‌های شما با شفافیت پیگیری می‌شوند؛ آخرین وضعیت و پاسخ کارشناسان را همین‌جا ببینید.' : 'تیم شما امروز ۸۷٪ درخواست‌ها را در محدوده زمانی SLA پاسخ داده است. عالی پیش می‌روید!');
  readonly periodLabel = computed(() => ({ '7': '۷ روز گذشته', '30': '۳۰ روز گذشته', '90': '۹۰ روز گذشته' }[this.period()]));
  readonly slaPercent = computed(() => this.activeRole() === 'customer' ? 75 : this.period() === '7' ? 91 : this.period() === '90' ? 84 : 87);
  readonly slaBreakdown = computed(() => this.activeRole() === 'customer' ? { good: '۱۲', warning: '۳', late: '۱' } : { good: '۲۱۶', warning: '۲۱', late: '۱۱' });
  readonly metrics = computed(() => {
    const role = this.activeRole();
    if (role === 'customer') return [
      { label: 'درخواست‌های من', value: '۱۶', change: '۲ مورد', note: 'در مجموع', tone: 'tone-blue', direction: 'up', icon: Ticket },
      { label: 'در حال رسیدگی', value: '۳', change: '۱ مورد', note: 'نیازمند پیگیری', tone: 'tone-orange', direction: 'down', icon: Clock3 },
      { label: 'درخواست حل‌شده', value: '۱۲', change: '۷۵٪', note: 'از کل درخواست‌ها', tone: 'tone-green', direction: 'up', icon: CheckCircle2 },
      { label: 'پاسخ جدید', value: '۲', change: 'جدید', note: 'منتظر مشاهده شما', tone: 'tone-purple', direction: 'up', icon: Bell }
    ];
    if (role === 'agent') return [
      { label: 'تیکت‌های تخصیص‌یافته', value: '۲۴', change: '۳ مورد', note: 'در این دوره', tone: 'tone-blue', direction: 'up', icon: Ticket },
      { label: 'نیازمند اقدام من', value: '۸', change: '۲ فوری', note: 'اولویت امروز', tone: 'tone-orange', direction: 'down', icon: AlertCircle },
      { label: 'حل‌شده توسط من', value: '۱۸', change: '۱۲٪', note: 'بهبود نسبت به قبل', tone: 'tone-green', direction: 'up', icon: CheckCircle2 },
      { label: 'میانگین پاسخ', value: '۲.۴h', change: '۸٪', note: 'سریع‌تر از قبل', tone: 'tone-purple', direction: 'up', icon: Clock3 }
    ];
    return [
      { label: role === 'admin' ? 'کل سازمان‌ها' : 'کل تیکت‌های ثبت‌شده', value: role === 'admin' ? '۱۲' : '۲۴۸', change: '۸.۲٪', note: 'در ' + this.periodLabel(), tone: 'tone-blue', direction: 'up', icon: role === 'admin' ? Users : Ticket },
      { label: role === 'lead' ? 'در انتظار تیم من' : 'در انتظار رسیدگی', value: '۳۶', change: '۴.۵٪', note: '۱۲ مورد با اولویت بالا', tone: 'tone-orange', direction: 'down', icon: Clock3 },
      { label: 'تیکت‌های حل‌شده', value: '۱۸۷', change: '۱۲.۶٪', note: '۷۵٪ از کل درخواست‌ها', tone: 'tone-green', direction: 'up', icon: CheckCircle2 },
      { label: role === 'admin' ? 'کاربران فعال' : 'کارشناسان فعال', value: role === 'admin' ? '۹۴' : '۱۸', change: '۵.۱٪', note: 'در ۷ روز گذشته', tone: 'tone-purple', direction: 'up', icon: Users }
    ];
  });

  readonly tickets: TicketItem[] = [
    { id: 'AH-2048', title: 'عدم دسترسی به پنل مالی', requester: 'سارا محمدی', assignee: 'علی کریمی', priority: 'بالا', status: 'در حال بررسی', age: '۱۲ دقیقه' },
    { id: 'AH-2047', title: 'درخواست نصب نرم‌افزار', requester: 'امیر حسینی', assignee: 'نازنین احمدی', priority: 'متوسط', status: 'در انتظار', age: '۳۵ دقیقه' },
    { id: 'AH-2046', title: 'اختلال در شبکه داخلی', requester: 'رضا موسوی', assignee: 'مهدی صالحی', priority: 'بحرانی', status: 'در حال بررسی', age: '۵۲ دقیقه' },
    { id: 'AH-2045', title: 'بازیابی دسترسی ایمیل', requester: 'نگار احمدی', assignee: 'فاطمه رضایی', priority: 'پایین', status: 'حل‌شده', age: '۱ ساعت' }
  ];
  readonly visibleTickets = computed(() => this.activeRole() === 'customer' ? this.tickets.slice(0, 3).map(ticket => ({ ...ticket, requester: 'شما' })) : this.tickets);
  readonly teamMembers = signal([
    { name: 'علی کریمی', role: 'کارشناس ارشد', solved: '۴۸', progress: 88 },
    { name: 'نازنین احمدی', role: 'کارشناس پشتیبانی', solved: '۳۹', progress: 72 },
    { name: 'مهدی صالحی', role: 'کارشناس شبکه', solved: '۳۲', progress: 61 }
  ]);
  readonly onlineAgents = computed(() => this.activeRole() === 'lead' ? 5 : 4);
  readonly urgentItems = computed(() => this.activeRole() === 'customer' ? [
    { title: '۲ پاسخ جدید از تیم پشتیبانی', description: 'پاسخ کارشناسان را در درخواست‌های اخیر ببینید.', time: 'جدید', icon: Bell },
    { title: 'یک درخواست در انتظار اطلاعات شماست', description: 'برای ادامه رسیدگی، جزئیات تکمیلی را ارسال کنید.', time: 'امروز', icon: AlertCircle }
  ] : [
    { title: '۳ تیکت نزدیک به پایان SLA', description: 'برای جلوگیری از نقض تعهد زمانی بررسی شوند.', time: '۱۵ دقیقه', icon: Clock3 },
    { title: 'اختلال شبکه داخلی · AH-2046', description: 'درخواست بحرانی هنوز در حال بررسی است.', time: '۵۲ دقیقه', icon: AlertCircle },
    { title: '۲ درخواست بدون کارشناس', description: 'نیاز به تخصیص به یکی از تیم‌های پشتیبانی دارند.', time: 'امروز', icon: Users }
  ]);

  readonly analyticsKpis = computed(() => {
    const customer = this.activeRole() === 'customer';
    const agent = this.activeRole() === 'agent';
    return customer ? [
      { label: 'نرخ حل موفق', value: '۷۵٪', change: '۶٪+', note: 'بهبود نسبت به قبل', positive: true, icon: CheckCircle2 },
      { label: 'میانگین پاسخ', value: '۳.۱h', change: '۱۲٪-', note: 'زمان کمتر بهتر است', positive: true, icon: Clock3 },
      { label: 'رضایت مشتری', value: '۴.۶/۵', change: '۰.۲+', note: 'امتیاز دوره', positive: true, icon: TrendingUp },
      { label: 'درخواست باز', value: '۳', change: '۱ مورد', note: 'نیازمند پیگیری', positive: false, icon: Ticket }
    ] : agent ? [
      { label: 'بهره‌وری شخصی', value: '۸۸٪', change: '۹٪+', note: 'نسبت به دوره قبل', positive: true, icon: TrendingUp },
      { label: 'SLA شخصی', value: '۹۴٪', change: '۴٪+', note: 'در محدوده هدف', positive: true, icon: ShieldCheck },
      { label: 'CSAT', value: '۴.۷/۵', change: '۰.۳+', note: 'رضایت مشتریان', positive: true, icon: CheckCircle2 },
      { label: 'Backlog من', value: '۸', change: '۲-', note: 'نیازمند اقدام', positive: true, icon: Clock3 }
    ] : [
      { label: 'SLA Compliance', value: this.slaPercent() + '٪', change: '۳.۲٪+', note: 'نسبت به دوره قبل', positive: true, icon: ShieldCheck },
      { label: 'First Response', value: '۲.۴h', change: '۸٪-', note: 'سریع‌تر از قبل', positive: true, icon: Clock3 },
      { label: 'CSAT', value: '۴.۵/۵', change: '۰.۲+', note: 'رضایت مشتریان', positive: true, icon: CheckCircle2 },
      { label: 'Backlog', value: '۳۶', change: '۴.۵٪-', note: 'کاهش درخواست‌های باز', positive: true, icon: Ticket }
    ];
  });
  readonly analyticsTrend = [
    { label: 'هفته ۱', value: '۶۸', incoming: 68, solved: 56 },
    { label: 'هفته ۲', value: '۷۶', incoming: 76, solved: 67 },
    { label: 'هفته ۳', value: '۶۱', incoming: 61, solved: 73 },
    { label: 'هفته ۴', value: '۸۴', incoming: 84, solved: 79 },
    { label: 'امروز', value: '۹۱', incoming: 91, solved: 86 }
  ];
  readonly channelMix = [
    { name: 'پورتال', percent: 34, tone: 'channel-blue' },
    { name: 'ایمیل', percent: 24, tone: 'channel-purple' },
    { name: 'Live Chat', percent: 18, tone: 'channel-green' },
    { name: 'WhatsApp', percent: 14, tone: 'channel-orange' },
    { name: 'تلفن و API', percent: 10, tone: 'channel-red' }
  ];
  readonly analyticsAgents = [
    { name: 'علی کریمی', solved: 48, firstResponse: '۱.۸h', sla: 96, csat: '4.8', score: '۹۵' },
    { name: 'نازنین احمدی', solved: 39, firstResponse: '۲.۱h', sla: 93, csat: '4.6', score: '۹۱' },
    { name: 'مهدی صالحی', solved: 32, firstResponse: '۲.۷h', sla: 89, csat: '4.4', score: '۸۶' },
    { name: 'فاطمه رضایی', solved: 29, firstResponse: '۳.۰h', sla: 87, csat: '4.3', score: '۸۲' }
  ];
  readonly criticalItems = [
    { title: '۳ تیکت نزدیک به نقض SLA', description: 'برای جلوگیری از افت شاخص SLA نیازمند تخصیص فوری هستند.', time: '۱۵ دقیقه', icon: Clock3 },
    { title: 'AH-2046 · اختلال شبکه', description: 'درخواست بحرانی هنوز در حال بررسی است.', time: '۵۲ دقیقه', icon: AlertCircle },
    { title: 'افت ۴٪ در کانال ایمیل', description: 'حجم ورودی این کانال نسبت به دوره قبل کاهش داشته است.', time: 'این دوره', icon: Activity }
  ];
  readonly channelTotal = computed(() => this.channelMix.reduce((sum, item) => sum + item.percent, 0) + '%');
  downloadAnalytics(): void {
    const rows = [['شاخص', 'مقدار', 'تغییر', 'یادداشت'], ...this.analyticsKpis().map(k => [k.label, k.value, k.change, k.note])];
    const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ashkan-executive-analytics.csv'; anchor.click(); URL.revokeObjectURL(url);
    this.showToast('خروجی تحلیل مدیریتی دانلود شد.');
  }

  readonly chartReceivedLine = computed(() => this.period() === '7' ? 'M0 150 C55 125 70 140 130 105 S210 125 270 90 S350 100 410 70 S500 95 560 45 S640 60 700 28' : this.period() === '90' ? 'M0 165 C50 150 80 110 130 125 S210 70 270 100 S350 60 410 80 S500 35 560 55 S640 25 700 20' : 'M0 145 C35 130 55 145 90 115 S150 125 185 95 S245 112 280 82 S340 100 375 70 S435 92 470 55 S530 78 560 50 S630 65 700 25');
  readonly chartSolvedLine = computed(() => this.period() === '7' ? 'M0 170 C55 155 70 165 130 145 S210 150 270 125 S350 140 410 110 S500 125 560 90 S640 100 700 65' : this.period() === '90' ? 'M0 180 C50 165 80 140 130 150 S210 110 270 130 S350 100 410 110 S500 75 560 90 S640 65 700 55' : 'M0 165 C35 155 55 160 90 145 S150 150 185 130 S245 145 280 118 S340 135 375 105 S435 120 470 93 S530 108 560 83 S630 92 700 60');
  readonly chartReceivedArea = computed(() => `${this.chartReceivedLine()} L700 205 L0 205Z`);
  readonly chartSolvedArea = computed(() => `${this.chartSolvedLine()} L700 205 L0 205Z`);

  readonly UserRound = UserRound; readonly ChevronDown = ChevronDown; readonly CalendarDays = CalendarDays;
  readonly Plus = Plus; readonly Sparkles = Sparkles; readonly TrendingUp = TrendingUp; readonly Headset = Headset;
  readonly ArrowDownLeft = ArrowDownLeft; readonly ArrowUpLeft = ArrowUpLeft; readonly ArrowUpRight = ArrowUpRight;
  readonly Clock3 = Clock3; readonly CheckCircle2 = CheckCircle2; readonly Ticket = Ticket; readonly Users = Users;
  readonly Bell = Bell; readonly RefreshCw = RefreshCw; readonly MoreHorizontal = MoreHorizontal; readonly ArrowLeft = ArrowLeft;
  readonly LifeBuoy = LifeBuoy; readonly Download = Download; readonly Workflow = Workflow; readonly Zap = Zap;
  readonly AlertCircle = AlertCircle; readonly ShieldCheck = ShieldCheck;

  changeRole(event: Event): void { this.activeRole.set((event.target as HTMLSelectElement).value as DashboardRole); }
  changePeriod(event: Event): void { this.period.set((event.target as HTMLSelectElement).value as Period); }
  refreshData(): void { this.showToast('اطلاعات نمایشی داشبورد تازه‌سازی شد.'); }
  quickAction(): void { this.showToast('فرم ثبت تیکت در مرحله مدیریت تیکت‌ها تکمیل می‌شود.'); }
  downloadReport(): void {
    const rows = [['شناسه', 'عنوان', 'درخواست‌دهنده', 'کارشناس', 'اولویت', 'وضعیت', 'زمان'], ...this.visibleTickets().map(ticket => [ticket.id, ticket.title, ticket.requester, ticket.assignee, ticket.priority, ticket.status, ticket.age])];
    const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ashkan-helpdesk-dashboard.csv'; anchor.click(); URL.revokeObjectURL(url);
    this.showToast('گزارش CSV دانلود شد.');
  }
  showToast(message: string): void {
    this.toastMessage.set(message);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(''), 2800);
  }
}
