import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule, Activity, Flag, ShieldCheck, Gauge, HardDrive, UsersRound, Ticket,
  CheckCircle2, AlertTriangle, LockKeyhole, UnlockKeyhole, Plus, X, Zap,
  Layers3, SlidersHorizontal, FlaskConical, Building2, TimerReset, Ban
} from 'lucide-angular';
import { hasPermission } from '../auth/auth.guard';

type Tab = 'overview' | 'flags' | 'entitlements' | 'quotas' | 'overrides' | 'rollouts';
type LimitMode = 'Soft Limit' | 'Hard Limit';
type FlagStatus = 'فعال' | 'خاموش' | 'آزمایشی';

interface FeatureFlag {
  key: string; name: string; module: string; status: FlagStatus;
  rollout: number; plans: string[]; description: string;
}
interface Entitlement {
  key: string; label: string; module: string; enabled: boolean;
  limit: string; usage: number; capacity: number; unit: string;
  mode: LimitMode; graceDays: number;
}
interface TenantOverride {
  tenant: string; feature: string; value: string; reason: string; expires: string; status: string;
}
interface Rollout {
  name: string; feature: string; audience: string; percentage: number;
  stage: string; health: string;
}

@Component({
  selector: 'ah-entitlement-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './entitlement-management.html',
  styleUrl: './entitlement-management.scss'
})
export class EntitlementManagementComponent {
  readonly Activity = Activity; readonly Flag = Flag; readonly ShieldCheck = ShieldCheck; readonly Gauge = Gauge;
  readonly HardDrive = HardDrive; readonly UsersRound = UsersRound; readonly Ticket = Ticket;
  readonly CheckCircle2 = CheckCircle2; readonly AlertTriangle = AlertTriangle;
  readonly LockKeyhole = LockKeyhole; readonly UnlockKeyhole = UnlockKeyhole;
  readonly Plus = Plus; readonly X = X; readonly Zap = Zap; readonly Layers3 = Layers3;
  readonly SlidersHorizontal = SlidersHorizontal; readonly FlaskConical = FlaskConical;
  readonly Building2 = Building2; readonly TimerReset = TimerReset; readonly Ban = Ban;

  readonly canManage = hasPermission('settings.manage');
  readonly tab = signal<Tab>('overview');
  readonly notice = signal('');
  readonly showOverride = signal(false);
  readonly showFlag = signal(false);

  readonly flags = signal<FeatureFlag[]>([
    {key:'advanced-analytics',name:'تحلیل پیشرفته',module:'Analytics',status:'فعال',rollout:100,plans:['Business','Enterprise'],description:'داشبوردها و شاخص‌های تحلیلی پیشرفته'},
    {key:'ai-self-service',name:'AI Self-Service',module:'Knowledge',status:'آزمایشی',rollout:35,plans:['Enterprise'],description:'پاسخ هوشمند به پرسش‌های کاربران از پایگاه دانش'},
    {key:'omnichannel-routing',name:'مسیریابی Omnichannel',module:'Omnichannel',status:'فعال',rollout:100,plans:['Business','Enterprise'],description:'توزیع هوشمند مکالمات بین کانال‌ها'},
    {key:'workforce-intelligence',name:'هوش نیروی انسانی',module:'Workforce',status:'خاموش',rollout:0,plans:['Enterprise'],description:'پیش‌بینی ظرفیت و تقاضای نیروی انسانی'}
  ]);

  readonly entitlements = signal<Entitlement[]>([
    {key:'users',label:'کاربران',module:'Core',enabled:true,limit:'250',usage:128,capacity:250,unit:'کاربر',mode:'Hard Limit',graceDays:0},
    {key:'tickets',label:'تیکت ماهانه',module:'Ticketing',enabled:true,limit:'100,000',usage:63420,capacity:100000,unit:'تیکت',mode:'Soft Limit',graceDays:7},
    {key:'storage',label:'فضای ذخیره‌سازی',module:'Core',enabled:true,limit:'1,000 GB',usage:612,capacity:1000,unit:'GB',mode:'Hard Limit',graceDays:3},
    {key:'api',label:'درخواست API',module:'Integrations',enabled:true,limit:'1,000,000',usage:724000,capacity:1000000,unit:'درخواست',mode:'Soft Limit',graceDays:14},
    {key:'ai',label:'اعتبار AI',module:'AI',enabled:false,limit:'50,000',usage:0,capacity:50000,unit:'اعتبار',mode:'Hard Limit',graceDays:0}
  ]);

