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
  netsale_material_waste_comparison_chart
} from '../data';


@Component({
  selector: 'app-daily-analysis',
  templateUrl: './daily-analysis.component.html',
  styleUrls: ['./daily-analysis.component.scss']
})
export class DailyAnalysisComponent implements OnInit {

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
  shop_names = []
  selected_shop_id = -1
  error = ''

  daily_finished_products_comparison: ChartType
  pos_daily_usage_comparison: ChartType
  pos_daily_ingredient_comparison: ChartType
  netsale_material_waste_comparison: ChartType

  daily_finished_products = []

  pos_daily_usage = [
  ]

  pos_daily_ingredient = [
  ]

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
    this.netsale_material_waste_comparison = netsale_material_waste_comparison_chart

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
    this.daily_finished_products = []

    this.pos_daily_usage = [
    ]

    this.pos_daily_ingredient = [
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

  apply_filter(){
    this._fetchHistoryData()
  }

  set_data(data){
    console.log(data)

    if(data.hasOwnProperty('producted_list')){
      let items = []
      let item_names = []
      let amount_values = []
      this.daily_finished_products = [...data.producted_list]
      data.producted_list.forEach(item => {
        if(!items.includes(item.item_code)){
          items.push(item.item_code)
          item_names.push(item.item_name)
          amount_values.push(0)
        }
      })
      data.producted_list.forEach(item => {
        amount_values[items.indexOf(item.item_code)] += parseFloat(item.product_amount)
      })

      this.daily_finished_products_comparison.series = [
        {
          name: "Real production amount",
          data: [...amount_values]
        },
        {
          name: "Theoretical production amount",
          data: [...amount_values.map(item => (item + (-1) * (0.5 - Math.random()) * item * Math.random()))]
        }
      ]
      this.daily_finished_products_comparison.xaxis.categories = [...item_names]
    }

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

    this.pos_daily_usage_comparison.series = [
      {
        name: "Real usage amount",
        data: this.pos_daily_usage.map((item) => item.amount)
      },
      {
        name: "Theoretical usage amount",
        data: this.pos_daily_usage.map(item => (item.amount + (-1) * (0.5 - Math.random()) * item.amount * Math.random()))
      }
    ]
    this.pos_daily_usage_comparison.xaxis.categories = [
      ...this.pos_daily_usage.map((item) => item.name)
    ]

    this.pos_daily_ingredient_comparison.series = [
      {
        name: "Real ingredient usage amount",
        data: this.pos_daily_ingredient.map((item) => item.amount)
      },
      {
        name: "Theoretical ingredient usage amount",
        data: this.pos_daily_ingredient.map(item => (item.amount + (-1) * (0.5 - Math.random()) * item.amount * Math.random()))
      }
    ]
    this.pos_daily_ingredient_comparison.xaxis.categories = [
      ...this.pos_daily_ingredient.map((item) => item.name)
    ]


    this.netsale_material_waste_comparison.series = [2109.3, 981.2, 350.3]
    this.netsale_material_waste_comparison.labels = ["Netsale", "Material cost", "Waste cost"]

  }
}
