import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity, AlertTriangle, BarChart3, BellRing, Building2, CheckCircle2, ChevronLeft,
  CircleDollarSign, Clock3, Flag, HeartPulse, Layers3, LucideAngularModule, Plus,
  RefreshCw, ShieldCheck, Sparkles, Target, TrendingDown, TrendingUp, UsersRound,
  X, Zap
} from 'lucide-angular';
import { hasPermission } from '../auth/auth.guard';

type Tab='overview'|'portfolio'|'onboarding'|'playbooks'|'journey';
type Lifecycle='Trial'|'Onboarding'|'Active'|'At Risk'|'Renewal'|'Churned';
interface Customer {
  id:string; name:string; plan:string; lifecycle:Lifecycle; health:number; adoption:number;
  renewal:string; mrr:number; users:number; activeUsers:number; tickets:number; sla:number;
  trend:'up'|'down'|'flat'; owner:string; risk:string; expansion:string;
}
interface Playbook {name:string; trigger:string; action:string; owner:string; status:string; priority:string}
interface Journey {stage:string; done:boolean; date:string; detail:string}

@Component({
  selector:'ah-customer-success',
  standalone:true,
  imports:[CommonModule,FormsModule,LucideAngularModule],
  templateUrl:'./customer-success.html',
  styleUrl:'./customer-success.scss'
})
export class CustomerSuccessComponent {
  readonly Activity=Activity; readonly AlertTriangle=AlertTriangle; readonly BarChart3=BarChart3;
  readonly BellRing=BellRing; readonly Building2=Building2; readonly CheckCircle2=CheckCircle2;
  readonly ChevronLeft=ChevronLeft; readonly CircleDollarSign=CircleDollarSign; readonly Clock3=Clock3;
  readonly Flag=Flag; readonly HeartPulse=HeartPulse; readonly Layers3=Layers3; readonly Plus=Plus;
  readonly RefreshCw=RefreshCw; readonly ShieldCheck=ShieldCheck; readonly Sparkles=Sparkles;
  readonly Target=Target; readonly TrendingDown=TrendingDown; readonly TrendingUp=TrendingUp;
  readonly UsersRound=UsersRound; readonly X=X; readonly Zap=Zap;

  readonly canManage=hasPermission('settings.manage');
  readonly tab=signal<Tab>('overview');
  readonly notice=signal('');
  readonly selected=signal<Customer|null>(null);
  readonly showTask=signal(false);

  readonly customers=signal<Customer[]>([
    {id:'T-001',name:'شرکت آشیان',plan:'Enterprise',lifecycle:'Active',health:92,adoption:86,renewal:'۱۴۰۵/۰۹/۲۸',mrr:249,users:250,activeUsers:221,tickets:6342,sla:97,trend:'up',owner:'سارا احمدی',risk:'کم',expansion:'AI + Analytics'},
    {id:'T-002',name:'راهکاران نوین',plan:'Business',lifecycle:'Renewal',health:78,adoption:71,renewal:'۱۴۰۵/۱۰/۰۶',mrr:89,users:50,activeUsers:39,tickets:9240,sla:93,trend:'flat',owner:'علی رضایی',risk:'متوسط',expansion:'API Pack'},
    {id:'T-003',name:'گروه توسعه فردا',plan:'Starter',lifecycle:'Onboarding',health:64,adoption:48,renewal:'۱۴۰۵/۰۹/۳۰',mrr:29,users:10,activeUsers:8,tickets:720,sla:89,trend:'up',owner:'مینا کریمی',risk:'متوسط',expansion:'Business Plan'},
    {id:'T-004',name:'پارس داده',plan:'Business',lifecycle:'At Risk',health:38,adoption:24,renewal:'۱۴۰۵/۰۸/۱۲',mrr:89,users:50,activeUsers:11,tickets:410,sla:76,trend:'down',owner:'سارا احمدی',risk:'زیاد',expansion:'نیازمند نجات'},
    {id:'T-005',name:'نگین سیستم',plan:'Enterprise',lifecycle:'Trial',health:57,adoption:31,renewal:'آزمایشی',mrr:0,users:100,activeUsers:27,tickets:94,sla:91,trend:'up',owner:'مینا کریمی',risk:'متوسط',expansion:'Conversion'}
  ]);

