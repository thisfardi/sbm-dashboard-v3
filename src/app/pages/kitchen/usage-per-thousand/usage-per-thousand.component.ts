import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-usage-per-thousand',
  templateUrl: './usage-per-thousand.component.html',
  styleUrls: ['./usage-per-thousand.component.scss']
})
export class UsagePerThousandComponent implements OnInit {

  constructor(
    private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService
  ) { }

  company: string = JSON.parse(this.cookieService.getCookie('currentUser')).company;
  database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
  date_ranges: Object;

  f_criteria: string = 'hour';
  disable_criteria = [0, 1, 1, 1, 1, 1, 1];

  filter_range: string;
  filter_date: Object;
  filter_shop_name: string;

  db_error: Boolean = false;

  shop_loading = false
  history_loading = false
  shops = []
  selected_shop_id = -1
  shop_names = []
  error = ''

  finished_products = [
  ]
  filtered_finished_products = []
  uniq_finished_products_code = []
  uniq_finished_products_name = []
  selected_finished_product = ""

  selected_item = {
    name: '#',
    code: '#',
    total: 0,
    price: 0,
    netsale: 0
  }
  price = 0
  total = 0
  netsale = 0

  ex_sales = [10000, 20000, 40000]
  selected_ex_sales = 10000
  sc_factor = [0.1, 0.2, .3, .4, .5]
  selected_sc_factor = .2

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
    this._fetchShops()
  }
  get_date_range(){
    return {
      from: moment(this.filter_date['from']).format('MM/DD/YYYY'),
      to: this.filter_date['to'] ? moment(this.filter_date['to']).format('MM/DD/YYYY') : moment(this.filter_date['from']).format('MM/DD/YYYY')
    }
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
            this._fetchNetsale()

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
  _fetchNetsale(){
    this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
    this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
    this.history_loading = true
    this.apiService.sum_data(this.parseService.encode({
      from: this.filter_date['from'],
      to: this.filter_date['to'],
      shop: this.filter_shop_name,
      db: this.database
    }))
      .pipe(first())
      .subscribe(
        data => {
          let sum_data = data['data']
          if(data['status'] == 'success'){
            this.netsale = data['data'].netsale.reduce((netsale, item) => {
              return netsale += parseFloat(item['netsale'])
            }, 0)
            this._fetchHistoryData()
          }else{
            this.db_error = true;
          }
          this.history_loading = false
        },
        error => {
          this.db_error = true;
          this.history_loading = false
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

  set_data(data){
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
    this.uniq_finished_products_name = []
    this.finished_products.forEach(item => {
      if(!this.uniq_finished_products_code.includes(item.code)){
        this.uniq_finished_products_code.push(item.code)
        this.uniq_finished_products_name.push(item.name)
      }
    })
    this.selected_finished_product = this.uniq_finished_products_name[0]
    this.filter_item_change()
  }
  filter_item_change(){
    this.filtered_finished_products = [...this.finished_products.filter(item => item.name == this.selected_finished_product)]

    this.total = this.filtered_finished_products.reduce((total, item) => {
      return total += parseFloat(item.amount)
    }, 0) / 1000
    this.price = this.filtered_finished_products.reduce((total, item) => {
      return total += parseFloat(item.price)
    }, 0)
    this.selected_item = {
      name: this.filtered_finished_products.length != 0 ? this.filtered_finished_products[0].name : '',
      code: this.filtered_finished_products.length != 0 ? this.filtered_finished_products[0].code : '',
      total: this.total,
      price: this.price,
      netsale: this.netsale
    }
    console.log(this.selected_item)
  }
  apply_filter(){
    this._fetchNetsale()
  }

  prettify_time_stamp(time){
    return moment(time).format('YYYY-MM-DD hh:mm:ss')
  }
  trunc(val){
    return Math.trunc(parseFloat(val))
  }
}
