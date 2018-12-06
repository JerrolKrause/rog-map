import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatButtonToggleModule
} from '@angular/material';

const modules = [
  // Angular Materials
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatButtonToggleModule
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...modules,
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule, // NgbModule,
    ...modules,
  ],
  declarations: [],
})
export class VendorModule {}
