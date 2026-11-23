import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertTriangle, CheckCircle2, ClipboardCheck, FlaskConical, LockKeyhole, LucideAngularModule, Play, RefreshCw, Search, ShieldAlert, ShieldCheck, Target, UserCheck, XCircle } from 'lucide-angular';

type Severity='Critical'|'High'|'Medium'|'Low';
interface Finding { id:string; title:string; category:string; severity:Severity; status:'Open'|'Mitigated'|'Accepted'; flow:string; detected:string; }
interface Case { id:string; scenario:string; category:string; score:number; blocked:boolean; status:'Passed'|'Review'|'Failed'; }

@Component({selector:'ah-ai-security',standalone:true,imports:[CommonModule,FormsModule,LucideAngularModule],templateUrl:'./ai-security.html',styleUrl:'./ai-security.scss'})
export class AiSecurityComponent {
 readonly AlertTriangle=AlertTriangle; readonly CheckCircle2=CheckCircle2; readonly ClipboardCheck=ClipboardCheck; readonly FlaskConical=FlaskConical; readonly LockKeyhole=LockKeyhole; readonly Play=Play; readonly RefreshCw=RefreshCw; readonly Search=Search; readonly ShieldAlert=ShieldAlert; readonly ShieldCheck=ShieldCheck; readonly Target=Target; readonly UserCheck=UserCheck; readonly XCircle=XCircle;
 readonly search=signal(''); readonly selected=signal<Finding|null>(null); readonly showDetail=signal(false); readonly running=signal(false); readonly toast=signal('');
 readonly findings=signal<Finding[]>([
 {id:'AI-SEC-021',title:'Indirect prompt injection',category:'Prompt Injection',severity:'High',status:'Open',flow:'RAG knowledge answer',detected:'18 min ago'},
 {id:'AI-SEC-019',title:'Sensitive action recommendation',category:'Excessive Agency',severity:'Critical',status:'Mitigated',flow:'Ticket automation',detected:'1 hr ago'},
 {id:'AI-SEC-017',title:'Untrusted retrieved content',category:'Data Exfiltration',severity:'High',status:'Mitigated',flow:'Customer portal',detected:'2 hrs ago'},
 {id:'AI-SEC-014',title:'Unsafe output classification',category:'Output Safety',severity:'Medium',status:'Accepted',flow:'Copilot response',detected:'Yesterday'},
 {id:'AI-SEC-011',title:'Cross-tenant context boundary',category:'Tenant Isolation',severity:'Critical',status:'Mitigated',flow:'RAG retrieval',detected:'Yesterday'}]);
 readonly cases=signal<Case[]>([
 {id:'RT-201',scenario:'Prompt injection through knowledge article',category:'Injection',score:98,blocked:true,status:'Passed'},
 {id:'RT-198',scenario:'Cross-tenant retrieval attempt',category:'Isolation',score:100,blocked:true,status:'Passed'},
 {id:'RT-194',scenario:'Tool misuse / excessive agency',category:'Agency',score:92,blocked:true,status:'Passed'},
 {id:'RT-190',scenario:'Sensitive data extraction request',category:'Data leakage',score:84,blocked:false,status:'Review'}]);
 readonly filtered=computed(()=>{const q=this.search().trim().toLowerCase();return q?this.findings().filter(x=>`${x.id} ${x.title} ${x.category} ${x.severity} ${x.status} ${x.flow}`.toLowerCase().includes(q)):this.findings()});
 readonly protectionScore=computed(()=>Math.round(this.cases().reduce((s,x)=>s+x.score,0)/this.cases().length));
 readonly blockedRate=computed(()=>Math.round(this.cases().filter(x=>x.blocked).length/this.cases().length*100));
 readonly criticalOpen=computed(()=>this.findings().filter(x=>x.severity==='Critical'&&x.status==='Open').length);
 readonly mitigated=computed(()=>this.findings().filter(x=>x.status==='Mitigated').length);
 notify(m:string){this.toast.set(m);setTimeout(()=>this.toast.set(''),2800)}
 runSuite(){this.running.set(true);this.notify('Red-team security suite started...');setTimeout(()=>{this.running.set(false);this.notify('Security suite completed. Backend execution is ready for integration.')},900)}
 open(x:Finding){this.selected.set(x);this.showDetail.set(true)}
 cls(v:string){return v.toLowerCase()}
 track(_:number,x:Finding){return x.id} trackCase(_:number,x:Case){return x.id}
}
