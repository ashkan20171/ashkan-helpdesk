import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Priority = 'بحرانی' | 'بالا' | 'متوسط' | 'پایین';
type Status = 'فعال' | 'غیرفعال';
type EscalationLevel = 'هشدار' | 'سرپرست' | 'مدیر ارشد';
type TicketSlaState = 'در محدوده' | 'نزدیک نقض' | 'نقض‌شده' | 'متوقف';

interface Escalation { level: EscalationLevel; threshold: number; action: string; enabled: boolean; }
interface Policy {
  id: number; name: string; code: string; priority: Priority; response: number; resolution: number;
  calendar: string; status: Status; description: string; pauseOnPending: boolean;
  escalation: Escalation[]; customerScope: string; contractScope: string;
}
interface MonitorItem {
  id: string; subject: string; priority: Priority; policy: string; owner: string;
  responseDue: string; resolutionDue: string; state: TicketSlaState; progress: number;
  remaining: string; escalated: boolean;
}

@Component({
  selector: 'ah-sla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sla.html',
  styleUrl: './sla.scss'
})
export class SlaComponent {
  activeTab: 'policies' | 'monitor' | 'calendars' | 'escalations' = 'policies';
  search = '';
  priorityFilter = '';
  statusFilter = '';
  monitorFilter = 'همه';
  dialogOpen = false;
  monitorDetailOpen = false;
  editingId: number | null = null;
  selectedMonitor: MonitorItem | null = null;
  notice = '';
  form: Policy = this.emptyPolicy();

  policies: Policy[] = [
    { id: 1, name: 'پشتیبانی بحرانی', code: 'SLA-P1', priority: 'بحرانی', response: 15, resolution: 4, calendar: '۲۴×۷', status: 'فعال', description: 'اختلال کامل سرویس‌های حیاتی', pauseOnPending: false, customerScope: 'همه مشتریان', contractScope: 'Enterprise', escalation: [{level:'هشدار',threshold:75,action:'اعلان به مسئول',enabled:true},{level:'سرپرست',threshold:90,action:'Escalation به سرپرست',enabled:true},{level:'مدیر ارشد',threshold:100,action:'اعلان مدیر ارشد',enabled:true}] },
    { id: 2, name: 'پشتیبانی با اولویت بالا', code: 'SLA-P2', priority: 'بالا', response: 30, resolution: 8, calendar: '۲۴×۷', status: 'فعال', description: 'اختلال جدی با راهکار جایگزین محدود', pauseOnPending: true, customerScope: 'همه مشتریان', contractScope: 'Professional / Enterprise', escalation: [{level:'هشدار',threshold:75,action:'اعلان به مسئول',enabled:true},{level:'سرپرست',threshold:90,action:'اعلان سرپرست',enabled:true}] },
    { id: 3, name: 'پشتیبانی عادی', code: 'SLA-P3', priority: 'متوسط', response: 120, resolution: 24, calendar: 'روزهای کاری (شنبه تا پنجشنبه)', status: 'فعال', description: 'درخواست‌های معمول کاربران', pauseOnPending: true, customerScope: 'همه مشتریان', contractScope: 'همه قراردادها', escalation: [{level:'هشدار',threshold:80,action:'اعلان به مسئول',enabled:true},{level:'سرپرست',threshold:100,action:'Escalation به سرپرست',enabled:true}] },
    { id: 4, name: 'درخواست کم‌اهمیت', code: 'SLA-P4', priority: 'پایین', response: 480, resolution: 72, calendar: 'ساعات اداری', status: 'فعال', description: 'درخواست‌های غیرضروری و بهبودها', pauseOnPending: true, customerScope: 'همه مشتریان', contractScope: 'همه قراردادها', escalation: [{level:'هشدار',threshold:85,action:'اعلان به مسئول',enabled:true}] }
  ];

