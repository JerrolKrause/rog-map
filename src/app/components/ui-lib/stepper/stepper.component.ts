import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ContentChildren,
  QueryList,
  AfterViewInit,
  Input,
  HostListener,
} from '@angular/core';

import { StepDirective } from './directives/step.directive';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { debounce } from 'helpful-decorators';
import { BehaviorSubject } from 'rxjs';

/**
 * An abstraction for the materials stepper that is responsive
 * This stepper will flip between the horizontal and vertical screen sizes depending
 * on the screen resolution
 * USAGE:
  <app-stepper>
    <step>
      <ng-template step-label-template>
        Step Label
      </ng-template>
      <ng-template step-body-template>
        Step Body
      </ng-template>
    </step>
  </app-stepper>
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements OnInit, AfterViewInit {
  /** At what hozizontal resolution does the horizontal stepper change to the vertical stepper in pixels */
  @Input() breakpoint = 768;
  /** Use the vertical or horizontal stepper */
  public isHorizontal$ = new BehaviorSubject(true);

  public selectedIndex = 0;

  /** Holds custom DOM templates passed from parent */
  private _stepTemplates: any;
  @ContentChildren(StepDirective)
  set stepTemplates(val: QueryList<StepDirective>) {
    const arr = val.toArray();
    if (arr.length) {
      this._stepTemplates = arr;
    }
  }
  get stepTemplates(): QueryList<StepDirective> {
    return this._stepTemplates;
  }

  public selectedIndexWidths: number[] = [];
  public ready = false;

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.widthUpdate();
  }

  ngAfterViewInit() {
    console.log();
  }

  @HostListener('window:resize')
  @debounce(100)
  public widthUpdate() {
    const widthCurrent = this.elRef.nativeElement.getBoundingClientRect().width;
    const isHorizontal = widthCurrent >= this.breakpoint ? true : false;
    this.isHorizontal$.next(isHorizontal);
  }

  /**
   * Change the URL without loading/uploading components to make the stepper routable
   * @param section - New section
   */
  public selectionChange(stepper: StepperSelectionEvent) {
    console.log(stepper);
  }

  /**
   * Generate the necessary widths for the stepper progress bar
   * TODO: Figure out better way to determine when the mat-stepper is finished rendering
   */
  public getStepperProgressBar() {
    // Mat stepper doesn't render nested content right so add delay otherwise actual dom widths will be incorrect
    setTimeout(() => {
      // Get header container
      const container = this.elRef.nativeElement.querySelector('.mat-horizontal-stepper-header-container');
      // If container is present (DOM check)
      if (container) {
        // Get the DOM element of the step headers
        const items = Array.from(container.getElementsByClassName('mat-step-header'));
        // Get the spacers between the step headers
        const spacers: any[] = Array.from(container.getElementsByClassName('mat-stepper-horizontal-line'));

        const widths: number[] = [];
        // Loop through the number of step headers
        items.forEach((item: any, i) => {
          const width = Math.round(item.getBoundingClientRect().width);
          // If first entry
          if (i === 0) {
            widths.push(width);
          } else {
            // Subsequent widths are a combination of: current step header width + last width in array + previous spacer width
            const spacer = Math.round(spacers[i - 1].getBoundingClientRect().width);
            const widthLast = widths[i - 1];
            const widthNew = width + spacer + widthLast - 32;
            widths.push(widthNew);
          }
        });
        this.selectedIndexWidths = widths;
      }
    }, 500);
  }
}
