import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AhButtonComponent } from '../../shared/ui/button/button';
import { AhBadgeComponent } from '../../shared/ui/badge/badge';
import { AhCardComponent } from '../../shared/ui/card/card';
import { AhTextFieldComponent } from '../../shared/ui/text-field/text-field';
import { AhEmptyStateComponent } from '../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'ah-design-system',
  standalone: true,
  imports: [FormsModule, AhButtonComponent, AhBadgeComponent, AhCardComponent, AhTextFieldComponent, AhEmptyStateComponent],
  template: `
    <div class="ds-page">
      <div class="ds-heading">
        <div><div class="ds-eyebrow"><span></span> کتابخانه رابط کاربری</div><h1>Design System</h1><p>زبان بصری و کامپوننت‌های مشترک Ashkan HelpDesk</p></div>
        <ah-badge tone="success">نسخه ۱.۰ · فعال</ah-badge>
      </div>
      <div class="ds-intro">
        <div><span class="ds-intro-label">ASHKAN DESIGN LANGUAGE</span><h2>تجربه‌ای یکپارچه، دقیق و انسانی.</h2><p>تمام اجزای رابط کاربری از توکن‌های طراحی مشترک استفاده می‌کنند؛ بنابراین تغییر ظاهر سامانه در آینده سریع و کنترل‌شده خواهد بود.</p></div>
        <div class="ds-orbit" aria-hidden="true"><span>A</span><i></i><b></b></div>
      </div>
      <div class="ds-section-title"><div><h2>رنگ‌های پایه</h2><p>رنگ‌ها بر اساس نقش و معنا انتخاب شده‌اند، نه صرفاً تزئین.</p></div><span>01 / FOUNDATIONS</span></div>
      <div class="ds-color-grid">
        @for (color of colors; track color.name) { <div class="ds-color-card"><div class="ds-swatch" [style.background]="color.hex"><span>{{ color.hex }}</span></div><strong>{{ color.name }}</strong><small>{{ color.usage }}</small></div> }
      </div>
      <div class="ds-two-col">
        <section class="ds-section">
          <div class="ds-section-title"><div><h2>دکمه‌ها</h2><p>حالت‌های مختلف برای سطوح متفاوت اهمیت.</p></div><span>02 / BUTTONS</span></div>
          <ah-card>
            <div class="ds-component-grid">
              <div class="ds-example"><label>Primary</label><ah-button>ذخیره تغییرات</ah-button></div>
              <div class="ds-example"><label>Secondary</label><ah-button variant="secondary">مشاهده جزئیات</ah-button></div>
              <div class="ds-example"><label>Outline</label><ah-button variant="outline">انصراف</ah-button></div>
              <div class="ds-example"><label>Ghost</label><ah-button variant="ghost">بیشتر</ah-button></div>
              <div class="ds-example"><label>Danger</label><ah-button variant="danger">حذف مورد</ah-button></div>
              <div class="ds-example"><label>Success</label><ah-button variant="success">تأیید درخواست</ah-button></div>
              <div class="ds-example"><label>Loading</label><ah-button [loading]="true">در حال ذخیره</ah-button></div>
              <div class="ds-example"><label>Disabled</label><ah-button [disabled]="true">غیرفعال</ah-button></div>
            </div>
            <div class="ds-divider"></div>
            <div class="ds-example-row"><ah-button size="sm">کوچک</ah-button><ah-button size="md">متوسط</ah-button><ah-button size="lg">بزرگ</ah-button></div>
          </ah-card>
        </section>
        <section class="ds-section">
          <div class="ds-section-title"><div><h2>وضعیت‌ها و برچسب‌ها</h2><p>نمایش سریع وضعیت و سطح اهمیت.</p></div><span>03 / BADGES</span></div>
          <ah-card>
            <div class="ds-badge-list"><ah-badge tone="success">● باز</ah-badge><ah-badge tone="info">● در حال بررسی</ah-badge><ah-badge tone="warning">● منتظر پاسخ</ah-badge><ah-badge tone="danger">● بحرانی</ah-badge><ah-badge tone="purple">● ارجاع تخصصی</ah-badge><ah-badge tone="neutral">● بسته‌شده</ah-badge></div>
            <div class="ds-divider"></div>
            <div class="ds-status-row"><span>اولویت پایین</span><ah-badge tone="success">کم</ah-badge></div>
            <div class="ds-status-row"><span>اولویت متوسط</span><ah-badge tone="warning">متوسط</ah-badge></div>
            <div class="ds-status-row"><span>اولویت بالا</span><ah-badge tone="danger">زیاد</ah-badge></div>
          </ah-card>
        </section>
      </div>
      <div class="ds-two-col">
        <section class="ds-section">
          <div class="ds-section-title"><div><h2>ورودی‌ها و فرم‌ها</h2><p>حالت عادی، راهنما و اعتبارسنجی.</p></div><span>04 / FORMS</span></div>
          <ah-card>
            <div class="ds-form-grid">
              <ah-text-field label="عنوان درخواست" placeholder="مثلاً مشکل اتصال به شبکه" [required]="true" hint="عنوان را کوتاه و دقیق وارد کنید." />
              <ah-text-field label="ایمیل سازمانی" placeholder="name@company.com" type="email" />
              <ah-text-field label="کد پیگیری" value="HD-2026-00128" [disabled]="true" />
              <ah-text-field label="ورودی نامعتبر" value="مقدار نامعتبر" [invalid]="true" error="لطفاً مقدار معتبر وارد کنید." />
            </div>
            <div class="ds-divider"></div>
            <label class="ds-native-select"><span>دسته‌بندی درخواست</span><select><option>پشتیبانی فنی</option><option>دسترسی و حساب کاربری</option><option>سخت‌افزار</option><option>نرم‌افزار</option></select></label>
            <label class="ds-check"><input type="checkbox" checked> <span>اعلان تغییر وضعیت برای من ارسال شود</span></label>
          </ah-card>
        </section>
        <section class="ds-section">
          <div class="ds-section-title"><div><h2>تعامل و بازخورد</h2><p>اعلان‌های واضح و بازخوردهای قابل فهم.</p></div><span>05 / FEEDBACK</span></div>
          <ah-card>
            <div class="ds-alert ds-alert--success"><b>✓</b><div><strong>تغییرات با موفقیت ذخیره شد</strong><small>اطلاعات شما به‌روزرسانی شده است.</small></div></div>
            <div class="ds-alert ds-alert--warning"><b>!</b><div><strong>نیاز به بررسی</strong><small>زمان پاسخ‌گویی این درخواست رو به پایان است.</small></div></div>
            <div class="ds-alert ds-alert--danger"><b>×</b><div><strong>عملیات ناموفق بود</strong><small>ارتباط برقرار نشد. دوباره تلاش کنید.</small></div></div>
            <div class="ds-divider"></div>
            <div class="ds-interaction"><div><strong>نمایش اعلان آزمایشی</strong><small>برای بررسی پیام بازخورد کلیک کنید.</small></div><ah-button variant="outline" size="sm" (click)="showToast()">نمایش Toast</ah-button></div>
            @if (toastVisible()) { <div class="ds-toast"><span>✓</span> عملیات آزمایشی با موفقیت انجام شد <button (click)="toastVisible.set(false)" aria-label="بستن">×</button></div> }
          </ah-card>
        </section>
      </div>
      <div class="ds-section-title"><div><h2>جدول و وضعیت خالی</h2><p>الگوهای استاندارد برای داده‌ها و صفحات بدون نتیجه.</p></div><span>06 / DATA DISPLAY</span></div>
      <ah-card [flush]="true">
        <div class="ds-table-wrap"><table class="ds-table"><thead><tr><th>شناسه</th><th>عنوان درخواست</th><th>مسئول</th><th>وضعیت</th><th>اولویت</th></tr></thead><tbody>
          <tr><td class="ds-id">#HD-1284</td><td><strong>عدم دسترسی به سامانه مالی</strong><small>ثبت‌شده ۲۰ دقیقه پیش</small></td><td>علی محمدی</td><td><ah-badge tone="info">در حال بررسی</ah-badge></td><td><ah-badge tone="danger">بالا</ah-badge></td></tr>
          <tr><td class="ds-id">#HD-1283</td><td><strong>درخواست نصب نرم‌افزار</strong><small>ثبت‌شده ۱ ساعت پیش</small></td><td>سارا احمدی</td><td><ah-badge tone="warning">منتظر پاسخ</ah-badge></td><td><ah-badge tone="warning">متوسط</ah-badge></td></tr>
          <tr><td class="ds-id">#HD-1282</td><td><strong>تعویض تجهیزات شبکه</strong><small>ثبت‌شده دیروز</small></td><td>رضا کریمی</td><td><ah-badge tone="success">حل‌شده</ah-badge></td><td><ah-badge tone="neutral">کم</ah-badge></td></tr>
        </tbody></table></div>
      </ah-card>
      <div class="ds-empty-wrap"><ah-card><ah-empty-state icon="⌕" title="نتیجه‌ای پیدا نشد" description="با تغییر عبارت جست‌وجو یا پاک کردن فیلترها دوباره تلاش کنید."><ah-button variant="outline" size="sm">پاک کردن فیلترها</ah-button></ah-empty-state></ah-card></div>
      <div class="ds-footer-note"><span>✦</span> تمام کامپوننت‌های این کتابخانه با توکن‌های مشترک طراحی شده‌اند و آماده استفاده در ماژول‌های آینده هستند.</div>
    </div>
  `,
  styleUrl: './design-system.scss'
})
export class DesignSystemComponent {
  readonly toastVisible = signal(false);
  readonly colors = [
    { name: 'آبی اعتماد', hex: '#397CF6', usage: 'رنگ اصلی و اقدام‌ها' },
    { name: 'سرمه‌ای', hex: '#14213D', usage: 'هویت و ساختار' },
    { name: 'بنفش هوشمند', hex: '#8767D8', usage: 'قابلیت‌های ویژه' },
    { name: 'سبز موفقیت', hex: '#159B70', usage: 'تأیید و تکمیل' },
    { name: 'کهربایی هشدار', hex: '#D88A22', usage: 'توجه و انتظار' },
    { name: 'قرمز خطا', hex: '#D94F5C', usage: 'خطا و وضعیت بحرانی' }
  ];
  showToast(): void { this.toastVisible.set(true); }
}
