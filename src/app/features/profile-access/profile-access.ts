import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserRound, ShieldCheck, MonitorSmartphone, Building2, KeyRound, Smartphone, Mail, MapPin, Clock3, LogOut, CheckCircle2, LockKeyhole, UsersRound } from 'lucide-angular';
import { AppRole, ROLE_PERMISSIONS, hasPermission } from '../auth/auth.guard';
interface SessionDevice { id:string; device:string; browser:string; location:string; lastSeen:string; current:boolean; }
interface Member { id:string; name:string; email:string; role:AppRole; department:string; status:string; }
@Component({selector:'ah-profile-access',standalone:true,imports:[FormsModule,LucideAngularModule],templateUrl:'./profile-access.html',styleUrl:'./profile-access.scss'})
export class ProfileAccessComponent {
  readonly UserRound=UserRound; readonly ShieldCheck=ShieldCheck; readonly MonitorSmartphone=MonitorSmartphone; readonly Building2=Building2; readonly KeyRound=KeyRound; readonly Smartphone=Smartphone; readonly Mail=Mail; readonly MapPin=MapPin; readonly Clock3=Clock3; readonly LogOut=LogOut; readonly CheckCircle2=CheckCircle2; readonly LockKeyhole=LockKeyhole; readonly UsersRound=UsersRound;
  readonly activeTab=signal<'profile'|'security'|'sessions'|'organization'>('profile'); readonly notice=signal(''); readonly error=signal('');
  readonly role=((localStorage.getItem('ashkan.demo.role')||'customer') as AppRole); readonly canManageSecurity=hasPermission('security.manage'); readonly canManageMembers=hasPermission('organization.members.manage');
  profile={firstName:(localStorage.getItem('ashkan.demo.name')||'کاربر').split(' ')[0],lastName:(localStorage.getItem('ashkan.demo.name')||'').split(' ').slice(1).join(' '),email:'user@ashian.ir',mobile:'۰۹۱۲۱۲۳۴۵۶۷',jobTitle:'کاربر سامانه',department:'واحد پشتیبانی',timezone:'Asia/Tehran'};
  password={current:'',next:'',confirm:''}; mfaEnabled=true; recoveryEmail='security@ashian.ir'; recoveryPhone='۰۹۱۲۱۲۳۴۵۶۷';
  readonly sessions=signal<SessionDevice[]>([{id:'s1',device:'Windows Desktop',browser:'Chrome 157',location:'Tehran · Iran',lastSeen:'اکنون',current:true},{id:'s2',device:'Android Phone',browser:'Chrome Mobile',location:'Tehran · Iran',lastSeen:'۲ ساعت پیش',current:false},{id:'s3',device:'MacBook Pro',browser:'Safari',location:'Tehran · Iran',lastSeen:'۲ روز پیش',current:false}]);
  readonly members=signal<Member[]>([{id:'M-104',name:'محمد رضایی',email:'m.rezaei@ashian.ir',role:'admin',department:'IT & Support',status:'فعال'},{id:'M-117',name:'سارا احمدی',email:'s.ahmadi@ashian.ir',role:'manager',department:'Service Desk',status:'فعال'},{id:'M-128',name:'علی کریمی',email:'a.karimi@ashian.ir',role:'agent',department:'Service Desk',status:'فعال'},{id:'M-131',name:'کاربر جدید',email:'new.user@ashian.ir',role:'customer',department:'مالی',status:'در انتظار'}]);
  readonly roleLabel=()=>({admin:'مدیر سامانه',manager:'مدیر پشتیبانی',agent:'کارشناس پشتیبانی',customer:'کاربر / مشتری'} as Record<AppRole,string>)[this.role]; readonly permissions=()=>ROLE_PERMISSIONS[this.role]||[];
  selectTab(t:'profile'|'security'|'sessions'|'organization'){this.activeTab.set(t);this.notice.set('');this.error.set('');}
  saveProfile(){localStorage.setItem('ashkan.demo.name',`${this.profile.firstName} ${this.profile.lastName}`.trim()||'کاربر');this.flash('پروفایل با موفقیت ذخیره شد.');}
  changePassword(){this.error.set('');if(!this.password.current||this.password.next.length<8){this.error.set('رمز فعلی و رمز جدید باید مقدار داشته باشند و رمز جدید حداقل ۸ کاراکتر باشد.');return;}if(this.password.next!==this.password.confirm){this.error.set('تکرار رمز عبور با رمز جدید یکسان نیست.');return;}this.password={current:'',next:'',confirm:''};this.flash('رمز عبور در نسخه نمایشی تغییر کرد؛ ثبت واقعی در Backend انجام می‌شود.');}
  toggleMfa(){if(!this.canManageSecurity)return;this.mfaEnabled=!this.mfaEnabled;this.flash(this.mfaEnabled?'MFA فعال شد.':'MFA غیرفعال شد.');}
  revokeSession(id:string){this.sessions.update(x=>x.filter(s=>s.id!==id||s.current));this.flash('نشست انتخاب‌شده خاتمه یافت.');}
  revokeAll(){this.sessions.update(x=>x.filter(s=>s.current));this.flash('همه نشست‌های غیرجاری خاتمه یافتند.');}
  inviteMember(){if(this.canManageMembers)this.flash('زیرساخت دعوت عضو آماده است و در Backend به سرویس ایمیل متصل می‌شود.');}
  roleName(r:AppRole){return ({admin:'مدیر سامانه',manager:'مدیر پشتیبانی',agent:'کارشناس پشتیبانی',customer:'کاربر / مشتری'} as Record<AppRole,string>)[r];}
  private flash(m:string){this.error.set('');this.notice.set(m);setTimeout(()=>this.notice.set(''),3200);}
}
