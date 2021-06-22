import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../core/services/api.service';
import { ParseService } from '../../core/services/parse.service';
import { CookieService } from '../../core/services/cookie.service';
import { HistoryService } from '../../core/services/history.service';
import { AuthenticationService } from '../../core/services/auth.service';
import { ExportService } from '../../core/services/export.service';

import { revenueAreaChart, targetsBarChart, salesDonutChart, ordersData } from './data';

import { ChartType, OrdersTable } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Dashboard component - handling dashboard with sidear and content
 */
export class DashboardComponent implements OnInit {

  // Init sum empty values for 10 days
  _10_days = [];
  sale_division = 7 // Weekly. 15, 30, 365

  _15_days    = [];
  weekdays    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeks       = ['First week', 'Second week', 'Third week', 'Forth week', 'Fifth week'];
  month3      = ['First 10 days', 'Second 10 days', 'Third 10 days'];
  months      = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private apiService: ApiService, private cookieService: CookieService, private authService: AuthenticationService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

  revenueAreaChart: ChartType;
  targetsBarChart: ChartType;
  salesDonutChart: ChartType;
  ordersData: OrdersTable[];

  // Dashboard date
  dash_date: string = moment().format('YYYY-MM-DD');
  // Current user's shops and database
  user_database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
  user_shops = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
  current_shop: string;
  date_ranges: Object;

  // Data from API
  db_error: boolean = false;

  sum_data: Object;
  today_items = [];

  avg = 0;

  // Loaders
  sum_loading = false;
  sale_loading = false;
  payment_loading = false;

  f_criteria: string = 'day';
  filter_range: string;
  filter_date: Object;

  one_day = true

  dates = []
  selected_date = ''
  hourly_data = []
  hourly_loading = false

