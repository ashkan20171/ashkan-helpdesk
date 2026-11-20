import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule,
  Archive,
  ArchiveRestore,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Edit3,
  FileCheck2,
  FileText,
  FolderArchive,
  FolderOpen,
  History,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
  UserRound,
  X
} from 'lucide-angular';

type DocumentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

interface DocumentVersion {
  version: number;
  date: string;
  author: string;
  size: string;
  note: string;
}

interface DocumentItem {
  id: number;
  title: string;
  fileName: string;
  type: string;
  category: string;
  owner: string;
  tags: string[];
  status: DocumentStatus;
  linkedTo: string;
  linkedType: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  size: string;
  description: string;
  versions: DocumentVersion[];
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class DocumentsComponent {
  readonly icons = {
    archive: Archive,
    archiveRestore: ArchiveRestore,
    check: Check,
    chevronDown: ChevronDown,
    clock: Clock3,
    download: Download,
    edit: Edit3,
    fileCheck: FileCheck2,
    fileText: FileText,
    folderArchive: FolderArchive,
    folderOpen: FolderOpen,
    history: History,
    plus: Plus,
    search: Search,
    tag: Tag,
    trash: Trash2,
    upload: Upload,
    user: UserRound,
    x: X
  };

  categories = ['همه', 'سازمانی', 'قراردادها', 'منابع انسانی', 'مالی', 'عملیات', 'فنی'];
  statuses = [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'pending', label: 'در انتظار تأیید' },
    { value: 'approved', label: 'تأیید شده' },
    { value: 'rejected', label: 'رد شده' },
    { value: 'archived', label: 'بایگانی شده' }
  ];

  documents: DocumentItem[] = [
    {
      id: 1,
      title: 'قرارداد پشتیبانی زیرساخت ۱۴۰۵',
      fileName: 'Infrastructure-Support-1405.pdf',
      type: 'PDF',
      category: 'قراردادها',
      owner: 'سارا احمدی',
      tags: ['قرارداد', 'زیرساخت', 'محرمانه'],
      status: 'approved',
      linkedTo: 'قرارداد CT-1405-018',
      linkedType: 'قرارداد',
      createdAt: '1405/08/12',
      updatedAt: '1405/09/04',
      expiresAt: '1406/12/29',
      size: '4.8 MB',
      description: 'نسخه نهایی قرارداد پشتیبانی و نگهداری زیرساخت سازمان.',
      versions: [
        { version: 3, date: '1405/09/04', author: 'سارا احمدی', size: '4.8 MB', note: 'نسخه نهایی تأیید شده' },
        { version: 2, date: '1405/08/29', author: 'رضا کریمی', size: '4.6 MB', note: 'اصلاح بند SLA' },
        { version: 1, date: '1405/08/12', author: 'سارا احمدی', size: '4.2 MB', note: 'نسخه اولیه' }
      ]
    },
    {
      id: 2,
      title: 'آیین‌نامه منابع انسانی',
      fileName: 'HR-Policy-1405.docx',
      type: 'DOCX',
      category: 'منابع انسانی',
      owner: 'مریم رضایی',
      tags: ['منابع انسانی', 'آیین‌نامه'],
      status: 'pending',
      linkedTo: 'منابع انسانی',
      linkedType: 'واحد سازمانی',
      createdAt: '1405/09/01',
      updatedAt: '1405/09/10',
      expiresAt: '',
      size: '1.2 MB',
      description: 'پیش‌نویس آیین‌نامه داخلی منابع انسانی برای بررسی مدیریت.',
      versions: [
        { version: 2, date: '1405/09/10', author: 'مریم رضایی', size: '1.2 MB', note: 'ارسال برای تأیید' },
        { version: 1, date: '1405/09/01', author: 'مریم رضایی', size: '1.1 MB', note: 'نسخه اولیه' }
      ]
    },
    {
      id: 3,
      title: 'صورت‌جلسه کمیته خرید',
      fileName: 'Procurement-Minutes-22.pdf',
      type: 'PDF',
      category: 'مالی',
      owner: 'علی محمدی',
      tags: ['خرید', 'کمیته', 'صورت‌جلسه'],
      status: 'approved',
      linkedTo: 'RFQ-1405-022',
      linkedType: 'مناقصه',
      createdAt: '1405/09/07',
      updatedAt: '1405/09/07',
      expiresAt: '',
      size: '820 KB',
      description: 'صورت‌جلسه بررسی پیشنهادهای خرید تجهیزات شبکه.',
      versions: [
        { version: 1, date: '1405/09/07', author: 'علی محمدی', size: '820 KB', note: 'ثبت و تأیید نهایی' }
      ]
    },
    {
      id: 4,
      title: 'گزارش ممیزی امنیتی',
      fileName: 'Security-Audit-1405.xlsx',
      type: 'XLSX',
      category: 'فنی',
      owner: 'امیر حسینی',
      tags: ['امنیت', 'ممیزی', 'فنی'],
      status: 'draft',
      linkedTo: 'عملیات امنیت',
      linkedType: 'فرآیند',
      createdAt: '1405/09/11',
      updatedAt: '1405/09/12',
      expiresAt: '1405/12/29',
      size: '2.4 MB',
      description: 'گزارش اولیه ممیزی امنیتی سرویس‌ها و زیرساخت سازمان.',
      versions: [
        { version: 1, date: '1405/09/12', author: 'امیر حسینی', size: '2.4 MB', note: 'نسخه کاری' }
      ]
    },
    {
      id: 5,
      title: 'فرم درخواست مرخصی سازمانی',
      fileName: 'Leave-Request.pdf',
      type: 'PDF',
      category: 'سازمانی',
      owner: 'واحد منابع انسانی',
      tags: ['فرم', 'مرخصی'],
      status: 'archived',
      linkedTo: 'فرآیند مرخصی',
      linkedType: 'فرآیند',
      createdAt: '1404/11/20',
      updatedAt: '1405/01/02',
      expiresAt: '',
      size: '340 KB',
      description: 'نسخه قدیمی فرم درخواست مرخصی؛ برای نگهداری سوابق بایگانی شده است.',
      versions: [
        { version: 1, date: '1404/11/20', author: 'واحد منابع انسانی', size: '340 KB', note: 'نسخه قدیمی' }
      ]
    },
    {
      id: 6,
      title: 'گزارش تحویل تجهیزات شعبه شمال',
      fileName: 'Branch-North-Delivery.pdf',
      type: 'PDF',
      category: 'عملیات',
      owner: 'رضا کریمی',
      tags: ['تحویل', 'تجهیزات', 'شعبه'],
      status: 'rejected',
      linkedTo: 'سفارش خرید PO-1405-041',
      linkedType: 'سفارش خرید',
      createdAt: '1405/09/03',
      updatedAt: '1405/09/09',
      expiresAt: '',
      size: '690 KB',
      description: 'گزارش تحویل تجهیزات که برای اصلاح اطلاعات سریال‌ها برگشت خورده است.',
      versions: [
        { version: 2, date: '1405/09/09', author: 'رضا کریمی', size: '690 KB', note: 'رد شده برای اصلاح سریال‌ها' },
        { version: 1, date: '1405/09/03', author: 'رضا کریمی', size: '640 KB', note: 'نسخه اولیه' }
      ]
    }
  ];

