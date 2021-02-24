import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';


@Component({
  selector: 'app-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent implements OnInit {

  constructor(
    private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService
  ) { }

  kitchens = [];
  company: string = JSON.parse(this.cookieService.getCookie('currentUser')).company;
  date_ranges: Object;

  f_criteria: string = 'hour';
  disable_criteria = [0, 1, 1, 1, 1, 1, 1];

  filter_range: string;
  filter_date: Object;
  filter_kitchen: string;

  db_error: Boolean = false;

  ngOnInit() {
    this.date_ranges = {
      labels: ['Today', 'Yesterday', 'This week', 'Last week', 'This month', 'Last month', 'This year', 'Last year', 'All time', 'Custom range'],
      ranges: [
        { // Today
          from: moment().format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD')
        },
        { // Yesterday
          from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'days').format('YYYY-MM-DD')
        },
        { // This week
          from: moment().startOf('week').format('YYYY-MM-DD'),
          to: moment().endOf('week').format('YYYY-MM-DD')
        },
        { // Last week
          from: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')
        },
        { // This month
          from: moment().startOf('month').format('YYYY-MM-DD'),
          to: moment().endOf('month').format('YYYY-MM-DD')
        },
        { // Last month
          from: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
        },
        { // This year
          from: moment().startOf('year').format('YYYY-MM-DD'),
          to: moment().endOf('year').format('YYYY-MM-DD')
        },
        { // Last year
          from: moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD')
        },
        { // All time
          from: '2015-01-01',
          to: moment().endOf('year').format('YYYY-MM-DD')
        },
        { // Custom range
          from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'days').format('YYYY-MM-DD')
        }
      ]
    }
    this.filter_range = this.date_ranges['labels'][0];
    this.filter_date = this.date_ranges['ranges'][0];
  }

}
