import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

/**
 * Autocomplete extension for angular materials. Automatically handles the filtering and emits selected values
 * EXAMPLE: For a string array, returns string value
    <app-autocomplete [terms]="terms" placeholder="Select a user..." (optionSelected)="optionSelected($event)"></app-autocomplete>
 * EXAMPLE: For an object array, autocomplete returns the entire selected object
    <app-autocomplete [terms]="terms" placeholder="Select a user..." termLabel="name" 
    (optionSelected)="optionSelected($event)"></app-autocomplete>
* EXAMPLE: For an object array, autocomplete returns the selected property value instead of the entire object
    <app-autocomplete [terms]="terms" placeholder="Select a user..." termLabel="name" termValue="name" 
    (optionSelected)="optionSelected($event)"></app-autocomplete>
* EXAMPLE: For use with a reactive form. Returns the selected value name as the property name in the form
    <app-autocomplete [terms]="terms" placeholder="Select a user..." termLabel="name" termValue="name" 
    [formControlRef]="form.controls.name"></app-autocomplete>
 */
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  /** Available autocomplete terms */
  @Input() terms: any[] = [];
  /** Default placeholder text */
  @Input() placeholder = '';
  /** The property of the LABEL in the term object. Used to display the human readable text */
  @Input() termLabel: string;
  /** The property of the VALUE in the term object. Used to determine which value to return instead of the whole object */
  @Input() termValue: string;
  /** If autocomplete is part of a form group, pass the form control reference */
  @Input() formControlRef: FormControl;
  /** The term that was selected from the autocomplete */

  @Output() optionSelected = new EventEmitter<any>();

  /** Internal form control used for input */
  public autoCompleteControl = new FormControl();
  /** Holds filtered list of terms */
  public filteredOptions: Observable<string[]>;
  /** Term that was selected from the autocomplete */
  public selectedTerm: string;

  constructor() {}

  ngOnInit() {
    // Set up filtering as a user types
    this.filteredOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value[this.termLabel])),
      map(value => this._filter(value)),
    );
  }

  /**
   * Determine which display label to use
   * @param option
   */
  public labelDisplay(option: any) {
    return this.termLabel && option ? option[this.termLabel] : option;
  }

  /**
   * Filter visible list of options
   * @param value - Filter term
   */
  private _filter(value: string | any): string[] {
    const filterValue = value.toLowerCase();
    return this.terms.filter(option => {
      const optionNew = this.termLabel && option ? option[this.termLabel] : option;
      return optionNew.toLowerCase().includes(filterValue);
    });
  }

  /**
   * When an option was selected from the autocomplete
   * @param event
   */
  public selectedOption(event: MatAutocompleteSelectedEvent) {
    const value = this.termValue ? event.option.value[this.termValue] : event.option.value;
    this.selectedTerm = value;
    this.optionSelected.emit(value);
    if (this.formControlRef) {
      this.formControlRef.patchValue(value);
    }
  }

  /**
   * Clear selecter/filtered term
   */
  public clearSelected() {
    this.autoCompleteControl.patchValue('');
    // Only update/emit values if a term was selected
    if (this.selectedTerm !== null && this.selectedTerm !== undefined) {
      this.optionSelected.emit(null);
      if (this.formControlRef) {
        this.formControlRef.patchValue(null);
      }
      this.selectedTerm = null;
    }
  }
}
