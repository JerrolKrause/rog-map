import { Models } from '$models';
import { EntityState, EntityAdapter } from '@ngrx/entity';
import { AppStore } from '$shared'; // Inherit types from core Appstore

export declare namespace MonolithStore {
  /** The root store which contains the other stores */
  interface Root {
    api: Api;
    ui: Ui;
  }

  /** API Store */
  export interface Api {
    [key: string]: AppStore.ApiState<any>;
    //users?: any[]; // Store response
    // Example of Store typing with mapped response
    users?: AppStore.ApiState<EntityState<Models.User>>;
  }

  /** UI Store */
  export interface Ui {
    /** A static snapshot of the UI store, used mainly for multiscreen usage */
    saveState: Ui | null;
    tabsActive: { [key: string]: string };
    modal: {
      modalId: string;
      options: {};
      data: any;
      dataAlt: any;
    } | null;
    multiScreen: boolean;
  }
}
