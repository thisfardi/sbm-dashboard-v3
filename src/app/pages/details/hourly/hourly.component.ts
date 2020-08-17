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
        console.log(data)
        // this.apiService.hourly_detail_article(this.parseService.encode({
        //     from: moment(this.dash_date).format('YYYY-MM-DD'),
        //     to: moment(this.dash_date).format('YYYY-MM-DD'),
        //     shop: this.current_shop,
        //     db: this.user_database,
        //     group_id: this.f_group,
        //     h: h
        // }))
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.article_loading = false;
        //             if(data['status'] == 'success'){
        //                 console.log(data);
        //             }else{
        //                 this.db_error = true;
        //             }
        //         },
        //         error => {
        //             this.db_error = true;
        //             this.article_loading = false;
        //         }
        //     )
    }
    apply_filter(){
        this._fetch_hourly_details();
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
                                console.log(item)
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

}
