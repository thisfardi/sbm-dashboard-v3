import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
    selector: 'app-weekly',
    templateUrl: './weekly.component.html',
    styleUrls: ['./weekly.component.scss']
})
export class WeeklyComponent implements OnInit {

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
    weekly_loading: Boolean = false;

    group_data = [];

    selected_group_id = 0;
    selected_group = {};
    selected_articles = [];

    week_group_data = [];
    groups = [];
    articles = [];

    week_days = [];

    db_error: Boolean = false;

    advanced_filters: Boolean = false;

    filter_shop: string;
    filter_range: string;
    filter_date: Object;

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
        this.filter_range = this.date_ranges['labels'][3];
        this.filter_date = this.date_ranges['ranges'][3];

        this.historyService.logHistory('page', 'Weekly detail visit. Checked weekly detail data for ' + this.filter_shop + ' from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to']);

        this._fetchWeeklyData();
    }

    get_weekdays(from, to) {
        this.week_days = [];
        while(from != to){
            this.week_days.push(from);
            from = moment(from, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
        }
        this.week_days.push(to);
    }
    get_weekday(date){
        return moment(date, 'YYYY-MM-DD').format('dddd');
    }
    format_date(date){
        return moment(date, 'YYYY-MM-DD').format('DD-MMM');
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
    apply_filter(){
        // Do actions
        this.historyService.logHistory('page', 'Weekly detail visit. Checked weekly detail data for ' + this.filter_shop + ' from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to']);
        this._fetchWeeklyData();
    }
    select_group(id){
        this.selected_group_id = id;
        for(let item of this.group_data){
            if(item.id == id){
                this.selected_group = item;
            }
        }
    }
    render_weekly_table(data){
        this.week_group_data = [...data['weekly_group_detail']];
        // Group data
        let group_ids = [];
        let group_items = [];
        for(let item of this.week_group_data){
            if(group_ids.indexOf(item.group_id) == -1){
                group_ids.push(item.group_id);
            }
        }
        for(let g_id of group_ids){
            let a_ids = [];
            for(let item of this.week_group_data){
                if((g_id == item.group_id) && (a_ids.indexOf(item.article_id)) == -1){
                    a_ids.push(item.article_id);
                }
            }
            group_items.push({
                g_id: g_id,
                a_id: [...a_ids]
            })
        }
        let tag = ``;
        let global_total = 0;
        for(let item of group_items){
            let group_total = 0;
            for(let _item of item.a_id){
                let sub_total = 0;
                this.week_days.forEach(day => {
                    sub_total += this.get_price(item.g_id, _item, day);
                })
                group_total += sub_total;
            }
            global_total += group_total;
        }
        for(let item of group_items){
            tag += `
            <tr>
                <td class="bg-soft-success" style="font-weight: bolder">${ this.get_group_name(item.g_id) } (${ item.a_id.length })</td>
                ${ (() => {
                    let ret = '';
                    this.week_days.forEach(day => {
                        ret += `<td class="bg-soft-success"></td>`;
                    })
                    return ret;
                })() }
                <td class="bg-soft-success"></td>
                <td class="bg-soft-success"></td>
            <tr>`;
            let group_total = 0;
            let day_total = [];
            this.week_days.forEach(day => {
                day_total.push(0);
            })
            for(let _item of item.a_id){
                let sub_total = 0;
                this.week_days.forEach(day => {
                    sub_total += this.get_price(item.g_id, _item, day);
                })
                group_total += sub_total;
            }
            for(let _item of item.a_id){
                let sub_tag = ``;
                let sub_total = 0;
                this.week_days.forEach((day, idx) => {
                    day_total[idx] += this.get_price(item.g_id, _item, day);
                    sub_tag += `<td>$${ this.get_price(item.g_id, _item, day) }</td>`;
                    sub_total += this.get_price(item.g_id, _item, day);
                })
                tag += `<tr><td style="text-align: right;">${ this.get_article_name(_item) }</td>${ sub_tag }<td class="bg-soft-primary">$${ sub_total.toFixed(2) }</td><td class="bg-soft-primary">${ (sub_total / group_total * 100).toFixed(2) + '%' }</td></tr>`
            }
            tag += `
            <tr><td class="bg-soft-primary">${ this.get_group_name(item.g_id) } total</td>
                ${ (() => {
                    let ret = '';
                    for(let item of day_total){
                        ret += `<td class="bg-soft-primary">$${ item.toFixed(2) }</td>`
                    }
                    return ret;
                })() }
                <td class="bg-soft-primary">
                    $${ (() => {
                        let ret = 0;
                        day_total.forEach(value => {
                            ret += Math.floor(value * 100);
                        })
                        return ret / 100;
                    })() }
                </td>
                <td class="bg-soft-primary">
                    ${ (() => {
                        let ret = 0;
                        day_total.forEach(value => {
                            ret += Math.floor(value * 100);
                        })
                        return (ret / global_total).toFixed(2) + '%';
                    })() }
                </td>
            </tr>`;
        }

        // Sale data
        tag += `
        <tr>
            <td class="bg-soft-success" style="font-weight: bolder">Sales summary</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach(day => {
                    ret += `<td class="bg-soft-success"></td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-success"></td>
            <td class="bg-soft-success"></td>
        <tr>`;
        let total_sale = [];
        let _total_sale = 0;
        let tax = [];
        let _tax = 0;
        let tip = [];
        let _tip = 0;
        let grossale = [];
        let _grossale = 0;
        let discount = [];
        let _discount = 0;
        let netsale = [];
        let _netsale = 0;

        let trans_count = [];
        let _trans_count = 0;
        let avg = [];
        let _avg = 0;

        this.week_days.forEach(item => {
            total_sale.push(0);
            tax.push(0);
            tip.push(0);
            grossale.push(0);
            discount.push(0);
            netsale.push(0);
            trans_count.push(0);
            avg.push(0);
        })
        this.week_days.forEach((item, idx) => {
            let value = 0;
            data.weekly_netsale.forEach(_item => {
                if(moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == item){
                    value = parseFloat(_item.netsale);
                }
            })
            netsale[idx] = value;
            _netsale += value;
            value = 0;
            data.weekly_tax.forEach(_item => {
                if(moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == item){
                    value = parseFloat(_item.tax);
                }
            })
            tax[idx] = value;
            _tax += value;
            value = 0;
            data.weekly_tip.forEach(_item => {
                if(moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == item){
                    value = parseFloat(_item.tip);
                }
            })
            tip[idx] = value;
            _tip += value;
            value = 0;
            data.weekly_discount.forEach(_item => {
                if(moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == item){
                    value = parseFloat(_item.discount);
                }
            })
            discount[idx] = value;
            _discount += value;
            value = 0;
            data.weekly_trans.forEach(_item => {
                if(moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == item){
                    value = parseFloat(_item.qty);
                }
            })
            trans_count[idx] = value;
            _trans_count += value;
            value = 0;
            data.weekly_trans.forEach(_item => {
                if(moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == item){
                    value = parseFloat(_item.average_bill);
                }
            })
            avg[idx] = value;
            _avg += value;
        })

        tag += `
        <tr><td>Total sales amount</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (netsale[idx] - discount[idx] + tax[idx] + tip[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_netsale -_discount + _tax + _tip).toFixed(2) }</td>
            <td></td>
        </tr>
        <tr><td>Tax amount</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (tax[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_tax).toFixed(2) }</td>
            <td></td>
        </tr>
        <tr><td>Tips amount</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (tip[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_tip).toFixed(2) }</td>
            <td></td>
        </tr>
        <tr><td>Gross sales amount</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (netsale[idx] - discount[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_netsale -_discount).toFixed(2) }</td>
            <td></td>
        </tr>
        <tr><td>Discount amount</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (discount[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_discount).toFixed(2) }</td>
            <td></td>
        </tr>
        <tr><td>Net sales</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (netsale[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_netsale).toFixed(2) }</td>
            <td></td>
        </tr>
        `;

        // Payment details
        let payment_details = [...data.weekly_payment];
        let payment_names = [];
        payment_details.forEach(item => {
            if(payment_names.indexOf(item.payment_detail) == -1){
                payment_names.push(item.payment_detail)
            }
        })
        let payment_data = [];
        payment_names.forEach(item => {
            payment_data.push({
                name: item,
                values: (() => {
                    let ret = [];
                    this.week_days.forEach(day => {
                        ret.push(0)
                    })
                    return ret;
                })(),
                total: 0
            })
        })

        payment_data.forEach(item => {
            this.week_days.forEach((day, idx) => {
                for(let _item of payment_details){
                    if((moment(_item.d, 'YYYY-M-D').format('YYYY-MM-DD') == day) && (item.name == _item.payment_detail)){
                        item.values[idx] = parseFloat(_item.amount);
                        item.total += parseFloat(_item.amount)
                    }
                }
            })
        })
        payment_data.forEach(item => {
            tag += `
                <tr>
                    <td>${ item.name }</td>
                    ${ (() => {
                        let ret = '';
                        item.values.forEach(value => {
                            ret += `<td>$${ value.toFixed(2) }</td>`
                        })
                        return ret;
                    })() }
                    <td class="bg-soft-primary">$${ item.total.toFixed(2) }</td>
                </tr>
            `;
        })
        // Trans details
        tag += `
        <tr><td>Customer count</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>${ (trans_count[idx]) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">${ (_trans_count) }</td>
            <td></td>
        </tr>
        <tr><td>Average check</td>
            ${ (() => {
                let ret = '';
                this.week_days.forEach((day, idx) => {
                    ret += `<td>$${ (avg[idx]).toFixed(2) }</td>`;
                })
                return ret;
            })() }
            <td class="bg-soft-primary">$${ (_avg / this.week_days.length).toFixed(2) }</td>
            <td></td>
        </tr>
        `;
        document.querySelector('.report-view tbody').innerHTML = tag;
    }
    get_price(g_id, a_id, date){
        let ret = 0;
        this.week_group_data.forEach(item => {
            if((item.group_id == g_id) && (item.article_id == a_id) && (moment(item.d, 'YYYY-M-D').format('YYYY-MM-DD') == date)){
                ret = Math.floor(parseFloat(item.price) * 100) / 100;
            }
        })
        return ret;
    }
    get_group_name(g_id){
        let ret = '';
        this.week_group_data.forEach(item => {
            if(item.group_id == g_id){
                ret = item.group_description;
            }
        })
        return ret;
    }
    get_article_name(a_id){
        let ret = '';
        this.week_group_data.forEach(item => {
            if((item.article_id == a_id)){
                ret = item.article_description;
            }
        })
        return ret;
    }
    public _fetchWeeklyData(){
        this.db_error = false;
        this.weekly_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        this.get_weekdays(this.filter_date['from'], this.filter_date['to']);
        // Force to hour view on one day is selected
        if(this.filter_date['from'] == this.filter_date['to']){
            this.f_criteria = 'hour';
        }
        let _data = {
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
            d: this.f_criteria,
            group_id: this.f_group
        };
        this.apiService.weekly_detail(this.parseService.encode(_data))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this.render_weekly_table(data['data']);
                    }else{
                        this.db_error = true;
                    }
                    this.weekly_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.weekly_loading = false;
                }
            )
    }
}
