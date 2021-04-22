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
  daily_finished_products_comparison_chart,
  pos_daily_usage_comparison_chart,
  pos_daily_ingredient_comparison_chart,
  netsale_cook_dispose_compare_piechart
} from '../data';


@Component({
  selector: 'app-daily-analysis',
  templateUrl: './daily-analysis.component.html',
  styleUrls: ['./daily-analysis.component.scss']
})
export class DailyAnalysisComponent implements OnInit {

  date_ranges: Object;
  f_criteria: string = 'day';
  disable_criteria = [0, 1, 1, 1, 1, 1, 1];

  filter_range: string;
  filter_date: Object;
  filter_shop_name: string;

  db_error: Boolean = false;

  shop_loading = false
  history_loading = false

  shops = []
  shop_names = []
  selected_shop_id = -1
  error = ''
  netsale = 0

  daily_finished_products_comparison: ChartType
  pos_daily_usage_comparison: ChartType
  pos_daily_ingredient_comparison: ChartType
  netsale_cook_dispose_compare_piechart: any

  filtered_daily_finished_products = []
  uniq_finished_products_code = []
  uniq_finished_products_name = []
  selected_finished_product = ""

  daily_finished_products = [] // producted
  pos_daily_usage = [] // usage
  pos_daily_dispose = [] // POS disposal
  filtered_pos_daily_usage = []
  filtered_pos_daily_dispose = []

