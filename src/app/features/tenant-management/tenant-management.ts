import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building2, CheckCircle2, ChevronDown, Globe2, Palette, ShieldCheck, UsersRound, CreditCard, Search, Plus, Settings2, Activity, ArrowUpRight, X, Sparkles, LayoutDashboard, LockKeyhole } from 'lucide-angular';
import { hasPermission } from '../auth/auth.guard';

type TenantStatus = 'فعال' | 'آزمایشی' | 'تعلیق‌شده';
type TenantPlan = 'Starter' | 'Business' | 'Enterprise';
interface Tenant {
  id:string; name:string; slug:string; domain:string; plan:TenantPlan; status:TenantStatus;
  members:number; created:string; region:string; accent:string; logoText:string;
  trialEnds?:string;
}
@Component({
  selector:'ah-tenant-management',
  standalone:true,
  imports:[FormsModule,LucideAngularModule],
  templateUrl:'./tenant-management.html',
  styleUrl:'./tenant-management.scss'
})
export class TenantManagementComponent {
  readonly Building2=Building2; readonly CheckCircle2=CheckCircle2; readonly ChevronDown=ChevronDown;
  readonly Globe2=Globe2; readonly Palette=Palette; readonly ShieldCheck=ShieldCheck;
  readonly UsersRound=UsersRound; readonly CreditCard=CreditCard; readonly Search=Search;
  readonly Plus=Plus; readonly Settings2=Settings2; readonly Activity=Activity;
  readonly ArrowUpRight=ArrowUpRight; readonly X=X; readonly Sparkles=Sparkles;
  readonly LayoutDashboard=LayoutDashboard; readonly LockKeyhole=LockKeyhole;

  readonly canManage=hasPermission('settings.manage');
  readonly activeTab=signal<'overview'|'tenants'|'branding'|'policies'|'onboarding'>('overview');
  readonly selectedTenantId=signal('tn-001');
  readonly search=signal('');
  readonly notice=signal('');
  readonly showCreate=signal(false);
  readonly showSwitcher=signal(false);

  readonly tenants=signal<Tenant[]>([
    {id:'tn-001',name:'شرکت آشیان',slug:'ashian',domain:'app.ashian.ir',plan:'Enterprise',status:'فعال',members:128,created:'۱۴۰۲/۰۸/۱۲',region:'ایران · خاورمیانه',accent:'#6957e8',logoText:'A'},
    {id:'tn-002',name:'راهکاران نوین',slug:'rahkaran',domain:'rahkaran.ashian.ir',plan:'Business',status:'فعال',members:54,created:'۱۴۰۳/۰۳/۲۱',region:'ایران · خاورمیانه',accent:'#2588d8',logoText:'R'},
    {id:'tn-003',name:'گروه توسعه فردا',slug:'farda',domain:'farda.ashian.ir',plan:'Starter',status:'آزمایشی',members:12,created:'۱۴۰۴/۰۹/۰۱',region:'اروپا · فرانکفورت',accent:'#159b79',logoText:'F',trialEnds:'۱۴۰۵/۰۹/۳۰'},
    {id:'tn-004',name:'پارس داده',slug:'parsdata',domain:'parsdata.ashian.ir',plan:'Business',status:'تعلیق‌شده',members:0,created:'۱۴۰۳/۱۱/۱۷',region:'ایران · خاورمیانه',accent:'#d28a2d',logoText:'P'}
  ]);

  readonly selectedTenant=computed(()=>this.tenants().find(t=>t.id===this.selectedTenantId()) ?? this.tenants()[0]);
  readonly activeTenants=computed(()=>this.tenants().filter(t=>t.status==='فعال').length);
  readonly trialTenants=computed(()=>this.tenants().filter(t=>t.status==='آزمایشی').length);
  readonly totalMembers=computed(()=>this.tenants().reduce((sum,t)=>sum+t.members,0));
  readonly filteredTenants=computed(()=>{
    const q=this.search().trim().toLowerCase();
    return this.tenants().filter(t=>!q||`${t.name} ${t.slug} ${t.domain}`.toLowerCase().includes(q));
  });

