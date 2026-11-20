import { Component, Input } from '@angular/core';
@Component({ selector: 'ah-empty-state', standalone: true, template: `<div class="ah-empty"><div class="ah-empty__icon" aria-hidden="true">{{ icon }}</div><h3>{{ title }}</h3><p>{{ description }}</p><ng-content /></div>`, styleUrl: './empty-state.scss' })
export class AhEmptyStateComponent { @Input() icon = '◌'; @Input() title = 'موردی پیدا نشد'; @Input() description = 'برای شروع، یک مورد جدید ایجاد کنید.'; }
