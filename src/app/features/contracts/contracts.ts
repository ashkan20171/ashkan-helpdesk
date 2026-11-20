import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell, CalendarClock, CheckCircle2, Download, FileText, Plus, Search, ShoppingCart, Truck, Wallet, X } from 'lucide-angular';

type ContractStatus='draft'|'active'|'expiring'|'expired'|'terminated';
type VendorStatus='active'|'pending'|'blocked';
type PurchaseStatus='draft'|'requested'|'approved'|'ordered'|'received'|'cancelled';

interface Contract { id:number; number:string; title:string; vendor:string; type:string; start:string; end:string; value:number; status:ContractStatus; owner:string; renewalNotice:number; }
interface Vendor { id:number; code:string; name:string; category:string; contact:string; phone:string; score:number; status:VendorStatus; contracts:number; }
interface PurchaseOrder { id:number; number:string; vendor:string; requester:string; date:string; amount:number; status:PurchaseStatus; delivery:string; }
interface Tender { id:number; title:string; category:string; deadline:string; bids:number; estimated:number; status:'open'|'review'|'awarded'|'closed'; }

@Component({selector:'app-contracts',standalone:true,imports:[LucideAngularModule, CommonModule,FormsModule],templateUrl:'./contracts.html',styleUrl:'./contracts.scss'})
export class ContractsComponent {
 readonly icons={bell:Bell,calendar:CalendarClock,check:CheckCircle2,download:Download,file:FileText,plus:Plus,search:Search,cart:ShoppingCart,truck:Truck,wallet:Wallet,close:X};
 activeTab:'contracts'|'vendors'|'orders'|'tenders'='contracts';
 searchTerm=''; statusFilter='all'; showContractModal=false; showVendorModal=false; editingContractId:number|null=null;
 contractForm={number:'',title:'',vendor:'',type:'خدمات',start:'',end:'',value:0,status:'draft' as ContractStatus,owner:'',renewalNotice:30};
 vendorForm={code:'',name:'',category:'',contact:'',phone:'',score:5,status:'active' as VendorStatus};
 contracts:Contract[]=[
 {id:1,number:'CNT-1405-001',title:'قرارداد پشتیبانی زیرساخت شبکه',vendor:'راهکاران شبکه آریا',type:'خدمات',start:'2026-01-01',end:'2026-12-31',value:4800000000,status:'active',owner:'علی رضایی',renewalNotice:45},
 {id:2,number:'CNT-1405-014',title:'تأمین تجهیزات دیتاسنتر',vendor:'پارس تجهیز',type:'تأمین',start:'2026-05-15',end:'2026-12-10',value:3200000000,status:'expiring',owner:'مینا حسینی',renewalNotice:30},
 {id:3,number:'CNT-1405-018',title:'خدمات مشاوره منابع انسانی',vendor:'توسعه سرمایه نوین',type:'مشاوره',start:'2026-07-01',end:'2027-06-30',value:1850000000,status:'active',owner:'سارا محمدی',renewalNotice:60},
 {id:4,number:'CNT-1404-042',title:'قرارداد نگهداری سیستم سرمایش',vendor:'تهویه گستر',type:'نگهداری',start:'2025-01-01',end:'2026-11-05',value:920000000,status:'expired',owner:'مهدی احمدی',renewalNotice:30}
 ];
 vendors:Vendor[]=[
 {id:1,code:'VND-001',name:'راهکاران شبکه آریا',category:'فناوری اطلاعات',contact:'رضا اکبری',phone:'021-44000001',score:4.7,status:'active',contracts:3},
 {id:2,code:'VND-002',name:'پارس تجهیز',category:'تجهیزات',contact:'محمد کاظمی',phone:'021-44000002',score:4.2,status:'active',contracts:2},
 {id:3,code:'VND-003',name:'توسعه سرمایه نوین',category:'مشاوره',contact:'نگار مرادی',phone:'021-44000003',score:4.5,status:'active',contracts:1},
 {id:4,code:'VND-004',name:'تهویه گستر',category:'تأسیسات',contact:'حمید رستمی',phone:'021-44000004',score:3.4,status:'pending',contracts:1}
 ];
 orders:PurchaseOrder[]=[
 {id:1,number:'PO-1405-071',vendor:'پارس تجهیز',requester:'مینا حسینی',date:'2026-11-12',amount:760000000,status:'approved',delivery:'2026-11-25'},
 {id:2,number:'PO-1405-068',vendor:'راهکاران شبکه آریا',requester:'علی رضایی',date:'2026-11-08',amount:420000000,status:'ordered',delivery:'2026-11-21'},
 {id:3,number:'PO-1405-062',vendor:'تهویه گستر',requester:'مهدی احمدی',date:'2026-10-30',amount:185000000,status:'received',delivery:'2026-11-10'}
 ];
 tenders:Tender[]=[
 {id:1,title:'تأمین لپ‌تاپ سازمانی',category:'IT',deadline:'2026-11-28',bids:4,estimated:2400000000,status:'open'},
 {id:2,title:'خدمات نگهداری تأسیسات',category:'تأسیسات',deadline:'2026-11-20',bids:3,estimated:1100000000,status:'review'},
 {id:3,title:'قرارداد مشاوره امنیت اطلاعات',category:'امنیت',deadline:'2026-10-30',bids:5,estimated:1600000000,status:'awarded'}
 ];
 get expiring(){return this.contracts.filter(c=>c.status==='expiring').length}
 get activeContracts(){return this.contracts.filter(c=>c.status==='active').length}
 get contractValue(){return this.contracts.filter(c=>c.status!=='expired'&&c.status!=='terminated').reduce((s,c)=>s+c.value,0)}
 get orderValue(){return this.orders.reduce((s,o)=>s+o.amount,0)}
 get filteredContracts(){const q=this.searchTerm.trim().toLowerCase();return this.contracts.filter(c=>(!q||[c.number,c.title,c.vendor,c.owner].some(x=>x.toLowerCase().includes(q)))&&(this.statusFilter==='all'||c.status===this.statusFilter))}
 money(n:number){return new Intl.NumberFormat('fa-IR').format(n)}
 openContract(c?:Contract){this.editingContractId=c?.id??null;this.contractForm=c?{number:c.number,title:c.title,vendor:c.vendor,type:c.type,start:c.start,end:c.end,value:c.value,status:c.status,owner:c.owner,renewalNotice:c.renewalNotice}:{number:`CNT-1405-${String(this.contracts.length+1).padStart(3,'0')}`,title:'',vendor:this.vendors[0]?.name??'',type:'خدمات',start:'',end:'',value:0,status:'draft',owner:'',renewalNotice:30};this.showContractModal=true}
 saveContract(){if(!this.contractForm.title.trim()||!this.contractForm.vendor.trim())return;if(this.editingContractId){const i=this.contracts.findIndex(c=>c.id===this.editingContractId);if(i>=0)this.contracts[i]={...this.contracts[i],...this.contractForm}}else this.contracts.unshift({id:Date.now(),...this.contractForm});this.showContractModal=false}
 openVendor(v?:Vendor){this.vendorForm=v?{code:v.code,name:v.name,category:v.category,contact:v.contact,phone:v.phone,score:v.score,status:v.status}:{code:`VND-${String(this.vendors.length+1).padStart(3,'0')}`,name:'',category:'',contact:'',phone:'',score:5,status:'active'};this.showVendorModal=true}
 saveVendor(){if(!this.vendorForm.name.trim())return;this.vendors.unshift({id:Date.now(),...this.vendorForm,contracts:0});this.showVendorModal=false}
 setContractStatus(c:Contract,s:ContractStatus){c.status=s}
 setOrderStatus(o:PurchaseOrder,s:PurchaseStatus){o.status=s}
 exportCsv(){const rows=this.filteredContracts.map(c=>[c.number,c.title,c.vendor,c.type,c.start,c.end,c.value,c.status,c.owner]);const csv=[['شماره','عنوان','تأمین‌کننده','نوع','شروع','پایان','ارزش','وضعیت','مسئول'],...rows].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='ashkan-contracts.csv';a.click();URL.revokeObjectURL(u)}
}
