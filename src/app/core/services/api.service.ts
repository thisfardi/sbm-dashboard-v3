import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';

const api_url = 'http://198.11.172.117/sbm-dashboard';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor( private http: HttpClient, private cookieService: CookieService ) { }

    /**
     * Performs the login
     * @param data formdata of user authentication
     */
    login(data) {
        return this.http.post(`${api_url}/auth/login`, data)
            .pipe(map(res => {
                //login successful if the status is success
                if (res && res['status'] == 'success') {
                    // store res details and jwt in cookie
                    this.cookieService.setCookie('currentUser', JSON.stringify(res), 1);
                }
                return res;
            }));
    }

    /**
     * Performs the register
     * @param username username of user
     * @param email email of user
     * @param password password of user
     * @param confirm_password
     */
}