  query = '';
  statusFilter = 'all';
  categoryFilter = 'همه';
  ownerFilter = 'همه';
  selectedDocument: DocumentItem | null = null;
  showModal = false;
  showVersions = false;
  isEditing = false;
  activeCategory = 'همه';

  form: Partial<DocumentItem> = this.emptyForm();

  get filteredDocuments(): DocumentItem[] {
    const q = this.query.trim().toLowerCase();
    return this.documents.filter(doc => {
      const matchesQuery = !q || [
        doc.title, doc.fileName, doc.owner, doc.category, doc.linkedTo, doc.linkedType, ...doc.tags
      ].join(' ').toLowerCase().includes(q);
      const matchesStatus = this.statusFilter === 'all' || doc.status === this.statusFilter;
      const matchesCategory = this.categoryFilter === 'همه' || doc.category === this.categoryFilter;
      const matchesOwner = this.ownerFilter === 'همه' || doc.owner === this.ownerFilter;
      return matchesQuery && matchesStatus && matchesCategory && matchesOwner;
    });
  }

  get owners(): string[] {
    return ['همه', ...Array.from(new Set(this.documents.map(d => d.owner)))];
  }

  get pendingCount(): number {
    return this.documents.filter(d => d.status === 'pending').length;
  }

  get expiringCount(): number {
    return this.documents.filter(d => d.expiresAt === '1405/12/29').length;
  }