  readonly overrides = signal<TenantOverride[]>([
    {tenant:'شرکت آشیان',feature:'AI Self-Service',value:'فعال',reason:'پایلوت سازمانی',expires:'۱۴۰۵/۱۰/۱۵',status:'فعال'},
    {tenant:'راهکاران نوین',feature:'API Rate Limit',value:'۲×',reason:'یکپارچه‌سازی ERP',expires:'۱۴۰۵/۱۱/۰۱',status:'فعال'},
    {tenant:'پارس داده',feature:'Advanced Analytics',value:'غیرفعال',reason:'تعلیق اشتراک',expires:'—',status:'قفل'}
  ]);

  readonly rollouts = signal<Rollout[]>([
    {name:'AI Pilot',feature:'AI Self-Service',audience:'Enterprise / مدیران',percentage:35,stage:'Canary',health:'پایدار'},
    {name:'Analytics v2',feature:'Advanced Analytics',audience:'Business',percentage:70,stage:'Gradual',health:'پایدار'},
    {name:'Workforce AI',feature:'Workforce Intelligence',audience:'انتخابی',percentage:10,stage:'Experimental',health:'در پایش'}
  ]);

  customFlag={name:'',key:'',module:'Core',description:'',rollout:10};
  overrideForm={tenant:'',feature:'',value:'فعال',reason:'',expires:''};

  readonly activeFlags = computed(()=>this.flags().filter(x=>x.status==='فعال').length);
  readonly experimentalFlags = computed(()=>this.flags().filter(x=>x.status==='آزمایشی').length);
  readonly lockedFeatures = computed(()=>this.entitlements().filter(x=>!x.enabled).length);
  readonly quotaRisks = computed(()=>this.entitlements().filter(x=>this.pct(x.usage,x.capacity)>=80).length);
  readonly avgUsage = computed(()=>{
    const a=this.entitlements();
    return a.length ? Math.round(a.reduce((s,x)=>s+this.pct(x.usage,x.capacity),0)/a.length) : 0;
  });

  selectTab(tab:Tab){this.tab.set(tab)}
  pct(a:number,b:number){return b ? Math.min(100,Math.round(a/b*100)) : 0}
  toggleFlag(key:string){
    if(!this.canManage) return;
    this.flags.update(items=>items.map(x=>x.key===key ? {...x,status:x.status==='خاموش'?'فعال':'خاموش',rollout:x.status==='خاموش'?100:0} : x));
    this.flash('وضعیت Feature Flag به‌روزرسانی شد.');
  }
  toggleEntitlement(key:string){
    if(!this.canManage) return;
    this.entitlements.update(items=>items.map(x=>x.key===key ? {...x,enabled:!x.enabled} : x));
    this.flash('Entitlement با موفقیت به‌روزرسانی شد.');
  }
  createFlag(){
    if(!this.customFlag.name.trim() || !this.customFlag.key.trim()){this.flash('نام و کلید Feature Flag الزامی است.',true);return;}
    this.flags.update(items=>[...items,{key:this.customFlag.key.trim(),name:this.customFlag.name.trim(),module:this.customFlag.module,status:'خاموش',rollout:+this.customFlag.rollout,plans:['Enterprise'],description:this.customFlag.description.trim()||'Feature جدید'}]);
    this.showFlag.set(false);
    this.customFlag={name:'',key:'',module:'Core',description:'',rollout:10};
    this.flash('Feature Flag جدید ایجاد شد.');
  }
  createOverride(){
    if(!this.overrideForm.tenant.trim() || !this.overrideForm.feature.trim()){this.flash('Tenant و Feature الزامی است.',true);return;}
    this.overrides.update(items=>[...items,{...this.overrideForm,status:'فعال'}]);
    this.showOverride.set(false);
    this.overrideForm={tenant:'',feature:'',value:'فعال',reason:'',expires:''};
    this.flash('Override برای Tenant ثبت شد.');
  }
  applyRollout(feature:string,percentage:number){
    if(!this.canManage)return;
    this.flags.update(items=>items.map(x=>x.name===feature?{...x,rollout:percentage,status:percentage===0?'خاموش':percentage<100?'آزمایشی':'فعال'}:x));
    this.flash(`Rollout ${percentage}% برای ${feature} اعمال شد.`);
  }
  private flash(message:string,error=false){this.notice.set(`${error?'!':'✓'} ${message}`);setTimeout(()=>this.notice.set(''),3200)}
}
