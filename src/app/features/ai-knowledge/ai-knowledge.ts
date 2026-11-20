import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookOpen, BrainCircuit, CheckCircle2, ChevronLeft, Database, FileSearch, GitBranch, Info, LoaderCircle, LucideAngularModule, Network, Plus, RefreshCw, Search, ShieldCheck, Sparkles, Target, Trash2, UploadCloud, X } from 'lucide-angular';
import { hasPermission } from '../auth/auth.guard';

type Status = 'Indexed' | 'Pending' | 'Needs Review';
interface Source { id:string; title:string; type:string; chunks:number; score:number; status:Status; updated:string; }
interface Retrieval { title:string; source:string; relevance:number; excerpt:string; }

@Component({
 selector:'ah-ai-knowledge', standalone:true,
 imports:[CommonModule,FormsModule,LucideAngularModule],
 templateUrl:'./ai-knowledge.html', styleUrl:'./ai-knowledge.scss'
})
export class AiKnowledgeComponent {
 readonly BookOpen=BookOpen; readonly BrainCircuit=BrainCircuit; readonly CheckCircle2=CheckCircle2; readonly ChevronLeft=ChevronLeft;
 readonly Database=Database; readonly FileSearch=FileSearch; readonly GitBranch=GitBranch; readonly Info=Info; readonly LoaderCircle=LoaderCircle;
 readonly Network=Network; readonly Plus=Plus; readonly RefreshCw=RefreshCw; readonly Search=Search; readonly ShieldCheck=ShieldCheck;
 readonly Sparkles=Sparkles; readonly Target=Target; readonly Trash2=Trash2; readonly UploadCloud=UploadCloud; readonly X=X;
 readonly canManage=hasPermission('settings.manage');
 readonly search=signal(''); readonly indexing=signal(false); readonly toast=signal(''); readonly showModal=signal(false);
 readonly selected=signal<Source|null>(null);
 readonly sources=signal<Source[]>([
  {id:'KB-1001',title:'راهنمای خطاهای احراز هویت و SSO',type:'Article',chunks:42,score:96,status:'Indexed',updated:'2h ago'},
  {id:'KB-1008',title:'راهنمای تنظیم SLA برای مشتریان Enterprise',type:'Article',chunks:31,score:93,status:'Indexed',updated:'5h ago'},
  {id:'DOC-204',title:'راهنمای داخلی Incident Response',type:'Document',chunks:58,score:89,status:'Indexed',updated:'1d ago'},
  {id:'TKT-8120',title:'حل مشکل Timeout در VPN Gateway',type:'Ticket',chunks:12,score:84,status:'Needs Review',updated:'1d ago'},
  {id:'FAQ-77',title:'سؤالات متداول Billing و Subscription',type:'FAQ',chunks:24,score:91,status:'Pending',updated:'3d ago'}
 ]);
 readonly retrievals=signal<Retrieval[]>([
  {title:'راهنمای خطاهای احراز هویت و SSO',source:'KB-1001 · Article',relevance:97,excerpt:'برای خطاهای SSO ابتدا وضعیت Identity Provider، زمان سیستم و اعتبار گواهی را بررسی کنید.'},
  {title:'SSO Troubleshooting Checklist',source:'KB-1012 · Article',relevance:92,excerpt:'مراحل تشخیص خطا شامل Redirect URI، Claim Mapping و Session Policy است.'},
  {title:'Incident Response — Authentication',source:'DOC-204 · Document',relevance:86,excerpt:'اگر خطا روی بیش از ۱۰٪ کاربران مشاهده شد، Incident را به سطح P1 ارتقا دهید.'}
 ]);
 readonly filtered=computed(()=>{const q=this.search().trim().toLowerCase(); return q?this.sources().filter(x=>`${x.id} ${x.title} ${x.type}`.toLowerCase().includes(q)):this.sources();});
 readonly indexed=computed(()=>this.sources().filter(x=>x.status==='Indexed').length);
 readonly chunks=computed(()=>this.sources().reduce((n,x)=>n+x.chunks,0));
 readonly quality=computed(()=>Math.round(this.sources().reduce((n,x)=>n+x.score,0)/this.sources().length));

 notify(m:string){this.toast.set(m);setTimeout(()=>this.toast.set(''),3000);}
 runIndexing(){this.indexing.set(true);this.notify('Pipeline ایندکس‌گذاری آماده شد.');setTimeout(()=>{this.indexing.set(false);this.notify('Chunking و Embedding برای اتصال Backend آماده است.');},900);}
 open(item:Source){this.selected.set(item);this.showModal.set(true);}
 add(){this.notify('Source Connector آماده ثبت منبع جدید است.');}
 remove(item:Source){this.sources.update(x=>x.filter(y=>y.id!==item.id));this.notify(`${item.id} حذف شد.`);}
 track(_:number,x:Source){return x.id;}
 statusClass(x:Status){return x.toLowerCase().replace(/\s+/g,'-');}
}
