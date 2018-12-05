import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { QaComponent } from './qa.component';
import { routing } from './qa.routes';

import { ChartsComponent } from './routes/charts/charts.component';
import { ChartModule, MapModule } from '$libs';
import { MapComponent } from './routes/map/map.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, ChartModule, MapModule],
  declarations: [QaComponent, ChartsComponent, MapComponent],
})
export class QaModule {}
