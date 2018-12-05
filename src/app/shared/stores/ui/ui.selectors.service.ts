import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppStore } from '$shared';

@Injectable({
  providedIn: 'root',
})
export class UiSelectorsService {
  public saveState$ = this.store.select(store => store.ui.saveState);
  public gridState$ = this.store.select(store => store.ui.gridState);
  public modal$ = this.store.select(store => store.ui.modal);
  public tabActive$ = (tabInstanceId: string) => this.store.select(store => store.ui.tabsActive[tabInstanceId]);
  public toggle$ = (toggleProp: string) => this.store.select(store => store.ui.toggles[toggleProp]);

  constructor(private store: Store<AppStore.Root>) {}
}
