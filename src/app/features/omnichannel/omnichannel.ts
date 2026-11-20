
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, MessageCircle, Phone, Globe, Bot, UsersRound, GitMerge, Split, Zap, ShieldCheck, Send, Search, Filter, Plus, X, CheckCircle2 } from 'lucide-angular';

type Channel = 'portal' | 'email' | 'chat' | 'whatsapp' | 'phone' | 'api';
type TicketStatus = 'باز' | 'در حال بررسی' | 'منتظر مشتری' | 'حل‌شده';
type Priority = 'بحرانی' | 'بالا' | 'متوسط' | 'پایین';
type SlaState = 'در محدوده' | 'نزدیک نقض' | 'نقض‌شده' | 'متوقف';

interface TicketItem {
  id: string;
  subject: string;
  requester: string;
  channel: Channel;
  status: TicketStatus;
  priority: Priority;
  team: string;
  agent: string;
  sla: SlaState;
  updated: string;
  parentId?: string;
  children?: string[];
}

interface TimelineItem {
  type: 'in' | 'out' | 'system';
  title: string;
  text: string;
  time: string;
}

@Component({
  selector: 'ah-omnichannel',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './omnichannel.html',
  styleUrl: './omnichannel.scss'
})
export class OmnichannelComponent {
  readonly Mail = Mail; readonly MessageCircle = MessageCircle; readonly Phone = Phone;
  readonly Globe = Globe; readonly Bot = Bot; readonly UsersRound = UsersRound;
  readonly GitMerge = GitMerge; readonly Split = Split; readonly Zap = Zap;
  readonly ShieldCheck = ShieldCheck; readonly Send = Send; readonly Search = Search;
  readonly Filter = Filter; readonly Plus = Plus; readonly X = X; readonly CheckCircle2 = CheckCircle2;

  search = '';
  channelFilter = 'همه';
  priorityFilter = 'همه';
  slaFilter = 'همه';
  activeTicket = signal<TicketItem | null>(null);
  toast = signal('');
  replyText = '';

