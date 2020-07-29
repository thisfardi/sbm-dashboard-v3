import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { ChartType } from '../charts.model';
import { itemChart, ratioChart } from '../data';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    // Filters
    database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
    shops: Object = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
    date_ranges: Object;

    f_criteria: string = 'day';
    f_group: string = 'group_a_id';
    f_causals: Object = [];
    f_causals_checked: Array<{}> = [];

    disable_criteria = [1, 0, 0, 0, 0, 1, 1]; // hour, day, weekday, week, 10days, month, year
    // Loaders
    causal_loading: Boolean = false;
    item_loading: Boolean = false;

    db_error: Boolean = false;
    causal_error: Boolean = false;

    advanced_filters: Boolean = false;

    filter_shop: string;
    filter_range: string;
    filter_date: Object;

    item_chart: ChartType;
    ratio_chart: ChartType;

    constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

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
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            d: this.f_criteria
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.render_item_history(data['res']);
                    this.item_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.item_loading = false;
                }
            )
    }
    render_item_history(data){
        console.log(data)
        let x_axis = [...this.getXAxis()];
        let t_cooked = 0;
        let t_disposed = 0;
        let cooked = {
            name: 'Cooked',
            type: 'line',
            data: []
        }
        let disposed = {
            name: 'Disposed',
            type: 'line',
            data: []
        }
        for(let item of x_axis){
            cooked.data.push(0);
            disposed.data.push(0);
        }
        for(let time of x_axis){
            for(let item of data){
                if(moment(time, 'DD MMM, YYYY').format('YYYY-MM-DD') == moment(item.d, 'YYYY-MM-DD').format('YYYY-MM-DD')){
                    t_cooked += parseFloat(item.cooked_qty);
                    t_disposed += parseFloat(item.disposed_qty);
                    cooked.data[x_axis.indexOf(time)] += parseFloat(item.cooked_qty);
                    disposed.data[x_axis.indexOf(time)] += parseFloat(item.disposed_qty);
                }
            }
        }
        this.item_chart.xaxis.categories = [...x_axis];
        this.item_chart.series.push(cooked);
        this.item_chart.series.push(disposed);
        this.ratio_chart.series = [t_cooked, t_disposed];
        this.ratio_chart.labels = ['Used for cooking', 'Disposed items'];
    }
    getXAxis(){
        let ret = [];
        let start = moment(this.filter_date['from']).format('YYYY-MM-DD');
        let end = moment(this.filter_date['to']).format('YYYY-MM-DD');

        if(this.f_criteria == 'hour'){
            start = moment(this.filter_date['from']).format('MM-DD-HH');
            end = moment(this.filter_date['to']).format('MM-DD') + '-23';
            do {
                ret.push(moment(start, 'MM-DD-HH').format('HH, MMM DD'));
                start = moment(start, 'MM-DD-HH').add(1, 'hours').format('MM-DD-HH');
            } while (start != end)
            ret.push(moment(end, 'MM-DD-HH').format('HH, MMM DD'));
        }else if(this.f_criteria == 'day'){
            do {
                ret.push(moment(start).format('DD MMM, YYYY'));
                start = moment(start).add(1, 'days').format('YYYY-MM-DD');
            } while (start != end)
            ret.push(moment(end).format('DD MMM, YYYY'));
        }else if(this.f_criteria == 'weekday'){
            do {
                ret.push(moment(start).format('ddd, DD MMM'));
                start = moment(start).add(1, 'days').format('YYYY-MM-DD');
            } while (start != end)
            ret.push(moment(end).format('ddd, DD MMM'));
        }else if(this.f_criteria == 'week'){
            do {
                ret.push(moment(start).format('w, YYYY'));
                start = moment(start).add(7, 'days').format('YYYY-MM-DD');
            } while (moment(start).format('w, YYYY') != moment(end).format('w, YYYY'))
        }else if(this.f_criteria == '10days'){
            ret = ['First 10 days', 'Second 10 days', 'Third 10 days'];
        }else if(this.f_criteria == 'month'){
            start = moment(start).format('YYYY-MM');
            end = moment(end).format('YYYY-MM');
            do {
                ret.push(moment(start).format('MMM, YYYY'));
                start = moment(start).add(1, 'months').format('YYYY-MM');
            } while (start != end)
            ret.push(moment(end).format('MMM, YYYY'));
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
        this.filter_shop = this.shops[0];
        this.date_ranges = {
            labels: ['Today', 'Yesterday', 'This week', 'Last week', 'This month', 'Last month', 'This year', 'Last year', 'All time', 'Custom range'],
            ranges: [
                { // Today
                    from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                    to: moment().subtract(1, 'days').format('YYYY-MM-DD')
                },
                { // Yesterday
                    from: moment().subtract(2, 'days').format('YYYY-MM-DD'),
                    to: moment().subtract(2, 'days').format('YYYY-MM-DD')
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
        this.filter_range = this.date_ranges['labels'][4];
        this.filter_date = this.date_ranges['ranges'][4];
        this.historyService.logHistory('page', `Kitchen page visit. Checked item history.`);
        this.item_chart = itemChart;
        this.ratio_chart = ratioChart;
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
                this.disable_criteria = [1, 0, 0, 1, 1, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'Last week':
                this.disable_criteria = [1, 0, 0, 1, 1, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'This month':
                this.disable_criteria = [1, 0, 0, 0, 0, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'Last month':
                this.disable_criteria = [1, 0, 0, 0, 0, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'This year':
                this.disable_criteria = [1, 0, 0, 0, 1, 0, 1];
                this.f_criteria = 'month';
                break;
            case 'Last year':
                this.disable_criteria = [1, 0, 0, 0, 1, 0, 1];
                this.f_criteria = 'month';
                break;
            case 'All time':
                this.disable_criteria = [1, 0, 0, 0, 1, 0, 0];
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
