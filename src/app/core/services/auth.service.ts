import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';
import { ApiService } from '../services/api.service';
import { ParseService } from '../services/parse.service';
import { User } from '../models/auth.models';
import { HistoryService } from '../services/history.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user: User;

    constructor(private http: HttpClient, private cookieService: CookieService, private apiService: ApiService, private parseService: ParseService, private historyService: HistoryService) {
    }

    /**
     * Returns the current user
     */
    public currentUser() {
        return JSON.parse(this.cookieService.getCookie('currentUser'));
    }

    /**
     * Performs the login
     * @param username username of user
     * @param password password of user
     */
    login(username: string, password: string) {
        return this.apiService.login(this.parseService.encode({
            name: username,
            password: password
        }));
    }

    install(username, email, password, servername, serverpassword, uid){
        return this.apiService.install(this.parseService.encode({
            name: username,
            email: email,
            password: password,
            servername: servername,
            serverpassword: serverpassword,
            uid: uid,
            access: 'dashboard',
            role: 'super_admin'
        }));
    }

    /**
     * Logout the user
     */
    logout() {
        //this.historyService.logHistory('logout', 'Log out');
        // remove user from local storage to log user out
        this.cookieService.deleteCookie('currentUser');
        this.user = null;
    }
}