  readonly channels = [
    { key: 'portal', label: 'پورتال', icon: Globe, count: 24, state: 'متصل' },
    { key: 'email', label: 'ایمیل', icon: Mail, count: 18, state: 'متصل' },
    { key: 'chat', label: 'Live Chat', icon: MessageCircle, count: 11, state: 'متصل' },
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, count: 9, state: 'آماده' },
    { key: 'phone', label: 'تلفن', icon: Phone, count: 7, state: 'متصل' },
    { key: 'api', label: 'API', icon: Bot, count: 5, state: 'متصل' }
  ];

  readonly tickets = signal<TicketItem[]>([
    { id:'INC-2048', subject:'دسترسی کاربر به سامانه مالی قطع شده', requester:'سارا احمدی', channel:'email', status:'باز', priority:'بحرانی', team:'پشتیبانی سطح ۲', agent:'مریم کریمی', sla:'نزدیک نقض', updated:'۲ دقیقه پیش' },
    { id:'INC-2047', subject:'خطای ورود به پورتال خدمات', requester:'رضا نادری', channel:'portal', status:'در حال بررسی', priority:'بالا', team:'Service Desk', agent:'علی رضایی', sla:'در محدوده', updated:'۶ دقیقه پیش' },
    { id:'INC-2046', subject:'پیگیری سفارش تجهیزات شبکه', requester:'حمید مرادی', channel:'whatsapp', status:'منتظر مشتری', priority:'متوسط', team:'تدارکات', agent:'نگار موسوی', sla:'متوقف', updated:'۱۸ دقیقه پیش' },
    { id:'INC-2045', subject:'گفت‌وگوی زنده درباره تنظیمات VPN', requester:'الهام اکبری', channel:'chat', status:'باز', priority:'بالا', team:'شبکه', agent:'آرمان صادقی', sla:'در محدوده', updated:'۲۱ دقیقه پیش' },
    { id:'INC-2044', subject:'ثبت خودکار تیکت از ERP', requester:'ERP Integration', channel:'api', status:'در حال بررسی', priority:'بحرانی', team:'Integration', agent:'سیستم هوشمند', sla:'نقض‌شده', updated:'۳۲ دقیقه پیش' },
    { id:'INC-2043', subject:'تماس برگشتی درباره صورتحساب', requester:'مهدی یوسفی', channel:'phone', status:'حل‌شده', priority:'پایین', team:'مالی', agent:'سعید احمدی', sla:'در محدوده', updated:'۴۵ دقیقه پیش' }
  ]);

  readonly templates = [
    { name:'پاسخ اولیه استاندارد', shortcut:'/hello', text:'سلام، درخواست شما دریافت شد و در حال بررسی توسط تیم مربوطه است.' },
    { name:'درخواست اطلاعات تکمیلی', shortcut:'/info', text:'لطفاً اطلاعات تکمیلی موردنیاز را ارسال کنید تا بررسی را ادامه دهیم.' },
    { name:'اعلام حل مسئله', shortcut:'/done', text:'مشکل بررسی و برطرف شد. در صورت نیاز به راهنمایی بیشتر، در خدمت شما هستیم.' }
  ];

  readonly timeline = signal<TimelineItem[]>([
    { type:'in', title:'پیام ورودی از ایمیل', text:'دسترسی من به سامانه مالی از صبح قطع شده است.', time:'۱۰:۲۲' },
    { type:'system', title:'مسیریابی هوشمند', text:'تیکت به دلیل SLA بحرانی به پشتیبانی سطح ۲ منتقل شد.', time:'۱۰:۲۳' },
    { type:'system', title:'Round Robin', text:'مسئول جدید: مریم کریمی', time:'۱۰:۲۴' },
    { type:'out', title:'پاسخ کارشناس', text:'در حال بررسی دسترسی شما هستم.', time:'۱۰:۲۵' }
  ]);

  readonly filteredTickets = computed(() => {
    const q = this.search.trim().toLowerCase();
    return this.tickets().filter(t =>
      (!q || [t.id,t.subject,t.requester,t.agent,t.team].join(' ').toLowerCase().includes(q)) &&
      (this.channelFilter === 'همه' || this.channelLabel(t.channel) === this.channelFilter) &&
      (this.priorityFilter === 'همه' || t.priority === this.priorityFilter) &&
      (this.slaFilter === 'همه' || t.sla === this.slaFilter)
    );
  });

  readonly openCount = computed(() => this.tickets().filter(t => t.status !== 'حل‌شده').length);
  readonly urgentCount = computed(() => this.tickets().filter(t => t.priority === 'بحرانی' || t.sla === 'نقض‌شده').length);
  readonly waitingCount = computed(() => this.tickets().filter(t => t.status === 'منتظر مشتری').length);
  readonly channelCount = computed(() => this.channels.length);

  channelLabel(channel: Channel): string {
    return ({ portal:'پورتال', email:'ایمیل', chat:'Live Chat', whatsapp:'WhatsApp', phone:'تلفن', api:'API' })[channel];
  }

  channelIcon(channel: Channel) {
    return ({ portal:this.Globe, email:this.Mail, chat:this.MessageCircle, whatsapp:this.MessageCircle, phone:this.Phone, api:this.Bot })[channel];
  }

  selectTicket(ticket: TicketItem): void { this.activeTicket.set(ticket); }
  closeTicket(): void { this.activeTicket.set(null); this.replyText = ''; }

  routeSelected(): void {
    const ticket = this.activeTicket();
    if (!ticket) return;
    const agents = ['مریم کریمی','علی رضایی','نگار موسوی','آرمان صادقی'];
    const next = agents[(agents.indexOf(ticket.agent) + 1) % agents.length];
    this.tickets.update(items => items.map(t => t.id === ticket.id ? {...t, agent: next, updated:'همین الان'} : t));
    this.activeTicket.set({...ticket, agent: next, updated:'همین الان'});
    this.showToast(`تیکت ${ticket.id} با Round Robin به ${next} واگذار شد.`);
  }

  mergeSelected(): void {
    const ticket = this.activeTicket();
    if (!ticket) return;
    this.showToast(`تیکت ${ticket.id} آماده ادغام با تیکت مرتبط شد؛ در Backend نهایی می‌شود.`);
  }

  splitSelected(): void {
    const ticket = this.activeTicket();
    if (!ticket) return;
    this.showToast(`فرآیند Split برای ${ticket.id} شبیه‌سازی شد.`);
  }

  applyTemplate(template: { text: string }): void {
    this.replyText = template.text;
  }

  sendReply(): void {
    if (!this.replyText.trim()) return;
    this.timeline.update(items => [...items, { type:'out', title:'پاسخ جدید', text:this.replyText.trim(), time:'همین الان' }]);
    this.replyText = '';
    this.showToast('پاسخ در تایم‌لاین یکپارچه ثبت شد.');
  }

  exportCsv(): void {
    const rows = [['Ticket','Subject','Channel','Priority','SLA','Team','Agent'],
      ...this.filteredTickets().map(t => [t.id,t.subject,this.channelLabel(t.channel),t.priority,t.sla,t.team,t.agent])];
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href=url; a.download='ashkan-omnichannel-tickets.csv'; a.click(); URL.revokeObjectURL(url);
  }

  showToast(message: string): void {
    this.toast.set(message);
    window.setTimeout(() => this.toast.set(''), 2600);
  }
}
