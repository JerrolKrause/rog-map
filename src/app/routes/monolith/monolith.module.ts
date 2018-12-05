import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { SiteModule } from '$site'; // Site modules
import { ContextModule } from '$libs'; // Lazy loaded datagrid

// Store Reducer
import { UIReducer } from '$ui';
import { ApiReducer } from '$api';

// Home component and routing
import { routing } from './monolith.routes';
import { HomeComponent } from './routes/home/home.component';
import { HomeContextMenuComponent } from './routes/home/context-menu/context-menu.component';

import { MonolithApiService } from './shared/stores/api/api.store.service';
import { MonolithApiSelectorsService } from './shared/stores/api/api.selectors.service';

import { MonolithService } from './servies/monolith.service';

@NgModule({
  imports: [CommonModule, SiteModule, routing, ContextModule, StoreModule.forRoot({ api: ApiReducer, ui: UIReducer })],
  declarations: [HomeComponent, HomeContextMenuComponent],
  providers: [MonolithApiService, MonolithApiSelectorsService, MonolithService],
  exports: [],
  entryComponents: [],
})
export class MonolithModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MonolithModule,
      providers: [],
    };
  }
}
