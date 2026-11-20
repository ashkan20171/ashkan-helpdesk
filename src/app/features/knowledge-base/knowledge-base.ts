import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, BookOpen, Check, ChevronDown, Clock3, Edit3, Eye, FileCheck2, FileText, Filter, Lightbulb, MessageCircleQuestion, Plus, Search, Star, Tag, ThumbsUp, Trash2, TrendingUp, X } from 'lucide-angular';

type ArticleStatus = 'draft' | 'pending' | 'published' | 'archived';

interface ArticleVersion {
  version: number;
  date: string;
  author: string;
  note: string;
}

interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  status: ArticleStatus;
  tags: string[];
  linkedModules: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  updatedAt: string;
  publishedAt: string;
  featured: boolean;
  versions: ArticleVersion[];
}

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './knowledge-base.html',
  styleUrl: './knowledge-base.scss'
})
export class KnowledgeBaseComponent {
  readonly icons = {
    book: BookOpen,
    check: Check,
    chevron: ChevronDown,
    clock: Clock3,
    edit: Edit3,
    eye: Eye,
    fileCheck: FileCheck2,
    fileText: FileText,
    filter: Filter,
    idea: Lightbulb,
    faq: MessageCircleQuestion,
    plus: Plus,
    search: Search,
    star: Star,
    tag: Tag,
    thumbsUp: ThumbsUp,
    trash: Trash2,
    trend: TrendingUp,
    x: X
  };

