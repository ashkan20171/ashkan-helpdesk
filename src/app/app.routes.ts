import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth';
import { authGuard } from './features/auth/auth.guard';
import { AiAuditComponent } from './features/ai-audit/ai-audit';
import { AiBillingComponent } from './features/ai-billing/ai-billing';
import { AiExecutiveComponent } from './features/ai-executive/ai-executive';
import { AiFinanceComponent } from './features/ai-finance/ai-finance';
import { AiFinopsComponent } from './features/ai-finops/ai-finops';
import { AiForecastingComponent } from './features/ai-forecasting/ai-forecasting';
import { AiGovernanceComponent } from './features/ai-governance/ai-governance';
import { AiIncidentsComponent } from './features/ai-incidents/ai-incidents';
import { AiKnowledgeComponent } from './features/ai-knowledge/ai-knowledge';
import { AiObservabilityComponent } from './features/ai-observability/ai-observability';
import { AiSecurityComponent } from './features/ai-security/ai-security';
import { AiSimulationComponent } from './features/ai-simulation/ai-simulation';
import { AiTrustComponent } from './features/ai-trust/ai-trust';
import { ApiManagementComponent } from './features/api-management/api-management';
import { ApprovalCenterComponent } from './features/approval-center/approval-center';
import { AssetLifecycleComponent } from './features/asset-lifecycle/asset-lifecycle';
import { AssetMaintenanceComponent } from './features/asset-maintenance/asset-maintenance';
import { AssetsComponent } from './features/assets/assets';
import { AuditLogComponent } from './features/audit-log/audit-log';
import { AutomationComponent } from './features/automation/automation';
import { BillingComponent } from './features/billing/billing';
import { ContractsComponent } from './features/contracts/contracts';
import { CopilotComponent } from './features/copilot/copilot';
import { CustomerSuccessComponent } from './features/customer-success/customer-success';
import { CustomerSuccessAutomationComponent } from './features/customer-success-automation/customer-success-automation';
import { DashboardComponent } from './features/dashboard/dashboard';
import { DesignSystemComponent } from './features/design-system/design-system';
import { DocumentsComponent } from './features/documents/documents';
import { EntitlementManagementComponent } from './features/entitlement-management/entitlement-management';
import { FacilitiesWorkplaceComponent } from './features/facilities-workplace/facilities-workplace';
import { FinanceComponent } from './features/finance/finance';
import { GlobalSearchComponent } from './features/global-search/global-search';
import { HrComponent } from './features/hr/hr';
import { InventoryComponent } from './features/inventory/inventory';
import { KnowledgeBaseComponent } from './features/knowledge-base/knowledge-base';
import { MaintenanceComponent } from './features/maintenance/maintenance';
import { MeetingRoomBookingComponent } from './features/meeting-room-booking/meeting-room-booking';
import { NotificationsComponent } from './features/notifications/notifications';
import { OmnichannelComponent } from './features/omnichannel/omnichannel';
import { OrganizationComponent } from './features/organization/organization';
import { OrganizationAccessComponent } from './features/organization-access/organization-access';
import { PayrollComponent } from './features/payroll/payroll';
import { PhysicalAccessSecurityComponent } from './features/physical-access-security/physical-access-security';
import { PortalComponent } from './features/portal/portal';
import { ProcurementComponent } from './features/procurement/procurement';
import { ProfileAccessComponent } from './features/profile-access/profile-access';
import { ReportsComponent } from './features/reports/reports';
import { ResourceEquipmentBookingComponent } from './features/resource-equipment-booking/resource-equipment-booking';
import { ServiceCatalogComponent } from './features/service-catalog/service-catalog';
import { ServiceRequestsComponent } from './features/service-requests/service-requests';
import { SettingsComponent } from './features/settings/settings';
import { SlaComponent } from './features/sla/sla';
import { SubscriptionBillingComponent } from './features/subscription-billing/subscription-billing';
import { SurveysComponent } from './features/surveys/surveys';
import { TeamSeatingNeighborhoodComponent } from './features/team-seating-neighborhood/team-seating-neighborhood';
import { TenantManagementComponent } from './features/tenant-management/tenant-management';
import { TenantsComponent } from './features/tenants/tenants';
import { TicketsComponent } from './features/tickets/tickets';
import { UserManagementComponent } from './features/user-management/user-management';
import { UsersComponent } from './features/users/users';
import { VisitorReceptionComponent } from './features/visitor-reception/visitor-reception';
import { WorkflowsComponent } from './features/workflows/workflows';
import { WorkforceInsightsComponent } from './features/workforce-insights/workforce-insights';
import { WorkforcePlanningComponent } from './features/workforce-planning/workforce-planning';
import { WorkplaceAttendanceComponent } from './features/workplace-attendance/workplace-attendance';
import { WorkplaceDeskManagementComponent } from './features/workplace-desk-management/workplace-desk-management';
import { WorkplacePolicyReservationComponent } from './features/workplace-policy-reservation/workplace-policy-reservation';
import { WorkspaceCapacityOccupancyComponent } from './features/workspace-capacity-occupancy/workspace-capacity-occupancy';

