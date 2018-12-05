import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
})
export class LogoutModalComponent implements OnInit, OnDestroy {
  public logoutTimer$: Subscription; // Holds the countdown obserable
  public counter: number; // Log out after this many seconds
  public modalDuration = 120; // This number is passed in through the modal reference, will default to 120 if not specified

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public dataAlt: any,
  ) {}

  ngOnInit() {
    this.counter = this.data; // How long to display the modal window

    // Create a timer obserable that counts down
    this.logoutTimer$ = interval(1000).subscribe(() => {
      // If timer is greater than 0, count down.
      if (this.counter > 1) {
        this.counter--;
      } else {
        // If timer hits zero or below, CLOSE this modal which toggles the logout action in AuthService
        this.logout();
      }
    });
  }

  /** Log the user out manually */
  public logout() {
    this.dialogRef.close(true);
  }

  public ngOnDestroy() {
    this.logoutTimer$.unsubscribe(); // Unsub from timer on modal close
  }
}
