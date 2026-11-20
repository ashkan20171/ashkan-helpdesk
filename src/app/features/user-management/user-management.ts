
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ShieldCheck, UsersRound, UserPlus, Search, Filter, Edit3, Trash2, Lock, Unlock, CheckCircle2, X, Save, KeyRound, Eye, EyeOff, UserRound, Building2, Activity, Download, Headset } from 'lucide-angular';

type RoleKey = 'admin'|'manager'|'agent'|'customer';
type UserStatus = 'فعال'|'غیرفعال'|'قفل‌شده'|'در انتظار تأیید';

interface AppUser {
  id:string; name:string; email:string; mobile:string; role:RoleKey; department:string;
  status:UserStatus; lastLogin:string; mfa:boolean; tenant:string; permissions:string[];
}

const ROLE_LABELS:Record<RoleKey,string> = {
  admin:'مدیر سامانه', manager:'مدیر پشتیبانی', agent:'کارشناس پشتیبانی', customer:'کاربر / مشتری'
};

const PERMISSION_LABELS:Record<string,string> = {
  'dashboard.view':'مشاهده داشبورد','tickets.view':'مشاهده تیکت‌ها','tickets.create':'ایجاد تیکت',
  'tickets.manage':'مدیریت تیکت‌ها','users.view':'مشاهده کاربران','users.manage':'مدیریت کاربران',
  'roles.manage':'مدیریت نقش‌ها','reports.view':'گزارش‌ها','billing.view':'مالی و صورتحساب',
  'settings.manage':'تنظیمات سامانه','audit.view':'لاگ ممیزی','knowledge.manage':'مدیریت دانش','portal.use':'پورتال کاربر',
  'automation.manage':'مدیریت اتوماسیون','sla.manage':'مدیریت SLA','integrations.manage':'مدیریت Integration'
};

const ROLE_DEFAULTS:Record<RoleKey,string[]> = {
  admin:Object.keys(PERMISSION_LABELS),
  manager:['dashboard.view','tickets.view','tickets.create','tickets.manage','users.view','reports.view','audit.view','knowledge.manage','portal.use','automation.manage','sla.manage'],
  agent:['dashboard.view','tickets.view','tickets.create','tickets.manage','knowledge.manage','portal.use'],
  customer:['dashboard.view','tickets.view','tickets.create','portal.use']
};

@Component({
  selector:'ah-user-management',
  standalone:true,
  imports:[FormsModule,LucideAngularModule],
  templateUrl:'./user-management.html',
  styleUrl:'./user-management.scss'
})
export class UserManagementComponent {
  readonly ROLE_LABELS = ROLE_LABELS; readonly PERMISSION_LABELS = PERMISSION_LABELS; readonly Headset = Headset;

  readonly ShieldCheck=ShieldCheck; readonly UsersRound=UsersRound; readonly UserPlus=UserPlus; readonly UserRound=UserRound; readonly Building2=Building2;
  readonly Search=Search; readonly Filter=Filter; readonly Edit3=Edit3; readonly Trash2=Trash2;
  readonly Lock=Lock; readonly Unlock=Unlock; readonly CheckCircle2=CheckCircle2; readonly X=X;
  readonly Save=Save; readonly KeyRound=KeyRound; readonly Eye=Eye; readonly EyeOff=EyeOff;
  readonly Activity=Activity; readonly Download=Download;

  search=''; roleFilter='همه'; statusFilter='همه'; departmentFilter='همه';
  showModal=signal(false); showRoleModal=signal(false); showDetail=signal(false);
  editingId:string|null=null; selectedUser=signal<AppUser|null>(null); toast=signal('');
  form = {name:'',email:'',mobile:'',role:'agent' as RoleKey,department:'Service Desk',tenant:'سازمان مرکزی',status:'فعال' as UserStatus,mfa:true};
  customPermissions=signal<string[]>([]);
  roles = signal([
    {key:'admin' as RoleKey,label:'مدیر سامانه',users:2,description:'دسترسی کامل سامانه و امنیت',color:'red'},
    {key:'manager' as RoleKey,label:'مدیر پشتیبانی',users:5,description:'مدیریت تیم، SLA و گزارش‌ها',color:'blue'},
    {key:'agent' as RoleKey,label:'کارشناس پشتیبانی',users:28,description:'رسیدگی به تیکت‌ها و دانش',color:'green'},
    {key:'customer' as RoleKey,label:'کاربر / مشتری',users:184,description:'استفاده از پورتال خدمات',color:'gray'}
  ]);

  users=signal<AppUser[]>([
    {id:'USR-1001',name:'علی رضایی',email:'ali@ashkan.local',mobile:'09120000001',role:'admin',department:'IT',status:'فعال',lastLogin:'همین الان',mfa:true,tenant:'سازمان مرکزی',permissions:ROLE_DEFAULTS.admin},
    {id:'USR-1002',name:'مریم کریمی',email:'maryam@ashkan.local',mobile:'09120000002',role:'manager',department:'Service Desk',status:'فعال',lastLogin:'۸ دقیقه پیش',mfa:true,tenant:'سازمان مرکزی',permissions:ROLE_DEFAULTS.manager},
    {id:'USR-1003',name:'آرمان صادقی',email:'arman@ashkan.local',mobile:'09120000003',role:'agent',department:'شبکه',status:'فعال',lastLogin:'۲۲ دقیقه پیش',mfa:false,tenant:'سازمان مرکزی',permissions:ROLE_DEFAULTS.agent},
    {id:'USR-1004',name:'نگار موسوی',email:'negar@ashkan.local',mobile:'09120000004',role:'agent',department:'تدارکات',status:'فعال',lastLogin:'۳۵ دقیقه پیش',mfa:true,tenant:'سازمان مرکزی',permissions:[...ROLE_DEFAULTS.agent,'reports.view']},
    {id:'USR-1005',name:'سارا احمدی',email:'sara@customer.local',mobile:'09120000005',role:'customer',department:'فروش',status:'در انتظار تأیید',lastLogin:'هرگز',mfa:false,tenant:'مشتریان',permissions:ROLE_DEFAULTS.customer},
    {id:'USR-1006',name:'رضا نادری',email:'reza@customer.local',mobile:'09120000006',role:'customer',department:'مالی',status:'قفل‌شده',lastLogin:'دیروز',mfa:false,tenant:'مشتریان',permissions:ROLE_DEFAULTS.customer}
  ]);

