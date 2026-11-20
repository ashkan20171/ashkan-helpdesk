import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SubStatus = 'فعال' | 'آزمایشی' | 'سررسید گذشته' | 'لغوشده';
type InvoiceStatus = 'پرداخت‌شده' | 'در انتظار پرداخت' | 'سررسید گذشته';
interface Subscription { id: string; tenant: string; plan: string; status: SubStatus; users: number; userLimit: number; storage: number; storageLimit: number; tickets: number; ticketLimit: number; amount: number; cycle: string; nextDate: string; }
interface Invoice { id: string; tenant: string; date: string; due: string; amount: number; status: InvoiceStatus; items: string; }
@Component({
 selector: 'ah-billing', standalone: true, imports: [CommonModule, FormsModule],
 templateUrl: './billing.html', styleUrl: './billing.scss'
})
export class BillingComponent {
 readonly Math = Math;
 activeTab = 'اشتراک سازمان‌ها'; search = ''; statusFilter = 'همه'; toast = '';
 selected: Subscription | null = null; showInvoice = false; showPlanForm = false;
 invoiceDraft = { tenant: 'شرکت آشیان', amount: 0, due: '۱۴۰۵/۰۹/۳۰', items: 'تمدید اشتراک ماهانه' };
 plans = [
  { name: 'Starter', price: 490000, users: 50, storage: 10, tickets: 1000, features: 'پورتال کاربران، مدیریت تیکت، پایگاه دانش' },
  { name: 'Professional', price: 1490000, users: 500, storage: 100, tickets: 10000, features: 'گردش‌کار پیشرفته، SLA، API و دامنه اختصاصی' },
  { name: 'Enterprise', price: 0, users: 0, storage: 0, tickets: 0, features: 'سهمیه سفارشی، سیاست امنیتی و پشتیبانی اختصاصی' }
 ];
 subscriptions: Subscription[] = [
  { id:'SUB-1001', tenant:'شرکت آشیان', plan:'Enterprise', status:'فعال', users:128, userLimit:0, storage:68, storageLimit:0, tickets:2481, ticketLimit:0, amount:8900000, cycle:'سالانه', nextDate:'۱۴۰۶/۰۲/۱۲' },
  { id:'SUB-1002', tenant:'گروه صنعتی پایا', plan:'Professional', status:'فعال', users:64, userLimit:500, storage:42, storageLimit:100, tickets:936, ticketLimit:10000, amount:1490000, cycle:'ماهانه', nextDate:'۱۴۰۵/۰۹/۰۸' },
  { id:'SUB-1003', tenant:'فناوری نوین شرق', plan:'Starter', status:'آزمایشی', users:12, userLimit:50, storage:2.4, storageLimit:10, tickets:84, ticketLimit:1000, amount:490000, cycle:'ماهانه', nextDate:'۱۴۰۵/۰۹/۲۱' },
  { id:'SUB-1004', tenant:'هلدینگ اطلس', plan:'Professional', status:'سررسید گذشته', users:0, userLimit:500, storage:0, storageLimit:100, tickets:0, ticketLimit:10000, amount:1490000, cycle:'ماهانه', nextDate:'۱۴۰۵/۰۸/۱۶' }
 ];
 invoices: Invoice[] = [
  {id:'INV-1405-0081',tenant:'شرکت آشیان',date:'۱۴۰۵/۰۸/۱۲',due:'۱۴۰۵/۰۸/۲۰',amount:8900000,status:'پرداخت‌شده',items:'اشتراک Enterprise سالانه'},
  {id:'INV-1405-0080',tenant:'گروه صنعتی پایا',date:'۱۴۰۵/۰۸/۰۸',due:'۱۴۰۵/۰۸/۱۵',amount:1490000,status:'در انتظار پرداخت',items:'اشتراک Professional ماهانه'},
  {id:'INV-1405-0079',tenant:'فناوری نوین شرق',date:'۱۴۰۵/۰۸/۰۱',due:'۱۴۰۵/۰۸/۱۰',amount:490000,status:'سررسید گذشته',items:'اشتراک Starter ماهانه'},
  {id:'INV-1405-0078',tenant:'شرکت آشیان',date:'۱۴۰۵/۰۷/۱۲',due:'۱۴۰۵/۰۷/۲۰',amount:8900000,status:'پرداخت‌شده',items:'اشتراک Enterprise سالانه'}
 ];
 payments = [
  {id:'PAY-7781',tenant:'شرکت آشیان',invoice:'INV-1405-0081',date:'۱۴۰۵/۰۸/۱۸',amount:8900000,method:'درگاه پرداخت',status:'موفق'},
  {id:'PAY-7764',tenant:'شرکت آشیان',invoice:'INV-1405-0078',date:'۱۴۰۵/۰۷/۱۹',amount:8900000,method:'انتقال بانکی',status:'موفق'}
 ];
 get filteredSubs(): Subscription[] { return this.subscriptions.filter(s => (this.statusFilter==='همه'||s.status===this.statusFilter) && `${s.tenant} ${s.plan} ${s.id}`.toLowerCase().includes(this.search.toLowerCase())); }
 get paidRevenue(): number { return this.invoices.filter(i=>i.status==='پرداخت‌شده').reduce((a,b)=>a+b.amount,0); }
 get pendingAmount(): number { return this.invoices.filter(i=>i.status!=='پرداخت‌شده').reduce((a,b)=>a+b.amount,0); }
 get activeSubscriptions(): number { return this.subscriptions.filter(s=>s.status==='فعال').length; }
 get mrr(): number { return this.subscriptions.filter(s=>s.status==='فعال').reduce((sum,s)=>sum+(s.cycle==='سالانه'?s.amount/12:s.amount),0); }
 notify(message:string):void { this.toast=message; setTimeout(()=>this.toast='',2800); }
 changePlan(sub:Subscription,plan:string):void {
  const target=this.plans.find(p=>p.name===plan); if(!target)return;
  sub.plan=target.name; sub.amount=target.price; sub.userLimit=target.users; sub.storageLimit=target.storage; sub.ticketLimit=target.tickets;
  this.notify(`طرح ${sub.tenant} به ${plan} تغییر کرد (پیش‌نمایش).`);
 }
 extendTrial(sub:Subscription):void { sub.status='آزمایشی'; this.notify(`تمدید آزمایشی ${sub.tenant} در حالت نمایشی ثبت شد.`); }
 cancelSubscription(sub:Subscription):void { sub.status='لغوشده'; this.notify(`اشتراک ${sub.tenant} لغو شد (نمایشی).`); }
 activateSubscription(sub:Subscription):void { sub.status='فعال'; this.notify(`اشتراک ${sub.tenant} فعال شد (نمایشی).`); }
 markPaid(invoice:Invoice):void { invoice.status='پرداخت‌شده'; this.payments.unshift({id:`PAY-${7800+this.payments.length}`,tenant:invoice.tenant,invoice:invoice.id,date:'امروز',amount:invoice.amount,method:'ثبت دستی مدیر',status:'موفق'}); this.notify('وضعیت فاکتور پرداخت‌شده ثبت شد.'); }
 createInvoice():void {
  if(this.invoiceDraft.amount<=0){this.notify('مبلغ فاکتور باید بیشتر از صفر باشد.');return;}
  this.invoices.unshift({id:`INV-1405-${String(82+this.invoices.length).padStart(4,'0')}`,tenant:this.invoiceDraft.tenant,date:'امروز',due:this.invoiceDraft.due,amount:this.invoiceDraft.amount,status:'در انتظار پرداخت',items:this.invoiceDraft.items});
  this.showInvoice=false;this.notify('فاکتور جدید ایجاد شد.');
 }
 savePlan():void { this.notify('تعرفه‌ها در وضعیت نمایشی ذخیره شدند.');this.showPlanForm=false; }
 exportInvoices():void {
  const rows=[['شماره فاکتور','سازمان','تاریخ','سررسید','مبلغ','وضعیت'],...this.invoices.map(i=>[i.id,i.tenant,i.date,i.due,String(i.amount),i.status])];
  const csv='\uFEFF'+rows.map(r=>r.map(v=>`"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ashkan-invoices.csv';a.click();URL.revokeObjectURL(url);
 }
}
