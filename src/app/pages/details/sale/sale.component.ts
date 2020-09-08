import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { ChartType } from '../charts.model';
import { salesChart, causalChart } from '../data';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

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
    sale_loading: Boolean = false;

    advanced_filters: Boolean = false;

    filter_shop: string;
    filter_range: string;
    filter_date: Object;

    db_error: Boolean = false;
    causal_error: Boolean = false;

    sales_chart: ChartType;
    causal_chart: ChartType;


    // Table data
    causal_names = [];
    net_total = 0;
    peak_data = {
        date: moment().format('DD MMM'),
        value: 0
    }
    trending_causal = {
        name: 'Other',
        value: 0
    }
    table_data = {};

    sale_data = [];
    discount_data = [];
    discount_total = {
        amount: 0,
        qty: 0
    }
    other_data = {
        tip: 0,
        tax: 0,
        promotion: 0
    }

    constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

    ngOnInit() {
        this.filter_shop = this.shops[0];

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
        this.filter_range = this.date_ranges['labels'][4];
        this.filter_date = this.date_ranges['ranges'][4];

        this._fetchCausals();

        this.historyService.logHistory('page', 'Sale detail visit. Checked sale detail data for ' + this.filter_shop + ' from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to']);

        this.sales_chart = salesChart;
        this.causal_chart = causalChart;
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
                        this._fetchSaleDetails();
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

    private _fetchSaleDetails(){

        this.db_error = false;
        this.sale_loading = true;
        this.discount_total.amount = 0;
        this.discount_total.qty = 0;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        // Force to hour view on one day is selected
        if(this.filter_date['from'] == this.filter_date['to']){
            this.f_criteria = 'hour';
        }
        this.apiService.sale_details(this.parseService.encode({
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
                        this.discount_data = [...data['data'].discount];
                        for(let item of this.discount_data){
                            this.discount_total.amount += parseFloat(item.amount);
                            this.discount_total.qty += parseFloat(item.qty);
                        }
                        let others = [...data['data'].others];
                        for(let item of others){
                            if(item.description == 'tip'){
                                this.other_data.tip = item.amount;
                            }else if(item.description == 'promotion'){
                                this.other_data.promotion = item.amount;
                            }else{
                                this.other_data.tax = item.amount;
                            }
                        }
                        this.sale_data = [...data['data'].sale];
                        this.sale_data_render(this.sale_data);
                    }else{
                        this.db_error = true;
                    }
                    this.sale_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.sale_loading = false;
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
        this.historyService.logHistory('page', 'Sale detail visit. Checked sale detail data for ' + this.filter_shop + ' from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to']);
        this._fetchSaleDetails();
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

    // Renderers
    sale_data_render(data){

        this.causal_names = [];
        this.table_data = {};
        this.net_total = 0;

        this.peak_data = {
            date: moment().format('DD MMM'),
            value: 0
        }
        this.trending_causal = {
            name: 'Other',
            value: 0
        }

        let x_axis = [...this.getXAxis()];
        this.sales_chart.series = [];
        this.causal_chart.series = [];
        this.causal_chart.labels = [];
        let netsale = {
            name: 'Netsale',
            type: 'line',
            data: []
        };
        let causals = [];
        // Init to zero
        for(let item of x_axis){
            netsale.data.push(0);
        }
        // Init causals
        let _temp_causal = [];
        let _temp_causal_values = {
            names: [],
            values: []
        };
        for(let item of data){
            if(_temp_causal.indexOf(item.causal_desc) == -1){
                causals.push({
                    name: item.causal_desc,
                    type: 'line',
                    data: [...netsale.data]
                })
                _temp_causal.push(item.causal_desc);
            }
        }
        _temp_causal_values.names = [..._temp_causal];
        _temp_causal_values.values = [..._temp_causal['map'](item => {
            return 0;
        })]
        if(this.f_criteria == '10days'){
            for(let item of data){
                if(item.d == 'first'){
                    netsale.data[0] += parseFloat(item.netsale);
                    causals[_temp_causal.indexOf(item.causal_desc)].data[0] = item.netsale;
                    _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                }else if(item.d == 'second'){
                    netsale.data[1] += parseFloat(item.netsale);
                    causals[_temp_causal.indexOf(item.causal_desc)].data[1] = item.netsale;
                    _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                }else{
                    netsale.data[2] += parseFloat(item.netsale);
                    causals[_temp_causal.indexOf(item.causal_desc)].data[2] = item.netsale;
                    _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                }
            }
        }else{
            for(let time of x_axis){
                for(let item of data){
                    if(this.f_criteria == 'hour'){
                        if(moment(time, 'HH, MMM DD').format('MM-DD-HH') == moment(item.d, 'YYYY-MM-DD-HH').format('MM-DD-HH')){
                            netsale.data[x_axis.indexOf(time)] += parseFloat(item.netsale);
                            causals[_temp_causal.indexOf(item.causal_desc)].data[x_axis.indexOf(time)] = item.netsale;
                            _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                        }
                    }else if(this.f_criteria == 'day'){
                        if(moment(time, 'DD MMM, YYYY').format('YYYY-MM-DD') == moment(item.d, 'YYYY-MM-DD').format('YYYY-MM-DD')){
                            netsale.data[x_axis.indexOf(time)] += parseFloat(item.netsale);
                            causals[_temp_causal.indexOf(item.causal_desc)].data[x_axis.indexOf(time)] = item.netsale;
                            _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                        }
                    }else if(this.f_criteria == 'weekday'){
                        if(moment(time, 'ddd, DD MMM').format('YYYY-MM-DD') == moment(item.d, 'YYYY-MM-DD').format('YYYY-MM-DD')){
                            netsale.data[x_axis.indexOf(time)] += parseFloat(item.netsale);
                            causals[_temp_causal.indexOf(item.causal_desc)].data[x_axis.indexOf(time)] = item.netsale;
                            _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                        }
                    }else if(this.f_criteria == 'week'){
                        if(moment(time, 'w, YYYY').format('YYYY-ww') == moment(item.d, 'YYYY-w').format('YYYY-ww')){
                            netsale.data[x_axis.indexOf(time)] += parseFloat(item.netsale);
                            causals[_temp_causal.indexOf(item.causal_desc)].data[x_axis.indexOf(time)] = item.netsale;
                            _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                        }
                    }else if(this.f_criteria == 'month'){
                        if(moment(time, 'MMM, YYYY').format('YYYY-MM') == moment(item.d, 'YYYY-MM').format('YYYY-MM')){
                            netsale.data[x_axis.indexOf(time)] += parseFloat(item.netsale);
                            causals[_temp_causal.indexOf(item.causal_desc)].data[x_axis.indexOf(time)] = item.netsale;
                            _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                        }
                    }else if(this.f_criteria == 'year'){
                        if(moment(time, 'YYYY').format('YYYY') == moment(item.d, 'YYYY').format('YYYY')){
                            netsale.data[x_axis.indexOf(time)] += parseFloat(item.netsale);
                            causals[_temp_causal.indexOf(item.causal_desc)].data[x_axis.indexOf(time)] = item.netsale;
                            _temp_causal_values.values[_temp_causal.indexOf(item.causal_desc)] += parseFloat(item.netsale);
                        }
                    }else{

                    }
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

        this.sales_chart.xaxis.categories = [...x_axis];
        this.sales_chart.series.push(netsale);

        for(let item of netsale.data){
            this.net_total += item;
        }

        for(let item of causals){
            this.sales_chart.series.push(item);
        }

        this.table_data = {
            netsale: [...netsale.data],
            causal: [...causals]
        }

        // Peak data
        for(let item of netsale.data){
            if(this.peak_data.value < item){
                this.peak_data.value = item;
            }
        }
        this.peak_data.date = x_axis[netsale.data.indexOf(this.peak_data.value)];

        // trending causal
        for(let item of _temp_causal_values.values){
            if(this.trending_causal.value < item){
                this.trending_causal.value = item
            }
        }
        this.trending_causal.name = _temp_causal_values.names[_temp_causal_values.values.indexOf(this.trending_causal.value)];

        this.causal_chart.series = [..._temp_causal_values.values];
        this.causal_chart.labels = [..._temp_causal_values.names];

        this.causal_names = [..._temp_causal];


    }
}
