import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-user-events',
    templateUrl: './user-events.component.html',
    styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {
    users: Object;

    date_ranges: Object;
    filter_user: string;
    filter_range: string;
    filter_date: Object;


    // Loaders
    loading = false;

    db_error: Boolean = false;
    server_user_fetching_error = false;

    logs: Object = [];
    member_since: string;
    login_counts: string = '0';
    page_visits: string = '0';
    export_counts: string = '0';
    current_status: string = 'Offline';
    last_login: string;

    constructor(private adminService: AdminService, private apiService: ApiService, private cookieService: CookieService, private parseService: ParseService, public exportService: ExportService, public historyService: HistoryService) { }

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

        //console.log(this.adminService.users)
        if(!this.adminService.users){
            this.loading = true;
            this.server_user_fetching_error = false;
            this._fetchUserList();
        }else{
            this.users = [...this.adminService.users['map'](item => item.name)];
            this.filter_user = this.users[0];
            this.apply_filter();
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
    apply_filter(){
        //
        this.loading = true;
        this.member_since = '';
        this.last_login = '';
        this.login_counts = '0';
        this.page_visits = '0';
        this.export_counts = '0';
        this.logs = [];
        this.historyService.getHistory({
            user: this.filter_user,
            from: this.filter_date['from'],
            to: this.filter_date['to'],
        })
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        if(data['data']['events']['events'].length == 0){

                        }else{
                            this.member_since = data['data']['events'].member_since;
                            this.last_login = data['data']['events'].last_login;
                            this.login_counts = data['data']['events']['events'][0].login_counts;
                            this.page_visits = data['data']['events']['events'][0].page_visits;
                            this.export_counts = data['data']['events']['events'][0].export_counts;
                        }
                        this.logs = [...data['data']['logs']];
                    }
                    this.loading = false;
                },
                error => {
                    console.log(error);
                    this.loading = false;
                }
            )
    }
    _fetchUserList() {
        this.apiService.users()
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;

                    this.adminService.users = [...data['data']];
                    this.users = [...data['data']['map'](item => item.name)];
                    this.filter_user = this.users[0];
                    this.apply_filter();
                },
                error => {
                    this.server_user_fetching_error = true;
                    this.loading = false;
                }
            )
    }
}
