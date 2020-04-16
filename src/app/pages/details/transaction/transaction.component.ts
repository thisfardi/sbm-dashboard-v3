import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';

import { ChartType } from '../charts.model';
import { transChart, avgChart } from '../data';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

    // Filters
    database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
    shops: Object = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
    date_ranges: Object;

    f_criteria: string = 'day';
    f_group: string = 'group_a_id';
    f_causals: Object = [];
    f_causals_checked: Array<{}> = [];

    disable_criteria = [1, 0, 0, 0, 1, 1]; // hour, day, weekday, week, month, year
    // Loaders
    causal_loading: Boolean = false;
    trans_loading: Boolean = false;

    db_error: Boolean = false;
    causal_error: Boolean = false;

    trans_chart: ChartType;
    avg_chart: ChartType;

    trans_total = 0;
    avg_total = 0;

    advanced_filters: Boolean = false;

    filter_shop: string;
    filter_range: string;
    filter_date: Object;

    constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService) { }

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

        this._fetchCausals();

        this.trans_chart = transChart;
        this.avg_chart = avgChart;
    }
    public _fetchCausals(){
        this.causal_error = false;
        this.causal_loading = true;
        this.f_causals = [];
        this.apiService.causals(this.parseService.encode({
            db: this.database
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this.f_causals = [...data['data'].causals];
                        this.f_causals_checked = this.f_causals['map'](item => item.id.toString());
                        this._fetchTransactiosn();
                    }else{
                        this.causal_error = true;
                    }
                    this.causal_loading = false;
                },
                error => {
                    this.causal_error = true;
                    this.causal_loading = false;
                }
            )
    }
    public _fetchTransactiosn(){
        this.db_error = false;
        this.trans_loading = true;

        this.trans_total = 0;
        this.avg_total = 0;

        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        // Force to hour view on one day is selected
        if(this.filter_date['from'] == this.filter_date['to']){
            this.f_criteria = 'hour';
        }
        this.apiService.trans_details(this.parseService.encode({
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            d: this.f_criteria,
            group_id: this.f_group,
            causals: this.f_causals_checked
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        let trans_data = [...data['data'].transaction];
                        for(let item of trans_data){
                            this.trans_total += parseInt(item.qty);
                            this.avg_total += parseFloat(item.average_bill);
                        }
                        this.avg_total = this.avg_total / trans_data.length;
                        this.trans_data_render(trans_data);
                    }else{
                        this.db_error = true;
                    }
                    this.trans_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.trans_loading = false;
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
                this.disable_criteria = [0, 1, 1, 1, 1, 1];
                this.f_criteria = 'hour';
                break;
            case 'Yesterday':
                this.disable_criteria = [0, 1, 1, 1, 1, 1];
                this.f_criteria = 'hour';
                break;
            case 'This week':
                this.disable_criteria = [1, 0, 0, 1, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'Last week':
                this.disable_criteria = [1, 0, 0, 1, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'This month':
                this.disable_criteria = [1, 0, 0, 0, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'Last month':
                this.disable_criteria = [1, 0, 0, 0, 1, 1];
                this.f_criteria = 'day';
                break;
            case 'This year':
                this.disable_criteria = [1, 0, 0, 0, 0, 1];
                this.f_criteria = 'month';
                break;
            case 'Last year':
                this.disable_criteria = [1, 0, 0, 0, 0, 1];
                this.f_criteria = 'month';
                break;
            case 'All time':
                this.disable_criteria = [1, 0, 0, 0, 0, 0];
                this.f_criteria = 'year';
                break;
            case 'Custom range':
                this.disable_criteria = [0, 0, 0, 0, 0, 0];
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
        // Do actions
        this._fetchTransactiosn();
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
    trans_data_render(data){
        console.log(data)
        this.trans_chart.series = [];
        this.avg_chart.series = [];
        let x_axis = [...this.getXAxis()];
        let transaction = {
            name: 'Transactions',
            type: 'column',
            data: []
        };
        let avg = {
            name: 'Average bill',
            type: 'line',
            data: []
        }
        for(let item of x_axis){
            transaction.data.push(0);
            avg.data.push(0);
        }
        for(let time of x_axis){
            for(let item of data){
                if(this.f_criteria == 'hour'){
                    if(moment(time, 'HH, MMM DD').format('MM-DD-HH') == moment(item.d, 'YYYY-MM-DD-HH').format('MM-DD-HH')){
                        transaction.data[x_axis.indexOf(time)] = parseFloat(item.qty);
                        avg.data[x_axis.indexOf(time)] = parseFloat(item.average_bill);
                    }
                }else if(this.f_criteria == 'day'){
                    if(moment(time, 'DD MMM, YYYY').format('YYYY-MM-DD') == moment(item.d, 'YYYY-MM-DD').format('YYYY-MM-DD')){
                        transaction.data[x_axis.indexOf(time)] = parseFloat(item.qty);
                        avg.data[x_axis.indexOf(time)] = parseFloat(item.average_bill);
                    }
                }else if(this.f_criteria == 'weekday'){
                    if(moment(time, 'ddd, DD MMM').format('YYYY-MM-DD') == moment(item.d, 'YYYY-MM-DD').format('YYYY-MM-DD')){
                        transaction.data[x_axis.indexOf(time)] = parseFloat(item.qty);
                        avg.data[x_axis.indexOf(time)] = parseFloat(item.average_bill);
                    }
                }else if(this.f_criteria == 'week'){
                    if(moment(time, 'w, YYYY').format('YYYY-ww') == moment(item.d, 'YYYY-w').format('YYYY-ww')){
                        transaction.data[x_axis.indexOf(time)] = parseFloat(item.qty);
                        avg.data[x_axis.indexOf(time)] = parseFloat(item.average_bill);
                    }
                }else if(this.f_criteria == 'month'){
                    if(moment(time, 'MMM, YYYY').format('YYYY-MM') == moment(item.d, 'YYYY-MM').format('YYYY-MM')){
                        transaction.data[x_axis.indexOf(time)] = parseFloat(item.qty);
                        avg.data[x_axis.indexOf(time)] = parseFloat(item.average_bill);
                    }
                }else if(this.f_criteria == 'year'){
                    if(moment(time, 'YYYY').format('YYYY') == moment(item.d, 'YYYY').format('YYYY')){
                        transaction.data[x_axis.indexOf(time)] = parseFloat(item.qty);
                        avg.data[x_axis.indexOf(time)] = parseFloat(item.average_bill);
                    }
                }else{

                }
            }
        }
        if(this.f_criteria == 'hour'){
            x_axis = x_axis['map'](item => {
                return item.split(',')[0] + ':00';
            })
        }
        if(this.f_criteria == 'day'){
            x_axis = x_axis['map'](item => {
                return moment(item, 'DD MMM, YYYY').format('DD MMM');
            })
        }
        if(this.f_criteria == 'week'){
            x_axis = x_axis['map'](item => {
                return "Week " + item.split(',')[0] + ',' + item.split(',')[1];
            })
        }
        this.trans_chart.xaxis.categories = [...x_axis];
        this.trans_chart.series.push(transaction);
        this.avg_chart.xaxis.categories = [...x_axis];
        this.avg_chart.series.push(avg);
    }
}
