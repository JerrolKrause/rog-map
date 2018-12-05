import { Component, OnInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Input } from '@angular/core';

import { AppStore } from '$shared';

@Component({
  selector: 'app-api-state',
  templateUrl: './api-state.component.html',
  styleUrls: ['./api-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiStateComponent implements OnInit, OnChanges {
  @Input() state: AppStore.ApiState<any>;

  public errorShow = true;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    // Everytime input data changes, reset error to show
    this.errorShow = true;
  }
}
