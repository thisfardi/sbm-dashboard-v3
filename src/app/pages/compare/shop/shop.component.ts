import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';

import { saleChart, saleDetailChart, avgChart, promotionChart, tipChart, taxChart, paymentChart, articleChart } from '../data';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

    // Filters
    database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
    shops: Object = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
    date_ranges: Object;

    filter_range: string;
    filter_date: Object;

    db_error: Boolean = false;

    sale_loading: Boolean = false;
    other_loading: Boolean = false;
    payment_loading: Boolean = false;

    sale_chart: Object;
    sale_detail_chart: Object;
    avg_chart: Object;
    promotion_chart: Object;
    tip_chart: Object;
    tax_chart: Object;
    payment_chart: Object;
    article_chart: Object;

    constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService) { }

    ngOnInit() {
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

        this.sale_chart = saleChart;
        this.sale_detail_chart = saleDetailChart;

        this.avg_chart = avgChart;
        this.promotion_chart = promotionChart;
        this.tip_chart = tipChart;
        this.tax_chart = taxChart;
        this.payment_chart = paymentChart;
        this.article_chart = articleChart;

        this._fetchSaleComparison();
    }

    _fetchSaleComparison(){
        this.db_error = false;
        this.sale_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        this.apiService.sale_compare(this.parseService.encode({
            db: this.database,
            shops: this.shops,
            from: this.filter_date['from'],
            to: this.filter_date['to']
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this.render_sale_data(data['data']);
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
        this.db_error = false;
        this.other_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        this.apiService.other_compare(this.parseService.encode({
            db: this.database,
            shops: this.shops,
            from: this.filter_date['from'],
            to: this.filter_date['to']
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this.render_other_data(data['data']);
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
        this.db_error = false;
        this.payment_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        this.apiService.payment_compare(this.parseService.encode({
            db: this.database,
            shops: this.shops,
            from: this.filter_date['from'],
            to: this.filter_date['to']
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this.render_payment_data(data['data']);
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
    filter_range_change(){
        this.filter_date = this.date_ranges['ranges'][this.date_ranges['labels'].indexOf(this.filter_range)];
        if(this.filter_range == 'Custom range'){
            document.querySelector('#filter_date_range').removeAttribute('disabled');
        }else{
            document.querySelector('#filter_date_range').setAttribute('disabled', 'true');
        }
    }
    apply_filter(){
        this._fetchSaleComparison();
    }
    getXAxis(){
        let ret = [];
        let start = moment(this.filter_date['from']).format('YYYY-MM-DD');
        let end = moment(this.filter_date['to']).format('YYYY-MM-DD');

        do {
            ret.push({
                label: moment(start).format('DD MMM')
            });
            start = moment(start).add(1, 'days').format('YYYY-MM-DD');
        } while (start != end)
        ret.push({
            label: moment(end).format('DD MMM')
        });

        return ret;
    }

    render_sale_data(data){

        let sale_chart_x = [];
        let sale_chart_y = [];
        let sale_detail_x = [...this.getXAxis()];
        let sale_detail_y = [];

        let avg_chart_xy = [];

        this.shops['map'](item => {
            sale_chart_x.push({
                label: item
            })
            avg_chart_xy.push({
                label: item,
                value: 0
            })
            sale_detail_y.push({
                seriesname: item,
                data: []
            })
        })
        sale_chart_y.push({
            seriesname: 'Net sale',
            data: []
        })
        sale_chart_y.push({
            seriesname: 'Discount',
            data: []
        })
        sale_chart_y.push({
            seriesname: 'Transactions',
            parentyaxis: "S",
            plottooltext: "$dataValue transactions in $label",
            renderas: "line",
            data: []
        })
        for(let i = 0; i < sale_chart_x.length; i++){
            for(let item of sale_chart_y){
                item.data.push({
                    value: 0
                })
            }
        }
        for(let i = 0; i < sale_chart_x.length; i++){
            for(let item of data.sales){
                if(sale_chart_x[i].label == item.shop_name){
                    sale_chart_y[0].data[i].value += parseFloat(item.netsale);
                    sale_chart_y[1].data[i].value += (parseFloat(item.grossale) - parseFloat(item.netsale));
                    //sale_chart_y[2].data[i] = item.grossale;
                }
            }
        }
        for(let i = 0; i < sale_chart_x.length; i++){
            for(let item of data.transactions){
                if(sale_chart_x[i].label == item.shop_name){
                    sale_chart_y[2].data[i].value += item.transaction_count;
                }
            }
        }
        for(let item of sale_detail_y){
            for(let time of sale_detail_x){
                item.data.push({
                    value: 0
                });
            }
        }
        for(let item of sale_detail_y){
            let idx = 0;
            for(let time of sale_detail_x){
                for(let _item of data.sales){
                    if((_item.shop_name == item.seriesname) && (moment(_item.d, 'YYYY-M-D').format('DD MMM') == time.label)){
                        item.data[idx].value = parseFloat(_item.netsale);
                    }
                }
                idx++;
            }
        }

        for(let item of avg_chart_xy){
            for(let _item of data.transactions){
                if(item.label == _item.shop_name){
                    item.value = parseFloat(_item.average_bill);
                }
            }
        }
        this.sale_chart['dataSource'].categories[0].category = [...sale_chart_x];
        this.sale_chart['dataSource'].dataset = [...sale_chart_y];

        this.sale_detail_chart['dataSource'].categories[0].category = [...sale_detail_x];
        this.sale_detail_chart['dataSource'].dataset = [...sale_detail_y];

        this.avg_chart['dataSource'].data = [...avg_chart_xy];
    }
    render_other_data(data){
        let promotion_chart_xy = [];
        let tip_chart_xy = [];
        let tax_chart_xy = [];

        this.shops['map'](item => {
            promotion_chart_xy.push({
                label: item,
                value: 0
            })
            tip_chart_xy.push({
                label: item,
                value: 0
            })
            tax_chart_xy.push({
                label: item,
                value: 0
            })
        })

        for(let item of promotion_chart_xy){
            for(let _item of data.promotion){
                if(item.label == _item.shop_name){
                    item.value = parseFloat(_item.promotion);
                }
            }
        }
        for(let item of tip_chart_xy){
            for(let _item of data.tip){
                if(item.label == _item.shop_name){
                    item.value = parseFloat(_item.tip);
                }
            }
        }
        for(let item of tax_chart_xy){
            for(let _item of data.tax){
                if(item.label == _item.shop_name){
                    item.value = parseFloat(_item.tax);
                }
            }
        }

        this.promotion_chart['dataSource'].data = [...promotion_chart_xy];
        this.tip_chart['dataSource'].data = [...tip_chart_xy];
        this.tax_chart['dataSource'].data = [...tax_chart_xy];
    }
    render_payment_data(data){
        this.payment_chart['dataSource'].data = [];
        this.article_chart['dataSource'].data = [];
        let total_payment_value = 0;
        let total_article_qty = 0;

        let shop_payment_value = [];

        let shop_article_value = [];
        let shop_article_group = [];
        let shop_article_items = [];

        this.shops['map'](item => {
            shop_payment_value.push({
                name: item,
                value: 0
            })
            shop_article_value.push({
                name: item,
                value: 0
            })
        })
        for(let item of data.payment){
            total_payment_value += Math.abs(parseFloat(item.price));
        }
        for(let item of data.article){
            total_article_qty += Math.abs(parseFloat(item.amount));
        }
        for(let item of shop_payment_value){
            for(let _item of data.payment){
                if(item.name == _item.shop_name){
                    item.value += Math.abs(parseFloat(_item.price));
                }
            }
        }
        for(let item of shop_article_value){
            for(let _item of data.article){
                if(item.name == _item.shop_name){
                    item.value += Math.abs(parseFloat(_item.amount));
                }
            }
        }
        this.payment_chart['dataSource'].data.push({
            id: "0",
            parent: "",
            name: "Total payments",
            value: total_payment_value
        })
        this.article_chart['dataSource'].data.push({
            id: "0",
            parent: "",
            name: "Total articles qty",
            value: total_article_qty
        })
        for(let item of shop_payment_value){
            this.payment_chart['dataSource'].data.push({
                id: item.name,
                parent: "0",
                name: item.name,
                value: Math.abs(parseFloat(item.value))
            })
        }
        for(let item of shop_article_value){
            this.article_chart['dataSource'].data.push({
                id: item.name,
                parent: "0",
                name: item.name,
                value: item.value
            })
        }
        let idx = 0;
        for(let item of data.payment){
            idx++;
            this.payment_chart['dataSource'].data.push({
                id: item.payment_detail + idx.toString(),
                parent: item.shop_name,
                name: item.payment_detail,
                value: Math.abs(parseFloat(item.price))
            })
        }
        for(let item of shop_article_value){
            shop_article_group.push({
                shop_name: item.name,
                group: [],
                group_names: []
            })
        }

        for(let item of shop_article_group){
            for(let _item of data.article){
                if((item.shop_name == _item.shop_name) && (item.group_names.indexOf(_item.group_description) == -1)){
                    item.group.push({
                        group_name: _item.group_description,
                        value: 0
                    });
                    item.group_names.push( _item.group_description);
                }
            }
        }
        for(let item of shop_article_group){
            for(let _item of data.article){
                if(item.shop_name == _item.shop_name){
                    item.group[item.group_names.indexOf(_item.group_description)].value += Math.abs(_item.amount);
                }
            }
        }
        for(let item of shop_article_group){
            for(let _item of item.group){
                this.article_chart['dataSource'].data.push({
                    id: item.shop_name + '-' +  _item.group_name,
                    parent: item.shop_name,
                    name: _item.group_name,
                    value: _item.value
                })
            }
        }
        idx = 0;
        for(let item of data.article){
            idx ++;
            this.article_chart['dataSource'].data.push({
                id: item.article_description + idx.toString(),
                parent: item.shop_name + '-' + item.group_description,
                name: item.article_description,
                value: Math.abs(item.amount)
            })
        }
    }
}
