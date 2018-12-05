import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppSettings } from '$shared';
import { Models } from '$models';

import { ApiHttpService } from '$api';
import { MonolithApiSelectorsService } from './api.selectors.service';
import { ApiStoreActions } from '$api';
import { ApiMap } from './api.map';
import { MonolithStore } from '../monolith.store';

@Injectable()
export class MonolithApiService extends ApiHttpService {
  /** Users endpoint */
  public users = {
    get: (update?: boolean) => this.getStore<Models.User[]>(ApiMap.users.endpoint, ApiMap.users, update),
    post: (user: Models.User) => this.postStore<Models.User>(ApiMap.users.endpoint, ApiMap.users, user),
    put: (user: Models.User) => this.putStore<Models.User>(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
    delete: (user: Models.User) => this.deleteStore(ApiMap.users.endpoint + '/' + user.id, ApiMap.users, user),
  };

  constructor(
    private store: Store<MonolithStore.Root>,
    private http: HttpClient,
    private router: Router,
    private props: AppSettings,
    /** API Store Selectors */
    public select: MonolithApiSelectorsService,
  ) {
    super(<any>http, <any>store, <any>router, <any>props);

    // Output store changes to console
    // this.store.subscribe(storeApi => console.warn(JSON.parse(JSON.stringify(storeApi))));
  }

  /**
   * Reset the store, clear out all held state and data
   */
  public resetStore() {
    this.cacheClear(); // Clear cache
    this.store.dispatch(ApiStoreActions.RESET(null));
  }

  /**
   * Fix a bug with TS where super calls don't count as usage
   */
  public fixTS() {
    console.log(this.http, this.router, this.props);
  }
}
