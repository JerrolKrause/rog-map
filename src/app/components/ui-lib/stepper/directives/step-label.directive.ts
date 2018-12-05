import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[step-label-template]' })
export class StepLabelDirective {
  constructor(public template: TemplateRef<any>) {}
}