  categories = ['همه', 'راهنمای کاربران', 'زیرساخت و فنی', 'منابع انسانی', 'مالی و اداری', 'امنیت', 'سؤالات متداول'];
  statuses = [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'pending', label: 'در انتظار تأیید' },
    { value: 'published', label: 'منتشر شده' },
    { value: 'archived', label: 'بایگانی شده' }
  ];

  articles: KnowledgeArticle[] = [
    {
      id: 1,
      title: 'راهنمای بازیابی رمز عبور حساب سازمانی',
      category: 'راهنمای کاربران',
      summary: 'مراحل بازیابی رمز عبور و فعال‌سازی مجدد حساب کاربری در سامانه.',
      content: 'در صورت فراموشی رمز عبور، ابتدا گزینه «بازیابی رمز عبور» را انتخاب کنید. پس از تأیید هویت، رمز جدید را ثبت کرده و دوباره وارد سامانه شوید.',
      author: 'سارا احمدی',
      status: 'published',
      tags: ['رمز عبور', 'حساب کاربری', 'ورود'],
      linkedModules: ['تیکتینگ', 'پرتال کاربران'],
      views: 1284,
      helpful: 116,
      notHelpful: 4,
      updatedAt: '1405/09/10',
      publishedAt: '1405/08/20',
      featured: true,
      versions: [
        { version: 3, date: '1405/09/10', author: 'سارا احمدی', note: 'به‌روزرسانی مراحل تأیید هویت' },
        { version: 2, date: '1405/09/01', author: 'سارا احمدی', note: 'افزودن پرسش‌های متداول' },
        { version: 1, date: '1405/08/20', author: 'سارا احمدی', note: 'نسخه اولیه' }
      ]
    },
    {
      id: 2,
      title: 'عیب‌یابی اتصال VPN سازمان',
      category: 'زیرساخت و فنی',
      summary: 'چک‌لیست بررسی خطاهای رایج اتصال VPN و اقدامات اولیه پشتیبانی.',
      content: 'وضعیت اینترنت، تاریخ و ساعت سیستم، اعتبار حساب و وضعیت سرویس VPN را بررسی کنید. سپس در صورت تداوم خطا، اطلاعات خطا را همراه با اسکرین‌شات در تیکت ثبت کنید.',
      author: 'امیر حسینی',
      status: 'published',
      tags: ['VPN', 'شبکه', 'عیب‌یابی'],
      linkedModules: ['تیکتینگ', 'مدیریت دارایی'],
      views: 972,
      helpful: 88,
      notHelpful: 9,
      updatedAt: '1405/09/08',
      publishedAt: '1405/08/14',
      featured: true,
      versions: [
        { version: 2, date: '1405/09/08', author: 'امیر حسینی', note: 'افزودن چک‌لیست جدید' },
        { version: 1, date: '1405/08/14', author: 'امیر حسینی', note: 'نسخه اولیه' }
      ]
    },
    {
      id: 3,
      title: 'قوانین درخواست مرخصی',
      category: 'منابع انسانی',
      summary: 'راهنمای ثبت درخواست مرخصی، تأیید مدیر و مشاهده مانده مرخصی.',
      content: 'درخواست مرخصی از بخش منابع انسانی ثبت می‌شود و پس از بررسی مدیر مستقیم در وضعیت تأیید یا رد قرار می‌گیرد.',
      author: 'مریم رضایی',
      status: 'published',
      tags: ['مرخصی', 'منابع انسانی'],
      linkedModules: ['HR'],
      views: 741,
      helpful: 63,
      notHelpful: 3,
      updatedAt: '1405/09/05',
      publishedAt: '1405/07/19',
      featured: false,
      versions: [
        { version: 2, date: '1405/09/05', author: 'مریم رضایی', note: 'اصلاح گردش تأیید' },
        { version: 1, date: '1405/07/19', author: 'مریم رضایی', note: 'نسخه اولیه' }
      ]
    },
    {
      id: 4,
      title: 'فرآیند درخواست خرید تجهیزات',
      category: 'مالی و اداری',
      summary: 'مراحل ثبت درخواست خرید، استعلام، تصویب و تحویل تجهیزات سازمان.',
      content: 'درخواست خرید توسط واحد متقاضی ثبت می‌شود، سپس استعلام و بررسی تأمین‌کنندگان انجام شده و پس از تصویب، سفارش خرید صادر می‌شود.',
      author: 'علی محمدی',
      status: 'pending',
      tags: ['خرید', 'تأمین‌کننده', 'سفارش خرید'],
      linkedModules: ['خرید', 'قراردادها'],
      views: 0,
      helpful: 0,
      notHelpful: 0,
      updatedAt: '1405/09/12',
      publishedAt: '',
      featured: false,
      versions: [
        { version: 1, date: '1405/09/12', author: 'علی محمدی', note: 'ارسال برای تأیید' }
      ]
    },
    {
      id: 5,
      title: 'اقدامات ضروری هنگام رخداد امنیتی',
      category: 'امنیت',
      summary: 'راهنمای کوتاه برای ایزوله‌سازی اولیه و ثبت رخدادهای امنیتی.',
      content: 'در رخدادهای امنیتی ابتدا دسترسی مشکوک را محدود کرده، اطلاعات رخداد را حفظ و سپس موضوع را از مسیر رسمی به تیم امنیت اطلاع دهید.',
      author: 'رضا کریمی',
      status: 'draft',
      tags: ['امنیت', 'رخداد', 'Incident'],
      linkedModules: ['تیکتینگ', 'امنیت'],
      views: 0,
      helpful: 0,
      notHelpful: 0,
      updatedAt: '1405/09/11',
      publishedAt: '',
      featured: false,
      versions: [
        { version: 1, date: '1405/09/11', author: 'رضا کریمی', note: 'پیش‌نویس اولیه' }
      ]
    },
    {
      id: 6,
      title: 'چگونه تیکت با اولویت بالا ثبت کنیم؟',
      category: 'سؤالات متداول',
      summary: 'چه زمانی باید یک درخواست را با اولویت بالا یا بحرانی ثبت کرد؟',
      content: 'اولویت بالا برای اختلال مؤثر بر فرایندهای حیاتی سازمان استفاده می‌شود. برای موارد بحرانی، شرح دقیق اثر کسب‌وکار و زمان شروع اختلال را نیز ثبت کنید.',
      author: 'سارا احمدی',
      status: 'published',
      tags: ['تیکت', 'اولویت', 'SLA'],
      linkedModules: ['تیکتینگ', 'SLA'],
      views: 1520,
      helpful: 142,
      notHelpful: 7,
      updatedAt: '1405/09/09',
      publishedAt: '1405/06/25',
      featured: true,
      versions: [
        { version: 2, date: '1405/09/09', author: 'سارا احمدی', note: 'افزودن مثال SLA' },
        { version: 1, date: '1405/06/25', author: 'سارا احمدی', note: 'نسخه اولیه' }
      ]
    }
  ];

  query = '';
  categoryFilter = 'همه';
  statusFilter = 'all';
  selectedArticle: KnowledgeArticle | null = null;
  showModal = false;
  showVersions = false;
  isEditing = false;
  activeCategory = 'همه';
  featuredOnly = false;

  form: Partial<KnowledgeArticle> = this.emptyForm();

  get filteredArticles(): KnowledgeArticle[] {
    const q = this.query.trim().toLowerCase();
    return this.articles.filter(article => {
      const text = [article.title, article.summary, article.content, article.author, article.category, ...article.tags, ...article.linkedModules].join(' ').toLowerCase();
      return (!q || text.includes(q))
        && (this.categoryFilter === 'همه' || article.category === this.categoryFilter)
        && (this.statusFilter === 'all' || article.status === this.statusFilter)
        && (!this.featuredOnly || article.featured);
    });
  }

  get publishedCount(): number {
    return this.articles.filter(a => a.status === 'published').length;
  }

  get pendingCount(): number {
    return this.articles.filter(a => a.status === 'pending').length;
  }

  get totalViews(): number {
    return this.articles.reduce((sum, a) => sum + a.views, 0);
  }

  get helpfulRate(): number {
    const helpful = this.articles.reduce((sum, a) => sum + a.helpful, 0);
    const total = helpful + this.articles.reduce((sum, a) => sum + a.notHelpful, 0);
    return total ? Math.round((helpful / total) * 100) : 0;
  }

  get topArticles(): KnowledgeArticle[] {
    return [...this.articles].filter(a => a.status === 'published').sort((a, b) => b.views - a.views).slice(0, 3);
  }

  selectCategory(category: string) {
    this.activeCategory = category;
    this.categoryFilter = category;
  }

  openCreate() {
    this.isEditing = false;
    this.form = this.emptyForm();
    this.showModal = true;
  }

  openEdit(article: KnowledgeArticle) {
    this.isEditing = true;
    this.form = { ...article, tags: [...article.tags], linkedModules: [...article.linkedModules] };
    this.showModal = true;
  }

  openDetails(article: KnowledgeArticle) {
    this.selectedArticle = article;
    this.showVersions = false;
  }

  closeDetails() {
    this.selectedArticle = null;
  }

  saveArticle() {
    const title = (this.form.title || '').trim();
    const summary = (this.form.summary || '').trim();
    if (!title || !summary) return;

    if (this.isEditing && this.form.id) {
      const index = this.articles.findIndex(a => a.id === this.form.id);
      if (index >= 0) {
        this.articles[index] = {
          ...this.articles[index],
          ...this.form,
          tags: this.normalize(this.form.tags),
          linkedModules: this.normalize(this.form.linkedModules),
          updatedAt: '1405/09/12'
        } as KnowledgeArticle;
      }
    } else {
      const item: KnowledgeArticle = {
        id: Math.max(...this.articles.map(a => a.id), 0) + 1,
        title,
        category: this.form.category || 'راهنمای کاربران',
        summary,
        content: this.form.content || '',
        author: this.form.author || 'مدیر سیستم',
        status: (this.form.status as ArticleStatus) || 'draft',
        tags: this.normalize(this.form.tags),
        linkedModules: this.normalize(this.form.linkedModules),
        views: 0,
        helpful: 0,
        notHelpful: 0,
        updatedAt: '1405/09/12',
        publishedAt: this.form.status === 'published' ? '1405/09/12' : '',
        featured: !!this.form.featured,
        versions: [{ version: 1, date: '1405/09/12', author: this.form.author || 'مدیر سیستم', note: 'ایجاد مقاله' }]
      };
      this.articles = [item, ...this.articles];
    }

    this.showModal = false;
  }

  publish(article: KnowledgeArticle) {
    article.status = 'published';
    article.publishedAt = '1405/09/12';
    article.updatedAt = '1405/09/12';
  }

  archive(article: KnowledgeArticle) {
    article.status = 'archived';
    article.updatedAt = '1405/09/12';
  }

  submitForApproval(article: KnowledgeArticle) {
    article.status = 'pending';
    article.updatedAt = '1405/09/12';
  }

  deleteArticle(article: KnowledgeArticle) {
    this.articles = this.articles.filter(a => a.id !== article.id);
    this.closeDetails();
  }

  addVersion(article: KnowledgeArticle) {
    const next = Math.max(...article.versions.map(v => v.version), 0) + 1;
    article.versions.unshift({
      version: next,
      date: '1405/09/12',
      author: article.author,
      note: 'ثبت نسخه جدید'
    });
    article.updatedAt = '1405/09/12';
    this.showVersions = true;
  }

  rateArticle(article: KnowledgeArticle, helpful: boolean) {
    if (helpful) article.helpful++;
    else article.notHelpful++;
  }

  exportCsv() {
    const headers = ['عنوان', 'دسته‌بندی', 'وضعیت', 'نویسنده', 'بازدید', 'مفید', 'آخرین بروزرسانی'];
    const rows = this.filteredArticles.map(a => [a.title, a.category, this.statusLabel(a.status), a.author, a.views, a.helpful, a.updatedAt]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ashkan-knowledge-base.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  statusLabel(status: ArticleStatus): string {
    return this.statuses.find(s => s.value === status)?.label || status;
  }

  statusClass(status: ArticleStatus): string {
    return `status-${status}`;
  }

  updateFormTags(value: string): void {
    this.form.tags = String(value || '').split(',').map(tag => tag.trim()).filter(Boolean);
  }

  updateFormLinkedModules(value: string): void {
    this.form.linkedModules = String(value || '').split(',').map(module => module.trim()).filter(Boolean);
  }

  private normalize(value: string[] | undefined): string[] {
    if (Array.isArray(value)) return value.map(x => String(x).trim()).filter(Boolean);
    return String(value || '').split(',').map(x => x.trim()).filter(Boolean);
  }

  private emptyForm(): Partial<KnowledgeArticle> {
    return {
      title: '',
      category: 'راهنمای کاربران',
      summary: '',
      content: '',
      author: 'مدیر سیستم',
      status: 'draft',
      tags: [],
      linkedModules: [],
      featured: false
    };
  }
}
