import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';

const api_url = 'http://198.11.172.117/sbm-dashboard';

const db = 'db';
const shop = 'shop';
const controller = 'home';

// const db = 'db_secondary';
// const shop = 'shop_secondary';
// const controller = 'tcpos'

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor( private http: HttpClient, private cookieService: CookieService) { }

    // Admin APIs
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
    logHistory(data) {
        return this.http.post(`${api_url}/auth/logHistory`, data)
            .pipe(map(res => {
                return res;
            }));
    }
    getHistory(data) {
        return this.http.post(`${api_url}/auth/getHistory`, data)
            .pipe(map(res => {
                return res;
            }));
    }
    users() {
        return this.http.post(`${api_url}/auth/all_users`, {})
            .pipe(map(res => {
                return res;
            }))
    }
    database() {
        return this.http.post(`${api_url}/auth/${ db }`, {})
            .pipe(map(res => {
                return res;
            }))
    }
    shops(data) {
        return this.http.post(`${api_url}/auth/${ shop }`, data)
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
    add_user(data){
        return this.http.post(`${api_url}/auth/register`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    remove_user(data){
        return this.http.post(`${api_url}/auth/delete`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    all_operators(data){
        return this.http.post(`${api_url}/${ controller }/all_operators`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    operators(data){
        return this.http.post(`${api_url}/${ controller }/operators`, data)
            .pipe(map(res => {
                return res;
            }))
    }

    // User APIs
    sum_data(data){
        return this.http.post(`${api_url}/${ controller }/sum_data`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    sale_data(data){
        return this.http.post(`${api_url}/${ controller }/sale_data`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    payment_data(data){
        return this.http.post(`${api_url}/${ controller }/payment_data`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    causals(data){
        return this.http.post(`${api_url}/${ controller }/causals_data`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    sale_details(data){
        return this.http.post(`${api_url}/${ controller }/sale_details`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    trans_details(data){
        return this.http.post(`${api_url}/${ controller }/trans_details`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    payment_details(data){
        return this.http.post(`${api_url}/${ controller }/payment_details`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    article_details(data){
        return this.http.post(`${api_url}/${ controller }/article_details`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    sale_compare(data){
        return this.http.post(`${api_url}/${ controller }/sale_compare`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    other_compare(data){
        return this.http.post(`${api_url}/${ controller }/other_compare`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    payment_compare(data){
        return this.http.post(`${api_url}/${ controller }/payment_compare`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    sale_date_compare(data){
        return this.http.post(`${api_url}/${ controller }/sale_date_compare`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    other_date_compare(data){
        return this.http.post(`${api_url}/${ controller }/other_date_compare`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    payment_date_compare(data){
        return this.http.post(`${api_url}/${ controller }/payment_date_compare`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    item_history(data){
        return this.http.post(`${api_url}/kitchen/getHistory`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    kitchens(data){
        return this.http.post(`${api_url}/kitchen/getKitchens`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    weekly_detail(data){
        return this.http.post(`${api_url}/${ controller }/weekly_detail`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    hourly_detail(data){
        return this.http.post(`${api_url}/${ controller }/hourly_detail`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    hourly_detail_article(data){
        return this.http.post(`${api_url}/${ controller }/hourly_detail_article`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    monthly_detail(data){
        return this.http.post(`${api_url}/${ controller }/monthly_detail`, data)
            .pipe(map(res => {
                return res;
            }))
    }
    getInventoryHistory(data){
      return this.http.post(`${api_url}/is/get_inventory_history`, data)
          .pipe(map(res => {
              return res;
          }))
    }
    getStocksData(data){
      return this.http.post(`${api_url}/is/get_inventory_stock`, data)
          .pipe(map(res => {
              return res;
          }))
    }
    getItemHistoryData(data){
      return this.http.post(`${api_url}/is/get_item_history_data`, data)
          .pipe(map(res => {
              return res;
          }))
    }


    getKitchenHistory(data){
      return this.http.post(`http://198.11.172.117:7101/history.aspx`, data, {headers : new HttpHeaders({ 'Content-Type': 'text/plain' })})
          .pipe(map(res => {
              return res;
          }))
    }
}
