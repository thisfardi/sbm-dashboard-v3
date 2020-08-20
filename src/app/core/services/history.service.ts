import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { CookieService } from '../services/cookie.service';
import { ApiService } from '../services/api.service';
import { ParseService } from '../services/parse.service';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    constructor(private cookieService: CookieService, private apiService: ApiService, private parseService: ParseService) { }

    user: Object;

    // user: user id,
    // event_detail: login, page, export
    // event_string: event_description
    logHistory(event_detail: string, event_string: string){
        this.user = JSON.parse(this.cookieService.getCookie('currentUser'));
        let log_event = {
            user_id: this.user['id'],
            event_description: event_string,
            event_detail: event_detail
        };
        this.apiService.logHistory(this.parseService.encode(log_event))
            .pipe(first())
            .subscribe(data => {
                    //console.log(data)
                },
                error => {
                    console.log(error)
                }
            )
    }
    getHistory(data){
        if(data.from == data.to){
            data.to = moment(data.from).add(1, 'days').format('YYYY-MM-DD');
        }
        return this.apiService.getHistory(this.parseService.encode({ user_name: data.user, from: data.from, to: data.to }));
    }
}