  monitors: MonitorItem[] = [
    {id:'HD-2048',subject:'اختلال در درگاه پرداخت',priority:'بحرانی',policy:'SLA-P1',owner:'سارا احمدی',responseDue:'۰۹:۴۵ امروز',resolutionDue:'۱۲:۳۰ امروز',state:'نزدیک نقض',progress:91,remaining:'۲۳ دقیقه',escalated:true},
    {id:'HD-2044',subject:'دسترسی کاربر جدید',priority:'بالا',policy:'SLA-P2',owner:'علی رضایی',responseDue:'۱۰:۲۰ امروز',resolutionDue:'۱۶:۰۰ امروز',state:'در محدوده',progress:48,remaining:'۳ ساعت و ۴۰ دقیقه',escalated:false},
    {id:'HD-2038',subject:'گزارش‌گیری مالی',priority:'متوسط',policy:'SLA-P3',owner:'مهدی کریمی',responseDue:'۱۱:۳۰ امروز',resolutionDue:'فردا، ۱۳:۰۰',state:'نزدیک نقض',progress:82,remaining:'۱ ساعت و ۱۵ دقیقه',escalated:false},
    {id:'HD-2027',subject:'خطای سرویس VPN',priority:'بحرانی',policy:'SLA-P1',owner:'تیم زیرساخت',responseDue:'۰۸:۱۰ امروز',resolutionDue:'۱۰:۰۰ امروز',state:'نقض‌شده',progress:100,remaining:'نقض شده ۱۸ دقیقه',escalated:true},
    {id:'HD-2019',subject:'درخواست تغییر گزارش',priority:'پایین',policy:'SLA-P4',owner:'نگار محمدی',responseDue:'فردا، ۱۰:۰۰',resolutionDue:'پس‌فردا، ۱۶:۰۰',state:'متوقف',progress:34,remaining:'متوقف تا پاسخ مشتری',escalated:false}
  ];

  calendars = [
    {name:'۲۴×۷', description:'تمام روزهای هفته بدون توقف', hours:'۱۶۸ ساعت در هفته', holidays:'تعطیلات نیز محاسبه می‌شود', status:'فعال'},
    {name:'روزهای کاری سازمان', description:'شنبه تا پنجشنبه، ۰۸:۰۰ تا ۱۷:۰۰', hours:'۵۴ ساعت در هفته', holidays:'تعطیلات رسمی متوقف', status:'فعال'},
    {name:'ساعات اداری', description:'شنبه تا چهارشنبه، ۰۸:۰۰ تا ۱۶:۰۰', hours:'۴۰ ساعت در هفته', holidays:'تعطیلات رسمی متوقف', status:'فعال'}
  ];

  get filteredPolicies(): Policy[] {
    const q=this.search.trim().toLocaleLowerCase('fa');
    return this.policies.filter(p=>(!q||`${p.name} ${p.code} ${p.description} ${p.customerScope}`.toLocaleLowerCase('fa').includes(q))
      &&(!this.priorityFilter||p.priority===this.priorityFilter)&&(!this.statusFilter||p.status===this.statusFilter));
  }
  get filteredMonitor(): MonitorItem[] {
    const q=this.search.trim().toLocaleLowerCase('fa');
    return this.monitors.filter(m=>(this.monitorFilter==='همه'||m.state===this.monitorFilter)
      &&(!q||`${m.id} ${m.subject} ${m.owner} ${m.policy}`.toLocaleLowerCase('fa').includes(q)));
  }
  get activeCount(){return this.policies.filter(p=>p.status==='فعال').length}
  get nearBreachCount(){return this.monitors.filter(m=>m.state==='نزدیک نقض').length}
  get breachedCount(){return this.monitors.filter(m=>m.state==='نقض‌شده').length}
  get complianceRate(){const total=this.monitors.length; return total?Math.round((this.monitors.filter(m=>m.state!=='نقض‌شده').length/total)*100):0}
  get avgResponse(){const a=this.policies.filter(p=>p.status==='فعال');return a.length?Math.round(a.reduce((s,p)=>s+p.response,0)/a.length):0}
  get avgResolution(){const a=this.policies.filter(p=>p.status==='فعال');return a.length?Math.round(a.reduce((s,p)=>s+p.resolution,0)/a.length):0}

