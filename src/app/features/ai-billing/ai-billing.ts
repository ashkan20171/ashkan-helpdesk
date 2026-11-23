import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, ArrowDownRight, ArrowUpRight, BarChart3, Building2, CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign, Download, FileText, Filter, Gauge, Receipt, Search, ShieldCheck, WalletCards, X } from 'lucide-angular';

type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Overdue';
type BillingStatus = 'Healthy' | 'Watch' | 'Over budget';

interface Invoice {
  id: string; period: string; scope: string; owner: string; amount: number; due: string; status: InvoiceStatus; usage: number;
}
interface BillingAllocation {
  scope: string; owner: string; requests: number; tokens: number; cost: number; chargeback: number; variance: number; status: BillingStatus;
}

@Component({
  selector: 'app-ai-billing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ai-billing.html',
  styleUrl: './ai-billing.scss'
})
export class AiBillingComponent {
  readonly Math = Math;
  readonly Search=Search; readonly X=X; readonly CircleDollarSign=CircleDollarSign; readonly Receipt=Receipt;
  readonly WalletCards=WalletCards; readonly FileText=FileText; readonly Building2=Building2; readonly CalendarDays=CalendarDays;
  readonly BarChart3=BarChart3; readonly Gauge=Gauge; readonly Download=Download; readonly Filter=Filter;
  readonly ChevronRight=ChevronRight; readonly ArrowUpRight=ArrowUpRight; readonly ArrowDownRight=ArrowDownRight;
  readonly CheckCircle2=CheckCircle2; readonly ShieldCheck=ShieldCheck;

  readonly query=signal('');
  readonly statusFilter=signal<'All'|InvoiceStatus>('All');
  readonly selectedInvoice=signal<Invoice|null>(null);

  readonly invoices=signal<Invoice[]>([
    {id:'INV-2026-11-0042',period:'Nov 01–30, 2026',scope:'Engineering',owner:'Engineering AI',amount:262.40,due:'Dec 07, 2026',status:'Issued',usage:92},
    {id:'INV-2026-11-0041',period:'Nov 01–30, 2026',scope:'Support',owner:'Support AI',amount:284.10,due:'Dec 07, 2026',status:'Draft',usage:79},
    {id:'INV-2026-11-0040',period:'Oct 01–31, 2026',scope:'Sales',owner:'Sales Intelligence',amount:198.70,due:'Nov 07, 2026',status:'Paid',usage:83},
    {id:'INV-2026-11-0039',period:'Oct 01–31, 2026',scope:'Platform',owner:'Shared AI Platform',amount:192.70,due:'Nov 07, 2026',status:'Paid',usage:69},
    {id:'INV-2026-10-0038',period:'Oct 01–31, 2026',scope:'Operations',owner:'Operations AI',amount:146.20,due:'Nov 07, 2026',status:'Overdue',usage:106}
  ]);

  readonly allocations=signal<BillingAllocation[]>([
    {scope:'Engineering',owner:'Engineering AI',requests:18440,tokens:9200000,cost:262.40,chargeback:287.00,variance:9.4,status:'Watch'},
    {scope:'Support',owner:'Support AI',requests:22180,tokens:10820000,cost:284.10,chargeback:310.00,variance:9.1,status:'Healthy'},
    {scope:'Sales',owner:'Sales Intelligence',requests:11780,tokens:5820000,cost:198.70,chargeback:215.00,variance:8.2,status:'Healthy'},
    {scope:'Platform',owner:'Shared AI Platform',requests:14560,tokens:6310000,cost:192.70,chargeback:0,variance:-100,status:'Healthy'}
  ]);

  readonly filteredInvoices=computed(()=>{
    const q=this.query().trim().toLowerCase();
    const f=this.statusFilter();
    return this.invoices().filter(x=>(f==='All'||x.status===f)&&(!q||`${x.id} ${x.scope} ${x.owner} ${x.period}`.toLowerCase().includes(q)));
  });
  readonly issuedTotal=computed(()=>this.invoices().filter(x=>x.status==='Issued').reduce((s,x)=>s+x.amount,0));
  readonly receivables=computed(()=>this.invoices().filter(x=>x.status==='Issued'||x.status==='Overdue').reduce((s,x)=>s+x.amount,0));
  readonly chargebackTotal=computed(()=>this.allocations().reduce((s,x)=>s+x.chargeback,0));
  readonly recoveryRate=computed(()=>this.chargebackTotal()/this.allocations().filter(x=>x.chargeback>0).reduce((s,x)=>s+x.cost,0)*100);

  selectInvoice(x:Invoice){this.selectedInvoice.set(x)}
  clearSelection(){this.selectedInvoice.set(null)}
  setFilter(v:string){this.statusFilter.set(v as 'All'|InvoiceStatus)}
}
