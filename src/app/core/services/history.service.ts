import { Injectable } from '@angular/core';

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
            user_id: this.user.id,
            event_description: event_string,
            event_detail: event_detail
        };
        console.log(log_event)

    }

}
