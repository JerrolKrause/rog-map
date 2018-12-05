import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '$env';
import { AppStore } from '$shared';
import { StringUtils } from '$utils';
import { AppSettings } from '../../app.settings';
import { UIStoreActions } from './ui.actions';
import { UiSelectorsService } from './ui.selectors.service';
import { MatTabChangeEvent } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class UIStoreService {
  /** Holds the reference to a window opened programmatically. Used by appComms for multiscreen state */
  public screen: any; // Window

  /** Obfuscate reference */
  private pad = 100;

  constructor(
    private store: Store<AppStore.Root>,
    /** UI Store Selectors */
    public select: UiSelectorsService,
    private settings: AppSettings,
  ) {
    // Rehydrate UI state from localstorage on instantiation
    if (this.settings.ui) {
      // Get UI state from localstorage
      let str = this.settings.ui;
      // Remove obfusucation if is set
      if (environment.settings.obfuscate) {
        // If de-obfuscating errors out, remove ui store state and fail gracefully
        str = this.obfuscateRemove(str);
      }
      // Convert to JSON
      const uiState: AppStore.Ui = JSON.parse(str);
      this.storeStateRestore(uiState);
    }

    // On UI store changes, persist to localstorage
    this.select.saveState$.subscribe((uiState: AppStore.Ui) => this.storeStateSave(uiState));

    // Output store changes to console
    // this.store.subscribe(storeApi => console.log(JSON.parse(JSON.stringify(storeApi.ui))));
  }

  /**
   * Change and persist the visible tab of a tabset
   * Make sure this service is public: constructor(public ui: UIStoreService) and that the first argument matches
   * USAGE
   <mat-tab-group [selectedIndex]="ui.select.tabActive$('home') | async" (selectedTabChange)="ui.tabChange('home', $event)">
   * @param tabInstanceId - A name or unique identifier for this tab instance
   * @param tabEvent - The tabChange event supplied by ng-boostrap
   */
  public tabChange(tabInstanceId: string, tabEvent: MatTabChangeEvent) {
    this.store.dispatch(UIStoreActions.TAB_CHANGE({ tabInstanceId: tabInstanceId, tabId: tabEvent.index }));
  }

  /**
   * Change a toggle which is just a boolean in a dictionary
   * @param prop - Property to set, corresponds to toggle$ in the ui.select service
   * @param value - T/F
   */
  public toggle(prop: string, value: boolean) {
    this.store.dispatch(UIStoreActions.TOGGLES({ prop: prop, value: value }));
  }

  /**
   * Toggle sidebar
   * @param toggle - New sidebar state
   */
  public gridStateChange(gridState: GridState) {
    this.store.dispatch(UIStoreActions.GRID_STATE_CHANGE(gridState));
  }

  /**
   *  Reload the latest UI state from localstorage
   */
  public storeStateRestore(uiState: AppStore.Ui) {
    this.store.dispatch(UIStoreActions.REHYDRATE(uiState));
  }

  /**
   * Save the UI store state to localstorage for persistance
   * @param state
   */
  private storeStateSave(state: AppStore.Ui) {
    if (state) {
      // Delete any keys that should not be persisted
      for (const key in state) {
        if (state.hasOwnProperty(key) && environment.state.uiStoreBlacklist.indexOf(key) !== -1 && (<any>state)[key]) {
          delete (<any>state)[key];
        }
      }
      let str = JSON.stringify(state);
      // Add obfusciation if set
      if (environment.settings.obfuscate) {
        str = this.obfuscateAdd(str);
      }
      // Set to localstorage
      this.settings.ui = str;
    }
  }

  /**
   * Add state obfuscation
   * @param str
   */
  public obfuscateAdd(str: string) {
    str = StringUtils.pad(str, this.pad, this.pad);
    str = StringUtils.obfuscateAdd(str);
    str = StringUtils.charShift(str, 10);
    return str;
  }

  /**
   * Remove state obfuscation
   * @param str
   */
  public obfuscateRemove(str: string) {
    try {
      str = StringUtils.charShift(str, -10);
      str = StringUtils.obfuscateRemove(str);
      str = StringUtils.trim(str, this.pad, this.pad);
    } catch (err) {
      console.error(err);
      this.settings.ui = null;
    }
    return str;
  }
}