  get storageMb(): number {
    return Math.round(this.documents.reduce((sum, d) => sum + this.sizeToMb(d.size), 0) * 10) / 10;
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

  openEdit(doc: DocumentItem) {
    this.isEditing = true;
    this.form = { ...doc, tags: [...doc.tags] };
    this.showModal = true;
  }

  openDetails(doc: DocumentItem) {
    this.selectedDocument = doc;
    this.showVersions = false;
  }

  closeDetails() {
    this.selectedDocument = null;
  }

  saveDocument() {
    const title = (this.form.title || '').trim();
    const fileName = (this.form.fileName || '').trim();
    if (!title || !fileName) return;

    if (this.isEditing && this.form.id) {
      const index = this.documents.findIndex(d => d.id === this.form.id);
      if (index >= 0) {
        const current = this.documents[index];
        this.documents[index] = {
          ...current,
          ...this.form,
          tags: this.normalizeTags(this.form.tags),
          updatedAt: '1405/09/12'
        } as DocumentItem;
      }
    } else {
      const item: DocumentItem = {
        id: Math.max(...this.documents.map(d => d.id), 0) + 1,
        title,
        fileName,
        type: (this.form.type || 'PDF').toUpperCase(),
        category: this.form.category || 'سازمانی',
        owner: this.form.owner || 'مدیر سیستم',
        tags: this.normalizeTags(this.form.tags),
        status: (this.form.status as DocumentStatus) || 'draft',
        linkedTo: this.form.linkedTo || '',
        linkedType: this.form.linkedType || '',
        createdAt: '1405/09/12',
        updatedAt: '1405/09/12',
        expiresAt: this.form.expiresAt || '',
        size: this.form.size || '0 KB',
        description: this.form.description || '',
        versions: [{
          version: 1,
          date: '1405/09/12',
          author: this.form.owner || 'مدیر سیستم',
          size: this.form.size || '0 KB',
          note: 'ایجاد سند'
        }]
      };
      this.documents = [item, ...this.documents];
    }

    this.showModal = false;
  }

  archive(doc: DocumentItem) {
    doc.status = 'archived';
    doc.updatedAt = '1405/09/12';
  }

  restore(doc: DocumentItem) {
    doc.status = 'draft';
    doc.updatedAt = '1405/09/12';
  }

  approve(doc: DocumentItem) {
    doc.status = 'approved';
    doc.updatedAt = '1405/09/12';
  }

  reject(doc: DocumentItem) {
    doc.status = 'rejected';
    doc.updatedAt = '1405/09/12';
  }

  deleteDocument(doc: DocumentItem) {
    this.documents = this.documents.filter(d => d.id !== doc.id);
    if (this.selectedDocument?.id === doc.id) this.closeDetails();
  }

  addVersion(doc: DocumentItem) {
    const nextVersion = Math.max(...doc.versions.map(v => v.version), 0) + 1;
    doc.versions.unshift({
      version: nextVersion,
      date: '1405/09/12',
      author: doc.owner,
      size: doc.size,
      note: 'نسخه جدید'
    });
    doc.updatedAt = '1405/09/12';
    this.selectedDocument = doc;
    this.showVersions = true;
  }

  exportCsv() {
    const headers = ['عنوان', 'نام فایل', 'نوع', 'دسته‌بندی', 'مالک', 'وضعیت', 'ارتباط', 'تاریخ انقضا', 'حجم'];
    const rows = this.filteredDocuments.map(d => [
      d.title, d.fileName, d.type, d.category, d.owner, this.statusLabel(d.status),
      `${d.linkedType}: ${d.linkedTo}`, d.expiresAt, d.size
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashkan-documents.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  statusLabel(status: DocumentStatus): string {
    return this.statuses.find(s => s.value === status)?.label || status;
  }

  statusClass(status: DocumentStatus): string {
    return `status-${status}`;
  }

  typeClass(type: string): string {
    return `file-${type.toLowerCase()}`;
  }

  private emptyForm(): Partial<DocumentItem> {
    return {
      title: '',
      fileName: '',
      type: 'PDF',
      category: 'سازمانی',
      owner: 'مدیر سیستم',
      tags: [],
      status: 'draft',
      linkedTo: '',
      linkedType: '',
      expiresAt: '',
      size: '0 KB',
      description: ''
    };
  }

  updateFormTags(value: string): void {
    this.form.tags = String(value || '').split(',').map(tag => tag.trim()).filter(Boolean);
  }

  private normalizeTags(tags: string[] | undefined): string[] {
    if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
    return String(tags || '').split(',').map(t => t.trim()).filter(Boolean);
  }

  private sizeToMb(size: string): number {
    const n = Number.parseFloat(size);
    if (!Number.isFinite(n)) return 0;
    return size.toUpperCase().includes('GB') ? n * 1024 : size.toUpperCase().includes('MB') ? n : n / 1024;
  }
}
