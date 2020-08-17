import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
    selector: 'app-hourly',
    templateUrl: './hourly.component.html',
    styleUrls: ['./hourly.component.scss']
})
export class HourlyComponent implements OnInit {

    dash_date: string = moment().subtract(1, 'days').format('YYYY-MM-DD');

    user_database: string = JSON.parse(this.cookieService.getCookie('currentUser')).database;
    user_shops: Object = JSON.parse(JSON.parse(this.cookieService.getCookie('currentUser')).shop_name);
    current_shop: string;

    hourly_data = [];
    total_trans = 0;
    total_article = 0;
    total_amount = 0;

    _h = -1;

    f_group: string = 'group_a_id';

    empty_data = false;
    // Data from API
    db_error: boolean = false;

    hourly_loading = false;
    article_loading = false;

    constructor(private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

    ngOnInit() {
        this.current_shop = this.user_shops[0];
        this.historyService.logHistory('page', 'Hourly detail visit. Checked weekly detail data for ' + this.current_shop);
        this._fetch_hourly_details();
    }
    group_change(e: any){
        this.f_group = e.target.value;
    }
    item_details(h){
        this._h = h;
        this.db_error = false;
        this.article_loading = true;
        let data = {
            from: moment(this.dash_date).format('YYYY-MM-DD'),
            to: moment(this.dash_date).format('YYYY-MM-DD'),
            shop: this.current_shop,
            db: this.user_database,
            group_id: this.f_group,
            h: h
        }
        this.apiService.hourly_detail_article(this.parseService.encode({
            from: moment(this.dash_date).format('YYYY-MM-DD'),
            to: moment(this.dash_date).format('YYYY-MM-DD'),
            shop: this.current_shop,
            db: this.user_database,
            group_id: this.f_group,
            h: h
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.article_loading = false;
                    if(data['status'] == 'success'){
                        this.render_item_details(data['data'].hourly_detail_article)
                    }else{
                        this.db_error = true;
                    }
                },
                error => {
                    this.db_error = true;
                    this.article_loading = false;
                }
            )
    }
    apply_filter(){
        this._fetch_hourly_details();
    }
    render_item_details(data){
        let group_ids = [];
        let group_names = [];
        data.forEach(item => {
            if(group_ids.indexOf(item.group_id) == -1){
                group_ids.push(item.group_id);
                group_names.push(item.group_description);
            }
        })
        let group_data = [];
        for(let item of group_names){
            group_data.push({
                id: group_ids[group_names.indexOf(item)],
                name: item,
                total_qty: 0,
                total_price: 0,
                items: []
            })
        }
        let total_qty = 0;
        let total_price = 0;
        group_data.forEach(item => {
            data.forEach(_item => {
                if(item.id == _item.group_id){
                    item.items.push({
                        name: _item.article_description,
                        price: _item.price,
                        qty: _item.amount
                    });
                    item.total_qty += _item.amount;
                    item.total_price += parseFloat(_item.price);
                    total_qty += parseFloat(_item.amount);
                    total_price += parseFloat(_item.price);
                }
            })
        })

        let tag = '';
        group_data.forEach(item => {
            tag += `
                <tr>
                    <td class="bg-soft-success" colspan="5">${ item.name }</td>
                </tr>
            `;
            item.items.forEach(_item => {
                tag += `
                    <tr>
                        <td></td>
                        <td>${ _item.name }</td>
                        <td>${ _item.qty }</td>
                        <td>$${ parseFloat(_item.price) }</td>
                        <td>${ (_item.price / item.total_price * 100).toFixed(2) }%</td>
                    </tr>
                `;
            })
            tag += `
                <tr>
                    <td class="bg-soft-primary">${ item.name } total</td>
                    <td class="bg-soft-primary">-</td>
                    <td class="bg-soft-primary">${ item.total_qty }</td>
                    <td class="bg-soft-primary">$${ parseFloat(item.total_price).toFixed(2) }</td>
                    <td class="bg-soft-primary">${ (item.total_price / total_price * 100).toFixed(2) }%</td>
                </tr>
            `;
        })
        tag += `
            <tr>
                <td class="bg-soft-danger">Total</td>
                <td class="bg-soft-danger">-</td>
                <td class="bg-soft-danger">${ total_qty }</td>
                <td class="bg-soft-danger">$${ total_price.toFixed(2) }</td>
                <td class="bg-soft-danger">-</td>
            </tr>`;
        document.querySelector('.report-view-articles tbody').innerHTML = tag;
    }
    _fetch_hourly_details(){
        this.empty_data = false;
        this.db_error = false;
        this.hourly_loading = true;
        this.apiService.hourly_detail(this.parseService.encode({
            from: moment(this.dash_date).format('YYYY-MM-DD'),
            to: moment(this.dash_date).format('YYYY-MM-DD'),
            shop: this.current_shop,
            db: this.user_database
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.hourly_loading = false;
                    let sum_data = data['data'];
                    if(data['status'] == 'success'){
                        this.hourly_data = [...data['data'].hourly_detail];
                        if(this.hourly_data.length > 0){
                            for(let item of this.hourly_data){
                                this.total_trans += item.trans_count;
                                this.total_article += item.article_count;
                                this.total_amount += parseFloat(item.netsale);
                            }
                        }else{
                            this.empty_data = true;
                        }
                    }else{
                        this.db_error = true;
                    }
                },
                error => {
                    this.db_error = true;
                    this.hourly_loading = false;
                }
            )
    }
    export_hourly_data(el){
        this.exportService.exportToCSV(el, 'Hourly report for ' + this.current_shop + ', On ' + moment(this.dash_date).format('DD, MMM YYYY'));
    }
    export_hourly_article_data(el){
        this.exportService.exportToCSV(el, 'Hourly article details report for ' + this.current_shop + ', On ' + moment(this.dash_date).format('DD, MMM YYYY') + ', ' + this._h + ':00 ~ ' + (parseInt(this._h) + 1).toString() + ':00');
    }
}
