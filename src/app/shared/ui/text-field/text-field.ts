import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({ selector: 'ah-text-field', standalone: true, imports: [FormsModule], template: `
  <label class="ah-field" [class.ah-field--invalid]="invalid">
    @if (label) { <span class="ah-field__label">{{ label }} @if (required) { <b aria-hidden="true">*</b> }</span> }
    <span class="ah-field__control"><ng-content select="[prefix]"/><input [type]="type" [placeholder]="placeholder" [disabled]="disabled" [required]="required" [attr.aria-invalid]="invalid" [attr.aria-describedby]="hint ? fieldId : null" [(ngModel)]="value"/><ng-content select="[suffix]"/></span>
    @if (hint) { <small class="ah-field__hint" [id]="fieldId">{{ hint }}</small> }
    @if (invalid && error) { <small class="ah-field__error">{{ error }}</small> }
  </label>
`, styleUrl: './text-field.scss' })
export class AhTextFieldComponent {
  @Input() label = ''; @Input() placeholder = ''; @Input() type = 'text'; @Input() hint = ''; @Input() error = '';
  @Input() required = false; @Input() disabled = false; @Input() invalid = false;
  @Input() value = ''; @Input() fieldId = 'ah-field-hint';
}
