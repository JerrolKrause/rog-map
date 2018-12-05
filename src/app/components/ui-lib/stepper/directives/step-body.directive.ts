import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[step-body-template]' })
export class StepBodyCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
