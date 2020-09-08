import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { netsalePeriodChart, transactionPeriodChart, avgPeriodChart, taxPeriodChart, tipPeriodChart, promotionPeriodChart, discountPeriodChart, paymentPeriodChart } from '../data';

@Component({
    selector: 'app-period',
    templateUrl: './period.component.html',
    styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

    // Filters
    database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
    shops: Object = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
    date_ranges: Object;

    filter_range: string;
    filter_date: Object;

    filter_range_secondary: string;
    filter_date_secondary: Object;

    filter_shop: string;

    sale_loading: Boolean = false;
    other_loading: Boolean = false;
    payment_loading: Boolean = false;

    db_error: Boolean = false;


    // Table data
    netsale_f = 0;
    netsale_s = 0;

    grossale_f = 0;
    grossale_s = 0;

    transaction_count_f = 0;
    transaction_count_s = 0;

    average_bill_f = 0;
    average_bill_s = 0;

    tip_f = 0;
    tip_s = 0;

    tax_f = 0;
    tax_s = 0;

    promotion_f = 0;
    promotion_s = 0;

    discount_amount_f = 0;
    discount_amount_s = 0;
    discount_qty_f = 0;
    discount_qty_s = 0;

    discount_descriptions = [];
    discount_detail_amount_f = [];
    discount_detail_qty_f = [];
    discount_detail_amount_s = [];
    discount_detail_qty_s = [];

    payment_amount_f = 0;
    payment_amount_s = 0;
    payment_qty_f = 0;
    payment_qty_s = 0;

    payment_descriptions = [];
    payment_detail_amount_f = [];
    payment_detail_qty_f = [];
    payment_detail_amount_s = [];
    payment_detail_qty_s = [];

    // Charts
    netsale_period_chart: Object;
    transaction_period_chart: Object;
    avg_period_chart: Object;
    tax_period_chart: Object;
    tip_period_chart: Object;
    promotion_period_chart: Object;
    discount_period_chart: Object;
    payment_period_chart: Object;

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

        this.filter_range_secondary = this.date_ranges['labels'][5];
        this.filter_date_secondary = this.date_ranges['ranges'][5];

        this.historyService.logHistory('page', 'Period compare page visit. Checked compare data data for ' + this.filter_shop + ' between from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to'] + ' and ' + this.filter_date_secondary['from'] + ' ~ ' + this.filter_date_secondary['to'] );

        this.netsale_period_chart = netsalePeriodChart;
        this.transaction_period_chart = transactionPeriodChart;
        this.avg_period_chart = avgPeriodChart;
        this.tax_period_chart = taxPeriodChart;
        this.tip_period_chart = tipPeriodChart;
        this.promotion_period_chart = promotionPeriodChart;
        this.discount_period_chart = discountPeriodChart;
        this.payment_period_chart = paymentPeriodChart;
        this._fetchSaleComparison();
    }
    filter_range_change(){
        this.filter_date = this.date_ranges['ranges'][this.date_ranges['labels'].indexOf(this.filter_range)];
        if(this.filter_range == 'Custom range'){
            document.querySelector('#filter_date_range').removeAttribute('disabled');
        }else{
            document.querySelector('#filter_date_range').setAttribute('disabled', 'true');
        }
    }
    filter_range_secondary_change(){
        this.filter_date_secondary = this.date_ranges['ranges'][this.date_ranges['labels'].indexOf(this.filter_range_secondary)];
        if(this.filter_range_secondary == 'Custom range'){
            document.querySelector('#filter_date_range_secondary').removeAttribute('disabled');
        }else{
            document.querySelector('#filter_date_range_secondary').setAttribute('disabled', 'true');
        }
    }
    apply_filter(){
        this.historyService.logHistory('page', 'Period compare page visit. Checked compare data data for ' + this.filter_shop + ' between from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to'] + ' and ' + this.filter_date_secondary['from'] + ' ~ ' + this.filter_date_secondary['to'] );
        this._fetchSaleComparison();
    }

    // APIs
    _fetchSaleComparison(){

        this.netsale_f = 0;
        this.netsale_s = 0;

        this.grossale_f = 0;
        this.grossale_s = 0;

        this.transaction_count_f = 0;
        this.transaction_count_s = 0;

        this.average_bill_f = 0;
        this.average_bill_s = 0;

        this.db_error = false;
        this.sale_loading = true;

        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];

        this.filter_date_secondary['from'] = moment(this.filter_date_secondary['from']).format('YYYY-MM-DD');
        this.filter_date_secondary['to'] = this.filter_date_secondary['to'] ? moment(this.filter_date_secondary['to']).format('YYYY-MM-DD') : this.filter_date_secondary['from'];
        this.apiService.sale_date_compare(this.parseService.encode({
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            from_secondary: this.filter_date_secondary['from'],
            to_secondary: this.filter_date_secondary['to'],
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        for(let item of data['data'].sales){
                            if(item.od == 'f'){
                                this.netsale_f = item.netsale;
                                this.grossale_f = item.grossale;
                            }else{
                                this.netsale_s = item.netsale;
                                this.grossale_s = item.grossale;
                            }
                        }
                        for(let item of data['data'].transactions){
                            if(item.od == 'f'){
                                this.transaction_count_f = item.transaction_count;
                                this.average_bill_f = item.average_bill;
                            }else{
                                this.transaction_count_s = item.transaction_count;
                                this.average_bill_s = item.average_bill;
                            }
                        }
                        this.netsale_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.netsale_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.netsale_s
                            }
                        ];
                        this.transaction_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.transaction_count_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.transaction_count_s
                            }
                        ];
                        this.avg_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.average_bill_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.average_bill_s
                            }
                        ];
                        this._fetchOthersComparison();
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
    _fetchOthersComparison(){

        this.tip_f = 0;
        this.tip_s = 0;

        this.tax_f = 0;
        this.tax_s = 0;

        this.promotion_f = 0;
        this.promotion_s = 0;

        this.discount_amount_f = 0;
        this.discount_amount_s = 0;
        this.discount_qty_f = 0;
        this.discount_qty_s = 0;

        this.discount_descriptions = [];
        this.discount_detail_amount_f = [];
        this.discount_detail_qty_f = [];
        this.discount_detail_amount_s = [];
        this.discount_detail_qty_s = [];

        this.db_error = false;
        this.other_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];

        this.filter_date_secondary['from'] = moment(this.filter_date_secondary['from']).format('YYYY-MM-DD');
        this.filter_date_secondary['to'] = this.filter_date_secondary['to'] ? moment(this.filter_date_secondary['to']).format('YYYY-MM-DD') : this.filter_date_secondary['from'];
        this.apiService.other_date_compare(this.parseService.encode({
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            from_secondary: this.filter_date_secondary['from'],
            to_secondary: this.filter_date_secondary['to'],
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        for(let item of data['data'].tip){
                            if(item.od == 'f'){
                                this.tip_f = item.tip;
                            }else{
                                this.tip_s = item.tip;
                            }
                        }
                        for(let item of data['data'].tax){
                            if(item.od == 'f'){
                                this.tax_f = item.tax;
                            }else{
                                this.tax_s = item.tax;
                            }
                        }
                        for(let item of data['data'].promotion){
                            if(item.od == 'f'){
                                this.promotion_f = item.promotion ? item.promotion : 0;
                            }else{
                                this.promotion_s = item.promotion ? item.promotion : 0;
                            }
                        }
                        for(let item of data['data'].discount){
                            if(item.od == 'f'){
                                this.discount_amount_f += parseFloat(item.price);
                                this.discount_qty_f += parseInt(item.qty);
                            }else{
                                this.discount_amount_s += parseFloat(item.price);
                                this.discount_qty_s += parseInt(item.qty);
                            }
                            if(this.discount_descriptions.indexOf(item.discount_description) == -1){
                                this.discount_descriptions.push(item.discount_description);
                            }
                        }
                        this.discount_detail_amount_f = [...this.discount_descriptions['map'](item => {
                            return 0;
                        })];
                        this.discount_detail_qty_f = [...this.discount_descriptions['map'](item => {
                            return 0;
                        })]
                        this.discount_detail_amount_s = [...this.discount_descriptions['map'](item => {
                            return 0;
                        })];
                        this.discount_detail_qty_s = [...this.discount_descriptions['map'](item => {
                            return 0;
                        })]
                        for(let item of data['data'].discount){
                            if(item.od == 'f'){
                                this.discount_detail_amount_f[this.discount_descriptions.indexOf(item.discount_description)] = parseFloat(item.price);
                                this.discount_detail_qty_f[this.discount_descriptions.indexOf(item.discount_description)] = parseInt(item.qty);
                            }else{
                                this.discount_detail_amount_s[this.discount_descriptions.indexOf(item.discount_description)] = parseFloat(item.price);
                                this.discount_detail_qty_s[this.discount_descriptions.indexOf(item.discount_description)] = parseInt(item.qty);
                            }
                        }

                        this.tax_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.tax_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.tax_s
                            }
                        ];
                        this.tip_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.tip_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.tip_s
                            }
                        ];
                        this.promotion_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.promotion_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.promotion_s
                            }
                        ];
                        this.discount_period_chart['dataSource'].data = [
                            {
                                label: this.filter_range,
                                value: this.discount_amount_f
                            },
                            {
                                label: this.filter_range_secondary,
                                value: this.discount_amount_s
                            }
                        ];

                        this._fetchPaymentComparison();
                    }else{
                        this.db_error = true;
                    }
                    this.other_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.other_loading = false;
                }
            )
    }
    _fetchPaymentComparison(){

        this.payment_amount_f = 0;
        this.payment_amount_s = 0;
        this.payment_qty_f = 0;
        this.payment_qty_s = 0;

        this.payment_descriptions = [];
        this.payment_detail_amount_f = [];
        this.payment_detail_qty_f = [];
        this.payment_detail_amount_s = [];
        this.payment_detail_qty_s = [];

        this.db_error = false;
        this.payment_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        this.filter_date_secondary['from'] = moment(this.filter_date_secondary['from']).format('YYYY-MM-DD');
        this.filter_date_secondary['to'] = this.filter_date_secondary['to'] ? moment(this.filter_date_secondary['to']).format('YYYY-MM-DD') : this.filter_date_secondary['from'];
        this.apiService.payment_date_compare(this.parseService.encode({
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            from_secondary: this.filter_date_secondary['from'],
            to_secondary: this.filter_date_secondary['to'],
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        for(let item of data['data'].payment){
                            if(item.od == 'f'){
                                this.payment_amount_f += parseFloat(item.price);
                                this.payment_qty_f += parseInt(item.qty);
                            }else{
                                this.payment_amount_s += parseFloat(item.price);
                                this.payment_qty_s += parseInt(item.qty);
                            }
                            if(this.payment_descriptions.indexOf(item.payment_detail) == -1){
                                this.payment_descriptions.push(item.payment_detail);
                            }
                        }
                        this.payment_detail_amount_f = [...this.payment_descriptions['map'](item => {
                            return 0;
                        })];
                        this.payment_detail_qty_f = [...this.payment_descriptions['map'](item => {
                            return 0;
                        })]
                        this.payment_detail_amount_s = [...this.payment_descriptions['map'](item => {
                            return 0;
                        })];
                        this.payment_detail_qty_s = [...this.payment_descriptions['map'](item => {
                            return 0;
                        })]
                        for(let item of data['data'].payment){
                            if(item.od == 'f'){
                                this.payment_detail_amount_f[this.payment_descriptions.indexOf(item.payment_detail)] = parseFloat(item.price);
                                this.payment_detail_qty_f[this.payment_descriptions.indexOf(item.payment_detail)] = parseInt(item.qty);
                            }else{
                                this.payment_detail_amount_s[this.payment_descriptions.indexOf(item.payment_detail)] = parseFloat(item.price);
                                this.payment_detail_qty_s[this.payment_descriptions.indexOf(item.payment_detail)] = parseInt(item.qty);
                            }
                        }
                    }else{
                        this.db_error = true;
                    }
                    this.payment_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.payment_loading = false;
                }
            )
    }
}
