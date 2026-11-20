import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CalendarDays, CheckCircle2, Clock3, Download, FileText, Plus, Search, UserRound, UsersRound, X } from 'lucide-angular';

type EmployeeStatus = 'active' | 'leave' | 'inactive';
type AttendanceStatus = 'present' | 'late' | 'absent' | 'remote';
type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface Employee {
  id: number;
  code: string;
  name: string;
  department: string;
  position: string;
  manager: string;
  phone: string;
  email: string;
  hireDate: string;
  status: EmployeeStatus;
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  status: AttendanceStatus;
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
}

interface Shift {
  id: number;
  title: string;
  start: string;
  end: string;
  employees: number;
  color: string;
}

interface Mission {
  id: number;
  employeeName: string;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'planned' | 'ongoing' | 'completed';
}

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './hr.html',
  styleUrl: './hr.scss',
})
export class HrComponent {
  readonly icons = {
    calendar: CalendarDays,
    check: CheckCircle2,
    clock: Clock3,
    download: Download,
    file: FileText,
    plus: Plus,
    search: Search,
    user: UserRound,
    users: UsersRound,
    close: X,
  };

  activeTab: 'employees' | 'attendance' | 'leave' | 'shifts' | 'missions' = 'employees';
  searchTerm = '';
  statusFilter = 'all';
  departmentFilter = 'all';
  selectedEmployee: Employee | null = null;
  selectedLeave: LeaveRequest | null = null;
  showEmployeeModal = false;
  showLeaveModal = false;
  editingEmployeeId: number | null = null;

  employeeForm = {
    code: '',
    name: '',
    department: 'فناوری اطلاعات',
    position: '',
    manager: '',
    phone: '',
    email: '',
    hireDate: '',
    status: 'active' as EmployeeStatus,
  };

  leaveForm = {
    employeeId: 0,
    type: 'استحقاقی',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    status: 'pending' as LeaveStatus,
  };

  employees: Employee[] = [
    { id: 1, code: 'EMP-1001', name: 'علی رضایی', department: 'فناوری اطلاعات', position: 'کارشناس ارشد شبکه', manager: 'مهدی احمدی', phone: '09120000001', email: 'ali@ashkan.local', hireDate: '2023-02-15', status: 'active' },
    { id: 2, code: 'EMP-1002', name: 'سارا محمدی', department: 'منابع انسانی', position: 'کارشناس منابع انسانی', manager: 'نگار کریمی', phone: '09120000002', email: 'sara@ashkan.local', hireDate: '2022-08-10', status: 'active' },
    { id: 3, code: 'EMP-1003', name: 'رضا کریمی', department: 'مالی', position: 'حسابدار', manager: 'نگار کریمی', phone: '09120000003', email: 'reza@ashkan.local', hireDate: '2024-01-20', status: 'leave' },
    { id: 4, code: 'EMP-1004', name: 'مینا حسینی', department: 'پشتیبانی', position: 'کارشناس هلپ‌دسک', manager: 'علی رضایی', phone: '09120000004', email: 'mina@ashkan.local', hireDate: '2024-04-05', status: 'active' },
    { id: 5, code: 'EMP-1005', name: 'امیر نادری', department: 'فروش', position: 'کارشناس فروش', manager: 'محمد اکبری', phone: '09120000005', email: 'amir@ashkan.local', hireDate: '2021-11-12', status: 'active' },
  ];

  attendance: AttendanceRecord[] = [
    { id: 1, employeeId: 1, employeeName: 'علی رضایی', date: '2026-11-19', checkIn: '08:04', checkOut: '16:18', hours: 8.2, status: 'present' },
    { id: 2, employeeId: 2, employeeName: 'سارا محمدی', date: '2026-11-19', checkIn: '08:31', checkOut: '16:05', hours: 7.6, status: 'late' },
    { id: 3, employeeId: 3, employeeName: 'رضا کریمی', date: '2026-11-19', checkIn: '-', checkOut: '-', hours: 0, status: 'absent' },
    { id: 4, employeeId: 4, employeeName: 'مینا حسینی', date: '2026-11-19', checkIn: '08:12', checkOut: '-', hours: 4.1, status: 'remote' },
  ];

  leaves: LeaveRequest[] = [
    { id: 1, employeeId: 2, employeeName: 'سارا محمدی', type: 'استحقاقی', startDate: '2026-11-24', endDate: '2026-11-26', days: 3, status: 'pending', reason: 'امور شخصی' },
    { id: 2, employeeId: 1, employeeName: 'علی رضایی', type: 'استحقاقی', startDate: '2026-12-02', endDate: '2026-12-03', days: 2, status: 'approved', reason: 'سفر خانوادگی' },
    { id: 3, employeeId: 4, employeeName: 'مینا حسینی', type: 'ساعتی', startDate: '2026-11-20', endDate: '2026-11-20', days: 0.5, status: 'approved', reason: 'قرار پزشکی' },
  ];