  private emptyPolicy(): Policy {
    return {id:0,name:'',code:'',priority:'متوسط',response:60,resolution:24,calendar:'روزهای کاری سازمان',status:'فعال',
      description:'',pauseOnPending:true,customerScope:'همه مشتریان',contractScope:'همه قراردادها',
      escalation:[{level:'هشدار',threshold:75,action:'اعلان به مسئول',enabled:true},{level:'سرپرست',threshold:90,action:'Escalation به سرپرست',enabled:true}]};
  }
  openCreate(){this.editingId=null;this.form=this.emptyPolicy();this.dialogOpen=true}
  edit(p:Policy){this.editingId=p.id;this.form={...p,escalation:p.escalation.map(e=>({...e}))};this.dialogOpen=true}
  close(){this.dialogOpen=false}
  save(){
    const name=this.form.name.trim(),code=this.form.code.trim().toUpperCase();
    if(!name||!code||this.form.response<1||this.form.resolution<1){this.notify('نام، کد و زمان‌های SLA را کامل کنید.');return}
    if(this.policies.some(p=>p.code.toLowerCase()===code.toLowerCase()&&p.id!==this.editingId)){this.notify('کد این سیاست قبلاً استفاده شده است.');return}
    const item={...this.form,name,code,response:Number(this.form.response),resolution:Number(this.form.resolution),id:this.editingId??Math.max(0,...this.policies.map(p=>p.id))+1};
    if(this.editingId)this.policies=this.policies.map(p=>p.id===this.editingId?item:p); else this.policies=[...this.policies,item];
    this.close();this.notify(this.editingId?'سیاست SLA به‌روزرسانی شد.':'سیاست SLA ایجاد شد.');
  }
  toggle(p:Policy){this.policies=this.policies.map(x=>x.id===p.id?{...x,status:x.status==='فعال'?'غیرفعال':'فعال'}:x);this.notify('وضعیت سیاست تغییر کرد.')}
  addEscalation(){this.form.escalation=[...this.form.escalation,{level:'سرپرست',threshold:95,action:'اعلان سرپرست',enabled:true}]}
  removeEscalation(i:number){this.form.escalation.splice(i,1);this.form.escalation=[...this.form.escalation]}
  inspect(m:MonitorItem){this.selectedMonitor=m;this.monitorDetailOpen=true}
  pause(m:MonitorItem){m.state=m.state==='متوقف'?'در محدوده':'متوقف';this.notify(m.state==='متوقف'?'محاسبه SLA متوقف شد.':'محاسبه SLA ادامه یافت.')}
  runEscalation(m:MonitorItem){m.escalated=true;this.notify(`Escalation برای ${m.id} به‌صورت نمایشی اجرا شد.`)}
  exportCsv(){
    const rows=[['شناسه','موضوع','اولویت','سیاست','مسئول','وضعیت','پیشرفت','باقی‌مانده'],...this.filteredMonitor.map(m=>[m.id,m.subject,m.priority,m.policy,m.owner,m.state,m.progress+'%',m.remaining])];
    const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='ashkan-sla-monitor.csv';a.click();
  }
  exportPolicies(){
    const rows=[['نام','کد','اولویت','پاسخ اولیه','حل','تقویم','توقف در انتظار','محدوده مشتری','محدوده قرارداد','وضعیت'],...this.filteredPolicies.map(p=>[p.name,p.code,p.priority,p.response,p.resolution,p.calendar,p.pauseOnPending?'بله':'خیر',p.customerScope,p.contractScope,p.status])];
    const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='ashkan-sla-policies.csv';a.click();
  }
  private notify(message:string){this.notice=message;setTimeout(()=>{if(this.notice===message)this.notice=''},3000)}
}
