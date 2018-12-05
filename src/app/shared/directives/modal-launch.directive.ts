import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalsService } from '../../components/modals/modals.service';

/**
 * Launch a modal
 * USAGE: appModalLaunch modal="ConfirmationModalComponent" size="lg" data="'Test'"
 */
@Directive({
  selector: '[appModalLaunch]',
})
export class ModalLaunchDirective implements OnInit, OnDestroy {
  /** The modal component name to launch */
  @Input() modal: string;
  /** Should the modal persist on reload */
  @Input() persist = false;
  /** Any model data that needs to be passed to the modal component */
  @Input() data: any;
  /** Any model data that needs to be passed to the modal component */
  @Input() dataAlt: any;
  /** CSS classes to apply to the button */
  @Input() classes = ''; //
  /** Default size of the modal, can be sm/md/lg/xl/full */
  @Input() size: 'sm' | 'lg' | 'xl' | 'full' = 'lg';
  /** Is the button or a tag disabled */
  @Input() disabled = false;
  /** Add a class to the window object */
  @Input() windowClass = '';

  @Output() success: EventEmitter<any> = new EventEmitter(); // A method to emit events to pass up to parent
  @Output() dismiss: EventEmitter<any> = new EventEmitter(); // A method to emit events to pass up to parent

  private sub: Subscription;

  constructor(private modals: ModalsService) {}

  ngOnInit() {}

  /**
   * Open a modal window
   * Attach a success function and pass any relevant data to the modal component
   */
  @HostListener('click', ['$event'])
  public openModal($event: MouseEvent) {
    const modal = this.modals.open(<any>this.modal, this.persist, this.size, this.data, this.dataAlt);
    // If static modal
    if (modal) {
      modal.afterClosed().subscribe(reason => {
        // Only emit success event if data is passed
        if (reason) {
          this.success.emit(reason);
        }
      });
    } else {
      // If observable modal. KNOWN BUG: If the page is refreshed and the app is dependent on an onSuccess method
      // that method will not be persisted
      this.sub = this.modals.modalRef$.subscribe(modalElem => {
        if (modalElem) {
          modalElem.result.then((reason: any) => this.success.emit(reason), (reason: any) => this.success.emit(reason));
        }
      });
    }
    $event.preventDefault();
  } // end openModal

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe(); // Unsub from modal observable
    }
  }
}
