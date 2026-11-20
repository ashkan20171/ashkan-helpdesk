import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, BarChart3, CalendarDays, Check, ChevronDown, CircleHelp, ClipboardList, Download, Edit3, MessageSquare, Plus, Search, Send, Smile, Star, ThumbsDown, ThumbsUp, TrendingUp, Users, X } from 'lucide-angular';

type SurveyStatus = 'draft' | 'active' | 'closed';
type QuestionType = 'rating' | 'nps' | 'text' | 'choice';

interface SurveyQuestion {
  id: number;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

interface SurveyResponse {
  id: number;
  respondent: string;
  ticket: string;
  team: string;
  date: string;
  csat: number;
  nps: number;
  comment: string;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  trigger: string;
  status: SurveyStatus;
  category: string;
  createdAt: string;
  responses: number;
  csat: number;
  nps: number;
  questions: SurveyQuestion[];
}

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './surveys.html',
  styleUrl: './surveys.scss'
})
export class SurveysComponent {
  readonly icons = {
    chart: BarChart3, calendar: CalendarDays, check: Check, chevron: ChevronDown,
    help: CircleHelp, clipboard: ClipboardList, download: Download, edit: Edit3,
    message: MessageSquare, plus: Plus, search: Search, send: Send, smile: Smile,
    star: Star, down: ThumbsDown, up: ThumbsUp, trend: TrendingUp, users: Users, x: X
  };

  surveys: Survey[] = [
    {
      id: 1, title: 'رضایت پس از حل تیکت', description: 'سنجش تجربه کاربر پس از بسته‌شدن درخواست پشتیبانی.',
      trigger: 'پس از بسته‌شدن تیکت', status: 'active', category: 'CSAT', createdAt: '1405/08/20',
      responses: 428, csat: 91, nps: 62,
      questions: [
        { id: 1, title: 'از کیفیت پاسخ دریافت‌شده چقدر رضایت دارید؟', type: 'rating', required: true, options: [] },
        { id: 2, title: 'چقدر احتمال دارد خدمات پشتیبانی را به همکار خود پیشنهاد دهید؟', type: 'nps', required: true, options: [] },
        { id: 3, title: 'چه پیشنهادی برای بهبود خدمات دارید؟', type: 'text', required: false, options: [] }
      ]
    },
    {
      id: 2, title: 'ارزیابی تجربه پورتال کاربران', description: 'بازخورد درباره سهولت استفاده و کیفیت خدمات سلف‌سرویس.',
      trigger: 'هر ۹۰ روز برای کاربران فعال', status: 'active', category: 'CX', createdAt: '1405/09/01',
      responses: 216, csat: 86, nps: 48,
      questions: [
        { id: 1, title: 'استفاده از پورتال چقدر ساده است؟', type: 'rating', required: true, options: [] },
        { id: 2, title: 'کدام بخش بیشترین نیاز به بهبود دارد؟', type: 'choice', required: true, options: ['ثبت تیکت', 'پایگاه دانش', 'پیگیری درخواست', 'اعلان‌ها'] }
      ]
    },
    {
      id: 3, title: 'ارزیابی کیفیت خدمات تیم زیرساخت', description: 'اندازه‌گیری رضایت واحدها از خدمات شبکه و زیرساخت.',
      trigger: 'پس از انجام درخواست زیرساخت', status: 'closed', category: 'CSAT', createdAt: '1405/07/12',
      responses: 173, csat: 88, nps: 54,
      questions: [
        { id: 1, title: 'سرعت رسیدگی به درخواست را چگونه ارزیابی می‌کنید؟', type: 'rating', required: true, options: [] },
        { id: 2, title: 'توضیحات تکمیلی', type: 'text', required: false, options: [] }
      ]
    },
    {
      id: 4, title: 'نظرسنجی کیفیت ارتباط کارشناسان', description: 'بررسی رفتار حرفه‌ای، شفافیت و کیفیت ارتباط کارشناسان.',
      trigger: 'پس از پاسخ نهایی کارشناس', status: 'draft', category: 'CES', createdAt: '1405/09/10',
      responses: 0, csat: 0, nps: 0,
      questions: [
        { id: 1, title: 'کارشناس تا چه اندازه پاسخ‌گو و شفاف بود؟', type: 'rating', required: true, options: [] }
      ]
    }
  ];

  responses: SurveyResponse[] = [
    { id: 1, respondent: 'کاربر سازمانی ۰۲۱', ticket: 'HD-10482', team: 'پشتیبانی نرم‌افزار', date: '1405/09/12', csat: 5, nps: 9, comment: 'پاسخ‌گویی سریع و دقیق بود.' },
    { id: 2, respondent: 'کاربر سازمانی ۰۱۴', ticket: 'HD-10476', team: 'زیرساخت', date: '1405/09/11', csat: 4, nps: 8, comment: 'مشکل حل شد؛ اطلاع‌رسانی می‌توانست بهتر باشد.' },
    { id: 3, respondent: 'کاربر سازمانی ۰۳۸', ticket: 'HD-10461', team: 'پشتیبانی نرم‌افزار', date: '1405/09/10', csat: 2, nps: 5, comment: 'زمان رسیدگی طولانی شد.' },
    { id: 4, respondent: 'کاربر سازمانی ۰۰۹', ticket: 'HD-10442', team: 'شبکه', date: '1405/09/09', csat: 5, nps: 10, comment: 'تجربه بسیار خوبی بود.' },
    { id: 5, respondent: 'کاربر سازمانی ۰۲۷', ticket: 'HD-10431', team: 'زیرساخت', date: '1405/09/08', csat: 3, nps: 6, comment: 'نیاز به پیگیری بیشتری داشت.' }
  ];

