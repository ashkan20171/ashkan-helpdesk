import { Component, Input } from '@angular/core';
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple';
@Component({ selector: 'ah-badge', standalone: true, template: `<span class="ah-badge" [class]="'ah-badge ah-badge--' + tone"><ng-content /></span>`, styleUrl: './badge.scss' })
export class AhBadgeComponent { @Input() tone: BadgeTone = 'neutral'; }
