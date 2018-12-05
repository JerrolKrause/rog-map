import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  /**
   * Append bearer token to auth settings
   * @param settings
   */
  constructor(private settings: AppSettings) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.settings.token),
    });
    return next.handle(authReq);
  }
}
