import { CustomerSuccessAutomationComponent } from './features/customer-success-automation/customer-success-automation';
import { CustomerSuccessComponent } from './features/customer-success/customer-success';
import { EntitlementManagementComponent } from './features/entitlement-management/entitlement-management';
import { SubscriptionBillingComponent } from './features/subscription-billing/subscription-billing';
import { AutomationComponent } from './features/automation/automation';
import { BillingComponent } from './features/billing/billing';
import { TenantsComponent } from './features/tenants/tenants';
import { PortalComponent } from './features/portal/portal';
import { ApiManagementComponent } from './features/api-management/api-management';
import { AuditLogComponent } from './features/audit-log/audit-log';
import { SettingsComponent } from './features/settings/settings';
import { ReportsComponent } from './features/reports/reports';
import { NotificationsComponent } from './features/notifications/notifications';
import { SurveysComponent } from './features/surveys/surveys';
import { DocumentsComponent } from './features/documents/documents';
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TicketsComponent } from './features/tickets/tickets';
import { DesignSystemComponent } from './features/design-system/design-system';
import { AuthComponent } from './features/auth/auth';
import { UsersComponent } from './features/users/users';
import { OrganizationComponent } from './features/organization/organization';
import { ServiceRequestsComponent } from './features/service-requests/service-requests';
import { SlaComponent } from './features/sla/sla';
import { WorkflowsComponent } from './features/workflows/workflows';
import { KnowledgeBaseComponent } from './features/knowledge-base/knowledge-base';
import { AssetsComponent } from './features/assets/assets';
import { ContractsComponent } from './features/contracts/contracts';
import { ProcurementComponent } from './features/procurement/procurement';
import { InventoryComponent } from './features/inventory/inventory';
import { MaintenanceComponent } from './features/maintenance/maintenance';
import { HrComponent } from './features/hr/hr';
import { PayrollComponent } from './features/payroll/payroll';
import { FinanceComponent } from './features/finance/finance';
import { OmnichannelComponent } from './features/omnichannel/omnichannel';
import { UserManagementComponent } from './features/user-management/user-management';
import { authGuard } from './features/auth/auth.guard';
import { GlobalSearchComponent } from './features/global-search/global-search';
import { ApprovalCenterComponent } from './features/approval-center/approval-center';
import { WorkforcePlanningComponent } from './features/workforce-planning/workforce-planning';
import { ProfileAccessComponent } from './features/profile-access/profile-access';
import { OrganizationAccessComponent } from './features/organization-access/organization-access';

import { TenantManagementComponent } from './features/tenant-management/tenant-management';
import { CopilotComponent } from './features/copilot/copilot';
import { AiKnowledgeComponent } from './features/ai-knowledge/ai-knowledge';
import { AiObservabilityComponent } from './features/ai-observability/ai-observability';

const rawRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: AuthComponent, data: { mode: 'login' }, title: 'ورود | Ashkan HelpDesk' },
  { path: 'auth/register', component: AuthComponent, data: { mode: 'register' }, title: 'ثبت‌نام | Ashkan HelpDesk' },
  { path: 'auth/forgot-password', component: AuthComponent, data: { mode: 'forgot' }, title: 'بازیابی رمز عبور | Ashkan HelpDesk' },
  { path: 'auth/reset-password', component: AuthComponent, data: { mode: 'reset' }, title: 'تغییر رمز عبور | Ashkan HelpDesk' },
  { path: 'auth/invite/:token', component: AuthComponent, data: { mode: 'invite' }, title: 'پذیرش دعوت‌نامه | Ashkan HelpDesk' },
  { path: 'automation', component: AutomationComponent, title: 'موتور قوانین و اتوماسیون | Ashkan HelpDesk' },
  { path: 'omnichannel', component: OmnichannelComponent, canActivate: [authGuard], title: 'مدیریت پیشرفته تیکت و Omnichannel | Ashkan HelpDesk' },
  { path: 'user-management', component: UserManagementComponent, canActivate: [authGuard], data: { permission: 'users.manage' }, title: 'کاربران، نقش‌ها و دسترسی‌ها | Ashkan HelpDesk' },
  { path: 'billing', component: BillingComponent, data: { permission: 'billing.view' }, title: 'اشتراک‌ها و صورتحساب‌ها | Ashkan HelpDesk' },
  { path: 'tenants', component: TenantsComponent, title: 'مدیریت سازمان‌ها | Ashkan HelpDesk' },
  { path: 'portal', component: PortalComponent, data: { permission: 'portal.use' }, title: 'پورتال خدمات کاربران | Ashkan HelpDesk' },
  { path: 'dashboard', component: DashboardComponent, data: { permission: 'dashboard.view' }, title: 'داشبورد | Ashkan HelpDesk' },
  { path: 'profile-access', component: ProfileAccessComponent, data: { permission: 'profile.manage' }, title: 'پروفایل و مرکز دسترسی | Ashkan HelpDesk' },
  { path: 'tenant-management', component: TenantManagementComponent, data: { permission: 'settings.manage' }, title: 'مدیریت سازمان‌ها و Tenantها | Ashkan HelpDesk' },
  { path: 'subscription-billing', component: SubscriptionBillingComponent, data: { permission: 'settings.manage' }, title: 'اشتراک و صورتحساب | Ashkan HelpDesk' },
  { path: 'entitlements', component: EntitlementManagementComponent, data: { permission: 'settings.manage' }, title: 'مرکز قابلیت‌ها و سهمیه‌ها | Ashkan HelpDesk' },
  { path: 'customer-success', component: CustomerSuccessComponent, data: { permission: 'settings.manage' }, title: 'Customer Success | Ashkan HelpDesk' },
  { path: 'customer-success-automation', component: CustomerSuccessAutomationComponent, data: { permission: 'settings.manage' }, title: 'Customer Success Automation | Ashkan HelpDesk' },
  { path: 'copilot', component: CopilotComponent, canActivate: [authGuard], title: 'Ashkan Copilot | Intelligent HelpDesk Assistant' },
  { path: 'ai-knowledge', component: AiKnowledgeComponent, canActivate: [authGuard], data: { permission: 'settings.manage' }, title: 'AI Knowledge & RAG Intelligence | Ashkan HelpDesk' },
  { path: 'ai-observability', component: AiObservabilityComponent, canActivate: [authGuard], data: { permission: 'settings.manage' }, title: 'AI Observability & Evaluation | Ashkan HelpDesk' },
  { path: 'organization-access', component: OrganizationAccessComponent, data: { permission: 'organization.members.manage' }, title: 'مدیریت سازمان و عضویت‌ها | Ashkan HelpDesk' },
  { path: 'search', component: GlobalSearchComponent, canActivate: [authGuard], title: 'جستجوی سراسری | Ashkan HelpDesk' },
  { path: 'approvals', component: ApprovalCenterComponent, canActivate: [authGuard], title: 'مرکز Workflow و تأییدیه‌ها | Ashkan HelpDesk' },
  { path: 'tickets', component: TicketsComponent, data: { permission: 'tickets.view' }, title: 'مدیریت تیکت‌ها | Ashkan HelpDesk' },
  { path: 'requests', component: ServiceRequestsComponent, data: { permission: 'tickets.create' }, title: 'درخواست‌های خدمات | Ashkan HelpDesk' },
  { path: 'users', component: UsersComponent, data: { permission: 'users.view' }, title: 'کاربران و دسترسی‌ها | Ashkan HelpDesk' },
  { path: 'organization', component: OrganizationComponent, title: 'تیم‌ها و دپارتمان‌ها | Ashkan HelpDesk' },
  { path: 'sla', component: SlaComponent, title: 'مدیریت SLA | Ashkan HelpDesk' },
  { path: 'workflows', component: WorkflowsComponent, title: 'موتور گردش کار | Ashkan HelpDesk' },
  { path: 'knowledge', component: KnowledgeBaseComponent, data: { permission: 'knowledge.manage' }, title: 'پایگاه دانش | Ashkan HelpDesk' },
  { path: 'assets', component: AssetsComponent, title: 'مدیریت دارایی‌ها | Ashkan HelpDesk' },
  { path: 'contracts', component: ContractsComponent, title: 'قراردادها و تأمین‌کنندگان | Ashkan HelpDesk' },
  { path: 'documents', component: DocumentsComponent },
  { path: 'knowledge-base', component: KnowledgeBaseComponent },
  { path: 'surveys', component: SurveysComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'procurement', component: ProcurementComponent, title: 'مدیریت خرید و سفارشات | Ashkan HelpDesk' },
  { path: 'inventory', component: InventoryComponent, title: 'مدیریت انبار و موجودی | Ashkan HelpDesk' },
  { path: 'maintenance', component: MaintenanceComponent, title: 'مدیریت تعمیرات و نگهداری | Ashkan HelpDesk' },
  { path: 'hr', component: HrComponent, title: 'مدیریت منابع انسانی | Ashkan HelpDesk' },
  { path: 'payroll', component: PayrollComponent, title: 'حقوق و دستمزد | Ashkan HelpDesk' },
  { path: 'finance', component: FinanceComponent, title: 'مدیریت مالی و هزینه‌ها | Ashkan HelpDesk' },
  { path: 'reports', component: ReportsComponent, data: { permission: 'reports.view' }, title: 'گزارش‌گیری و تحلیل | Ashkan HelpDesk' },
  { path: 'api-management', component: ApiManagementComponent, title: 'مدیریت API و یکپارچه‌سازی‌ها | Ashkan HelpDesk' },
  { path: 'audit-log', component: AuditLogComponent, data: { permission: 'audit.view' }, title: 'ثبت رویدادها و ممیزی | Ashkan HelpDesk' },
  { path: 'settings', component: SettingsComponent, data: { permission: 'settings.manage' }, title: 'تنظیمات سامانه | Ashkan HelpDesk' },
  { path: 'design-system', component: DesignSystemComponent, title: 'Design System | Ashkan HelpDesk' },
  { path: 'workforce-planning', component: WorkforcePlanningComponent, canActivate: [authGuard], data: { permission: 'workforce.plan' }, title: 'برنامه‌ریزی ظرفیت نیروی انسانی | Ashkan HelpDesk' },

  { path: '**', redirectTo: 'dashboard' }
];

export const routes: Routes = rawRoutes.map(route => {
  // Angular does not allow redirect routes to have activation guards.
  // Keep redirects untouched and apply the default auth guard only to
  // navigable component routes that do not already define their guards.
  if (route.redirectTo) return route;

  const publicPath = typeof route.path === 'string' && route.path.startsWith('auth/');
  if (publicPath) return route;

  const guards = route.canActivate ?? [];
  return { ...route, canActivate: guards.length ? guards : [authGuard] };
});