  shifts: Shift[] = [
    { id: 1, title: 'شیفت صبح', start: '07:30', end: '15:30', employees: 18, color: 'teal' },
    { id: 2, title: 'شیفت عصر', start: '15:30', end: '23:30', employees: 9, color: 'indigo' },
    { id: 3, title: 'شیفت پشتیبانی شب', start: '23:30', end: '07:30', employees: 4, color: 'amber' },
  ];

  missions: Mission[] = [
    { id: 1, employeeName: 'علی رضایی', destination: 'اصفهان', startDate: '2026-11-22', endDate: '2026-11-24', purpose: 'راه‌اندازی زیرساخت شعبه', status: 'planned' },
    { id: 2, employeeName: 'امیر نادری', destination: 'تبریز', startDate: '2026-11-15', endDate: '2026-11-18', purpose: 'جلسه با مشتری سازمانی', status: 'completed' },
  ];

  get departments() {
    return [...new Set(this.employees.map(e => e.department))];
  }

  get activeEmployees() {
    return this.employees.filter(e => e.status === 'active').length;
  }

  get pendingLeaves() {
    return this.leaves.filter(l => l.status === 'pending').length;
  }

  get presentToday() {
    return this.attendance.filter(a => a.status === 'present' || a.status === 'remote' || a.status === 'late').length;
  }

  get filteredEmployees() {
    const q = this.searchTerm.trim().toLowerCase();
    return this.employees.filter(e => {
      const matchesSearch = !q || [e.name, e.code, e.position, e.email].some(v => v.toLowerCase().includes(q));
      const matchesStatus = this.statusFilter === 'all' || e.status === this.statusFilter;
      const matchesDepartment = this.departmentFilter === 'all' || e.department === this.departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }

  openEmployee(employee?: Employee) {
    this.editingEmployeeId = employee?.id ?? null;
    this.employeeForm = employee
      ? { code: employee.code, name: employee.name, department: employee.department, position: employee.position, manager: employee.manager, phone: employee.phone, email: employee.email, hireDate: employee.hireDate, status: employee.status }
      : { code: `EMP-${1000 + this.employees.length + 1}`, name: '', department: 'فناوری اطلاعات', position: '', manager: '', phone: '', email: '', hireDate: new Date().toISOString().slice(0, 10), status: 'active' };
    this.showEmployeeModal = true;
  }

  saveEmployee() {
    if (!this.employeeForm.name.trim() || !this.employeeForm.position.trim()) return;
    if (this.editingEmployeeId) {
      const index = this.employees.findIndex(e => e.id === this.editingEmployeeId);
      if (index >= 0) this.employees[index] = { ...this.employees[index], ...this.employeeForm };
    } else {
      this.employees.unshift({ id: Date.now(), ...this.employeeForm });
    }
    this.showEmployeeModal = false;
  }

  openLeave(leave?: LeaveRequest) {
    this.selectedLeave = leave ?? null;
    this.leaveForm = leave
      ? { employeeId: leave.employeeId, type: leave.type, startDate: leave.startDate, endDate: leave.endDate, days: leave.days, reason: leave.reason, status: leave.status }
      : { employeeId: this.employees[0]?.id ?? 0, type: 'استحقاقی', startDate: '', endDate: '', days: 1, reason: '', status: 'pending' };
    this.showLeaveModal = true;
  }

  saveLeave() {
    const employee = this.employees.find(e => e.id === Number(this.leaveForm.employeeId));
    if (!employee || !this.leaveForm.startDate) return;
    if (this.selectedLeave) {
      const index = this.leaves.findIndex(l => l.id === this.selectedLeave?.id);
      if (index >= 0) this.leaves[index] = { ...this.leaves[index], ...this.leaveForm, employeeName: employee.name };
    } else {
      this.leaves.unshift({ id: Date.now(), ...this.leaveForm, employeeId: employee.id, employeeName: employee.name });
    }
    this.showLeaveModal = false;
  }

  setLeaveStatus(leave: LeaveRequest, status: LeaveStatus) {
    leave.status = status;
  }

  exportCsv() {
    const rows = this.filteredEmployees.map(e => [e.code, e.name, e.department, e.position, e.manager, e.phone, e.email, e.hireDate, e.status]);
    const csv = [['کد پرسنلی','نام','دپارتمان','سمت','مدیر','تلفن','ایمیل','تاریخ استخدام','وضعیت'], ...rows]
      .map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashkan-hr-employees.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  employeeName(id: number) {
    return this.employees.find(e => e.id === id)?.name ?? '---';
  }
}
