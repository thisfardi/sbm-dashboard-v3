import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { ChartType } from '../charts.model';
import { amountChart, ratioChart, itemChart } from '../data';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    // Filters
    kitchens = [];
    company: string = JSON.parse(this.cookieService.getCookie('currentUser')).company;
    date_ranges: Object;

    f_criteria: string = 'hour';
    f_group: string = 'group_a_id';
    f_causals: Object = [];
    f_causals_checked = [];

    disable_criteria = [0, 1, 1, 1, 1, 1, 1]; // hour, day, weekday, week, 10days, month, year
    // Loaders
    causal_loading: Boolean = false;
    item_loading: Boolean = false;

    db_error: Boolean = false;
    causal_error: Boolean = false;

    advanced_filters: Boolean = false;

    filter_range: string;
    filter_date: Object;
    filter_kitchen: string;

    amount_chart: ChartType;
    item_chart: ChartType;
    ratio_chart: ChartType;

    total_cooking_amount;
    total_cooked_amount;
    total_disposed_amount;

    disposal_ratio;
    disposal_ratio_including_cooking_amount;

    history: Object;

    constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

    _fetchShopIds(){
      this.db_error = false;
      this.item_loading = true;
      this.apiService.kitchens(this.parseService.encode({
          company: this.company
      })).pipe(first())
      .subscribe(
          data => {
              data['res'].forEach(item => {
                this.kitchens.push(item['name'])
              });
              this.filter_kitchen = this.kitchens[0]
              this.item_loading = false;
              this._fetchItemHistory()
          },
          error => {
              this.db_error = true;
              this.item_loading = false;
          }
      )
    }

    _fetchItemHistory(){
        this.db_error = false;
        this.item_loading = true;

        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        // Force to hour view on one day is selected
        if(this.filter_date['from'] == this.filter_date['to']){
            this.f_criteria = 'hour';
        }
        this.apiService.item_history(this.parseService.encode({
            kitchen: this.filter_kitchen,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            d: this.f_criteria
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.render_item_amount_history(data['amount_history']);
                    this.render_item_history(data['item_history']);
                    this.history = [...data['history']]
                    this.item_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.item_loading = false;
                }
            )
    }
    render_item_amount_history(data){

        let format = '';
        if(this.f_criteria == 'hour'){
          format = 'HH'
        }else if(this.f_criteria == 'day'){
          format = 'DD'
        }else if(this.f_criteria == 'month'){
          format = 'MM'
        }else{
          format = 'YYYY'
        }
        let x_axis = [...this.getXAxis()];

        let t_cooking_started = 0;
        let t_cooking_finished = 0;
        let t_disposed = 0;
        let cooking_started = {
            name: 'Cook started',
            data: []
        }
        let cooking_finished = {
            name: 'Cook finished',
            data: []
        }
        let disposed = {
            name: 'Disposed',
            data: []
        }
        for(let item of x_axis){
            cooking_started.data.push(0);
            cooking_finished.data.push(0);
            disposed.data.push(0);
        }
        for(let time of x_axis){
            for(let item of data){
                if(time == item.d){
                  if(item.type == 'cooking_finished'){
                    t_cooking_finished += parseFloat(item.amount);
                    cooking_finished.data[x_axis.indexOf(time)] = item.amount;
                  }else if(item.type == 'cooking_start'){
                    t_cooking_started += parseFloat(item.amount);
                    cooking_started.data[x_axis.indexOf(time)] = item.amount;
                  }else{
                    t_disposed += parseFloat(item.amount);
                    disposed.data[x_axis.indexOf(time)] = item.amount;
                  }
                }
            }
        }
        this.total_cooking_amount = t_cooking_started;
        this.total_cooked_amount = t_cooking_finished;
        this.total_disposed_amount = t_disposed;

        this.disposal_ratio = t_disposed / (t_cooking_finished + t_disposed);
        this.disposal_ratio_including_cooking_amount = t_disposed / (t_cooking_finished + t_cooking_started + t_disposed);

        this.amount_chart.series = [];
        this.amount_chart.xaxis.categories = [...x_axis];
        this.amount_chart.series.push(cooking_started);
        this.amount_chart.series.push(cooking_finished);
        this.amount_chart.series.push(disposed);
        this.ratio_chart.series = [t_cooking_started, t_cooking_finished, t_disposed];
        this.ratio_chart.labels = ['Cooking started', 'Cooking finished', 'Disposed items'];
    }
    render_item_history(data){
      let x_axis = [];
      data.forEach(item => {
        if(x_axis.indexOf(item.item_id) == -1) x_axis.push(item.item_id)
      })
      let cooking_started = {
          name: 'Cook started',
          data: []
      }
      let cooking_finished = {
          name: 'Cook finished',
          data: []
      }
      let disposed = {
          name: 'Disposed',
          data: []
      }
      for(let item of x_axis){
          cooking_started.data.push(0);
          cooking_finished.data.push(0);
          disposed.data.push(0);
      }
      for(let x of x_axis){
          for(let item of data){
              if(x == item.item_id){
                if(item.type == 'cooking_finished'){
                  cooking_finished.data[x_axis.indexOf(x)] = item.amount;
                }else if(item.type == 'cooking_start'){
                  cooking_started.data[x_axis.indexOf(x)] = item.amount;
                }else{
                  disposed.data[x_axis.indexOf(x)] = item.amount;
                }
              }
          }
      }
      this.item_chart.series = [];
      let real_x = [];
      real_x = [...x_axis.map(x => {
        let item = data.filter(item => {if(item.item_id == x) return item.item_name})[0]
        return item.item_name
      })]
      this.item_chart.xaxis.categories = [...real_x];
      this.item_chart.series.push(cooking_started);
      this.item_chart.series.push(cooking_finished);
      this.item_chart.series.push(disposed);
    }
    getXAxis(){
        let ret = [];
        let start = moment(this.filter_date['from']).format('YYYY-MM-DD');
        let end = moment(this.filter_date['to']).format('YYYY-MM-DD');

        if(this.f_criteria == 'hour'){
            start = moment(this.filter_date['from']).format('MM-DD') + '-00';
            end = moment(this.filter_date['to']).format('MM-DD') + '-23';
            do {
                ret.push(moment(start, 'MM-DD-HH').format('HH'));
                start = moment(start, 'MM-DD-HH').add(1, 'hours').format('MM-DD-HH');
            } while (start != end)
            ret.push(moment(end, 'MM-DD-HH').format('HH'));
        }else if(this.f_criteria == 'day'){
            do {
                ret.push(moment(start).format('DD'));
                start = moment(start).add(1, 'days').format('YYYY-MM-DD');
            } while (start != end)
            ret.push(moment(end).format('DD'));
        }else if(this.f_criteria == 'month'){
            start = moment(start).format('MM');
            end = moment(end).format('MM');
            do {
                ret.push(moment(start).format('MMM'));
                start = moment(start).add(1, 'months').format('MM');
            } while (start != end)
            ret.push(moment(end).format('MMM'));
        }else if(this.f_criteria == 'year'){
            start = moment('2015-01-01', 'YYYY-MM-DD').format('YYYY');
            end = moment().format('YYYY');
            do {
                ret.push(moment(start, 'YYYY').format('YYYY'));
                start = moment(start, 'YYYY').add(1, 'years').format('YYYY');
            } while (start != end)
            ret.push(moment(end, 'YYYY').format('YYYY'));
        }else{

        }
        return ret;
    }
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
        this.historyService.logHistory('page', `Kitchen page visit. Checked item history.`);
        this.amount_chart = amountChart;
        this.item_chart = itemChart;
        this.ratio_chart = ratioChart;
        this._fetchShopIds();
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
    toggle_advanced_filter(){
        this.advanced_filters = !this.advanced_filters;
    }
    criteria_change(e: any){
        this.f_criteria = e.target.value;
    }
    group_change(e: any){
        this.f_group = e.target.value;
    }
    causal_change(e: any){
        this.f_causals_checked = [];
        let causal_checked_tags = document.querySelectorAll('input[name="causal_checkbox"]:checked');
        for(let i = 0; i < causal_checked_tags.length; i++){
            this.f_causals_checked.push(causal_checked_tags[i]['value']);
        }
    }

    apply_filter(){
        this._fetchItemHistory();
    }
}
