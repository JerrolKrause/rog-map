import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

interface Statuses {
  [key: string]: boolean;
}

/**
 * A component abstraction for mat-form-field. Adds better design and validation states
 * USAGE: <app-form-field [formGroup]="formAgent" controlName="address" placeholder="Address"></app-form-field>
 */
@AutoUnsubscribe()
@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements OnInit, OnDestroy {
  /** Formgroup reference */
  @Input() formGroup: FormGroup;
  /** The formControlName of this field */
  @Input() controlName: string;
  /** Placeholder text */
  @Input() placeholder: string;
  /** Is this field required */
  public required = false;
  /** Does this field have a validation error? */
  public hasError = false;
  /** Display properties for the status of this form control, IE valid, touched, disabled, etc */
  public status: Statuses = {};

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    // Make sure a valid form group and that a valid control was passed
    if (this.formGroup && this.formGroup.controls[this.controlName]) {
      // Determine if field is required or not
      // Angular doesn't have an easier way to determine this
      if (
        this.formGroup.controls[this.controlName].validator &&
        this.formGroup.controls[this.controlName].validator(this.formGroup.controls[this.controlName]) &&
        this.formGroup.controls[this.controlName].validator(this.formGroup.controls[this.controlName]).required
      ) {
        this.required = true;
      }
    }
    // When this form control value changes, update the status
    this.formGroup.controls[this.controlName].valueChanges.subscribe(val => this.statusUpdate(val));
  }

  /**
   * Auto generate a list of easily consumable statuses about this form field, IE pristine, touched, valid, etc
   */
  public statusUpdate(val: string) {
    const status: Statuses = {};
    // Loop through all the props on this form control
    for (const key in this.formGroup.controls[this.controlName]) {
      if (typeof (<any>this).formGroup.controls[this.controlName][key] === 'boolean') {
        status[key] = (<any>this).formGroup.controls[this.controlName][key];
      }
    }
    // Determine if this field has a value
    if (val && val !== '') {
      status.hasValue = true;
    } else {
      status.hasValue = false;
    }

    this.status = status;
    this.ref.markForCheck(); // Fire change detection
  }

  ngOnDestroy() {}
}
