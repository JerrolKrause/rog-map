import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss'],
})
export class QaComponent implements OnInit {
  public launchModalWorks: boolean;

  public filterFruit: any;
  public filterFruitMore: any;
  public fruits = [
    'Apple',
    'Orange',
    'Kiwi',
    'Marionberries',
    'Loganberries',
    'Mangostein',
    'Peach',
    'Pear',
    'Blackberries',
    'Strawberries',
  ];
  public fruitsMore = [
    { name: 'Apple' },
    { name: 'Orange' },
    { name: 'Kiwi' },
    { name: 'Marionberries' },
    { name: 'Loganberries' },
    { name: 'Mangostein' },
    { name: 'Peach' },
    { name: 'Pear' },
    { name: 'Blackberries' },
    { name: 'Strawberries' },
  ];

  constructor() {}

  ngOnInit() {}

  public launchModalSuccess(event: any) {
    if (event) {
      this.launchModalWorks = true;
    }
  }
}
