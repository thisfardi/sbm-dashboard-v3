import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';
import { AuthenticationService } from '../../../core/services/auth.service';
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

  f_criteria = 1;
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
  filterd_pos_daily_usage = []
  uniq_pos_daily_usage_name = ["All items"]
  selected_pos_daily_usage_item = "All items"

  pos_daily_ingredient = [
  ]

  constructor(private apiService: ApiService, private cookieService: CookieService, private authService: AuthenticationService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

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
    let user_shops = JSON.parse(this.authService.currentUser().shop_name)
    this.apiService.shops(this.parseService.encode({
      db: JSON.parse(this.cookieService.getCookie('currentUser')).database,
      servername: this.authService.currentUser().servername,
      serverpassword: this.authService.currentUser().serverpassword,
      uid: this.authService.currentUser().uid
    }))
      .pipe(first())
      .subscribe(
        data => {
          this.shop_loading = false;
          if(data['status'] == 'success'){
            this.shops = [...data['data'].filter(item => user_shops.indexOf(item.description) != -1)]
            this.shop_names = this.shops.map(item => item.description)
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

    this.pos_daily_usage = [
    ]

    this.pos_daily_ingredient = [
    ]
    this.apiService.getKitchenHistory({
      shop_id: this.selected_shop_id,
      type: this.f_criteria,
      date_range: {
        from: this.filter_date['from'],
        to: this.filter_date['to']
      },
      db_name: JSON.parse(this.cookieService.getCookie('currentUser')).company.toLowerCase()
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
        this.f_criteria = 1;
        break;
      case 'Yesterday':
        this.disable_criteria = [0, 1, 1, 1, 1, 1, 1];
        this.f_criteria = 1;
        break;
      case 'This week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 2;
        break;
      case 'Last week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 2;
        break;
      case 'This month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 3;
        break;
      case 'Last month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 3;
        break;
      case 'This year':
        this.disable_criteria = [1, 1, 1, 1, 1, 0, 1];
        this.f_criteria = 3;
        break;
      case 'Last year':
        this.disable_criteria = [1, 1, 1, 1, 1, 0, 1];
        this.f_criteria = 3;
        break;
      case 'All time':
        this.disable_criteria = [1, 1, 1, 1, 1, 1, 0];
        this.f_criteria = 4;
        break;
      case 'Custom range':
        this.disable_criteria = [0, 0, 0, 0, 0, 0, 0];
        this.f_criteria = 4;
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
      this.uniq_pos_daily_usage_name = ["All items"]
      this.pos_daily_usage.forEach(item => {
        if(!this.uniq_pos_daily_usage_name.includes(item.name)){
          this.uniq_pos_daily_usage_name.push(item.name)
        }
      })
      this.selected_pos_daily_usage_item = "All items"
      this.filterd_pos_daily_usage = [...this.pos_daily_usage]
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
  filter_item_change(){
    this.filterd_pos_daily_usage = []
    if(this.selected_pos_daily_usage_item == "All items"){
      this.filterd_pos_daily_usage = [...this.pos_daily_usage]
    }else{
      this.filterd_pos_daily_usage = [...this.pos_daily_usage.filter(item => item.name == this.selected_pos_daily_usage_item)]
    }
  }
  select_item(name){
    if(name == this.selected_pos_daily_usage_item){
      this.selected_pos_daily_usage_item = "All items"
    }else{
      this.selected_pos_daily_usage_item = name
    }

    this.filter_item_change()
  }

}