export const routes: Routes = [
  { path: 'auth/login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'auth/register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'auth/forgot', component: AuthComponent, data: { mode: 'forgot' } },
  { path: 'auth/reset', component: AuthComponent, data: { mode: 'reset' } },
  { path: 'auth/invite', component: AuthComponent, data: { mode: 'invite' } },
  { path: 'ai-audit', component: AiAuditComponent, canActivate: [authGuard] },
  { path: 'ai-billing', component: AiBillingComponent, canActivate: [authGuard] },
  { path: 'ai-executive', component: AiExecutiveComponent, canActivate: [authGuard] },
  { path: 'ai-finance', component: AiFinanceComponent, canActivate: [authGuard] },
  { path: 'ai-finops', component: AiFinopsComponent, canActivate: [authGuard] },
  { path: 'ai-forecasting', component: AiForecastingComponent, canActivate: [authGuard] },
  { path: 'ai-governance', component: AiGovernanceComponent, canActivate: [authGuard] },
  { path: 'ai-incidents', component: AiIncidentsComponent, canActivate: [authGuard] },
  { path: 'ai-knowledge', component: AiKnowledgeComponent, canActivate: [authGuard] },
  { path: 'ai-observability', component: AiObservabilityComponent, canActivate: [authGuard] },
  { path: 'ai-security', component: AiSecurityComponent, canActivate: [authGuard] },
  { path: 'ai-simulation', component: AiSimulationComponent, canActivate: [authGuard] },
  { path: 'ai-trust', component: AiTrustComponent, canActivate: [authGuard] },
  { path: 'api-management', component: ApiManagementComponent, canActivate: [authGuard] },
  { path: 'approval-center', component: ApprovalCenterComponent, canActivate: [authGuard] },
  { path: 'asset-lifecycle', component: AssetLifecycleComponent, canActivate: [authGuard] },
  { path: 'asset-maintenance', component: AssetMaintenanceComponent, canActivate: [authGuard] },
  { path: 'assets', component: AssetsComponent, canActivate: [authGuard] },
  { path: 'audit-log', component: AuditLogComponent, canActivate: [authGuard] },
  { path: 'automation', component: AutomationComponent, canActivate: [authGuard] },
  { path: 'billing', component: BillingComponent, canActivate: [authGuard] },
  { path: 'contracts', component: ContractsComponent, canActivate: [authGuard] },
  { path: 'copilot', component: CopilotComponent, canActivate: [authGuard] },
  { path: 'customer-success', component: CustomerSuccessComponent, canActivate: [authGuard] },
  { path: 'customer-success-automation', component: CustomerSuccessAutomationComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'design-system', component: DesignSystemComponent, canActivate: [authGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [authGuard] },
  { path: 'entitlement-management', component: EntitlementManagementComponent, canActivate: [authGuard] },
  { path: 'facilities-workplace', component: FacilitiesWorkplaceComponent, canActivate: [authGuard] },
  { path: 'finance', component: FinanceComponent, canActivate: [authGuard] },
  { path: 'global-search', component: GlobalSearchComponent, canActivate: [authGuard] },
  { path: 'hr', component: HrComponent, canActivate: [authGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: 'knowledge-base', component: KnowledgeBaseComponent, canActivate: [authGuard] },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [authGuard] },
  { path: 'meeting-room-booking', component: MeetingRoomBookingComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: 'omnichannel', component: OmnichannelComponent, canActivate: [authGuard] },
  { path: 'organization', component: OrganizationComponent, canActivate: [authGuard] },
  { path: 'organization-access', component: OrganizationAccessComponent, canActivate: [authGuard] },
  { path: 'payroll', component: PayrollComponent, canActivate: [authGuard] },
  { path: 'physical-access-security', component: PhysicalAccessSecurityComponent, canActivate: [authGuard] },
  { path: 'portal', component: PortalComponent, canActivate: [authGuard] },
  { path: 'procurement', component: ProcurementComponent, canActivate: [authGuard] },
  { path: 'profile-access', component: ProfileAccessComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: 'resource-equipment-booking', component: ResourceEquipmentBookingComponent, canActivate: [authGuard] },
  { path: 'service-catalog', component: ServiceCatalogComponent, canActivate: [authGuard] },
  { path: 'service-requests', component: ServiceRequestsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'sla', component: SlaComponent, canActivate: [authGuard] },
  { path: 'subscription-billing', component: SubscriptionBillingComponent, canActivate: [authGuard] },
  { path: 'surveys', component: SurveysComponent, canActivate: [authGuard] },
  { path: 'team-seating-neighborhood', component: TeamSeatingNeighborhoodComponent, canActivate: [authGuard] },
  { path: 'tenant-management', component: TenantManagementComponent, canActivate: [authGuard] },
  { path: 'tenants', component: TenantsComponent, canActivate: [authGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [authGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'visitor-reception', component: VisitorReceptionComponent, canActivate: [authGuard] },
  { path: 'workflows', component: WorkflowsComponent, canActivate: [authGuard] },
  { path: 'workforce-insights', component: WorkforceInsightsComponent, canActivate: [authGuard] },
  { path: 'workforce-planning', component: WorkforcePlanningComponent, canActivate: [authGuard] },
  { path: 'workplace-attendance', component: WorkplaceAttendanceComponent, canActivate: [authGuard] },
  { path: 'workplace-desk-management', component: WorkplaceDeskManagementComponent, canActivate: [authGuard] },
  { path: 'workplace-policy-reservation', component: WorkplacePolicyReservationComponent, canActivate: [authGuard] },
  { path: 'workspace-capacity-occupancy', component: WorkspaceCapacityOccupancyComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
