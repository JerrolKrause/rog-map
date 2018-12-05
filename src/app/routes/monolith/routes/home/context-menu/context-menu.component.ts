import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ContextService, ContextMenuList } from '$libs';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeContextMenuComponent implements OnInit {
  /** Reference to current top level context menu */
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;

  constructor(private menu: ContextService) {}

  ngOnInit() {
    this.menu.register(ContextMenuList.home, this.contextMenu);
  }

  public doCoolStuff() {
    console.log('Doing cool stuff');
  }
}
