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
  selected_shop_id = -1
  error = ''

  pos_daily_usage = [
  ]

  pos_daily_ingredient = [
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
            this.selected_shop_id = this.shops.filter(item => item.description == this.filter_shop_name)[0].id
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
    this.selected_shop_id = this.shops.filter(item => item.description == this.filter_shop_name)[0].id
    this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
    this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
    this.history_loading = true
    this.apiService.getKitchenHistory({
      shop_id: this.selected_shop_id,
      date_range: {
        from: this.filter_date['from'],
        to: this.filter_date['to']
      }
    })
      .pipe(first())
      .subscribe(
        data => {
          this.history_loading = false
          this.set_data(data)
        },
        error => {
          this.history_loading = false
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

  set_data(data){

    if(data.hasOwnProperty('pos_usage')){
      this.pos_daily_usage = data.pos_usage.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          amount: item.product_amount,
          price: item.cost
        }
      })
    }
    if(data.hasOwnProperty('pos_ingredients_used')){
      this.pos_daily_ingredient = data.pos_ingredients_used.map(item => {
        return {
          name: item.item_name,
          amount: item.product_amount,
          code: item.item_code,
          finished_time: item.time_stamp,
          best_serving_by: item.best_serving_by,
          price: item.cost
        }
      })
    }


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
  apply_filter(){
    this._fetchHistoryData()
  }

}
