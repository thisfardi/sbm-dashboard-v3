import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})

/**
 * widgets-component - handling widgets with sidenav and content
 */
export class WidgetsComponent implements OnInit {

  // breadcrum items
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'SBM Dashboard v3.0', path: '/' }, { label: 'Components', path: '/' }, { label: 'Widgets', active: true }];
  }
}