  ngOnInit() {
      // Set the default shop as the first shop of the shop list
    this.current_shop = this.user_shops[0]
    this.date_ranges = {
      labels: ['Today', 'Yesterday', 'Last 7 days', 'This week', 'Last week', 'Last 30 days', 'This month', 'Last month', 'This year', 'Last year', 'All time', 'Custom range'],
      ranges: [
        { // Today
          from: moment().format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD')
        },
        { // Yesterday
          from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'days').format('YYYY-MM-DD')
        },
        { // Last 7 days
          from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD')
        },
        { // This week
          from: moment().startOf('week').format('YYYY-MM-DD'),
          to: moment().endOf('week').format('YYYY-MM-DD')
        },
        { // Last week
          from: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
          to: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')
        },
        { // Last 30 days
          from: moment().subtract(30, 'days').format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD')
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
    
    this.refresh_values();

    this._fetchData();
    this._fetchSumData();
    //this.historyService.logHistory('page', 'Dashboard visit. Checked dashboard data for ' + this.current_shop + ' on ' + this.dash_date);
  }
  filter_range_change(){
    this.filter_date = this.date_ranges['ranges'][this.date_ranges['labels'].indexOf(this.filter_range)];
    if(this.filter_range == 'Custom range'){
      document.querySelector('#filter_date_range').removeAttribute('disabled');
    }else{
      document.querySelector('#filter_date_range').setAttribute('disabled', 'true');
    }

    if(this.filter_range == 'Yesterday' || this.filter_range == 'Today'){
      this.one_day = true 
    }else{
      this.one_day = false
    }
    if(this.filter_range != 'Custom range'){
      this.apply_filter()
    }
  }
  filter_date_change(e){
    let from = ''
    let to = ''
    if(e.target.value.includes('to')){
      from = e.target.value.split(' to ')[0]
      to = e.target.value.split(' to ')[1]
    }else{
      from = e.target.value
      to = e.target.value
    }
    this.filter_date['from'] = from
    this.filter_date['to'] = to
  }
  private _fetchData() {
    this.revenueAreaChart = revenueAreaChart;
    this.targetsBarChart = targetsBarChart;
    this.salesDonutChart = salesDonutChart;
    this.ordersData = ordersData;
  }
  // Fetch netsale, transactions, average bill and discounts of choosen date
  private _fetchSumData(){
    this.db_error = false;
    this.sum_loading = true;

    this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
    this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];

    // if(this.filter_date['from'] == this.filter_date['to']){
    //   this.filter_date['from'] = moment(this.filter_date['to']).subtract(10, 'days').format('YYYY-MM-DD')
    // }

    this.apiService.sum_data(this.parseService.encode({
      from: this.filter_date['from'],
      to: this.filter_date['to'],
      shop: this.current_shop,
      db: this.user_database,
      servername: this.authService.currentUser().servername,
      serverpassword: this.authService.currentUser().serverpassword,
      uid: this.authService.currentUser().uid
    }))
      .pipe(first())
      .subscribe(
        data => {
          this.sum_loading = false;
          let sum_data = data['data']
          if(data['status'] == 'success'){
              this.avg = sum_data.avg[0].avg_per_item;
              // Get netsale
              for(let item of sum_data.netsale){
                if(parseInt(item.d.split('-')[1]) < 10){
                  item.d = item.d.split('-')[0] + '-0' + item.d.split('-')[1] + '-' + item.d.split('-')[2];
                }
                if(parseInt(item.d.split('-')[2]) < 10){
                  item.d = item.d.split('-')[0] + '-' + item.d.split('-')[1] + '-0' + item.d.split('-')[2];
                }
                if(this._10_days.indexOf(item.d) > -1){
                  this.sum_data['netsale'][this._10_days.indexOf(item.d)] = parseFloat(item.netsale ? item.netsale : 0);
                  this.sum_data['article_count'][this._10_days.indexOf(item.d)] = parseFloat(item.article_count ? item.article_count : 0);
                }
              }
              // Get transaction and average bill
              for(let item of sum_data.transaction){
                if(parseInt(item.d.split('-')[1]) < 10){
                  item.d = item.d.split('-')[0] + '-0' + item.d.split('-')[1] + '-' + item.d.split('-')[2];
                }
                if(parseInt(item.d.split('-')[2]) < 10){
                  item.d = item.d.split('-')[0] + '-' + item.d.split('-')[1] + '-0' + item.d.split('-')[2];
                }
                if(this._10_days.indexOf(item.d) > -1){
                  this.sum_data['transaction'][this._10_days.indexOf(item.d)] = parseFloat(item.transaction_count ? item.transaction_count : 0);
                  this.sum_data['average_bill'][this._10_days.indexOf(item.d)] = parseFloat(item.average_bill ? item.average_bill : 0).toFixed(2);
                }
              }
              // Get tip
              for(let item of sum_data.tip){
                if(parseInt(item.d.split('-')[1]) < 10){
                  item.d = item.d.split('-')[0] + '-0' + item.d.split('-')[1] + '-' + item.d.split('-')[2];
                }
                if(parseInt(item.d.split('-')[2]) < 10){
                  item.d = item.d.split('-')[0] + '-' + item.d.split('-')[1] + '-0' + item.d.split('-')[2];
                }
                if(this._10_days.indexOf(item.d) > -1){
                  this.sum_data['tip'][this._10_days.indexOf(item.d)] = parseFloat(item.tip);
                }
              }
              // Get promotion
              for(let item of sum_data.promotion){
                if(parseInt(item.d.split('-')[1]) < 10){
                  item.d = item.d.split('-')[0] + '-0' + item.d.split('-')[1] + '-' + item.d.split('-')[2];
                }
                if(parseInt(item.d.split('-')[2]) < 10){
                  item.d = item.d.split('-')[0] + '-' + item.d.split('-')[1] + '-0' + item.d.split('-')[2];
                }
                if(this._10_days.indexOf(item.d) > -1){
                  this.sum_data['promotion'][this._10_days.indexOf(item.d)] = parseFloat(item.promotion ? item.promotion : 0);
                }
              }
              // Get discount
              for(let item of sum_data.discount){
                if(parseInt(item.d.split('-')[1]) < 10){
                  item.d = item.d.split('-')[0] + '-0' + item.d.split('-')[1] + '-' + item.d.split('-')[2];
                }
                if(parseInt(item.d.split('-')[2]) < 10){
                  item.d = item.d.split('-')[0] + '-' + item.d.split('-')[1] + '-0' + item.d.split('-')[2];
                }
                if(this._10_days.indexOf(item.d) > -1){
                  this.sum_data['discount'][this._10_days.indexOf(item.d)] = parseFloat(item.discount ? item.discount : 0);
                  this.sum_data['grossale'][this._10_days.indexOf(item.d)] = (this.sum_data['netsale'][this._10_days.indexOf(item.d)] - parseFloat(item.discount ? item.discount : 0)).toFixed(2);
                }
              }
              // Get tax
              for(let item of sum_data.tax){
                if(parseInt(item.d.split('-')[1]) < 10){
                  item.d = item.d.split('-')[0] + '-0' + item.d.split('-')[1] + '-' + item.d.split('-')[2];
                }
                if(parseInt(item.d.split('-')[2]) < 10){
                  item.d = item.d.split('-')[0] + '-' + item.d.split('-')[1] + '-0' + item.d.split('-')[2];
                }
                if(this._10_days.indexOf(item.d) > -1){
                  this.sum_data['tax'][this._10_days.indexOf(item.d)] = parseFloat(item.tax ? item.tax : 0);
                }
              }
              this._fetchPaymentData();
            }else{
              this.db_error = true;
            }
        },
        error => {
            this.db_error = true;
            this.sum_loading = false;
        }
      )
  }
  sum_values(data){
    let sum = 0
    data.forEach(item => {
      sum += parseFloat(item)
    })
    return sum
  }
  // Fetch %d netsales
  private _fetchSaleData(){
      this.dash_date = moment(this.dash_date).format('YYYY-MM-DD');

      this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
      this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];

      this.db_error = false;
      this.sale_loading = true;
      this._15_days = [];
      let x_axis = [];
      let temp_from, temp_to;
      if(this.sale_division == 7){
        temp_from = moment(this.filter_date['to']).startOf('week').format('YYYY-MM-DD');
        temp_to = moment(this.filter_date['to']).endOf('week').format('YYYY-MM-DD');
        x_axis = [...this.weekdays.map((item, idx) => {
          return moment(this.filter_date['to']).startOf('week').add(idx, 'days').format('DD, MMM ') + item
        })];
        
      }else if(this.sale_division == 15){
        if(parseInt(this.filter_date['to'].split('-')[2]) < 16){
          temp_from = moment(this.filter_date['to']).startOf('month').format('YYYY-MM-DD');
          temp_to = moment(this.filter_date['to']).format('YYYY-MM-') + '15';
          for(let i = 1; i < 16; i++){
            this._15_days.push(i.toString() + ' ' + moment(this.filter_date['to']).format('MMM'));
          }
        }else{
          temp_from = moment(this.filter_date['to']).format('YYYY-MM-') + '16';
          temp_to = moment(this.filter_date['to']).endOf('month').format('YYYY-MM-DD');
          for(let i = 16; i < parseInt(moment(this.filter_date['to']).endOf('month').format('DD')) + 1; i++){
            this._15_days.push(i.toString() + ' ' + moment(this.filter_date['to']).format('MMM'));
          }
        }
        x_axis = [...this._15_days];
      }else if(this.sale_division == 10){
        temp_from = moment(this.filter_date['to']).startOf('month').format('YYYY-MM-DD');
        temp_to = moment(this.filter_date['to']).endOf('month').format('YYYY-MM-DD');
        x_axis = [...this.month3];
      }else if(this.sale_division == 30){
        temp_from = moment(this.filter_date['to']).startOf('month').format('YYYY-MM-DD');
        temp_to = moment(this.filter_date['to']).endOf('month').format('YYYY-MM-DD');
        x_axis = [...this.weeks];
      }else{
        temp_from = moment(this.filter_date['to']).startOf('year').format('YYYY-MM-DD');
        temp_to = moment(this.filter_date['to']).endOf('year').format('YYYY-MM-DD');
        x_axis = [...this.months];
      }
      this.apiService.sale_data(this.parseService.encode({
        from: temp_from,
        to: temp_to,
        shop: this.current_shop,
        db: this.user_database,
        division: this.sale_division,
        servername: this.authService.currentUser().servername,
        serverpassword: this.authService.currentUser().serverpassword,
        uid: this.authService.currentUser().uid
      }))
        .pipe(first())
        .subscribe(
          data => {
            this.sale_loading = false;
            if(data['status'] == 'success'){
              let sale_data = data['data'].division_sale;
              let y_axis = [];
              for(let i = 0; i < x_axis.length; i++){
                y_axis.push(0);
              }
              if(this.sale_division == 7){
                for(let item of sale_data){
                  y_axis[parseInt(item.d) - 1] = parseFloat(item.netsale);
                }
              }else if(this.sale_division == 15){
                if(x_axis[0].split(' ')[0] == '1'){
                  for(let item of sale_data){
                    y_axis[parseInt(item.d) - 1] = parseFloat(item.netsale);
                  }
                }else{
                  for(let item of sale_data){
                    y_axis[parseInt(item.d) - 16] = parseFloat(item.netsale);
                  }
                }
              }else if(this.sale_division == 10){
                let idx = 0;
                for(let item of sale_data){
                  y_axis[idx++] = parseFloat(item.netsale);
                }
              }else if(this.sale_division == 30){
                for(let item of sale_data){
                  y_axis[parseInt(item.d) - moment(moment(this.filter_date['to']).format('YYYY-MM-') + '01').week()] = parseFloat(item.netsale);
                }
              }else{
                for(let item of sale_data){
                  y_axis[parseInt(item.d) - 1] = parseFloat(item.netsale);
                }
              }
              this.revenueAreaChart.xaxis.categories = [...x_axis];
              this.revenueAreaChart.series[0].data = [...y_axis];

            }else{
              this.db_error = true;
            }
          },
          error => {
            this.db_error = true;
            this.sale_loading = false;
          }
        )
  }
  //Fetch hourly detail and payment detail
  private _fetchPaymentData(){
      this.dash_date = moment(this.dash_date).format('YYYY-MM-DD');

      this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
      this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
      if(this.one_day){
        this.filter_date['from'] = this.filter_date['to']
      }
      this.db_error = false;
      this.payment_loading = true;
      this.today_items = [];
      this.salesDonutChart.series = [];
      this.salesDonutChart.labels = [];
      this.targetsBarChart.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.apiService.payment_data(this.parseService.encode({
          from: this.filter_date['from'],
          to: this.filter_date['to'],
          shop: this.current_shop,
          db: this.user_database,
          servername: this.authService.currentUser().servername,
          serverpassword: this.authService.currentUser().serverpassword,
          uid: this.authService.currentUser().uid
      }))
          .pipe(first())
          .subscribe(
              data => {
                  this.payment_loading = false;
                  if(data['status'] == 'success'){
                      let payment_data = data['data'];
                      this.hourly_data = [...payment_data.hourly_sale]
                      this.date_change()
                      // Payment detail
                      for(let item of payment_data.payment_detail){
                          this.salesDonutChart.series.push(parseFloat(item.amount));
                          this.salesDonutChart.labels.push(item.payment_description);
                      }
                      // Today items
                      this.today_items = [...payment_data.today_items];
                  }else{
                      this.db_error = true;
                  }
                  this._fetchSaleData();
              },
              error => {
                  this.db_error = true;
                  this.payment_loading = false;
              }
          )
  }
  /**
  * Component functions
  */
  readable_date(date) {
    return moment(date).format('DD, MMM')
  }
  readable_month(date) {
    return moment(date).format('MMMM YYYY')
  }
  refresh_values(){
    this._10_days = [];
    this.dates = []
    let empty_values = [];
    let count = moment(this.filter_date['to']).diff(this.filter_date['from'], 'days') + 1
    for(let i = count; i > 0; i--){
      this.dates.push(moment(this.filter_date['to']).subtract(i - 1, 'days').format('YYYY-MM-DD'));
    }
    this.selected_date = this.dates[0]
    if(count == 1){
      count = 10
    }
    for(let i = count; i > 0; i--){
      this._10_days.push(moment(this.filter_date['to']).subtract(i - 1, 'days').format('YYYY-MM-DD'));
      empty_values.push(0);
    }
    this.sum_data = {
      netsale:        [...empty_values],
      transaction:    [...empty_values],
      average_bill:   [...empty_values],
      discount:       [...empty_values],
      tip:            [...empty_values],
      tax:            [...empty_values],
      promotion:      [...empty_values],
      grossale:       [...empty_values],
      article_count:  [...empty_values]
    };
  }
  apply_filter(){
      // date range format change to string
    this.dash_date = moment(this.dash_date).format('YYYY-MM-DD');
    this.refresh_values();
    this._fetchSumData();
    this.historyService.logHistory('page', 'Dashboard visit. Checked dashboard data for ' + this.current_shop + ' on ' + this.dash_date);
  }
  // Sumdata functions
  get_percent(c: any, p: any){
    if(parseInt(c) == 0){
      return 0;
    }else if(parseInt(p) == 0){
      if(c > 0){
        return 100;
      }else{
        return -100;
      }
    }else{
      return ((c - p) / Math.abs(p) * 100).toFixed(2);
    }
  }
  get_hex_color(c: any, p: any){
    if((c == 0) && (p == 0)){
      return '#ff00ff'; // Green on netural
    }else if((c == 0) && (p != 0)){
      return '#ff0000'; // red on c == 0
    }else if((c != 0) && (p == 0)){
      if(p > 0){
        return '#0000ff';
      }else{
        return '#ff0000';
      }
    }else{
      let st = (c - p) / Math.abs(p) * 255;
      if (st < -255) { st = -255; }
      if (st > 255) { st = 255; }
      st = parseInt(st.toString());
      if (st < 0) {
        return `rgb(${ 0 - st }, 0, ${ 255 + st })`;
      } else {
        return `rgb(0, ${ st }, ${ 255 - st })`;
      }
    }
  }
  // Saledata functions
  change_division(division: any){
    this.sale_division = division;
    this._fetchSaleData();
  }
  date_change(){
    this.hourly_loading = true
    this.targetsBarChart = targetsBarChart
    this.targetsBarChart.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let hourly_data = [...this.hourly_data.filter(item => moment(item.d, 'YYYY-M-D').format('YYYY-MM-DD') == this.selected_date)]
    //Hourly sale
    for(let item of hourly_data){
      this.targetsBarChart.series[0].data[parseInt(item.h)] = parseInt(item.transaction_count);
    }
    setTimeout(() => {
      this.hourly_loading = false
    }, 500)
  }
}
