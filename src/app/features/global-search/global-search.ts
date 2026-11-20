import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Ticket, Users, Building2, Laptop, FileText, BookOpen, UserRound, SlidersHorizontal, Save, Download, ArrowUpRight, Clock3, X, Sparkles } from 'lucide-angular';

type SearchType = 'همه' | 'تیکت' | 'کاربر' | 'سازمان' | 'دارایی' | 'قرارداد' | 'دانش';
interface SearchItem { id:string; title:string; subtitle:string; type:Exclude<SearchType,'همه'>; status:string; meta:string; route:string; icon:any; keywords:string; }

@Component({
  selector: 'ah-global-search', standalone: true, imports: [FormsModule, RouterLink, LucideAngularModule], styleUrl: './global-search.scss',
  template: `
    <div class="search-page">
      <header class="search-hero">
        <div><span class="eyebrow"><i-lucide [img]="Sparkles" [size]="14"></i-lucide> Global Command Center</span><h1>جستجوی سراسری Ashkan</h1><p>تیکت‌ها، کاربران، سازمان‌ها، دارایی‌ها، قراردادها و پایگاه دانش را از یک نقطه پیدا و مدیریت کنید.</p></div>
        <button class="button button-light" type="button" (click)="exportResults()"><i-lucide [img]="Download" [size]="16"></i-lucide> خروجی CSV</button>
      </header>

      <section class="search-box-wrap">
        <div class="global-search-box"><i-lucide [img]="Search" [size]="22"></i-lucide><input #searchInput [(ngModel)]="query" (ngModelChange)="searchQuery.set($event)" autofocus placeholder="مثلاً: TKT-2481، محمد رضایی، لپ‌تاپ، SLA یا قرارداد پشتیبانی..." aria-label="جستجوی سراسری"><kbd>⌘ K</kbd>@if(query){<button type="button" aria-label="پاک کردن" (click)="query=''; searchQuery.set('')"><i-lucide [img]="X" [size]="17"></i-lucide></button>}</div>
        <div class="search-meta"><span><i-lucide [img]="Sparkles" [size]="14"></i-lucide> جستجوی هوشمند در {{ items.length }} رکورد نمایشی</span><span>فشار دهید <b>Enter</b> برای اولین نتیجه</span></div>
      </section>

      <section class="search-layout">
        <aside class="filters panel">
          <div class="panel-title"><div><strong>فیلترها</strong><small>نتایج را دقیق‌تر کنید</small></div><i-lucide [img]="SlidersHorizontal" [size]="18"></i-lucide></div>
          <label class="filter-label">نوع رکورد</label>
          <div class="filter-list">@for(type of types; track type){<button type="button" [class.active]="activeType()===type" (click)="activeType.set(type)"><span>{{ type }}</span><small>{{ typeCount(type) }}</small></button>}</div>
          <div class="filter-divider"></div>
          <label class="filter-label">وضعیت</label>
          <select [(ngModel)]="statusFilter"><option value="همه">همه وضعیت‌ها</option><option value="فعال">فعال</option><option value="باز">باز</option><option value="حل‌شده">حل‌شده</option><option value="منقضی">منقضی</option><option value="منتشر">منتشر</option></select>
          <div class="filter-divider"></div>
          <button class="saved-search" type="button" (click)="saveSearch()"><i-lucide [img]="Save" [size]="16"></i-lucide> ذخیره این جستجو</button>
          <div class="recent"><strong>جستجوهای اخیر</strong><button type="button" (click)="query='SLA'; searchQuery.set('SLA')">SLA بحرانی</button><button type="button" (click)="query='محمد'; searchQuery.set('محمد')">محمد رضایی</button><button type="button" (click)="query='VPN'; searchQuery.set('VPN')">VPN</button></div>
        </aside>

        <main class="results panel">
          <div class="results-head"><div><strong>{{ filteredItems().length }} نتیجه</strong><span>برای «{{ query || 'همه رکوردها' }}»</span></div><div class="result-tools"><span class="smart-badge">هوشمند</span><select [(ngModel)]="sortMode"><option value="relevance">مرتبط‌ترین</option><option value="recent">جدیدترین</option><option value="type">نوع رکورد</option></select></div></div>
          @if(filteredItems().length){<div class="result-list">@for(item of filteredItems(); track item.id){<article class="result-row"><span class="result-icon"><i-lucide [img]="item.icon" [size]="19"></i-lucide></span><div class="result-copy"><div class="result-title"><strong>{{ item.title }}</strong><span class="type-pill">{{ item.type }}</span><span class="status-pill">{{ item.status }}</span></div><p>{{ item.subtitle }}</p><div class="result-meta"><span>{{ item.meta }}</span><span class="dot">•</span><span>{{ item.id }}</span></div></div><a class="result-action" [routerLink]="item.route" aria-label="باز کردن"><i-lucide [img]="ArrowUpRight" [size]="17"></i-lucide></a></article>}</div>}
          @else {<div class="empty"><i-lucide [img]="Search" [size]="34"></i-lucide><strong>نتیجه‌ای پیدا نشد</strong><p>عبارت جستجو یا فیلترها را تغییر دهید.</p></div>}
        </main>
      </section>

      <section class="command-tip"><div><i-lucide [img]="Sparkles" [size]="18"></i-lucide><div><strong>Command Center</strong><p>از هدر سامانه با میانبر ⌘ K همین جستجو را سریع باز کنید.</p></div></div><span><kbd>⌘</kbd><kbd>K</kbd></span></section>
    </div>
  `
})
export class GlobalSearchComponent {
  readonly Search=Search; readonly Ticket=Ticket; readonly Users=Users; readonly Building2=Building2; readonly Laptop=Laptop; readonly FileText=FileText; readonly BookOpen=BookOpen; readonly UserRound=UserRound; readonly SlidersHorizontal=SlidersHorizontal; readonly Save=Save; readonly Download=Download; readonly ArrowUpRight=ArrowUpRight; readonly Clock3=Clock3; readonly X=X; readonly Sparkles=Sparkles;
  query=''; readonly searchQuery=signal(''); readonly activeType=signal<SearchType>('همه'); statusFilter='همه'; sortMode='relevance';
  readonly types: SearchType[]=['همه','تیکت','کاربر','سازمان','دارایی','قرارداد','دانش'];
  readonly items: SearchItem[]=[
    {id:'TKT-2481',title:'VPN کاربران شعبه غرب قطع است',subtitle:'درخواست اتصال مجدد VPN و بررسی Gateway شعبه غرب',type:'تیکت',status:'باز',meta:'اولویت بحرانی · علی احمدی · ۱۸ دقیقه قبل',route:'/tickets',icon:Ticket,keywords:'vpn شبکه gateway شعبه غرب قطع بحرانی'},
    {id:'TKT-2474',title:'افزایش زمان پاسخ API',subtitle:'بررسی latency سرویس یکپارچه‌سازی مشتریان',type:'تیکت',status:'باز',meta:'اولویت بالا · تیم API · ۳۵ دقیقه قبل',route:'/tickets',icon:Ticket,keywords:'api latency integration timeout'},
    {id:'USR-104',title:'محمد رضایی',subtitle:'مدیر سامانه · شرکت آشیان · تیم فناوری اطلاعات',type:'کاربر',status:'فعال',meta:'Admin · آخرین ورود امروز',route:'/user-management',icon:UserRound,keywords:'محمد رضایی مدیر سامانه admin'},
    {id:'USR-118',title:'سارا کریمی',subtitle:'مشتری سازمانی · واحد منابع انسانی',type:'کاربر',status:'فعال',meta:'Customer · آخرین ورود ۲ ساعت قبل',route:'/users',icon:Users,keywords:'سارا کریمی customer'},
    {id:'ORG-01',title:'شرکت آشیان',subtitle:'فضای کاری اصلی · ۱۲۸ کاربر · ۶ تیم',type:'سازمان',status:'فعال',meta:'Enterprise · SLA طلایی',route:'/tenants',icon:Building2,keywords:'آشیان سازمان tenant enterprise'},
    {id:'AST-402',title:'Laptop Dell Latitude 7440',subtitle:'دارایی تخصیص‌یافته به علی احمدی · گارانتی فعال',type:'دارایی',status:'فعال',meta:'Asset · IT-402 · تا ۱۴۰۶/۰۹/۱۲',route:'/assets',icon:Laptop,keywords:'laptop dell علی احمدی asset'},
    {id:'CON-77',title:'قرارداد پشتیبانی زیرساخت شبکه',subtitle:'قرارداد Gold با شرکت راهکار شبکه شرق',type:'قرارداد',status:'فعال',meta:'تمدید در ۴۵ روز · مالک: تدارکات',route:'/contracts',icon:FileText,keywords:'قرارداد پشتیبانی شبکه gold supplier'},
    {id:'KB-211',title:'راهنمای رفع خطای VPN در ویندوز',subtitle:'مقاله دانش با ۹۴٪ نرخ مفیدبودن برای کاربران',type:'دانش',status:'منتشر',meta:'Knowledge Base · ۲۳ مشاهده امروز',route:'/knowledge',icon:BookOpen,keywords:'vpn windows راهنما دانش خطا'},
    {id:'SLA-03',title:'SLA طلایی — پاسخ بحرانی زیر ۱۵ دقیقه',subtitle:'سیاست سطح خدمات برای مشتریان Enterprise',type:'قرارداد',status:'فعال',meta:'SLA · ۹۷٪ انطباق در ماه جاری',route:'/sla',icon:Clock3,keywords:'sla بحرانی golden enterprise 15 دقیقه'},
  ];
  readonly filteredItems=computed(()=>{const q=this.searchQuery().trim().toLocaleLowerCase(); let r=this.items.filter(x=>(this.activeType()==='همه'||x.type===this.activeType())&&(this.statusFilter==='همه'||x.status===this.statusFilter)&&(!q||`${x.title} ${x.subtitle} ${x.id} ${x.keywords} ${x.meta}`.toLocaleLowerCase().includes(q))); if(this.sortMode==='type')r=[...r].sort((a,b)=>a.type.localeCompare(b.type)); if(this.sortMode==='recent')r=[...r].reverse(); return r;});
  typeCount(type:SearchType){return type==='همه'?this.items.length:this.items.filter(x=>x.type===type).length;}
  saveSearch(){const label=this.query.trim()||'همه رکوردها'; localStorage.setItem('ashkan.saved-search',label); alert(`جستجوی «${label}» ذخیره شد.`);}
  exportResults(){const rows=this.filteredItems().map(x=>[x.id,x.type,x.title,x.status,x.meta].map(v=>`"${v.replaceAll('"','""')}"`).join(',')); const blob=new Blob(['\uFEFFID,Type,Title,Status,Meta\n'+rows.join('\n')],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ashkan-global-search.csv'; a.click(); URL.revokeObjectURL(a.href);}
}
