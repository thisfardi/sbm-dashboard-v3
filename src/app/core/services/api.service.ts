import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';

const api_url = 'http://198.11.172.117/sbm-dashboard';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor( private http: HttpClient, private cookieService: CookieService ) { }
    login(data) {
        return this.http.post(`${api_url}/auth/login`, data)
            .pipe(map(res => {
                //login successful if the status is success
                if (res['status'] == 'success') {
                    // store res details and jwt in cookie
                    this.cookieService.setCookie('currentUser', JSON.stringify(res['res']), 1);
                }

                return res;
            }));
    }
    users() {
        return this.http.post(`${api_url}/auth/users`, {})
            .pipe(map(res => {
                return res;
            }))
    }
    database() {
        return this.http.post(`${api_url}/auth/db`, {})
            .pipe(map(res => {
                return res;
            }))
    }
    shops(data) {
        return this.http.post(`${api_url}/auth/shop`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    update_user(data){
        return this.http.post(`${api_url}/auth/update`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    /**
     * Performs the register
     * @param username username of user
     * @param email email of user
     * @param password password of user
     * @param confirm_password
     */
}
