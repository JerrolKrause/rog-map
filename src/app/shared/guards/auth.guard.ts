import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { environment } from '$env';
import { AppSettings } from '../app.settings';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private settings: AppSettings, private auth: AuthService) {}

  canActivate() {
    if (
      // If is on a dev domain and an auth endpoint is not yet available
      !environment.settings.enableAuth || // Remove this line when out of dev/prototype phase for additional security
      // OR a token and an api url are present
      (this.settings.token && environment.endpoints.apiUrl)
    ) {
      return true; // logged in and has apiUrl so set true
    }
    this.auth.logOut();
    return false;
  }
}
