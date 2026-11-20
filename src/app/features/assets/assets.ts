import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

type AssetStatus = 'در حال استفاده' | 'در انبار' | 'در تعمیر' | 'اسقاط‌شده';
type AssetCondition = 'عالی' | 'خوب' | 'نیازمند بررسی' | 'معیوب';
type AssetCategory = 'لپ‌تاپ' | 'رایانه رومیزی' | 'مانیتور' | 'پرینتر' | 'تجهیزات شبکه' | 'موبایل' | 'سایر';
interface MaintenanceRecord { date: string; type: string; description: string; technician: string; cost: number; }
interface Asset {
  id: number; tag: string; name: string; category: AssetCategory; brand: string; model: string;
  serial: string; status: AssetStatus; condition: AssetCondition; department: string; assignee: string;
  purchaseDate: string; warrantyUntil: string; purchaseCost: number; location: string;
  notes: string; maintenance: MaintenanceRecord[];
}
interface AssetForm {
  tag: string; name: string; category: AssetCategory; brand: string; model: string; serial: string;
  status: AssetStatus; condition: AssetCondition; department: string; assignee: string;
  purchaseDate: string; warrantyUntil: string; purchaseCost: number; location: string; notes: string;
}

@Component({
  selector: 'ah-assets',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  styleUrl: './assets.scss',
  template: `
  <div class="assets-page" dir="rtl">
    <header class="page-heading">
      <div><div class="eyebrow"><span class="eyebrow-dot"></span> مدیریت تجهیزات و چرخه عمر</div><h1>مدیریت دارایی‌ها</h1><p>دارایی‌های فناوری اطلاعات را از زمان خرید تا تحویل، تعمیر و خروج از چرخه مدیریت کنید.</p></div>
      <div class="heading-actions"><button class="button button-ghost" type="button" (click)="exportCsv()">↓ خروجی CSV</button><button class="button button-primary" type="button" (click)="create()">＋ ثبت دارایی</button></div>
    </header>

    <section class="asset-hero">
      <div class="hero-copy"><span class="hero-label">کنترل هوشمند دارایی‌ها</span><h2>تصویر شفافی از تجهیزات سازمان داشته باشید</h2><p>موجودی، مسئول تحویل‌گیرنده، وضعیت گارانتی و سوابق نگهداری را یکپارچه پیگیری کنید.</p>
        <label class="hero-search"><span>⌕</span><input [value]="search()" (input)="search.set(inputValue($event))" placeholder="جستجو بر اساس نام، کد اموال یا سریال..." aria-label="جستجو در دارایی‌ها"><kbd>جستجو</kbd></label>
      </div>
      <div class="hero-art" aria-hidden="true"><span class="art-ring ring-one"></span><span class="art-ring ring-two"></span><div class="device-stack"><span>▰</span><b>IT</b><small>ASSET CONTROL</small></div><i class="floating-chip chip-a">چرخه عمر دارایی</i><i class="floating-chip chip-b">موجودی سازمان</i></div>
    </section>

    <section class="asset-stats">
      <article><span class="metric-icon blue">▣</span><div><small>کل دارایی‌ها</small><strong>{{ assets().length }}</strong><em>ثبت‌شده در سامانه</em></div></article>
      <article><span class="metric-icon green">✓</span><div><small>در حال استفاده</small><strong>{{ inUseCount() }}</strong><em>تخصیص‌یافته به کارکنان</em></div></article>
      <article><span class="metric-icon amber">◷</span><div><small>نیازمند پیگیری</small><strong>{{ attentionCount() }}</strong><em>تعمیر یا گارانتی رو به پایان</em></div></article>
      <article><span class="metric-icon violet">▤</span><div><small>ارزش خرید</small><strong>{{ totalValue() | number }}</strong><em>ریال · مبلغ نمونه</em></div></article>
    </section>

    <section class="asset-alerts">
      <div class="alert-title"><span>!</span><div><strong>موارد نیازمند توجه</strong><small>بر اساس وضعیت ثبت‌شده دارایی‌ها</small></div></div>
      <div class="alert-items">
        @for (asset of expiringWarranty(); track asset.id) {<button type="button" class="alert-item" (click)="select(asset)"><span class="alert-dot amber-dot"></span><span><b>{{ asset.name }}</b><small>پایان گارانتی: {{ asset.warrantyUntil }}</small></span><i>←</i></button>}
        @for (asset of assetsInRepair(); track asset.id) {<button type="button" class="alert-item" (click)="select(asset)"><span class="alert-dot red-dot"></span><span><b>{{ asset.name }}</b><small>در انتظار پیگیری تعمیر</small></span><i>←</i></button>}
        @if (!expiringWarranty().length && !assetsInRepair().length) {<span class="no-alert">در حال حاضر مورد فوری ثبت نشده است.</span>}
      </div>
    </section>

    <section class="asset-workspace">
      <main class="asset-main panel">
        <div class="asset-toolbar"><div><h2>فهرست دارایی‌ها</h2><p>برای مشاهده جزئیات، یک دارایی را انتخاب کنید.</p></div>
          <div class="filters">
            <select [value]="categoryFilter()" (change)="categoryFilter.set(inputValue($event))" aria-label="فیلتر دسته"><option value="">همه دسته‌ها</option>@for (cat of categories; track cat) {<option [value]="cat">{{cat}}</option>}</select>
            <select [value]="statusFilter()" (change)="statusFilter.set(inputValue($event))" aria-label="فیلتر وضعیت"><option value="">همه وضعیت‌ها</option>@for (status of statuses; track status) {<option [value]="status">{{status}}</option>}</select>
            <select [value]="departmentFilter()" (change)="departmentFilter.set(inputValue($event))" aria-label="فیلتر واحد"><option value="">همه واحدها</option>@for (dept of departments; track dept) {<option [value]="dept">{{dept}}</option>}</select>
          </div>
        </div>
        <div class="asset-tabs"><button type="button" [class.active]="statusFilter()===''" (click)="statusFilter.set('')">همه <span>{{assets().length}}</span></button><button type="button" [class.active]="statusFilter()==='در حال استفاده'" (click)="statusFilter.set('در حال استفاده')">در حال استفاده</button><button type="button" [class.active]="statusFilter()==='در انبار'" (click)="statusFilter.set('در انبار')">در انبار</button><button type="button" [class.active]="statusFilter()==='در تعمیر'" (click)="statusFilter.set('در تعمیر')">در تعمیر</button></div>
        <div class="asset-table-wrap">
          <table class="asset-table">
            <thead><tr><th>دارایی</th><th>کد اموال / سریال</th><th>تحویل‌گیرنده</th><th>واحد سازمانی</th><th>وضعیت</th><th>گارانتی</th></tr></thead>
            <tbody>
              @for (asset of filteredAssets(); track asset.id) {
                <tr [class.selected]="selectedId()===asset.id" (click)="select(asset)" tabindex="0" (keydown.enter)="select(asset)">
                  <td><div class="asset-name-cell"><span class="asset-symbol" [attr.data-category]="asset.category">{{categoryIcon(asset.category)}}</span><span><b>{{asset.name}}</b><small>{{asset.brand}} {{asset.model}}</small></span></div></td>
                  <td><b class="asset-code">{{asset.tag}}</b><small class="serial">{{asset.serial}}</small></td>
                  <td>{{asset.assignee || '—'}}</td><td>{{asset.department}}</td>
                  <td><span class="status-pill" [attr.data-status]="asset.status">{{asset.status}}</span></td>
                  <td><span class="warranty" [class.expiring]="isWarrantyExpiring(asset)">{{asset.warrantyUntil || '—'}}</span></td>
                </tr>
              } @empty {<tr><td colspan="6"><div class="empty-state"><strong>دارایی‌ای پیدا نشد</strong><span>فیلترها را تغییر دهید یا دارایی جدید ثبت کنید.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
        <footer class="table-footer"><span>نمایش {{filteredAssets().length}} از {{assets().length}} دارایی</span><span>اطلاعات نسخه نمایشی</span></footer>
      </main>

      <aside class="asset-detail panel">
        @if (selected(); as asset) {
          <div class="detail-top"><span class="detail-kicker">شناسنامه دارایی · {{asset.tag}}</span><div class="detail-actions"><button type="button" class="icon-action" (click)="edit(asset)" aria-label="ویرایش">✎</button><button type="button" class="icon-action" (click)="addMaintenance(asset)" aria-label="ثبت سرویس">＋</button></div></div>
          <div class="detail-device"><span class="detail-device-icon">{{categoryIcon(asset.category)}}</span><div><h2>{{asset.name}}</h2><p>{{asset.brand}} {{asset.model}} · {{asset.category}}</p></div></div>
          <span class="status-pill detail-status" [attr.data-status]="asset.status">{{asset.status}}</span>
          <div class="detail-section"><h3>مشخصات و تخصیص</h3><div class="detail-grid"><div><small>شماره سریال</small><b>{{asset.serial}}</b></div><div><small>وضعیت فیزیکی</small><b>{{asset.condition}}</b></div><div><small>تحویل‌گیرنده</small><b>{{asset.assignee || 'بدون تخصیص'}}</b></div><div><small>واحد سازمانی</small><b>{{asset.department}}</b></div><div><small>محل استقرار</small><b>{{asset.location}}</b></div><div><small>تاریخ خرید</small><b>{{asset.purchaseDate}}</b></div><div><small>پایان گارانتی</small><b [class.warning-text]="isWarrantyExpiring(asset)">{{asset.warrantyUntil || 'ثبت نشده'}}</b></div><div><small>ارزش خرید</small><b>{{asset.purchaseCost | number}} ریال</b></div></div></div>
          <div class="detail-actions-row">
            @if (asset.status==='در انبار') {<button type="button" class="button button-primary" (click)="openAssign(asset)">تخصیص به کارمند</button>}
            @if (asset.status==='در حال استفاده') {<button type="button" class="button button-ghost" (click)="returnToStock(asset)">ثبت عودت</button>}
            @if (asset.status!=='در تعمیر' && asset.status!=='اسقاط‌شده') {<button type="button" class="button button-ghost" (click)="sendToRepair(asset)">ارسال به تعمیر</button>}
            @if (asset.status==='در تعمیر') {<button type="button" class="button button-primary" (click)="completeRepair(asset)">پایان تعمیر</button>}
          </div>
          <div class="maintenance-section"><div class="section-heading"><h3>سوابق نگهداری و تعمیرات</h3><button type="button" (click)="addMaintenance(asset)">＋ ثبت سابقه</button></div>
            @for (record of asset.maintenance; track $index) {<div class="maintenance-row"><span class="timeline-dot"></span><div><b>{{record.type}}</b><small>{{record.date}} · {{record.technician}}</small><p>{{record.description}}</p>@if (record.cost) {<em>{{record.cost | number}} ریال</em>}</div></div>}
            @if (!asset.maintenance.length) {<p class="no-history">هنوز سابقه‌ای برای این دارایی ثبت نشده است.</p>}
          </div>
        } @else {<div class="detail-empty"><span>▣</span><strong>یک دارایی را انتخاب کنید</strong><p>مشخصات، تخصیص و سوابق نگهداری در این قسمت نمایش داده می‌شود.</p></div>}
      </aside>
    </section>

    <section class="asset-note"><span>✦</span><div><strong>یادآوری درباره داده‌ها</strong><p>این نسخه برای ارزیابی رابط کاربری از داده‌های نمونه استفاده می‌کند. گردش کار تحویل، کنترل دسترسی، هشدارهای زمان‌بندی‌شده و سوابق حسابرسی در اتصال به ASP.NET Core و PostgreSQL تکمیل خواهند شد.</p></div></section>

    @if (dialogOpen()) {<div class="dialog-backdrop" (click)="closeDialog()"><section class="asset-dialog" role="dialog" aria-modal="true" aria-labelledby="asset-dialog-title" (click)="$event.stopPropagation()">
      <header><div><h2 id="asset-dialog-title">{{editingId() ? 'ویرایش دارایی' : 'ثبت دارایی جدید'}}</h2><p>مشخصات شناسنامه‌ای و اطلاعات تخصیص را وارد کنید.</p></div><button type="button" class="dialog-close" (click)="closeDialog()" aria-label="بستن">×</button></header>
      <form (ngSubmit)="save()"><div class="form-grid">
        <label>کد اموال<input name="tag" [(ngModel)]="form.tag" required placeholder="مثلاً AST-0106"></label>
        <label>نام دارایی<input name="name" [(ngModel)]="form.name" required minlength="3" placeholder="مثلاً لپ‌تاپ واحد مالی"></label>
        <label>دسته‌بندی<select name="category" [(ngModel)]="form.category">@for (cat of categories; track cat) {<option [value]="cat">{{cat}}</option>}</select></label>
        <label>وضعیت<select name="status" [(ngModel)]="form.status">@for (status of statuses; track status) {<option [value]="status">{{status}}</option>}</select></label>
        <label>برند<input name="brand" [(ngModel)]="form.brand" placeholder="Dell، HP، Lenovo..."></label>
        <label>مدل<input name="model" [(ngModel)]="form.model" placeholder="مدل دستگاه"></label>
        <label>شماره سریال<input name="serial" [(ngModel)]="form.serial" required placeholder="Serial Number"></label>
        <label>وضعیت فیزیکی<select name="condition" [(ngModel)]="form.condition">@for (condition of conditions; track condition) {<option [value]="condition">{{condition}}</option>}</select></label>
        <label>واحد سازمانی<select name="department" [(ngModel)]="form.department">@for (dept of departments; track dept) {<option [value]="dept">{{dept}}</option>}</select></label>
        <label>تحویل‌گیرنده<input name="assignee" [(ngModel)]="form.assignee" placeholder="نام و نام خانوادگی"></label>
        <label>تاریخ خرید<input name="purchaseDate" [(ngModel)]="form.purchaseDate" placeholder="۱۴۰۵/۰۱/۱۵"></label>
        <label>پایان گارانتی<input name="warrantyUntil" [(ngModel)]="form.warrantyUntil" placeholder="۱۴۰۶/۰۱/۱۵"></label>
        <label>ارزش خرید (ریال)<input name="purchaseCost" type="number" min="0" [(ngModel)]="form.purchaseCost"></label>
        <label>محل استقرار<input name="location" [(ngModel)]="form.location" placeholder="ساختمان، طبقه، اتاق"></label>
        <label class="full">توضیحات<textarea name="notes" [(ngModel)]="form.notes" rows="2" placeholder="یادداشت‌های تکمیلی"></textarea></label>
      </div><div class="dialog-actions"><button class="button button-ghost" type="button" (click)="closeDialog()">انصراف</button><button class="button button-primary" type="submit">{{editingId() ? 'ذخیره تغییرات' : 'ثبت دارایی'}}</button></div></form>
    </section></div>}

    @if (actionDialog()) {<div class="dialog-backdrop" (click)="closeAction()"><section class="action-dialog" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
      <header><div><h2>{{actionTitle()}}</h2><p>{{actionDescription()}}</p></div><button class="dialog-close" type="button" (click)="closeAction()">×</button></header>
      <form (ngSubmit)="confirmAction()">
        @if (actionType()==='assign') {<label>نام تحویل‌گیرنده<input name="actionAssignee" [(ngModel)]="actionAssignee" required placeholder="نام و نام خانوادگی"></label><label>واحد سازمانی<select name="actionDepartment" [(ngModel)]="actionDepartment">@for (dept of departments; track dept) {<option [value]="dept">{{dept}}</option>}</select></label>}
        @if (actionType()==='maintenance') {<label>نوع عملیات<input name="maintenanceType" [(ngModel)]="maintenanceType" required placeholder="سرویس دوره‌ای، تعمیر..."></label><label>شرح عملیات<textarea name="maintenanceDescription" [(ngModel)]="maintenanceDescription" required rows="3"></textarea></label><label>هزینه (ریال)<input name="maintenanceCost" type="number" min="0" [(ngModel)]="maintenanceCost"></label>}
        @if (actionType()==='repair') {<label>شرح ایراد<textarea name="repairDescription" [(ngModel)]="maintenanceDescription" required rows="3" placeholder="شرح مشکل و علائم مشاهده‌شده"></textarea></label>}
        <div class="dialog-actions"><button type="button" class="button button-ghost" (click)="closeAction()">انصراف</button><button type="submit" class="button button-primary">ثبت عملیات</button></div>
      </form>
    </section></div>}
    @if (toast()) {<div class="asset-toast" role="status">✦ {{toast()}}</div>}
  </div>`
})
export class AssetsComponent {
  readonly categories: AssetCategory[] = ['لپ‌تاپ','رایانه رومیزی','مانیتور','پرینتر','تجهیزات شبکه','موبایل','سایر'];
  readonly statuses: AssetStatus[] = ['در حال استفاده','در انبار','در تعمیر','اسقاط‌شده'];
  readonly conditions: AssetCondition[] = ['عالی','خوب','نیازمند بررسی','معیوب'];
  readonly departments = ['فناوری اطلاعات','مالی','منابع انسانی','فروش','عملیات'];
  readonly assets = signal<Asset[]>([
    {id:1,tag:'AST-0101',name:'لپ‌تاپ مدیر فناوری',category:'لپ‌تاپ',brand:'Dell',model:'Latitude 5440',serial:'DL-5440-9821',status:'در حال استفاده',condition:'عالی',department:'فناوری اطلاعات',assignee:'علی محمدی',purchaseDate:'۱۴۰۴/۰۵/۱۲',warrantyUntil:'۱۴۰۶/۰۵/۱۲',purchaseCost:680000000,location:'ساختمان مرکزی، طبقه ۳',notes:'',maintenance:[{date:'۱۴۰۵/۰۶/۰۵',type:'سرویس دوره‌ای',description:'بررسی سلامت باتری و به‌روزرسانی BIOS',technician:'واحد زیرساخت',cost:0}]},
    {id:2,tag:'AST-0102',name:'لپ‌تاپ کارشناس مالی',category:'لپ‌تاپ',brand:'Lenovo',model:'ThinkPad E14',serial:'LN-E14-4412',status:'در حال استفاده',condition:'خوب',department:'مالی',assignee:'سارا احمدی',purchaseDate:'۱۴۰۴/۰۲/۲۰',warrantyUntil:'۱۴۰۵/۱۲/۲۰',purchaseCost:520000000,location:'ساختمان مرکزی، طبقه ۲',notes:'',maintenance:[]},
    {id:3,tag:'AST-0103',name:'مانیتور اتاق جلسات',category:'مانیتور',brand:'LG',model:'UltraWide 29WQ',serial:'LG-29WQ-771',status:'در انبار',condition:'عالی',department:'فناوری اطلاعات',assignee:'',purchaseDate:'۱۴۰۵/۰۱/۰۸',warrantyUntil:'۱۴۰۷/۰۱/۰۸',purchaseCost:145000000,location:'انبار IT',notes:'به همراه کابل HDMI',maintenance:[]},
    {id:4,tag:'AST-0104',name:'سوئیچ مرکزی طبقه سوم',category:'تجهیزات شبکه',brand:'Cisco',model:'Catalyst 9200',serial:'CS-9200-3009',status:'در حال استفاده',condition:'نیازمند بررسی',department:'فناوری اطلاعات',assignee:'تیم شبکه',purchaseDate:'۱۴۰۳/۰۹/۱۷',warrantyUntil:'۱۴۰۵/۱۱/۳۰',purchaseCost:1250000000,location:'رک شبکه، طبقه ۳',notes:'',maintenance:[{date:'۱۴۰۵/۰۸/۰۱',type:'بازبینی شبکه',description:'بررسی پورت‌های پرترافیک و دمای دستگاه',technician:'تیم شبکه',cost:0}]},
    {id:5,tag:'AST-0105',name:'پرینتر واحد منابع انسانی',category:'پرینتر',brand:'HP',model:'LaserJet Pro M404',serial:'HP-M404-1802',status:'در تعمیر',condition:'معیوب',department:'منابع انسانی',assignee:'',purchaseDate:'۱۴۰۳/۰۴/۲۲',warrantyUntil:'۱۴۰۵/۰۴/۲۲',purchaseCost:210000000,location:'اتاق بایگانی',notes:'گیر کردن مکرر کاغذ',maintenance:[{date:'۱۴۰۵/۰۸/۲۵',type:'ثبت خرابی',description:'خرابی مجموعه کاغذکش؛ ارجاع به تعمیرکار',technician:'میز خدمت',cost:0}]},
    {id:6,tag:'AST-0106',name:'رایانه طراحی گرافیک',category:'رایانه رومیزی',brand:'HP',model:'Z2 Tower G9',serial:'HP-Z2-9061',status:'در حال استفاده',condition:'خوب',department:'فروش',assignee:'امیر کریمی',purchaseDate:'۱۴۰۴/۰۸/۰۵',warrantyUntil:'۱۴۰۶/۰۸/۰۵',purchaseCost:890000000,location:'ساختمان مرکزی، طبقه ۱',notes:'',maintenance:[]}
  ]);
  readonly search=signal(''); readonly categoryFilter=signal(''); readonly statusFilter=signal(''); readonly departmentFilter=signal('');
  readonly selectedId=signal<number|null>(1); readonly dialogOpen=signal(false); readonly editingId=signal<number|null>(null);
  readonly actionDialog=signal(false); readonly actionType=signal<'assign'|'maintenance'|'repair'|'return'|'complete'>('assign');
  actionAssignee=''; actionDepartment=this.departments[0];
  maintenanceType='سرویس دوره‌ای'; maintenanceDescription=''; maintenanceCost=0;
  readonly toast=signal(''); private nextId=7; private timer?:ReturnType<typeof setTimeout>;
  form: AssetForm=this.emptyForm();

