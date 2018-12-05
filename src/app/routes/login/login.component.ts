import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

import { AuthService, AppSettings } from '$shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  public formMain: FormGroup;
  public waiting: boolean;
  public errorApi: IErrorApi;
  public showErrorDetails = false;
  public sessionExpired: boolean;
  public loggedout: boolean;
  public showPassword = false;
  public returnUrl: string;

  public subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private settings: AppSettings,
  ) {}

  public ngOnInit() {
    let isLogin, hasLogin;
    if (isPlatformBrowser && window.localStorage.rememberLogin && this.settings.userName) {
      isLogin = this.settings.userName;
    }

    if (isPlatformBrowser && window.localStorage.rememberLogin) {
      hasLogin = true;
    }

    this.subs = [
      this.route.queryParams.subscribe(params => {
        if (params.session === 'expired') {
          this.sessionExpired = true;
        }
        if (params.session === 'loggedout') {
          this.loggedout = true;
        }
      }),
    ];

    if (isPlatformBrowser) {
      window.clearTimeout(this.authService.sessionTimer); // When the page is loaded, clear any legacy timeouts
    }

    this.authService.logOutModal = null; // Get rid of logout modal if it persists

    this.formMain = this.fb.group({
      userName: [isLogin || 'juser', [Validators.required]],
      password: ['password', [Validators.required]],
      remember: [hasLogin],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Submit the form
   */
  public onLogin() {
    this.waiting = true;
    this.errorApi = null;
    this.showErrorDetails = false;

    // If remember username is set
    if (this.formMain.value.remember) {
      this.settings.userName = this.formMain.value.userName;
      if (isPlatformBrowser) {
        window.localStorage.rememberLogin = true;
      }
    } else {
      if (isPlatformBrowser) {
        window.localStorage.removeItem('rememberLogin');
      }
    }

    // Authenticate
    this.authService.logIn(this.formMain.value).subscribe(
      () => {
        this.settings.userName = this.formMain.value.userName;
        this.router.navigate([this.returnUrl]);
        this.waiting = false;
      },
      error => {
        error.errorMsg = 'Error logging in.';
        if ((error.statusText = 'Unauthorized')) {
          error.errorMsg = 'Invalid username or password, please try again.';
          this.showErrorDetails = false;
        }

        this.errorApi = error;
        this.waiting = false;
      },
    );
  } // end onSubmit

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}
