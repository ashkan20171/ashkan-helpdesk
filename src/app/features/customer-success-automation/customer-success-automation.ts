import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertTriangle, Bot, CheckCircle2, ChevronLeft, Clock3, FlaskConical, Gauge, HeartPulse, LucideAngularModule, Play, Plus, RefreshCw, ShieldAlert, Sparkles, Target, TrendingUp, X, Zap } from 'lucide-angular';
import { hasPermission } from '../auth/auth.guard';

type RuleKind='health'|'adoption'|'renewal'|'usage'|'sla';
interface Rule {id:string; name:string; kind:RuleKind; condition:string; action:string; priority:string; enabled:boolean; runs:number}
interface Signal {customer:string; type:string; score:number; reason:string; action:string; severity:'high'|'medium'|'low'}
interface Forecast {customer:string; renewal:number; churn:number; expansion:number; next:string}

@Component({
  selector:'ah-customer-success-automation',
  standalone:true,
  imports:[CommonModule,FormsModule,LucideAngularModule],
  templateUrl:'./customer-success-automation.html',
  styleUrl:'./customer-success-automation.scss'
})
export class CustomerSuccessAutomationComponent {
  readonly AlertTriangle=AlertTriangle; readonly Bot=Bot; readonly CheckCircle2=CheckCircle2; readonly ChevronLeft=ChevronLeft;
  readonly Clock3=Clock3; readonly FlaskConical=FlaskConical; readonly Gauge=Gauge; readonly HeartPulse=HeartPulse;
  readonly Play=Play; readonly Plus=Plus; readonly RefreshCw=RefreshCw; readonly ShieldAlert=ShieldAlert;
  readonly Sparkles=Sparkles; readonly Target=Target; readonly TrendingUp=TrendingUp; readonly X=X; readonly Zap=Zap;
  readonly canManage=hasPermission('settings.manage');
  readonly notice=signal(''); readonly showRule=signal(false); readonly running=signal(false);
  readonly rules=signal<Rule[]>([
    {id:'R-01',name:'Health Rescue',kind:'health',condition:'Health Score < 50',action:'اجرای Rescue Playbook + ایجاد Task',priority:'بحرانی',enabled:true,runs:18},
    {id:'R-02',name:'Adoption Boost',kind:'adoption',condition:'Adoption < 40%',action:'ارسال Workshop + آموزش',priority:'زیاد',enabled:true,runs:31},
    {id:'R-03',name:'Renewal Radar',kind:'renewal',condition:'Renewal < 45 روز',action:'Value Review + Renewal Task',priority:'زیاد',enabled:true,runs:12},
    {id:'R-04',name:'Expansion Signal',kind:'usage',condition:'Usage > 80% و Health > 70',action:'پیشنهاد Upgrade / Add-on',priority:'متوسط',enabled:true,runs:26},
    {id:'R-05',name:'SLA Recovery',kind:'sla',condition:'SLA < 85%',action:'Escalation + Executive Alert',priority:'زیاد',enabled:true,runs:9}
  ]);
  readonly signals=signal<Signal[]>([
    {customer:'پارس داده',type:'Churn Risk',score:87,reason:'Health 38% + SLA 76% + کاهش کاربران فعال',action:'Rescue Playbook',severity:'high'},
    {customer:'راهکاران نوین',type:'Renewal Risk',score:61,reason:'تمدید نزدیک و رشد Adoption متوقف شده',action:'Value Review',severity:'medium'},
    {customer:'شرکت آشیان',type:'Expansion',score:84,reason:'Usage بالا + Health 92% + ظرفیت AI',action:'AI Add-on',severity:'low'},
    {customer:'گروه توسعه فردا',type:'Adoption Risk',score:55,reason:'Activation خوب اما Feature Adoption پایین',action:'Enablement',severity:'medium'}
  ]);
  readonly forecasts=signal<Forecast[]>([
    {customer:'شرکت آشیان',renewal:96,churn:4,expansion:82,next:'AI + Analytics'},
    {customer:'راهکاران نوین',renewal:74,churn:26,expansion:64,next:'Renewal Workshop'},
    {customer:'گروه توسعه فردا',renewal:81,churn:19,expansion:71,next:'Business Upgrade'},
    {customer:'پارس داده',renewal:31,churn:69,expansion:8,next:'Rescue / Executive Sponsor'}
  ]);
  rule={name:'',kind:'health' as RuleKind,condition:'',action:'',priority:'متوسط'};
  readonly activeRules=computed(()=>this.rules().filter(r=>r.enabled).length);
  readonly highRisk=computed(()=>this.signals().filter(s=>s.severity==='high').length);
  readonly avgRenewal=computed(()=>Math.round(this.forecasts().reduce((a,b)=>a+b.renewal,0)/this.forecasts().length));
  readonly automationRate=computed(()=>Math.round((this.activeRules()/this.rules().length)*100));
  flash(m:string){this.notice.set(m);setTimeout(()=>this.notice.set(''),3000)}
  toggle(r:Rule){this.rules.update(xs=>xs.map(x=>x.id===r.id?{...x,enabled:!x.enabled}:x))}
  runNow(){this.running.set(true);this.flash('موتور تصمیم‌گیری در حال ارزیابی Health، Usage، SLA و Renewal است…');setTimeout(()=>{this.running.set(false);this.flash('ارزیابی تکمیل شد؛ سیگنال‌های جدید در Portfolio اعمال شدند.')},1000)}
  execute(s:Signal){this.flash(`Next Best Action برای «${s.customer}»: ${s.action}`)}
  addRule(){if(!this.rule.name||!this.rule.condition||!this.rule.action){this.flash('نام، شرط و Action الزامی است.');return}this.rules.update(xs=>[...xs,{id:`R-${String(xs.length+1).padStart(2,'0')}`,name:this.rule.name,kind:this.rule.kind,condition:this.rule.condition,action:this.rule.action,priority:this.rule.priority,enabled:true,runs:0}]);this.showRule.set(false);this.rule={name:'',kind:'health',condition:'',action:'',priority:'متوسط'};this.flash('Automation Rule ثبت شد.')}
}