  readonly filteredAssets=computed(()=>{const q=this.search().trim().toLocaleLowerCase('fa');return this.assets().filter(a=>(!q||`${a.name} ${a.tag} ${a.serial} ${a.brand} ${a.model} ${a.assignee}`.toLocaleLowerCase('fa').includes(q))&&(!this.categoryFilter()||a.category===this.categoryFilter())&&(!this.statusFilter()||a.status===this.statusFilter())&&(!this.departmentFilter()||a.department===this.departmentFilter()));});
  readonly selected=computed(()=>this.assets().find(a=>a.id===this.selectedId())??null);
  readonly inUseCount=computed(()=>this.assets().filter(a=>a.status==='در حال استفاده').length);
  readonly attentionCount=computed(()=>this.assetsInRepair().length+this.expiringWarranty().length);
  readonly totalValue=computed(()=>this.assets().reduce((sum,a)=>sum+a.purchaseCost,0));
  readonly assetsInRepair=computed(()=>this.assets().filter(a=>a.status==='در تعمیر'));
  readonly expiringWarranty=computed(()=>this.assets().filter(a=>this.isWarrantyExpiring(a)));

  inputValue(event:Event):string{return (event.target as HTMLInputElement).value;}
  categoryIcon(category:AssetCategory):string{return category==='لپ‌تاپ'?'▰':category==='رایانه رومیزی'?'▣':category==='مانیتور'?'▱':category==='پرینتر'?'▤':category==='تجهیزات شبکه'?'⌁':category==='موبایل'?'▯':'◇';}
  isWarrantyExpiring(asset:Asset):boolean{return !!asset.warrantyUntil && (asset.warrantyUntil.startsWith('۱۴۰۵/۱۱') || asset.warrantyUntil.startsWith('۱۴۰۵/۱۲'));}
  select(asset:Asset):void{this.selectedId.set(asset.id);}
  private emptyForm():AssetForm{return {tag:'',name:'',category:'لپ‌تاپ',brand:'',model:'',serial:'',status:'در انبار',condition:'خوب',department:this.departments[0],assignee:'',purchaseDate:'',warrantyUntil:'',purchaseCost:0,location:'',notes:''};}
  create():void{this.editingId.set(null);this.form=this.emptyForm();this.dialogOpen.set(true);}
  edit(asset:Asset):void{this.editingId.set(asset.id);this.form={tag:asset.tag,name:asset.name,category:asset.category,brand:asset.brand,model:asset.model,serial:asset.serial,status:asset.status,condition:asset.condition,department:asset.department,assignee:asset.assignee,purchaseDate:asset.purchaseDate,warrantyUntil:asset.warrantyUntil,purchaseCost:asset.purchaseCost,location:asset.location,notes:asset.notes};this.dialogOpen.set(true);}
  closeDialog():void{this.dialogOpen.set(false);}
  save():void{
    const tag=this.form.tag.trim(),name=this.form.name.trim(),serial=this.form.serial.trim();
    if(!tag||name.length<3||!serial){this.notify('کد اموال، نام دارایی و شماره سریال الزامی هستند.');return;}
    if(this.assets().some(a=>a.tag.toLocaleLowerCase()===tag.toLocaleLowerCase()&&a.id!==this.editingId())){this.notify('این کد اموال قبلاً ثبت شده است.');return;}
    const existing=this.assets().find(a=>a.id===this.editingId());const id=this.editingId()??this.nextId++;
    const item:Asset={...this.form,id,tag,name,serial,maintenance:existing?.maintenance??[]};
    this.assets.update(items=>existing?items.map(a=>a.id===id?item:a):[item,...items]);this.selectedId.set(id);this.closeDialog();this.notify(existing?'اطلاعات دارایی به‌روزرسانی شد.':'دارایی جدید ثبت شد.');
  }
  openAssign(asset:Asset):void{this.selectedId.set(asset.id);this.actionType.set('assign');this.actionAssignee='';this.actionDepartment=asset.department;this.actionDialog.set(true);}
  returnToStock(asset:Asset):void{this.selectedId.set(asset.id);this.actionType.set('return');this.actionDialog.set(true);}
  sendToRepair(asset:Asset):void{this.selectedId.set(asset.id);this.actionType.set('repair');this.maintenanceDescription='';this.actionDialog.set(true);}
  completeRepair(asset:Asset):void{this.selectedId.set(asset.id);this.actionType.set('complete');this.actionDialog.set(true);}
  addMaintenance(asset:Asset):void{this.selectedId.set(asset.id);this.actionType.set('maintenance');this.maintenanceType='سرویس دوره‌ای';this.maintenanceDescription='';this.maintenanceCost=0;this.actionDialog.set(true);}
  actionTitle():string{return ({assign:'تخصیص دارایی',maintenance:'ثبت سابقه نگهداری',repair:'ارسال دارایی به تعمیر',return:'ثبت عودت دارایی',complete:'اتمام عملیات تعمیر'} as const)[this.actionType()];}
  actionDescription():string{return ({assign:'تحویل‌گیرنده و واحد سازمانی جدید را مشخص کنید.',maintenance:'جزئیات سرویس یا عملیات انجام‌شده را ثبت کنید.',repair:'شرح خرابی برای پیگیری در سوابق دارایی ذخیره می‌شود.',return:'دارایی به موجودی انبار بازگردانده خواهد شد.',complete:'پس از پایان تعمیر، وضعیت دارایی به انبار تغییر می‌کند.'} as const)[this.actionType()];}
  closeAction():void{this.actionDialog.set(false);}
  confirmAction():void{
    const asset=this.selected();if(!asset)return;const type=this.actionType();
    if(type==='assign'&&!this.actionAssignee.trim()){this.notify('نام تحویل‌گیرنده را وارد کنید.');return;}
    if(type==='assign'){this.updateAsset(asset.id,{status:'در حال استفاده',assignee:this.actionAssignee.trim(),department:this.actionDepartment});this.notify('تحویل دارایی ثبت شد.');}
    if(type==='return'){this.updateAsset(asset.id,{status:'در انبار',assignee:''});this.notify('عودت دارایی به انبار ثبت شد.');}
    if(type==='repair'){if(!this.maintenanceDescription.trim()){this.notify('شرح خرابی را وارد کنید.');return;}this.updateAsset(asset.id,{status:'در تعمیر',condition:'نیازمند بررسی',assignee:''});this.appendMaintenance(asset,{date:'۱۴۰۵/۰۸/۲۸',type:'ارجاع به تعمیر',description:this.maintenanceDescription,technician:'میز خدمت',cost:0});this.notify('دارایی به وضعیت تعمیر منتقل شد.');}
    if(type==='complete'){this.updateAsset(asset.id,{status:'در انبار',condition:'خوب'});this.notify('تعمیر تکمیل و دارایی به انبار بازگردانده شد.');}
    if(type==='maintenance'){if(!this.maintenanceDescription.trim()){this.notify('شرح عملیات را وارد کنید.');return;}this.appendMaintenance(asset,{date:'۱۴۰۵/۰۸/۲۸',type:this.maintenanceType,description:this.maintenanceDescription,technician:'محمد رضایی',cost:Number(this.maintenanceCost)||0});this.notify('سابقه نگهداری ثبت شد.');}
    this.closeAction();
  }
  private updateAsset(id:number,patch:Partial<Asset>):void{this.assets.update(items=>items.map(a=>a.id===id?{...a,...patch}:a));}
  private appendMaintenance(asset:Asset,record:MaintenanceRecord):void{this.assets.update(items=>items.map(a=>a.id===asset.id?{...a,maintenance:[record,...a.maintenance]}:a));}
  exportCsv():void{const rows=[['کد اموال','نام','دسته‌بندی','برند','مدل','سریال','وضعیت','تحویل‌گیرنده','واحد','پایان گارانتی','ارزش خرید'],...this.filteredAssets().map(a=>[a.tag,a.name,a.category,a.brand,a.model,a.serial,a.status,a.assignee,a.department,a.warrantyUntil,String(a.purchaseCost)])];const csv='\uFEFF'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='ashkan-assets.csv';link.click();URL.revokeObjectURL(url);}
  private notify(message:string):void{this.toast.set(message);if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(()=>this.toast.set(''),2800);}
}
