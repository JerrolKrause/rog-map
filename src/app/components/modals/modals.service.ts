import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppSettings } from '../../shared/app.settings';
import { AppStore } from '../../shared/stores/store';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UIStoreActions } from '$ui';
import { ConfirmationModalComponent } from './confirmation/confirmation-modal.component';
import { LogoutModalComponent } from './logout/logout-modal.component';

/** Sample Usage:
this.ui.modals.open('ConfirmationModalComponent', false, 'lg', 'Are you sure you want to delete this user?', 'Delete User').result.then(
	() => console.log('Modal Closed'),
	() => console.log('Modal Dismissed'));
*/

// List modals here by component name
type modals = 'LogoutModalComponent' | 'ConfirmationModalComponent';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  /** Reference to the STATIC currently open modal. This reference is used for static non persistant modals */
  public modalRef: MatDialogRef<any>;
  /** Reference to the STORE OBSERVABLE currently open modal. This reference is used for modals persisted in the UI store */
  public modalRef$: BehaviorSubject<any> = new BehaviorSubject(null);
  /** List of component references of available modals */
  public modalList: { [key: string]: any } = {
    ConfirmationModalComponent: ConfirmationModalComponent,
    LogoutModalComponent: LogoutModalComponent,
  };

  constructor(private store: Store<AppStore.Root>, private settings: AppSettings, public dialog: MatDialog) {
    // Subscribe to the modal in the store and launch store modal if data is found. Also make sure token is present
    this.store.select(storeElem => storeElem.ui.modal).subscribe((modal: any) => {
      // Make sure modal exists AND that a token is present in app settings. This prevents a modal from persisting after logout
      if (modal && Object.keys(modal).length && this.settings.token) {
        // Store reference to the modal instance
        let width = '720px';

        switch (modal.size) {
          case 'sm':
            width = '480px';
            break;
          case 'xl':
            width = '1024px';
            break;
          case 'full':
            width = '90%';
            break;
        }

        const modalRef = this.dialog.open(this.modalList[modal.modalId], {
          width: width,
          data: modal.data || null,
        });

        this.modalRef$.next(modalRef);
        this.onClose();
      }
    });
  }

  /**
   * Open a modal window
   * @param modalId The class name of the modal window
   * @param persist Should the modal persist on reload or otherwise have its state managed by the UI store
   * @param size Modal size
   * @param data Primary set of data to pass to the modal
   * @param dataAlt Secondary set of data to pass to the modal
   */
  public open(
    modalId: modals,
    persist: boolean = false,
    size: 'sm' | 'lg' | 'xl' | 'full' = 'lg',
    data?: any,
    dataAlt?: any,
  ) {
    let width = '720px';

    switch (size) {
      case 'sm':
        width = '480px';
        break;
      case 'xl':
        width = '1024px';
        break;
      case 'full':
        width = '90%';
        break;
    }

    // If persist is set, load this modal into the store so state is managed by the UI store
    if (persist) {
      this.store.dispatch(
        UIStoreActions.MODAL_OPEN({
          modalId: modalId,
          options: { size: <any>size },
          data: data,
        }),
      );
    } else {
      // If persist is not set
      // this.modalRef = this.modalService.open(this.modalList[modalId], { size: <any>size, windowClass: windowClass });
      this.modalRef = this.dialog.open(this.modalList[modalId], {
        width: width,
        data: data,
      });
    }
    this.modalRef.componentInstance.dataAlt = dataAlt;
    return this.modalRef;
  }

  /**
   * When the modal window is closed, remove from store
   */
  private onClose() {
    this.modalRef$.subscribe(modal => {
      // Wait for promise that is returned when modal is closed or dismissed
      modal.result.then(
        () => {
          this.store.dispatch(UIStoreActions.MODAL_UNLOAD(null));
        },
        () => {
          // On modal dismiss, which is closed without performing an action
          this.store.dispatch(UIStoreActions.MODAL_UNLOAD(null));
        },
      );
    });
  }
}
