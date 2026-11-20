import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle, Bot, BrainCircuit, CheckCircle2, ChevronLeft, ClipboardCheck,
  Clock3, FileSearch, Gauge, HeartPulse, HelpCircle, Headset, Lightbulb, LucideAngularModule,
  MessageSquareText, Play, RefreshCw, Search, Send, ShieldCheck, Sparkles, Target,
  Ticket, TrendingUp, UserRound, X, Zap
} from 'lucide-angular';
import { hasPermission } from '../auth/auth.guard';

type CopilotMode = 'agent' | 'manager' | 'customer';
type InsightKind = 'ticket' | 'knowledge' | 'sla' | 'customer' | 'asset' | 'workflow';

interface Insight {
  id: string;
  kind: InsightKind;
  title: string;
  summary: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action: string;
}

interface ConversationItem {
  role: 'user' | 'copilot';
  text: string;
}

@Component({
  selector: 'ah-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './copilot.html',
  styleUrl: './copilot.scss'
})
export class CopilotComponent {
  readonly AlertTriangle = AlertTriangle;
  readonly Bot = Bot;
  readonly BrainCircuit = BrainCircuit;
  readonly CheckCircle2 = CheckCircle2;
  readonly ChevronLeft = ChevronLeft;
  readonly ClipboardCheck = ClipboardCheck;
  readonly Clock3 = Clock3;
  readonly FileSearch = FileSearch;
  readonly Gauge = Gauge;
  readonly HeartPulse = HeartPulse;
  readonly HelpCircle = HelpCircle;
  readonly Headset = Headset;
  readonly Lightbulb = Lightbulb;
  readonly MessageSquareText = MessageSquareText;
  readonly Play = Play;
  readonly RefreshCw = RefreshCw;
  readonly Search = Search;
  readonly Send = Send;
  readonly ShieldCheck = ShieldCheck;
  readonly Sparkles = Sparkles;
  readonly Target = Target;
  readonly Ticket = Ticket;
  readonly TrendingUp = TrendingUp;
  readonly UserRound = UserRound;
  readonly X = X;
  readonly Zap = Zap;

  readonly canManage = hasPermission('settings.manage');
  readonly mode = signal<CopilotMode>('agent');
  readonly query = signal('');
  readonly busy = signal(false);
  readonly notice = signal('');
  readonly showInspector = signal(false);
  readonly selected = signal<Insight | null>(null);

  readonly conversations = signal<ConversationItem[]>([
    { role: 'copilot', text: 'سلام! من Ashkan Copilot هستم. می‌توانم تیکت، SLA، دانش، سلامت مشتری و گردش‌کار را کنار هم تحلیل کنم.' },
    { role: 'user', text: 'برای تیکت‌های بحرانی امروز چه کاری پیشنهاد می‌کنی؟' },
    { role: 'copilot', text: 'سه تیکت اولویت بالا را پیدا کردم؛ یکی در آستانه نقض SLA است و یک مورد نیز با افت Health مشتری مرتبط است.' }
  ]);

  readonly insights = signal<Insight[]>([
    {
      id: 'AI-101', kind: 'ticket', title: 'اولویت‌بندی هوشمند تیکت #HD-4821',
      summary: 'ترکیب شدت مشکل، زمان باقی‌مانده SLA و سابقه مشتری نشان می‌دهد این تیکت باید به صف Escalation منتقل شود.',
      confidence: 94, impact: 'high', action: 'Escalate + Assign'
    },
    {
      id: 'AI-102', kind: 'knowledge', title: 'مقاله مناسب برای پاسخ',
      summary: 'دو مقاله Knowledge Base با موضوع خطای احراز هویت بیشترین تطابق معنایی را دارند.',
      confidence: 91, impact: 'medium', action: 'Insert article'
    },
    {
      id: 'AI-103', kind: 'sla', title: 'پیش‌بینی نقض SLA',
      summary: 'برای ۷ تیکت احتمال نقض SLA در ۴ ساعت آینده بالاست؛ ۲ مورد به مشتریان پرریسک تعلق دارند.',
      confidence: 88, impact: 'high', action: 'Create recovery plan'
    },
    {
      id: 'AI-104', kind: 'customer', title: 'سیگنال افت سلامت مشتری',
      summary: 'کاهش کاربران فعال و افزایش زمان پاسخ با Health Score مشتری «پارس داده» همبستگی دارد.',
      confidence: 86, impact: 'high', action: 'Open rescue playbook'
    },
    {
      id: 'AI-105', kind: 'asset', title: 'ارتباط تیکت با دارایی',
      summary: 'سه تیکت اخیر به لپ‌تاپ‌های یک مدل خاص مربوط‌اند؛ احتمال یک مشکل تکرارشونده وجود دارد.',
      confidence: 82, impact: 'medium', action: 'Open problem'
    },
    {
      id: 'AI-106', kind: 'workflow', title: 'بهینه‌سازی گردش کار',
      summary: 'مرحله تأیید مدیر در یک Workflow پرتکرار باعث ۲۱٪ زمان انتظار اضافه شده است.',
      confidence: 79, impact: 'low', action: 'Review workflow'
    }
  ]);

  readonly activeInsights = computed(() => this.insights().filter(x => x.impact !== 'low').length);
  readonly avgConfidence = computed(() =>
    Math.round(this.insights().reduce((sum, item) => sum + item.confidence, 0) / this.insights().length)
  );

  readonly modeDescription = computed(() => ({
    agent: 'کمک عملیاتی برای کارشناسان: خلاصه، پاسخ، اولویت، SLA و Next Best Action.',
    manager: 'دید مدیریتی: ریسک، ظرفیت، کیفیت، SLA و تصمیم‌های اجرایی.',
    customer: 'کمک سلف‌سرویس: پاسخ قابل فهم، پیشنهاد مقاله و وضعیت درخواست.'
  }[this.mode()]));

  flash(message: string) {
    this.notice.set(message);
    setTimeout(() => this.notice.set(''), 3200);
  }

  setMode(mode: CopilotMode) {
    this.mode.set(mode);
    this.flash(`حالت Copilot به «${mode === 'agent' ? 'کارشناس' : mode === 'manager' ? 'مدیر' : 'مشتری'}» تغییر کرد.`);
  }

  analyze() {
    this.busy.set(true);
    this.flash('Copilot در حال تحلیل تیکت، Knowledge Base، SLA، Customer Health و Workflow است…');
    setTimeout(() => {
      this.busy.set(false);
      this.flash('تحلیل تکمیل شد؛ پیشنهادهای جدید آماده بررسی هستند.');
    }, 900);
  }

  runInsight(item: Insight) {
    this.selected.set(item);
    this.showInspector.set(true);
    this.flash(`پیشنهاد «${item.action}» برای ${item.id} آماده بررسی است.`);
  }

  applyAction() {
    const item = this.selected();
    if (!item) return;
    this.showInspector.set(false);
    this.flash(`Action «${item.action}» در صف اجرای Copilot قرار گرفت.`);
  }

  ask() {
    const q = this.query().trim();
    if (!q) {
      this.flash('سؤال خود را وارد کنید.');
      return;
    }
    this.conversations.update(items => [
      ...items,
      { role: 'user', text: q },
      { role: 'copilot', text: `بر اساس داده‌های فعلی HelpDesk، سؤال «${q}» باید با Ticket، SLA، Knowledge و Customer Context بررسی شود. این پاسخ فعلاً در حالت AI-ready و بدون اتصال به مدل زبانی واقعی ارائه می‌شود.` }
    ]);
    this.query.set('');
  }

  trackById(_: number, item: Insight) {
    return item.id;
  }
}