  allPermissions=Object.keys(PERMISSION_LABELS);
  permissionGroups=[
    {title:'داشبورد و تیکت',keys:['dashboard.view','tickets.view','tickets.create','tickets.manage']},
    {title:'کاربران و امنیت',keys:['users.view','users.manage','roles.manage','audit.view']},
    {title:'گزارش و سازمان',keys:['reports.view','billing.view','settings.manage']},
    {title:'اتوماسیون و SLA',keys:['automation.manage','sla.manage','integrations.manage']},
    {title:'دانش و پورتال',keys:['knowledge.manage','portal.use']}
  ];

  filteredUsers=computed(()=> {
    const q=this.search.trim().toLowerCase();
    return this.users().filter(u =>
      (!q || [u.id,u.name,u.email,u.mobile,u.department,u.tenant].join(' ').toLowerCase().includes(q)) &&
      (this.roleFilter==='همه'||ROLE_LABELS[u.role]===this.roleFilter) &&
      (this.statusFilter==='همه'||u.status===this.statusFilter) &&
      (this.departmentFilter==='همه'||u.department===this.departmentFilter)
    );
  });
  activeCount=computed(()=>this.users().filter(u=>u.status==='فعال').length);
  lockedCount=computed(()=>this.users().filter(u=>u.status==='قفل‌شده').length);
  mfaCount=computed(()=>this.users().filter(u=>u.mfa).length);
  pendingCount=computed(()=>this.users().filter(u=>u.status==='در انتظار تأیید').length);
  departments=computed(()=>Array.from(new Set(this.users().map(u=>u.department))));

  openCreate():void {
    this.editingId=null; this.form={name:'',email:'',mobile:'',role:'agent',department:'Service Desk',tenant:'سازمان مرکزی',status:'فعال',mfa:true};
    this.customPermissions.set([...ROLE_DEFAULTS.agent]); this.showModal.set(true);
  }
  editUser(u:AppUser):void {
    this.editingId=u.id; this.form={name:u.name,email:u.email,mobile:u.mobile,role:u.role,department:u.department,tenant:u.tenant,status:u.status,mfa:u.mfa};
    this.customPermissions.set([...u.permissions]); this.showModal.set(true);
  }
  closeModal():void{this.showModal.set(false);}
  roleChanged():void{this.customPermissions.set([...ROLE_DEFAULTS[this.form.role]]);}
  hasPermission(k:string):boolean{return this.customPermissions().includes(k);}
  togglePermission(k:string):void{
    this.customPermissions.update(xs=>xs.includes(k)?xs.filter(x=>x!==k):[...xs,k]);
  }
  selectUser(u:AppUser):void{this.selectedUser.set(u);this.showDetail.set(true);}
  closeDetail():void{this.showDetail.set(false);}
  saveUser():void{
    if(!this.form.name.trim()||!this.form.email.trim()){this.showToast('نام و ایمیل کاربر الزامی است.');return;}
    const permissions=[...this.customPermissions()];
    if(this.editingId){
      this.users.update(xs=>xs.map(u=>u.id===this.editingId?{...u,...this.form,permissions}:u));
      this.showToast('اطلاعات کاربر به‌روزرسانی شد.');
    }else{
      const id=`USR-${1000+this.users().length+1}`;
      this.users.update(xs=>[...xs,{id,...this.form,lastLogin:'هرگز',permissions}]);
      this.showToast('کاربر جدید با موفقیت ایجاد شد.');
    }
    this.closeModal();
  }
  toggleStatus(u:AppUser):void{
    const next: UserStatus = u.status === 'فعال' ? 'قفل‌شده' : 'فعال';
    this.users.update(xs=>xs.map(x=>x.id===u.id?{...x,status:next}:x));
    this.showToast(next==='فعال'?'حساب کاربر فعال شد.':'حساب کاربر قفل شد.');
  }
  deleteUser(u:AppUser):void{
    this.users.update(xs=>xs.filter(x=>x.id!==u.id)); this.showToast(`کاربر ${u.name} حذف شد.`);
  }
  openRoleMatrix():void{this.showRoleModal.set(true);}
  closeRoleMatrix():void{this.showRoleModal.set(false);}
  rolePermission(role:RoleKey,key:string):boolean{return ROLE_DEFAULTS[role].includes(key);}
  exportCsv():void{
    const rows=[['ID','Name','Email','Role','Department','Status','MFA','Tenant'],...this.filteredUsers().map(u=>[u.id,u.name,u.email,ROLE_LABELS[u.role],u.department,u.status,u.mfa?'Yes':'No',u.tenant])];
    const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ashkan-users.csv';a.click();URL.revokeObjectURL(url);
  }
  showToast(m:string):void{this.toast.set(m);window.setTimeout(()=>this.toast.set(''),2600);}
}
