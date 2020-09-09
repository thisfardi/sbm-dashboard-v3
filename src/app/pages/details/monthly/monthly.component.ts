import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
    selector: 'app-monthly',
    templateUrl: './monthly.component.html',
    styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {

    // Filters
    database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
    shops: Object = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
    date_ranges: Object;

    db_error: Boolean = false;
    monthly_loading:Boolean = false;

    f_criteria: string = 'day';

    filter_shop: string;
    filter_range: string;
    filter_date: Object;

    monthly_detail_data = [];

    is_happy_lemon: Boolean = false;

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
        this.historyService.logHistory('page', 'Monthly detail visit. Checked monthly detail data for ' + this.filter_shop + ' from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to']);
        this._fetchMonthlyDetails()


        if(this.database == 'HAPPY_LEMON_7.1'){
          this.is_happy_lemon = true
        }
    }

    filter_range_change(){
        this.filter_date = this.date_ranges['ranges'][this.date_ranges['labels'].indexOf(this.filter_range)];
        if(this.filter_range == 'Custom range'){
            document.querySelector('#filter_date_range').removeAttribute('disabled');
        }else{
            document.querySelector('#filter_date_range').setAttribute('disabled', 'true');
        }
    }

    _fetchMonthlyDetails(){
        this.historyService.logHistory('page', 'Checked monthly detail data for ' + this.filter_shop + ' from ' + this.filter_date['from'] + ' ~ ' + this.filter_date['to']);
        this.db_error = false;
        this.monthly_loading = true;
        this.filter_date['from'] = moment(this.filter_date['from']).format('YYYY-MM-DD');
        this.filter_date['to'] = this.filter_date['to'] ? moment(this.filter_date['to']).format('YYYY-MM-DD') : this.filter_date['from'];
        this.apiService.monthly_detail(this.parseService.encode({
            db: this.database,
            shop: this.filter_shop,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this.process_data(data['data'])
                    }else{
                        this.db_error = true;
                    }
                    this.monthly_loading = false;
                },
                error => {
                    this.db_error = true;
                    this.monthly_loading = false;
                }
            )
    }
    apply_filter(){
        this._fetchMonthlyDetails();
    }
    format_date(date){
        return moment(date).format('DD, MMM');
    }
    process_data(data){
        console.log(data)
        this.monthly_detail_data = [];
        let start = this.filter_date['from'];
        let end = this.filter_date['to'];
        let dates = [];
        while(start != end){
            dates.push(start);
            start = moment(start).add(1, 'days').format('YYYY-MM-DD');
        }
        dates.push(end);
        dates.forEach(item => {
            this.monthly_detail_data.push({
                date: item,
                day: moment(item).format('ddd'),
                temp: '',
                projected: (() =>{
                    let ret = 3200;
                    if(moment(item).format('ddd') == 'Fri'){
                        ret = 3400;
                    }else if(moment(item).format('ddd') == 'Sat'){
                        ret = 4500;
                    }else if(moment(item).format('ddd') == 'Sun'){
                        ret = 4800;
                    }else{
                        ret = 3200;
                    }
                    return ret;
                })(),
                ac_projected: 0,
                achievements: 0,
                sales: 0,
                ac_sales: 0,
                netsale: 0,
                ac_netsale: 0,
                gc: 0,
                ac_gc: 0,
                cup: 0,
                ac_cup: 0,
                ac: 0,
                ac_ac: 0,
                minus_c: 0,
                ac_minus_c: 0,
                remark: '',
                m_desert: 0,
                m_waffle: 0,
                m_toastie: 0,
                ac_m_desert: 0,
                ac_m_waffle: 0,
                ac_m_toastie: 0,
            });
        })
        let ac_sales = 0;
        let ac_netsale = 0;
        let ac_projected = 0;

        let ac_ac = 0;
        let ac_cup = 0;
        let ac_gc = 0;
        let ac_minus_c = 0;
        let ac_m_desert = 0;
        let ac_m_waffle = 0;
        let ac_m_toastie = 0;

        data.m_sale.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.sales = item.sale;
                    _item.netsale = item.netsale;
                    ac_projected += _item.projected;
                    ac_sales += parseFloat(item.sale);
                    ac_netsale += parseFloat(item.netsale);
                    _item.ac_sales = ac_sales;
                    _item.ac_netsale = ac_netsale;
                    _item.ac_projected = ac_projected;
                    _item.achievements = parseFloat(item.sale) / _item.projected;
                }
            }
        })
        // data.m_ac.forEach(item => {
        //     let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
        //     for(let _item of this.monthly_detail_data){
        //         if(_item.date == date){
        //             _item.ac = item.ac;
        //             ac_ac += parseFloat(item.ac);
        //             _item.ac_ac = ac_ac;
        //         }
        //     }
        // })
        data.m_hl_cup.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.cup = item.hl_cup;
                    ac_cup += item.hl_cup;
                    _item.ac_cup = ac_cup;
                }
            }
        })
        data.m_count.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.gc = item.transaction_count;
                    ac_gc += item.transaction_count;
                    _item.ac_gc = ac_gc;
                    _item.ac = _item.netsale / _item.gc;
                    _item.ac_ac = _item.ac_netsale / _item.ac_gc;
                }
            }
        })
        data.m_drink.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.minus_c = item.drinks;
                    ac_minus_c += parseFloat(item.drinks);
                    _item.ac_minus_c = ac_minus_c;
                }
            }
        })
        data.m_desert.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.m_desert = item.desert;
                    ac_m_desert += parseFloat(item.desert);
                    _item.ac_m_desert = ac_m_desert;
                }
            }
        })
        data.m_waffle.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.m_waffle = item.waffle;
                    ac_m_waffle += parseFloat(item.waffle);
                    _item.ac_m_waffle = ac_m_waffle;
                }
            }
        })
        data.m_toastie.forEach(item => {
            let date = moment((item.y + '-' + item.m + '-' + item.d), 'YYYY-M-D').format('YYYY-MM-DD');
            for(let _item of this.monthly_detail_data){
                if(_item.date == date){
                    _item.m_toastie = item.toastie;
                    ac_m_toastie += parseFloat(item.toastie);
                    _item.ac_m_toastie = ac_m_toastie;
                }
            }
        })
    }
}
