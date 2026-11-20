import { Component, Input } from '@angular/core';
@Component({ selector: 'ah-card', standalone: true, template: `<section class="ah-card" [class.ah-card--flush]="flush"><ng-content /></section>`, styleUrl: './card.scss' })
export class AhCardComponent { @Input() flush = false; }
