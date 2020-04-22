import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';

import { ChartType } from '../charts.model';

import { articleChart, groupDetailChart, articleDetailChart } from '../data';
@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

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
    article_loading: Boolean = false;

    article_chart: Object;
    group_detail_chart: Object;
    article_detail_chart: Object;

    group_data = [];
    article_data = [];
    article_total = {
        amount: 0,
        price: 0
    };
    selected_group_id = 0;
    selected_group = {};
    selected_articles = [];

    db_error: Boolean = false;
    causal_error: Boolean = false;

    advanced_filters: Boolean = false;

    filter_shop: string;
    filter_range: string;
    filter_date: Object;

    group_by = 'qty';
    article_by = 'qty';

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

        this.article_chart = articleChart;
        this.group_detail_chart = groupDetailChart;
        this.article_detail_chart = articleDetailChart;

        this._fetchArticles();
    }
    public _fetchArticles(){
        this.db_error = false;
        this.article_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        // Force to hour view on one day is selected
        if(this.filter_date['from'] == this.filter_date['to']){
            this.f_criteria = 'hour';
        }
        this.apiService.article_details(this.parseService.encode({
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
                        this.article_data_render(data['data'].article_details);
                    }else{
                        this.db_error = true;
                    }
                    this.article_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.article_loading = false;
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
        this._fetchArticles();
    }
    select_group(id){
        this.selected_group_id = id;
        for(let item of this.group_data){
            if(item.id == id){
                this.selected_group = item;
            }
        }
    }
    group_by_change(){
        if(this.group_by == 'qty'){
            this.group_by = 'price';
        }else{
            this.group_by = 'qty';
        }
        this.group_detail_chart_render();
    }
    article_by_change(){
        if(this.article_by == 'qty'){
            this.article_by = 'price';
        }else{
            this.article_by = 'qty';
        }
        this.article_detail_chart_render();
    }
    article_data_render(data){
        //console.log(data)
        this.article_chart['dataSource'].data = [];
        this.group_detail_chart['dataSource'].data = [];
        this.article_detail_chart['dataSource'].data = [];

        this.group_data = [];
        this.article_data = [];

        let group_ids = [];
        let article_ids = [];
        let total_value = {
            amount: 0,
            price: 0
        };

        for(let item of data){
            total_value.amount += item.amount;
            total_value.price += parseFloat(item.price);
            if(group_ids.indexOf(item.group_id) == -1){
                group_ids.push(item.group_id);
                this.group_data.push({
                    id: item.group_id,
                    name: item.group_description,
                    price: 0,
                    amount: 0
                })
            }
            if(article_ids.indexOf(item.article_id) == -1){
                article_ids.push(item.article_id);
                this.article_data.push({
                    id: item.article_id,
                    parent: item.group_id,
                    name: item.article_description,
                    price: parseFloat(item.price),
                    amount: item.amount
                })
            }
        }
        this.article_total = total_value;
        let idx = 0;
        for(let id of group_ids){
            for(let item of data){
                if(id == item.group_id){
                    this.group_data[idx].price += parseFloat(item.price);
                    this.group_data[idx].amount += item.amount;
                }
            }
            idx++;
        }

        this.article_chart['dataSource'].data.push({
            id: "0",
            parent: "",
            name: "Total",
            value: total_value.amount
        })
        for(let item of this.group_data){
            this.article_chart['dataSource'].data.push({
                id: item.id.toString(),
                parent: "0",
                name: item.name,
                value: item.amount
            })
        }

        for(let item of this.article_data){
            this.article_chart['dataSource'].data.push({
                id: item.id.toString() + '-sub',
                parent: item.parent.toString(),
                name: item.name,
                value: item.amount
            })
        }

        // Detail charts
        this.group_detail_chart_render();
        this.article_detail_chart_render();
        this.select_group(group_ids[0]);
    }
    group_detail_chart_render(){
        if(this.group_by == 'qty'){
            this.group_detail_chart['dataSource'].data = [];
            this.group_detail_chart['dataSource'].chart.yaxisname = 'Amount';
            this.group_data.sort((a, b) => (a.amount < b.amount) ? 1 : -1);
            if(this.group_data.length > 15){
                for(let i = 0; i < 15; i++){
                    this.group_detail_chart['dataSource'].data.push({
                        label: this.group_data[i].name,
                        value: this.group_data[i].amount
                    })
                }
            }else{
                for(let i = 0; i < this.group_data.length; i++){
                    this.group_detail_chart['dataSource'].data.push({
                        label: this.group_data[i].name,
                        value: this.group_data[i].amount
                    })
                }
            }
        }else{
            this.group_detail_chart['dataSource'].data = [];
            this.group_detail_chart['dataSource'].chart.yaxisname = 'Price [$]';
            this.group_data.sort((a, b) => (a.price < b.price) ? 1 : -1);
            if(this.group_data.length > 15){
                for(let i = 0; i < 15; i++){
                    this.group_detail_chart['dataSource'].data.push({
                        label: this.group_data[i].name,
                        value: this.group_data[i].price
                    })
                }
            }else{
                for(let i = 0; i < this.group_data.length; i++){
                    this.group_detail_chart['dataSource'].data.push({
                        label: this.group_data[i].name,
                        value: this.group_data[i].price
                    })
                }
            }
        }
    }
    article_detail_chart_render(){
        if(this.article_by == 'qty'){
            this.article_detail_chart['dataSource'].data = [];
            this.article_detail_chart['dataSource'].chart.yaxisname = 'Amount';
            this.article_data.sort((a, b) => (a.amount < b.amount) ? 1 : -1);
            if(this.article_data.length > 15){
                for(let i = 0; i < 15; i++){
                    this.article_detail_chart['dataSource'].data.push({
                        label: this.article_data[i].name,
                        value: this.article_data[i].amount
                    })
                }
            }else{
                for(let i = 0; i < this.article_data.length; i++){
                    this.article_detail_chart['dataSource'].data.push({
                        label: this.article_data[i].name,
                        value: this.article_data[i].amount
                    })
                }
            }
        }else{
            this.article_detail_chart['dataSource'].data = [];
            this.article_detail_chart['dataSource'].chart.yaxisname = 'Price [$]';
            this.article_data.sort((a, b) => (a.price < b.price) ? 1 : -1);
            if(this.article_data.length > 15){
                for(let i = 0; i < 15; i++){
                    this.article_detail_chart['dataSource'].data.push({
                        label: this.article_data[i].name,
                        value: this.article_data[i].price
                    })
                }
            }else{
                for(let i = 0; i < this.article_data.length; i++){
                    this.article_detail_chart['dataSource'].data.push({
                        label: this.article_data[i].name,
                        value: this.article_data[i].price
                    })
                }
            }
        }
    }
}
