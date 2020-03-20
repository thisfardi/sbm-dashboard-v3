import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})

/**
 * Activity-component - handling activity with sidebar with content
 */
export class ActivityComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'SBM Dashboard v3.0', path: '/' }, { label: 'Pages', path: '/' }, { label: 'Activity', active: true }];
  }
}
