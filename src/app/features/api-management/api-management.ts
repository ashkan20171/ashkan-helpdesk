import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LockKeyhole, Activity, KeyRound, Webhook, PlugZap, Copy, Eye, EyeOff, RefreshCw, Plus, Trash2, Check, X, ExternalLink, Clock3, ShieldCheck, Terminal, FileCode2, Search, MoreHorizontal } from 'lucide-angular';

type ApiTab = 'overview' | 'keys' | 'webhooks' | 'integrations' | 'logs' | 'docs';
interface ApiKey { id:number; name:string; prefix:string; secret:string; scopes:string[]; created:string; lastUsed:string; expires:string; active:boolean; }
interface Hook { id:number; name:string; url:string; events:string[]; status:'active'|'paused'|'failed'; lastDelivery:string; success:number; }
interface Integration { id:number; name:string; category:string; description:string; status:'connected'|'available'|'attention'; icon:string; }
interface ApiLog { id:number; method:string; path:string; status:number; duration:number; source:string; time:string; }
@Component({
 selector:'ah-api-management', standalone:true, imports:[CommonModule,FormsModule,LucideAngularModule],
 templateUrl:'./api-management.html', styleUrl:'./api-management.scss'
})
export class ApiManagementComponent {
 readonly Activity=Activity; readonly KeyRound=KeyRound; readonly Webhook=Webhook; readonly PlugZap=PlugZap;
 readonly Copy=Copy; readonly Eye=Eye; readonly EyeOff=EyeOff; readonly RefreshCw=RefreshCw; readonly Plus=Plus;
 readonly Trash2=Trash2; readonly Check=Check; readonly X=X; readonly ExternalLink=ExternalLink; readonly Clock3=Clock3;
 readonly ShieldCheck=ShieldCheck; readonly LockKeyhole=LockKeyhole; readonly Terminal=Terminal; readonly FileCode2=FileCode2; readonly Search=Search; readonly MoreHorizontal=MoreHorizontal;

 readonly activeTab=signal<ApiTab>('overview');
 readonly toast=signal('');
 readonly query=signal('');
 readonly showSecrets=signal<number[]>([]);
 readonly keyDialog=signal(false);
 readonly hookDialog=signal(false);
 readonly selectedLog=signal<ApiLog|null>(null);
 readonly keyForm={name:'',scopes:['tickets:read'] as string[],expires:'90'};
 readonly hookForm={name:'',url:'',events:['ticket.created'] as string[]};

 readonly keys=signal<ApiKey[]>([
  {id:1,name:'اتصال پورتال مشتریان',prefix:'ash_pub_7f2a',secret:'ash_pub_7f2a_8c91f0a4d62e',scopes:['tickets:read','tickets:create'],created:'۱۴۰۵/۰۸/۰۱',lastUsed:'۵ دقیقه پیش',expires:'بدون انقضا',active:true},
  {id:2,name:'یکپارچه‌سازی ERP',prefix:'ash_srv_91bd',secret:'ash_srv_91bd_2a84b7d1c930',scopes:['tickets:read','users:read','assets:read'],created:'۱۴۰۵/۰۷/۲۲',lastUsed:'۲ ساعت پیش',expires:'۱۴۰۶/۰۲/۰۱',active:true},
  {id:3,name:'داشبورد مدیریتی',prefix:'ash_srv_4c10',secret:'ash_srv_4c10_3c19a6e8f205',scopes:['reports:read'],created:'۱۴۰۵/۰۶/۱۵',lastUsed:'۱۲ روز پیش',expires:'۱۴۰۵/۱۲/۱۵',active:false}
 ]);
 readonly hooks=signal<Hook[]>([
  {id:1,name:'اعلان ثبت تیکت جدید',url:'https://erp.example.com/hooks/ticket-created',events:['ticket.created','ticket.assigned'],status:'active',lastDelivery:'۳ دقیقه پیش',success:99.2},
  {id:2,name:'همگام‌سازی وضعیت درخواست',url:'https://portal.example.com/api/ashkan/status',events:['ticket.updated','ticket.closed'],status:'active',lastDelivery:'۱۸ دقیقه پیش',success:97.8},
  {id:3,name:'هشدار رخداد بحرانی',url:'https://ops.example.com/webhook/critical',events:['sla.breached','ticket.priority_changed'],status:'failed',lastDelivery:'۲ ساعت پیش',success:82.4}
 ]);
 readonly integrations=signal<Integration[]>([
  {id:1,name:'Microsoft Teams',category:'ارتباطات',description:'ارسال اعلان و پیام به کانال‌های سازمانی',status:'connected',icon:'M'},
  {id:2,name:'Microsoft Entra ID',category:'هویت و دسترسی',description:'ورود یکپارچه و همگام‌سازی کاربران',status:'connected',icon:'A'},
  {id:3,name:'ERP سازمانی',category:'سامانه‌های سازمانی',description:'تبادل اطلاعات درخواست‌ها و دارایی‌ها',status:'attention',icon:'E'},
  {id:4,name:'Slack',category:'ارتباطات',description:'ارسال اعلان‌های عملیاتی به کانال‌ها',status:'available',icon:'S'},
  {id:5,name:'GitLab',category:'توسعه نرم‌افزار',description:'اتصال رخدادها و درخواست‌های تیم توسعه',status:'available',icon:'G'},
  {id:6,name:'ذخیره‌سازی ابری',category:'فایل و اسناد',description:'اتصال مخزن اسناد سازمانی',status:'available',icon:'C'}
 ]);
 readonly logs:ApiLog[]=[
  {id:9012,method:'GET',path:'/api/v1/tickets',status:200,duration:84,source:'192.168.10.24',time:'۱۴:۳۲:۱۸'},
  {id:9011,method:'POST',path:'/api/v1/tickets',status:201,duration:142,source:'10.0.0.18',time:'۱۴:۲۹:۴۲'},
  {id:9010,method:'PATCH',path:'/api/v1/tickets/TKT-2481',status:200,duration:96,source:'192.168.10.11',time:'۱۴:۲۸:۰۵'},
  {id:9009,method:'GET',path:'/api/v1/users',status:401,duration:21,source:'185.12.44.91',time:'۱۴:۲۱:۳۳'},
  {id:9008,method:'GET',path:'/api/v1/assets',status:429,duration:4,source:'10.0.0.18',time:'۱۴:۱۸:۱۱'},
  {id:9007,method:'POST',path:'/api/v1/webhooks/test',status:500,duration:1200,source:'10.0.0.5',time:'۱۳:۵۹:۰۲'}
 ];
 readonly filteredKeys=computed(()=>this.keys().filter(k=>!this.query()||`${k.name} ${k.prefix}`.toLocaleLowerCase('fa').includes(this.query().toLocaleLowerCase('fa'))));
 readonly filteredHooks=computed(()=>this.hooks().filter(h=>!this.query()||`${h.name} ${h.url}`.toLocaleLowerCase('fa').includes(this.query().toLocaleLowerCase('fa'))));
 readonly filteredLogs=computed(()=>this.logs.filter(l=>!this.query()||`${l.method} ${l.path} ${l.source} ${l.status}`.toLowerCase().includes(this.query().toLowerCase())));
 readonly activeKeys=computed(()=>this.keys().filter(k=>k.active).length);
 readonly activeHooks=computed(()=>this.hooks().filter(h=>h.status==='active').length);
 readonly connectedIntegrations=computed(()=>this.integrations().filter(i=>i.status==='connected').length);