  readonly playbooks=signal<Playbook[]>([
    {name:'Rescue At-Risk',trigger:'Health < 50',action:'جلسه نجات + بررسی SLA + Executive Sponsor',owner:'Customer Success',status:'فعال',priority:'بحرانی'},
    {name:'Adoption Boost',trigger:'Adoption < 40%',action:'ارسال آموزش + Success Workshop',owner:'Enablement',status:'فعال',priority:'زیاد'},
    {name:'Renewal Radar',trigger:'Renewal < 45 days',action:'شروع مذاکره تمدید و Value Review',owner:'Account Manager',status:'فعال',priority:'زیاد'},
    {name:'Expansion Signal',trigger:'Usage > 80%',action:'پیشنهاد Add-on / Upgrade',owner:'Sales',status:'فعال',priority:'متوسط'}
  ]);

  readonly journey=signal<Journey[]>([
    {stage:'Trial / Contract',done:true,date:'۱۴۰۵/۰۸/۰۱',detail:'Subscription و Plan مشخص شد'},
    {stage:'Onboarding',done:true,date:'۱۴۰۵/۰۸/۰۵',detail:'Workspace و کاربران اولیه ایجاد شدند'},
    {stage:'Activation',done:true,date:'۱۴۰۵/۰۸/۱۲',detail:'اولین تیکت و Knowledge Base فعال شد'},
    {stage:'Adoption',done:false,date:'۱۴۰۵/۰۹/۰۲',detail:'رسیدن به ۶۰٪ استفاده از قابلیت‌های کلیدی'},
    {stage:'Value Realization',done:false,date:'—',detail:'ثبت KPI و نتیجه کسب‌وکار'},
    {stage:'Renewal / Expansion',done:false,date:'—',detail:'تمدید یا توسعه اشتراک'}
  ]);

  task={title:'',customer:'',owner:'Customer Success',due:''};

  readonly activeCount=computed(()=>this.customers().filter(x=>x.lifecycle==='Active').length);
  readonly atRiskCount=computed(()=>this.customers().filter(x=>x.lifecycle==='At Risk').length);
  readonly renewalCount=computed(()=>this.customers().filter(x=>x.lifecycle==='Renewal').length);
  readonly avgHealth=computed(()=>this.avg(this.customers().map(x=>x.health)));
  readonly avgAdoption=computed(()=>this.avg(this.customers().map(x=>x.adoption)));
  readonly mrr=computed(()=>this.customers().reduce((s,x)=>s+x.mrr,0));
  readonly expansion=computed(()=>this.customers().filter(x=>x.expansion!=='نیازمند نجات').reduce((s,x)=>s+(x.lifecycle==='Active'?35:18),0));

  private avg(values:number[]){return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0}
  pct(v:number){return Math.max(0,Math.min(100,v))}
  setTab(t:Tab){this.tab.set(t)}
  openCustomer(c:Customer){this.selected.set(c)}
  healthLabel(h:number){return h>=80?'سلامت عالی':h>=60?'پایدار':h>=45?'نیازمند توجه':'در معرض ریزش'}
  lifecycleClass(l:Lifecycle){return l.toLowerCase().replaceAll(' ','-')}
  addTask(){
    if(!this.task.title.trim()||!this.task.customer.trim()){this.flash('عنوان کار و مشتری الزامی است.',true);return}
    this.showTask.set(false); this.flash('کار Customer Success ثبت شد.');
    this.task={title:'',customer:'',owner:'Customer Success',due:''};
  }
  triggerPlaybook(name:string){this.flash(`Playbook «${name}» برای اجرای آزمایشی آماده شد.`)}
  private flash(m:string,e=false){this.notice.set(`${e?'!':'✓'} ${m}`);setTimeout(()=>this.notice.set(''),3200)}
}