  query = '';
  statusFilter = 'all';
  categoryFilter = 'همه';
  activeTab: 'overview' | 'surveys' | 'responses' = 'overview';
  showModal = false;
  isEditing = false;
  selectedSurvey: Survey | null = null;
  form: Partial<Survey> = this.emptyForm();

  get filteredSurveys(): Survey[] {
    const q = this.query.trim().toLowerCase();
    return this.surveys.filter(s => {
      const matchText = !q || [s.title, s.description, s.trigger, s.category].join(' ').toLowerCase().includes(q);
      return matchText && (this.statusFilter === 'all' || s.status === this.statusFilter)
        && (this.categoryFilter === 'همه' || s.category === this.categoryFilter);
    });
  }

  get totalResponses(): number {
    return this.surveys.reduce((sum, s) => sum + s.responses, 0);
  }

  get averageCsat(): number {
    const active = this.surveys.filter(s => s.responses > 0);
    if (!active.length) return 0;
    return Math.round(active.reduce((sum, s) => sum + s.csat * s.responses, 0) / active.reduce((sum, s) => sum + s.responses, 0));
  }

  get averageNps(): number {
    const active = this.surveys.filter(s => s.responses > 0);
    if (!active.length) return 0;
    return Math.round(active.reduce((sum, s) => sum + s.nps * s.responses, 0) / active.reduce((sum, s) => sum + s.responses, 0));
  }

  get activeCount(): number {
    return this.surveys.filter(s => s.status === 'active').length;
  }

  get promoters(): number {
    return this.responses.filter(r => r.nps >= 9).length;
  }

  get detractors(): number {
    return this.responses.filter(r => r.nps <= 6).length;
  }

  get npsDistribution(): { label: string; count: number; className: string }[] {
    return [
      { label: 'مروجان (۹ تا ۱۰)', count: this.promoters, className: 'promoters' },
      { label: 'منفعلان (۷ تا ۸)', count: this.responses.filter(r => r.nps >= 7 && r.nps <= 8).length, className: 'passives' },
      { label: 'منتقدان (۰ تا ۶)', count: this.detractors, className: 'detractors' }
    ];
  }

  get teamMetrics(): { team: string; count: number; score: number }[] {
    const names = Array.from(new Set(this.responses.map(r => r.team)));
    return names.map(team => {
      const rows = this.responses.filter(r => r.team === team);
      return { team, count: rows.length, score: Math.round(rows.reduce((sum, r) => sum + r.csat, 0) / rows.length * 20) };
    }).sort((a, b) => b.score - a.score);
  }

  openCreate() {
    this.isEditing = false;
    this.form = this.emptyForm();
    this.showModal = true;
  }

  openEdit(survey: Survey) {
    this.isEditing = true;
    this.form = { ...survey, questions: survey.questions.map(q => ({ ...q, options: [...q.options] })) };
    this.showModal = true;
  }

  saveSurvey() {
    const title = (this.form.title || '').trim();
    if (!title) return;
    if (this.isEditing && this.form.id) {
      const index = this.surveys.findIndex(s => s.id === this.form.id);
      if (index >= 0) this.surveys[index] = { ...this.surveys[index], ...this.form } as Survey;
    } else {
      const item: Survey = {
        id: Math.max(...this.surveys.map(s => s.id), 0) + 1,
        title, description: this.form.description || '',
        trigger: this.form.trigger || 'ارسال دستی',
        status: (this.form.status as SurveyStatus) || 'draft',
        category: this.form.category || 'CSAT',
        createdAt: '1405/09/12', responses: 0, csat: 0, nps: 0,
        questions: this.form.questions?.length ? this.form.questions as SurveyQuestion[] : [
          { id: 1, title: 'از تجربه خود چقدر رضایت دارید؟', type: 'rating', required: true, options: [] }
        ]
      };
      this.surveys = [item, ...this.surveys];
    }
    this.showModal = false;
  }

  addQuestion() {
    const questions = [...(this.form.questions || [])];
    questions.push({ id: Math.max(...questions.map(q => q.id), 0) + 1, title: '', type: 'rating', required: true, options: [] });
    this.form.questions = questions;
  }

  removeQuestion(id: number) {
    this.form.questions = (this.form.questions || []).filter(q => q.id !== id);
  }

  toggleStatus(survey: Survey) {
    survey.status = survey.status === 'active' ? 'closed' : 'active';
  }

  statusLabel(status: SurveyStatus): string {
    return ({ draft: 'پیش‌نویس', active: 'فعال', closed: 'متوقف' } as Record<SurveyStatus, string>)[status];
  }

  statusClass(status: SurveyStatus): string {
    return `status-${status}`;
  }

  exportResponses() {
    const headers = ['شناسه پاسخ‌دهنده', 'تیکت', 'تیم', 'تاریخ', 'CSAT', 'NPS', 'نظر'];
    const rows = this.responses.map(r => [r.respondent, r.ticket, r.team, r.date, r.csat, r.nps, r.comment]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashkan-survey-responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private emptyForm(): Partial<Survey> {
    return {
      title: '', description: '', trigger: 'پس از بسته‌شدن تیکت',
      status: 'draft', category: 'CSAT',
      questions: [{ id: 1, title: 'از تجربه خود چقدر رضایت دارید؟', type: 'rating', required: true, options: [] }]
    };
  }
}