  daily_ingredients = [] // RM
  daily_ingredients_dispose = [] // RM dispose
  pos_daily_ingredient = [] // POS RM
  filtered_daily_ingredients = []
  filtered_daily_ingredients_dispose = []
  filtered_pos_daily_ingredient = []


  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private parseService: ParseService,
    public exportService: ExportService,
    public historyService: HistoryService
  ) { }

  ngOnInit() {
    this.daily_finished_products_comparison = daily_finished_products_comparison_chart
    this.pos_daily_usage_comparison = pos_daily_usage_comparison_chart
    this.pos_daily_ingredient_comparison = pos_daily_ingredient_comparison_chart
    this.netsale_cook_dispose_compare_piechart = netsale_cook_dispose_compare_piechart

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
      db: JSON.parse(this.cookieService.getCookie('currentUser')).database
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
    this.daily_finished_products = []
    this.pos_daily_usage = []
    this.pos_daily_dispose = []

    this.daily_ingredients = []
    this.daily_ingredients_dispose = []
    this.pos_daily_ingredient = []

    this.apiService.getKitchenHistory({
      //shop_id: 7,
      shop_id: this.selected_shop_id,
      date_range: {
        // from: '2021-03-02',
        // to: '2021-03-02',
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
        this.f_criteria = 'day';
        break;
      case 'Yesterday':
        this.disable_criteria = [0, 1, 1, 1, 1, 1, 1];
        this.f_criteria = 'day';
        break;
      case 'This week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'days';
        break;
      case 'Last week':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'days';
        break;
      case 'This month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'week';
        break;
      case 'Last month':
        this.disable_criteria = [1, 0, 1, 1, 1, 1, 1];
        this.f_criteria = 'week';
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

  apply_filter(){
    this._fetchNetsale()
  }

  set_data(data){
    if(data.hasOwnProperty('producted_list')){
      this.daily_finished_products = data.producted_list.map(item => {
        return {
          name: item.item_name,
          amount: item.product_amount,
          code: item.item_code,
          finished_time: item.time_stamp,
          best_serving_by: item.best_serving_by,
          price: item.cost,
          //timestamp: item.timestamp
        }
      })
    }
    if(data.hasOwnProperty('pos_usage')){
      this.pos_daily_usage = data.pos_usage.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          amount: item.product_amount,
          price: item.cost,
          //timestamp: item.timestamp
        }
      })
    }
    if(data.hasOwnProperty('dispose_rate_list')){
      this.pos_daily_dispose = data.dispose_rate_list.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          amount: item.product_amount,
          dispose_amount: item.dispose,
          rate: item.waste_rate,
          //timestamp: item.timestamp
        }
      })
    }

    if(data.hasOwnProperty('ingredient_list')){
      this.daily_ingredients = data.ingredient_list.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          amount: item.material_amount,
          price: item.cost,
          bag: item.bag,
          //timestamp: item.timestamp
        }
      })
    }
    if(data.hasOwnProperty('dispose_list')){
      this.daily_ingredients_dispose = data.dispose_list.map(item => {
        return {
          code: item.item_code,
          name: item.item_name,
          //amount: item.product_amount,
          price: item.cost,
          //timestamp: item.timestamp
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
          price: item.cost,
          //timestamp: item.timestamp
        }
      })
    }
    this.uniq_finished_products_code = []
    this.uniq_finished_products_name = []
    this.daily_finished_products.forEach(item => {
      if(!this.uniq_finished_products_code.includes(item.code)){
        this.uniq_finished_products_code.push(item.code)
        this.uniq_finished_products_name.push(item.name)
      }
    })
    this.selected_finished_product = this.daily_finished_products.length != 0 ? this.uniq_finished_products_name[0] : ""
    this.filter_item_change()
  }
  group_filtered_data(){
    if(this.f_criteria == 'day'){
      this.filtered_daily_finished_products = [this.filtered_daily_finished_products.reduce((arr, item) => {
        if(!arr['name']){
          arr['name'] = item['name']
          arr['code'] = item['code']
          arr['amount'] = 0
          arr['price'] = 0
        }
        arr['amount'] += parseFloat(item['amount'])
        arr['price'] += parseFloat(item['price'])
        return arr
      }, {})]
      this.filtered_pos_daily_usage = [this.filtered_pos_daily_usage.reduce((arr, item) => {
        if(!arr['name']){
          arr['name'] = item['name']
          arr['code'] = item['code']
          arr['amount'] = 0
          arr['price'] = 0
        }
        arr['amount'] += parseFloat(item['amount'])
        arr['price'] += parseFloat(item['price'])
        return arr
      }, {})]
      this.filtered_pos_daily_dispose = [this.filtered_pos_daily_dispose.reduce((arr, item) => {
        if(!arr['name']){
          arr['name'] = item['name']
          arr['code'] = item['code']
          arr['amount'] = 0
          arr['dispose_amount'] = 0
        }
        arr['amount'] += parseFloat(item['amount'])
        arr['dispose_amount'] += parseFloat(item['dispose_amount'])
        return arr
      }, {})]

      this.filtered_daily_ingredients = [this.filtered_daily_ingredients.reduce((arr, item) => {
        if(!arr['name']){
          arr['name'] = item['name']
          arr['code'] = item['code']
          arr['amount'] = 0
          arr['price'] = 0
        }
        arr['amount'] += parseFloat(item['amount'])
        arr['price'] += parseFloat(item['price'])
        return arr
      }, {})]
      this.filtered_daily_ingredients_dispose = [this.filtered_daily_ingredients_dispose.reduce((arr, item) => {
        if(!arr['name']){
          arr['name'] = item['name']
          arr['code'] = item['code']
          arr['price'] = 0
        }
        arr['price'] += parseFloat(item['price'])
        return arr
      }, {})]
      this.filtered_pos_daily_ingredient = [this.filtered_pos_daily_ingredient.reduce((arr, item) => {
        if(!arr['name']){
          arr['name'] = item['name']
          arr['code'] = item['code']
          arr['amount'] = 0
          arr['price'] = 0
        }
        arr['amount'] += parseFloat(item['amount'])
        arr['price'] += parseFloat(item['price'])
        return arr
      }, {})]

    }
    else if (this.f_criteria == 'days'){

    }
    else if (this.f_criteria == 'week'){

    }else{

    }
    this.render_chart()
  }
  render_chart(){
    // Cook, POS usage & Disposal compare
    this.daily_finished_products_comparison.xaxis.categories = []
    this.daily_finished_products_comparison.series = []
    if(this.filtered_daily_finished_products.length > 0){
      this.daily_finished_products_comparison.xaxis.categories.push(this.filtered_daily_finished_products[0].name ? this.filtered_daily_finished_products[0].name : '')
      this.daily_finished_products_comparison.series.push(
        {
          name: "Kitchen cook",
          data: [
            this.filtered_daily_finished_products[0].amount ? this.filtered_daily_finished_products[0].amount : 0
          ]
        }
      )
    }
    if(this.filtered_pos_daily_usage.length > 0){
      this.daily_finished_products_comparison.series.push(
        {
          name: "POS usage",
          data: [
            this.filtered_pos_daily_usage[0].amount ? this.filtered_pos_daily_usage[0].amount : 0
          ]
        }
      )
    }
    if(this.filtered_pos_daily_dispose.length > 0){
      this.daily_finished_products_comparison.series.push(
        {
          name: "POS disposal",
          data: [
            this.filtered_pos_daily_dispose[0].dispose_amount ? this.filtered_pos_daily_dispose[0].dispose_amount : 0
          ]
        }
      )
    }

    // Raw material and Disposal
    this.pos_daily_usage_comparison.xaxis.categories = []
    this.pos_daily_usage_comparison.series = []
    if(this.filtered_daily_ingredients.length > 0) {
      this.pos_daily_usage_comparison.xaxis.categories.push(this.filtered_daily_ingredients[0].name ? this.filtered_daily_ingredients[0].name : '')
      this.pos_daily_usage_comparison.series.push({
        name: "Kitchen RM usage",
        data: [
          this.filtered_daily_ingredients[0].amount ? this.filtered_daily_ingredients[0].amount : 0,
        ]
      })
    }
    if(this.filtered_pos_daily_ingredient.length > 0){
      this.pos_daily_usage_comparison.series.push({
        name: "POS RM usage",
        data: [
          this.filtered_pos_daily_ingredient[0].amount ? this.filtered_pos_daily_ingredient[0].amount : 0,
        ]
      })
    }
    if(this.filtered_daily_ingredients_dispose.length > 0){
      this.pos_daily_usage_comparison.series.push({
        name: "Kitchen dispose",
        data: [
          this.filtered_daily_ingredients_dispose[0].dispose_amount ? this.filtered_daily_ingredients_dispose[0].dispose_amount : 0,
        ]
      })
    }

    // Netsale, Material cost, Waste cost comparison
    this.netsale_cook_dispose_compare_piechart.dataSource.data = []
    this.netsale_cook_dispose_compare_piechart.dataSource.data.push({
      label: "Netsale",
      value: this.netsale
    })
    if(this.filtered_daily_ingredients.length > 0){
      this.netsale_cook_dispose_compare_piechart.dataSource.data.push({
        label: "Material cost",
        value: this.filtered_daily_ingredients[0].price ? this.filtered_daily_ingredients[0].price : 0
      })
    }
    if(this.filtered_daily_ingredients_dispose.length > 0){
      this.netsale_cook_dispose_compare_piechart.dataSource.data.push({
        label: "Waste cost",
        value: this.filtered_daily_ingredients_dispose[0].price ? this.filtered_daily_ingredients_dispose[0].price : 0
      })
    }
  }
  filter_item_change(){
    this.filtered_daily_finished_products = []
    setTimeout(() => {
      this.filtered_daily_finished_products = [...this.daily_finished_products.filter(item => item.name.toLowerCase() == this.selected_finished_product.toLowerCase())]
      this.filtered_pos_daily_usage = [...this.pos_daily_usage.filter(item => item.name.toLowerCase() == this.selected_finished_product.toLowerCase())]
      this.filtered_pos_daily_dispose = [...this.pos_daily_dispose.filter(item => item.name.toLowerCase() == this.selected_finished_product.toLowerCase())]

      this.filtered_daily_ingredients = [...this.daily_ingredients.filter(item => item.name.toLowerCase() == this.selected_finished_product.toLowerCase())]
      this.filtered_daily_ingredients_dispose = [...this.daily_ingredients_dispose.filter(item => item.name.toLowerCase() == this.selected_finished_product.toLowerCase())]
      this.filtered_pos_daily_ingredient = [...this.pos_daily_ingredient.filter(item => item.name.toLowerCase() == this.selected_finished_product.toLowerCase())]
      this.group_filtered_data()
    }, 100)
  }
  select_item(name){
    this.selected_finished_product = name
    this.filter_item_change()
  }
}
