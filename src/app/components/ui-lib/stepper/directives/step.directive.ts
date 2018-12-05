import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { StepBodyCellDirective } from './step-body.directive';
import { StepLabelDirective } from './step-label.directive';

@Directive({ selector: 'step' })
export class StepDirective {
  @Input() name: string;
  @Input() field: string;
  // Add custom props here for overrides in the cell templates

  // Cell Templates
  @Input()
  @ContentChild(StepBodyCellDirective, { read: TemplateRef })
  body: TemplateRef<any>;

  // Header Templates
  @Input()
  @ContentChild(StepLabelDirective, { read: TemplateRef })
  label: TemplateRef<any>;
}
