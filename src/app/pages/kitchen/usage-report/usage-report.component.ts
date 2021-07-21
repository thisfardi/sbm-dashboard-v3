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
  daily_finished_products_amount_chart,
  daily_finished_products_price_chart,
  daily_ingredients_amount_chart,
  daily_ingredients_price_chart,
  daily_waste_amount_chart,
  daily_waste_price_chart
} from '../data';
@Component({
  selector: 'app-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent implements OnInit {

  constructor(
    private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, private authService: AuthenticationService, public exportService: ExportService, public historyService: HistoryService
  ) { }

  company: string = JSON.parse(this.cookieService.getCookie('currentUser')).company;
  date_ranges: Object;

  f_criteria: string = '1';
  disable_criteria = [0, 1, 1, 1, 1, 1, 1];

  filter_range: string;
  filter_date: Object;
  filter_shop_name: string;

  db_error: Boolean = false;
  daily_finished_products_amount: ChartType
  daily_finished_products_price: ChartType
  daily_ingredients_amount: ChartType
  daily_ingredients_price: ChartType
  daily_waste_amount: ChartType
  daily_waste_price: ChartType

  finished_products = [
  ]
  filtered_finished_products = []
  uniq_finished_products_code = []
  uniq_finished_products_name = ["All items"]
  selected_finished_product = "All items"

  daily_ingredients = [
  ]

  daily_waste = [
  ]

  shop_loading = false
  history_loading = false
  shops = []
  selected_shop_id = -1
  shop_names = []
  error = ''
  ngOnInit() {
    this.daily_finished_products_amount = daily_finished_products_amount_chart
    this.daily_finished_products_price = daily_finished_products_price_chart
    this.daily_ingredients_amount = daily_ingredients_amount_chart
    this.daily_ingredients_price = daily_ingredients_price_chart
    this.daily_waste_amount = daily_waste_amount_chart
    this.daily_waste_price = daily_waste_price_chart
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

    this.finished_products = [
    ]

    this.daily_ingredients = [
    ]

    this.daily_waste = [
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
  get_data(){

  }
  set_data(data){

    console.log(data)
    if(data.hasOwnProperty('producted_list')){
      this.finished_products = data.producted_list.map(item => {
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
    this.uniq_finished_products_code = []
    this.uniq_finished_products_name = ["All items"]
    this.finished_products.forEach(item => {
      if(!this.uniq_finished_products_code.includes(item.code)){
        this.uniq_finished_products_code.push(item.code)
        this.uniq_finished_products_name.push(item.name)
      }
    })
    this.selected_finished_product = this.finished_products.length != 0 ? this.uniq_finished_products_name[1] : this.uniq_finished_products_name["All items"]
    this.filter_item_change()


    if(data.hasOwnProperty('ingredient_list')){
      this.daily_ingredients = data.ingredient_list.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          amount: item.material_amount,
          safety_level: item.bag,
          price: item.cost
        }
      })
    }

    if(data.hasOwnProperty('dispose_rate_list')){
      this.daily_waste = data.dispose_rate_list.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          amount: parseFloat(item.product_amount) * parseFloat(item.waste_rate),
          product_amount: item.product_amount,
          reason: "Waste",
          price: 0,
          rate: item.waste_rate
        }
      })
    }

    this.render_charts()
  }

  render_charts(){


    this.daily_finished_products_amount.series = [
      {
        name: "Amount",
        data: this.filtered_finished_products.map((item) => item.amount)
      }
    ]
    if(this.selected_finished_product == "All items"){
      this.daily_finished_products_amount.xaxis.categories = [
        ...this.filtered_finished_products.map((item) => item.name)
      ]
    }else{
      this.daily_finished_products_amount.xaxis.categories = [
        ...this.filtered_finished_products.map((item) => item.finished_time.split(' ')[1])
      ]
    }

    this.daily_finished_products_price.series = [
      {
        name: "Cost",
        data: this.filtered_finished_products.map((item) => item.price)
      }
    ]

    if(this.selected_finished_product == "All items"){
      this.daily_finished_products_price.xaxis.categories = [
        ...this.filtered_finished_products.map((item) => item.name)
      ]
    }else{
      this.daily_finished_products_price.xaxis.categories = [
        ...this.filtered_finished_products.map((item) => item.finished_time.split(' ')[1])
      ]
    }


    this.daily_ingredients_amount.series = [
      {
        name: "Amount",
        data: this.daily_ingredients.map((item) => item.amount)
      }
    ]
    this.daily_ingredients_amount.xaxis.categories = [
      ...this.daily_ingredients.map((item) => item.name)
    ]

    this.daily_ingredients_price.series = [
      {
        name: "Cost",
        data: this.daily_ingredients.map((item) => item.price)
      }
    ]
    this.daily_ingredients_price.xaxis.categories = [
      ...this.daily_ingredients.map((item) => item.name)
    ]



    this.daily_waste_amount.series = [
      {
        name: "Amount",
        data: this.daily_waste.map((item) => item.amount)
      }
    ]
    this.daily_waste_amount.xaxis.categories = [
      ...this.daily_waste.map((item) => item.name)
    ]

    this.daily_waste_price.series = [
      {
        name: "Cost",
        data: this.daily_waste.map((item) => item.price)
      }
    ]
    this.daily_waste_price.xaxis.categories = [
      ...this.daily_waste.map((item) => item.name)
    ]
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
        this.f_criteria = '1';
        break;
      case 'Yesterday':
        this.disable_criteria = [0, 1, 1, 1, 1, 1, 1];
        this.f_criteria = '1';
        break;
      case 'This week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = '1';
        break;
      case 'Last week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = '1';
        break;
      case 'This month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = '2';
        break;
      case 'Last month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = '2';
        break;
      case 'This year':
        this.disable_criteria = [1, 1, 1, 1, 1, 0, 1];
        this.f_criteria = '3';
        break;
      case 'Last year':
        this.disable_criteria = [1, 1, 1, 1, 1, 0, 1];
        this.f_criteria = '3';
        break;
      case 'All time':
        this.disable_criteria = [1, 1, 1, 1, 1, 1, 0];
        this.f_criteria = '4';
        break;
      case 'Custom range':
        this.disable_criteria = [0, 0, 0, 0, 0, 0, 0];
        this.f_criteria = '4';
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

  apply_filter(){
    this._fetchHistoryData()
  }

  prettify_time_stamp(time){
    return moment(time).format('YYYY-MM-DD hh:mm:ss')
  }

  filter_item_change(){
    this.filtered_finished_products = []
    if(this.selected_finished_product == "All items"){
      setTimeout(() => {
        this.filtered_finished_products = [...this.finished_products]
        this.render_charts()
      }, 100)
    }else{
      setTimeout(() => {
        this.filtered_finished_products = [...this.finished_products.filter(item => item.name == this.selected_finished_product)]
        this.render_charts()
      }, 100)
    }
  }

  select_item(name){
    this.selected_finished_product = name
    this.filter_item_change()
  }
}
