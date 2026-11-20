import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calculator, CheckCircle2, Download, FileText, Plus, Search, Wallet, X } from 'lucide-angular';

type PayrollStatus = 'draft' | 'calculated' | 'paid';
interface PayrollRow {
  id:number; employeeId:number; employeeName:string; department:string; month:string;
  baseSalary:number; housing:number; food:number; overtime:number; bonus:number;
  tax:number; insurance:number; deductions:number; status:PayrollStatus;
}
interface PayrollAdjustment { id:number; employeeName:string; type:'bonus'|'deduction'|'overtime'; title:string; amount:number; month:string; }

@Component({
 selector:'app-payroll', standalone:true, imports:[LucideAngularModule, CommonModule,FormsModule],
 templateUrl:'./payroll.html', styleUrl:'./payroll.scss'
})
export class PayrollComponent {
 readonly icons={calc:Calculator,check:CheckCircle2,download:Download,file:FileText,plus:Plus,search:Search,wallet:Wallet,close:X};
 activeTab:'payroll'|'adjustments'|'payslips'='payroll';
 month='1405/08'; searchTerm=''; statusFilter='all';
 showModal=false; editingId:number|null=null;
 form={employeeName:'',department:'فناوری اطلاعات',baseSalary:120000000,housing:9000000,food:5000000,overtime:0,bonus:0,tax:0,insurance:0,deductions:0,status:'draft' as PayrollStatus};

 payroll:PayrollRow[]=[
 {id:1,employeeId:1,employeeName:'علی رضایی',department:'فناوری اطلاعات',month:'1405/08',baseSalary:145000000,housing:12000000,food:7000000,overtime:18000000,bonus:10000000,tax:21000000,insurance:10150000,deductions:2500000,status:'calculated'},
 {id:2,employeeId:2,employeeName:'سارا محمدی',department:'منابع انسانی',month:'1405/08',baseSalary:118000000,housing:10000000,food:7000000,overtime:6000000,bonus:5000000,tax:13500000,insurance:8260000,deductions:1000000,status:'paid'},
 {id:3,employeeId:3,employeeName:'رضا کریمی',department:'مالی',month:'1405/08',baseSalary:125000000,housing:10000000,food:7000000,overtime:0,bonus:0,tax:12000000,insurance:8750000,deductions:3000000,status:'draft'},
 {id:4,employeeId:4,employeeName:'مینا حسینی',department:'پشتیبانی',month:'1405/08',baseSalary:105000000,housing:9000000,food:7000000,overtime:14000000,bonus:4000000,tax:11500000,insurance:7350000,deductions:1500000,status:'calculated'},
 {id:5,employeeId:5,employeeName:'امیر نادری',department:'فروش',month:'1405/08',baseSalary:130000000,housing:10000000,food:7000000,overtime:9000000,bonus:18000000,tax:15500000,insurance:9100000,deductions:0,status:'paid'}
 ];
 adjustments:PayrollAdjustment[]=[
 {id:1,employeeName:'علی رضایی',type:'overtime',title:'اضافه‌کاری پروژه شبکه',amount:18000000,month:'1405/08'},
 {id:2,employeeName:'امیر نادری',type:'bonus',title:'پاداش عملکرد فروش',amount:18000000,month:'1405/08'},
 {id:3,employeeName:'رضا کریمی',type:'deduction',title:'کسر مساعده',amount:3000000,month:'1405/08'}
 ];

 get filtered(){const q=this.searchTerm.trim().toLowerCase();return this.payroll.filter(p=>(!q||[p.employeeName,p.department].some(x=>x.toLowerCase().includes(q)))&&(this.statusFilter==='all'||p.status===this.statusFilter));}
 gross(p:PayrollRow){return p.baseSalary+p.housing+p.food+p.overtime+p.bonus}
 net(p:PayrollRow){return this.gross(p)-p.tax-p.insurance-p.deductions}
 get totalGross(){return this.payroll.reduce((s,p)=>s+this.gross(p),0)}
 get totalNet(){return this.payroll.reduce((s,p)=>s+this.net(p),0)}
 get totalTax(){return this.payroll.reduce((s,p)=>s+p.tax,0)}
 get paidCount(){return this.payroll.filter(p=>p.status==='paid').length}
 money(n:number){return new Intl.NumberFormat('fa-IR').format(Math.round(n))}
 open(p?:PayrollRow){this.editingId=p?.id??null;this.form=p?{employeeName:p.employeeName,department:p.department,baseSalary:p.baseSalary,housing:p.housing,food:p.food,overtime:p.overtime,bonus:p.bonus,tax:p.tax,insurance:p.insurance,deductions:p.deductions,status:p.status}:{employeeName:'',department:'فناوری اطلاعات',baseSalary:120000000,housing:9000000,food:5000000,overtime:0,bonus:0,tax:0,insurance:0,deductions:0,status:'draft'};this.showModal=true}
 save(){if(!this.form.employeeName.trim())return;if(this.editingId){const i=this.payroll.findIndex(p=>p.id===this.editingId);if(i>=0)this.payroll[i]={...this.payroll[i],...this.form,month:this.month}}else this.payroll.unshift({id:Date.now(),employeeId:Date.now(),month:this.month,...this.form});this.showModal=false}
 setStatus(p:PayrollRow,s:PayrollStatus){p.status=s}
 exportCsv(){const rows=this.filtered.map(p=>[p.employeeName,p.department,p.month,this.gross(p),p.tax,p.insurance,p.deductions,this.net(p),p.status]);const csv=[['کارمند','دپارتمان','ماه','ناخالص','مالیات','بیمه','کسورات','خالص','وضعیت'],...rows].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`ashkan-payroll-${this.month}.csv`;a.click();URL.revokeObjectURL(u)}
}
