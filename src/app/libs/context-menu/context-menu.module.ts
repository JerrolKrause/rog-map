import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from 'ngx-contextmenu';

import { ContextService } from './context-menu.service';

@NgModule({
  imports: [CommonModule, ContextMenuModule.forRoot()],
  declarations: [],
  providers: [ContextService],
  exports: [ContextMenuModule],
})
export class ContextModule {}