  createForm={name:'',slug:'',domain:'',plan:'Business' as TenantPlan,region:'ایران · خاورمیانه'};
  branding={name:'شرکت آشیان',logoText:'A',accent:'#6957e8',supportEmail:'support@ashian.ir',portalTitle:'مرکز خدمات مشتریان آشیان'};
  policies={allowInvites:true,requireMfa:true,allowCustomDomain:true,sessionTimeout:'۸ ساعت',defaultRole:'customer'};
  onboardingStep=1;
  onboarding={name:'',slug:'',adminEmail:'',plan:'Business' as TenantPlan,region:'ایران · خاورمیانه'};

  selectTab(tab:'overview'|'tenants'|'branding'|'policies'|'onboarding'){this.activeTab.set(tab);}
  selectTenant(id:string){this.selectedTenantId.set(id);this.showSwitcher.set(false);this.flash('سازمان فعال تغییر کرد.');}
  openCreate(){if(this.canManage)this.showCreate.set(true);}
  createTenant(){
    if(!this.canManage||!this.createForm.name.trim()||!this.createForm.slug.trim()){this.flash('نام سازمان و شناسه یکتا الزامی است.',true);return;}
    const slug=this.createForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    if(this.tenants().some(t=>t.slug===slug)){this.flash('این شناسه قبلاً استفاده شده است.',true);return;}
    const tenant:Tenant={id:`tn-${String(this.tenants().length+1).padStart(3,'0')}`,name:this.createForm.name.trim(),slug,domain:this.createForm.domain.trim()||`${slug}.ashian.ir`,plan:this.createForm.plan,status:'آزمایشی',members:1,created:'امروز',region:this.createForm.region,accent:'#6957e8',logoText:this.createForm.name.trim().slice(0,1),trialEnds:'۳۰ روز پس از ایجاد'};
    this.tenants.update(items=>[tenant,...items]);this.selectedTenantId.set(tenant.id);this.showCreate.set(false);this.createForm={name:'',slug:'',domain:'',plan:'Business',region:'ایران · خاورمیانه'};this.flash('سازمان آزمایشی ایجاد شد.');
  }
  saveBranding(){if(!this.canManage)return;this.tenants.update(items=>items.map(t=>t.id===this.selectedTenantId()?{...t,name:this.branding.name,accent:this.branding.accent,logoText:this.branding.logoText}:t));this.flash('تنظیمات برندینگ در نسخه نمایشی ذخیره شد.');}
  savePolicies(){if(!this.canManage)return;this.flash('سیاست‌های سازمان در نسخه نمایشی ذخیره شدند.');}
  startOnboarding(){if(!this.canManage)return;this.onboardingStep=2;}
  finishOnboarding(){
    if(!this.onboarding.name.trim()||!this.onboarding.slug.trim()||!this.onboarding.adminEmail.includes('@')){this.flash('نام، شناسه و ایمیل مدیر سازمان را کامل کنید.',true);return;}
    const slug=this.onboarding.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    if(this.tenants().some(t=>t.slug===slug)){this.flash('شناسه سازمان تکراری است.',true);return;}
    const tenant:Tenant={id:`tn-${String(this.tenants().length+1).padStart(3,'0')}`,name:this.onboarding.name,slug,domain:`${slug}.ashian.ir`,plan:this.onboarding.plan,status:'آزمایشی',members:1,created:'امروز',region:this.onboarding.region,accent:'#6957e8',logoText:this.onboarding.name.slice(0,1),trialEnds:'۳۰ روز پس از ایجاد'};
    this.tenants.update(items=>[tenant,...items]);this.selectedTenantId.set(tenant.id);this.onboardingStep=3;this.flash('سازمان با موفقیت راه‌اندازی شد.');
  }
  resetOnboarding(){this.onboardingStep=1;this.onboarding={name:'',slug:'',adminEmail:'',plan:'Business',region:'ایران · خاورمیانه'};}
  private flash(message:string,error=false){this.notice.set(`${error?'!':'✓'} ${message}`);setTimeout(()=>this.notice.set(''),3200);}
}
