import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit, OnDestroy {
  public timer: Observable<number>;

  constructor() {}

  ngOnInit() {
    this.start();
  }

  /**
   * Start timer
   */
  public start() {
    this.timer = timer(0, 1000).pipe(startWith(0));
  }

  /**
   * Stop timer
   */
  public stop() {
    this.timer = null;
  }

  /**
   * Reset timer
   */
  public reset() {
    this.stop();
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }
}
