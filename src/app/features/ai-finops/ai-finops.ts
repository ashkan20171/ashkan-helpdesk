import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Calculator, ChevronRight, CircleDollarSign, Coins, Download, Gauge, Lightbulb, PiggyBank, Search, ShieldCheck, TrendingDown, WalletCards, X } from 'lucide-angular';

interface ModelCost { model:string; provider:string; inputPer1k:number; outputPer1k:number; requests:number; tokens:number; spend:number; share:number; trend:number; status:'Healthy'|'Watch'|'Over budget'; }
interface Allocation { scope:string; owner:string; requests:number; spend:number; budget:number; forecast:number; }

@Component({
  selector:'app-ai-finops',
  standalone:true,
  imports:[CommonModule, LucideAngularModule],
  templateUrl:'./ai-finops.html',
  styleUrl:'./ai-finops.scss'
})
export class AiFinopsComponent {
  readonly Search=Search; readonly X=X; readonly Coins=Coins; readonly CircleDollarSign=CircleDollarSign;
  readonly WalletCards=WalletCards; readonly PiggyBank=PiggyBank; readonly TrendingDown=TrendingDown;
  readonly ArrowUpRight=ArrowUpRight; readonly ArrowDownRight=ArrowDownRight; readonly BarChart3=BarChart3;
  readonly Gauge=Gauge; readonly Calculator=Calculator; readonly Lightbulb=Lightbulb; readonly AlertTriangle=AlertTriangle;
  readonly ShieldCheck=ShieldCheck; readonly Download=Download; readonly ChevronRight=ChevronRight;

  readonly query=signal('');
  readonly selectedModel=signal<ModelCost|null>(null);
  readonly monthlyBudget=1240;
  readonly forecast=1142;

  readonly models=signal<ModelCost[]>([
    {model:'GPT-5.2',provider:'OpenAI',inputPer1k:.004,outputPer1k:.012,requests:18420,tokens:12480000,spend:318.4,share:34,trend:8.2,status:'Healthy'},
    {model:'Claude Sonnet 4.5',provider:'Anthropic',inputPer1k:.003,outputPer1k:.015,requests:12740,tokens:8650000,spend:246.7,share:26,trend:-3.4,status:'Healthy'},
    {model:'Gemini 3 Pro',provider:'Google',inputPer1k:.002,outputPer1k:.010,requests:10380,tokens:7210000,spend:171.3,share:18,trend:5.7,status:'Watch'},
    {model:'GPT-5 Mini',provider:'OpenAI',inputPer1k:.0008,outputPer1k:.003,requests:22450,tokens:9480000,spend:118.9,share:13,trend:-11.2,status:'Healthy'},
    {model:'Mistral Large',provider:'Mistral',inputPer1k:.002,outputPer1k:.008,requests:6120,tokens:3880000,spend:82.6,share:9,trend:14.8,status:'Over budget'}
  ]);

  readonly allocations=signal<Allocation[]>([
    {scope:'Support',owner:'Support AI',requests:22180,spend:284.1,budget:360,forecast:332},
    {scope:'Engineering',owner:'Engineering Copilot',requests:18440,spend:262.4,budget:300,forecast:319},
    {scope:'Sales',owner:'Sales Intelligence',requests:11780,spend:198.7,budget:240,forecast:224},
    {scope:'Platform',owner:'Shared AI Platform',requests:14560,spend:192.7,budget:280,forecast:267}
  ]);

  readonly savings=[46.2,31.8,24.6,18.4];
  readonly savingsTitles=[
    'Route low-complexity tickets to GPT-5 Mini',
    'Cache repeated knowledge retrieval prompts',
    'Cap verbose outputs for support summaries',
    'Move evaluation traffic to off-peak capacity'
  ];
  readonly savingsImpacts=['Model routing','Prompt caching','Output tokens','Capacity'];
  readonly savingsConfidence=[94,91,87,82];

  readonly filteredModels=computed(()=>{
    const q=this.query().trim().toLowerCase();
    return this.models().filter(m=>!q || `${m.model} ${m.provider}`.toLowerCase().includes(q));
  });
  readonly totalSpend=computed(()=>this.models().reduce((s,m)=>s+m.spend,0));
  readonly totalRequests=computed(()=>this.models().reduce((s,m)=>s+m.requests,0));
  readonly avgCostPerRequest=computed(()=>this.totalSpend()/this.totalRequests());
  readonly projectedSaving=computed(()=>this.savings.reduce((s,v)=>s+v,0));

  selectModel(m:ModelCost){this.selectedModel.set(m)}
  clearSelection(){this.selectedModel.set(null)}
}