 setTab(tab:ApiTab):void{this.activeTab.set(tab);this.query.set('');}
 toggleSecret(id:number):void{this.showSecrets.update(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);}
 async copy(value:string):Promise<void>{try{await navigator.clipboard.writeText(value);this.notify('مقدار در کلیپ‌بورد کپی شد.');}catch{this.notify('کپی خودکار در این مرورگر در دسترس نیست.');}}
 openKeyDialog():void{this.keyForm.name='';this.keyForm.scopes=['tickets:read'];this.keyForm.expires='90';this.keyDialog.set(true);}
 createKey():void{
  if(!this.keyForm.name.trim()||!this.keyForm.scopes.length){this.notify('نام کلید و حداقل یک مجوز لازم است.');return;}
  const id=Math.max(0,...this.keys().map(k=>k.id))+1;const token=`ash_srv_${Math.random().toString(36).slice(2,6)}_${Math.random().toString(36).slice(2,14)}`;
  this.keys.update(list=>[{id,name:this.keyForm.name.trim(),prefix:token.slice(0,12),secret:token,scopes:[...this.keyForm.scopes],created:'امروز',lastUsed:'هرگز',expires:this.keyForm.expires==='0'?'بدون انقضا':`پس از ${this.keyForm.expires} روز`,active:true},...list]);
  this.keyDialog.set(false);this.showSecrets.update(x=>[...x,id]);this.notify('کلید آزمایشی ایجاد شد؛ مقدار کامل فقط در همین نمایش قابل مشاهده است.');
 }
 toggleKey(key:ApiKey):void{this.keys.update(list=>list.map(k=>k.id===key.id?{...k,active:!k.active}:k));}
 revokeKey(key:ApiKey):void{this.keys.update(list=>list.filter(k=>k.id!==key.id));this.notify('کلید از فهرست نمایشی حذف شد.');}
 openHookDialog():void{this.hookForm.name='';this.hookForm.url='';this.hookForm.events=['ticket.created'];this.hookDialog.set(true);}
 createHook():void{
  if(!this.hookForm.name.trim()||!/^https?:\/\//i.test(this.hookForm.url)||!this.hookForm.events.length){this.notify('نام، نشانی معتبر HTTP(S) و حداقل یک رویداد لازم است.');return;}
  const id=Math.max(0,...this.hooks().map(h=>h.id))+1;
  this.hooks.update(list=>[{id,name:this.hookForm.name.trim(),url:this.hookForm.url.trim(),events:[...this.hookForm.events],status:'active',lastDelivery:'هنوز ارسال نشده',success:100},...list]);
  this.hookDialog.set(false);this.notify('Webhook آزمایشی ثبت شد.');
 }
 toggleHook(hook:Hook):void{this.hooks.update(list=>list.map(h=>h.id===hook.id?{...h,status:h.status==='active'?'paused':'active'}:h));}
 deleteHook(hook:Hook):void{this.hooks.update(list=>list.filter(h=>h.id!==hook.id));this.notify('Webhook از فهرست نمایشی حذف شد.');}
 testHook(hook:Hook):void{this.notify(`درخواست تست برای «${hook.name}» در نسخه نمایشی شبیه‌سازی شد.`);}
 connectIntegration(item:Integration):void{this.integrations.update(list=>list.map(i=>i.id===item.id?{...i,status:i.status==='connected'?'available':'connected'}:i));this.notify('وضعیت نمایشی اتصال به‌روزرسانی شد.');}
 methodClass(method:string):string{return method.toLowerCase();}
 statusLabel(status:number):string{return status>=500?'خطای سرور':status>=400?'خطا':status>=300?'تغییر مسیر':'موفق';}
 private notify(message:string):void{this.toast.set(message);setTimeout(()=>this.toast.set(''),2800);}
}
