import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from './vendor.module';

import { SharedModule } from '$shared';
import { ComponentsModule } from '$components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    VendorModule,
    // Global components
    ComponentsModule,
    // Global shared
    SharedModule,
  ],
  declarations: [],
  exports: [VendorModule, SharedModule, ComponentsModule],
})
export class SiteModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SiteModule,
      providers: [],
    };
  }
}
