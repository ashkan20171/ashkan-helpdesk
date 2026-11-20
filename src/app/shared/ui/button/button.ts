import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ah-button',
  standalone: true,
  template: `
    <button class="ah-button" [class]="'ah-button ah-button--' + variant + ' ah-button--' + size"
      [disabled]="disabled || loading" [attr.type]="type" [attr.aria-busy]="loading">
      @if (loading) { <span class="ah-spinner" aria-hidden="true"></span> }
      @else if (icon) { <span class="ah-button__icon" aria-hidden="true">{{ icon }}</span> }
      <ng-content />
    </button>
  `,
  styleUrl: './button.scss'
})
export class AhButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() loading = false;
}
