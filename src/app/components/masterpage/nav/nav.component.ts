import { Component } from '@angular/core';
import { AuthService, ServiceWorkerService, AppSettings } from '$shared';
import { environment } from '$env';

const startCase = require('lodash/startCase');
const toLower = require('lodash/toLower');

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent {
  /** Is the dropdown menu open on mobile */
  public isOpen = false;
  /** Turn the username into title case */
  public userName = startCase(toLower(this.settings.userName));
  /**  Is the service worker enabled */
  public hasSW = environment.settings.enableServiceWorker;
  /**   Does the app have an update */
  public hasUpdate$ = this.sw.updateAvailable$;

  constructor(private auth: AuthService, private sw: ServiceWorkerService, private settings: AppSettings) {}

  public updateApp() {
    this.sw.openModal();
  }

  public logOut() {
    this.auth.logOut(true);
  }
}
