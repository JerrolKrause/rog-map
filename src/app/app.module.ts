// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, enableProdMode, ErrorHandler } from '@angular/core'; // APP_INITIALIZER,
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

// Global vendor modules
import { StoreModule } from '@ngrx/store';

// Store Reducer
import { UIReducer } from '$ui';
import { ApiReducer } from '$api';

// Main entrypoint component
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { environment } from '$env';

// Enables faster prod mode, does disable some dirty error checking though
enableProdMode();

// Shared
import {
  AppSettings, // App settings
  // AppConfigService, // App config/env settings

  // Interceptors
  HttpInterceptorService,
  GlobalErrorHandler,
} from '$shared';

// Non-lazy loaded routes
import { LoginComponent, NoContentComponent } from '$routes';
import { SiteModule } from '$site';

// Components
export const APP_COMPONENTS = [
  // App component
  AppComponent,
  // Routes
  LoginComponent,
  NoContentComponent,
];

@NgModule({
  declarations: [APP_COMPONENTS],
  imports: [
    BrowserModule.withServerTransition({ appId: 'angular-starter' }),
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      preloadingStrategy: environment.settings.preloadRoutes ? PreloadAllModules : NoPreloading,
    }),

    StoreModule.forRoot({ api: ApiReducer, ui: UIReducer }), // NGRX
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: false }), // environment.settings.enableServiceWorker

    SiteModule.forRoot(),
  ],
  providers: [
    AppSettings, // App settings
    // AppConfigService, // App config/env settings

    // Global error handling
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    // HTTP interceptor for auth
    HttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    // App initializer for startup
    // {
    //  provide: APP_INITIALIZER,
    //  useFactory: AppInit,
    //  deps: [AppSettings, AppConfigService],
    //  multi: true,
    // },
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {}

/**
 * Check if environment settings are already present, if not load first before the rest of the app
 * @param settings - App settings
 * @param config - Config service
 */
// export function AppInit(settings: AppSettings, config: AppConfigService): () => Promise<any> {
//  if (settings.apiUrl) {
//    return (): Promise<any> => new Promise(resolve => resolve());
//  } else {
//    return (): Promise<any> => config.loadEnvSettings();
//  }
// }
