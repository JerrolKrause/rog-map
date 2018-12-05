import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../../vendor.module';
import { SharedModule } from '$shared';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { StepperComponent } from './stepper/stepper.component';
import { StepDirective } from './stepper/directives/step.directive';
import { StepBodyCellDirective } from './stepper/directives/step-body.directive';
import { StepLabelDirective } from './stepper/directives/step-label.directive';

const Components = [
  AutocompleteComponent,
  FormFieldComponent,
  StepperComponent,
  StepDirective,
  StepBodyCellDirective,
  StepLabelDirective,
];

/**
 * UI library abstractions, in this case for materials design
 */
@NgModule({
  imports: [CommonModule, VendorModule, SharedModule],
  declarations: [...Components],
  exports: [...Components],
})
export class UILibModule {}
