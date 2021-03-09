import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { ChartType } from '../charts.model';
import {
  pos_daily_usage_amount_chart,
  pos_daily_usage_price_chart,
  pos_daily_ingredient_amount_chart,
  pos_daily_ingredient_price_chart
} from '../data';

@Component({
  selector: 'app-pos-report',
  templateUrl: './pos-report.component.html',
  styleUrls: ['./pos-report.component.scss']
})
export class PosReportComponent implements OnInit {

  company: string = JSON.parse(this.cookieService.getCookie('currentUser')).company;
  date_ranges: Object;

  f_criteria: string = 'hour';
  disable_criteria = [0, 1, 1, 1, 1, 1, 1];

  filter_range: string;
  filter_date: Object;
  filter_shop_name: string;

  db_error: Boolean = false;

  pos_daily_usage_amount: ChartType
  pos_daily_usage_price: ChartType
  pos_daily_ingredient_amount: ChartType
  pos_daily_ingredient_price: ChartType

  shop_loading = false
  history_loading = false
  shops = []
  shop_names = []
  error = ''

  pos_daily_usage = [
    {
      code: '98754',
      name: 'Milk Tea',
      amount: '6600',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '14'
    },
    {
      code: '98753',
      name: 'Jasmine Green Tea',
      amount: '5000',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '2'
    },
    {
      code: '98752',
      name: 'Black Tea',
      amount: '4500',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '1.5'
    },
    {
      code: '98751',
      name: 'Boba',
      amount: '1100',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '0.5'
    },
    {
      code: '98750',
      name: 'Puff Cream',
      amount: '305',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '3'
    },
    {
      code: '98749',
      name: 'Pearl Sago',
      amount: '1100',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '0.5'
    },
    {
      code: '98748',
      name: 'Pudding',
      amount: '6600',
      finished_time: '3/3 11:40',
      best_serving_by: '2/20 14:40',
      best_serving_hours: 2,
      price: '1'
    }
  ]

  pos_daily_ingredient = [
    {
      code: '98754',
      name: 'Black Tea Leaves',
      amount: '660',
      safety_level: 2,
      price: '11'
    },
    {
      code: '98753',
      name: 'Green Tea Leaves',
      amount: '600',
      safety_level: 1.2,
      price: '14'
    },
    {
      code: '98752',
      name: 'Pearl Sago',
      amount: '200',
      safety_level: 0.5,
      price: '12'
    },
    {
      code: '98751',
      name: 'Pudding Powder',
      amount: '300',
      safety_level: 2,
      price: '5'
    },
    {
      code: '98749',
      name: 'Condesned Milk',
      amount: '900',
      safety_level: 2.3,
      price: '1'
    },
  ]

  constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

  ngOnInit() {
    this.pos_daily_usage_amount = pos_daily_usage_amount_chart
    this.pos_daily_usage_price = pos_daily_usage_price_chart
    this.pos_daily_ingredient_amount = pos_daily_ingredient_amount_chart
    this.pos_daily_ingredient_price = pos_daily_ingredient_price_chart
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
    this._fetchShops()
    this.set_data()
  }

  _fetchShops() {
    this.shops = [];
    this.error = ''
    this.shop_loading = true;
    this.apiService.shops(this.parseService.encode({
      db: JSON.parse(this.cookieService.getCookie('currentUser')).database
    }))
      .pipe(first())
      .subscribe(
        data => {
          this.shop_loading = false;
          if(data['status'] == 'success'){
            this.shops = [...data['data']]
            this.shop_names = data['data'].map(item => item.description)
            this.filter_shop_name = this.shop_names[0]
            this._fetchHistoryData()
          }else{
            this.error = "Something went wrong. Please try again later."
          }
        },
        error => {
          console.log(error)
          this.error = "DB error. Please check network connection and try again."
          this.shop_loading = false;
        }
      )
  }

  _fetchHistoryData(){
    this.error = ''
    this.history_loading = true
    this.apiService.getKitchenHistory({
      "shop_id":7,"date_range":{"from":"2021-03-01","to":"2021-03-01"}
    })
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
        },
        error => {
          console.log(error)
        }
      )
  }

  filter_range_change(){
    this.filter_date = this.date_ranges['ranges'][this.date_ranges['labels'].indexOf(this.filter_range)];
    if(this.filter_range == 'Custom range'){
      document.querySelector('#filter_date_range').removeAttribute('disabled');
    }else{
      document.querySelector('#filter_date_range').setAttribute('disabled', 'true');
    }
    switch(this.filter_range){
      case 'Today':
        this.disable_criteria = [0, 1, 1, 1, 1, 1, 1];
        this.f_criteria = 'hour';
        break;
      case 'Yesterday':
        this.disable_criteria = [0, 1, 1, 1, 1, 1, 1];
        this.f_criteria = 'hour';
        break;
      case 'This week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'day';
        break;
      case 'Last week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'day';
        break;
      case 'This month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'day';
        break;
      case 'Last month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'day';
        break;
      case 'This year':
        this.disable_criteria = [1, 1, 1, 1, 1, 0, 1];
        this.f_criteria = 'month';
        break;
      case 'Last year':
        this.disable_criteria = [1, 1, 1, 1, 1, 0, 1];
        this.f_criteria = 'month';
        break;
      case 'All time':
        this.disable_criteria = [1, 1, 1, 1, 1, 1, 0];
        this.f_criteria = 'year';
        break;
      case 'Custom range':
        this.disable_criteria = [0, 0, 0, 0, 0, 0, 0];
        this.f_criteria = 'day';
        break;
    }
  }
  get_class(val){
    if(val == "Expired"){
      return 'danger'
    }else if(val == "Bad"){
      return 'secondary'
    }else if(val == "Waste"){
      return 'warning'
    }else{
      return 'primary'
    }
  }

  set_data(){
    this.pos_daily_usage_amount.series = [
      {
        name: "Amount",
        data: this.pos_daily_usage.map((item) => item.amount)
      }
    ]
    this.pos_daily_usage_amount.xaxis.categories = [
      ...this.pos_daily_usage.map((item) => item.name)
    ]
    this.pos_daily_usage_price.series = [
      {
        name: "Cost",
        data: this.pos_daily_usage.map((item) => item.price)
      }
    ]
    this.pos_daily_usage_price.xaxis.categories = [
      ...this.pos_daily_usage.map((item) => item.name)
    ]

    this.pos_daily_ingredient_amount.series = [
      {
        name: "Amount",
        data: this.pos_daily_ingredient.map((item) => item.amount)
      }
    ]
    this.pos_daily_ingredient_amount.xaxis.categories = [
      ...this.pos_daily_ingredient.map((item) => item.name)
    ]

    this.pos_daily_ingredient_price.series = [
      {
        name: "Cost",
        data: this.pos_daily_ingredient.map((item) => item.price)
      }
    ]
    this.pos_daily_ingredient_price.xaxis.categories = [
      ...this.pos_daily_ingredient.map((item) => item.name)
    ]

  }
}
