import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { CookieService } from '../../../core/services/cookie.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

    loginForm: FormGroup;
    submitted = false;
    returnUrl: string;
    error = '';
    success_msg = '';
    loading = false;
    remember = true; // Remember credentials on cookie

    bg = '';

    interval: number;

    notDashboardUser: Boolean = false;

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private cookieService: CookieService, private historyService: HistoryService) { }

    ngOnInit() {
        let name = '';
        let password = '';
        let remember_credentials = JSON.parse(this.cookieService.getCookie('rememberCredentials'));

        if(remember_credentials){
            name = remember_credentials.name;
            password = remember_credentials.password;
        }
        this.loginForm = this.formBuilder.group({
            username: [name, [Validators.required]],
            password: [password, Validators.required],
        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        // tslint:disable-next-line: no-string-literal
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngAfterViewInit() {
        document.body.classList.add('authentication-bg');
        document.body.classList.add('authentication-bg-pattern');
        let idx = 1;
        this.interval = setInterval(function(){
            document.querySelector('.auth-img').setAttribute('src',`assets/images/bg/bg${ ++idx }.png`);
            if(idx > 2){
                idx = 0;
            }
        }, 3000);
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    /**
    * On submit form
    */
    onSubmit() {
        this.submitted = true;
        this.error = '';
        this.notDashboardUser = false;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        clearInterval(this.interval);
                        if(this.remember){
                            this.cookieService.setCookie('rememberCredentials', JSON.stringify({
                                name: this.f.username.value,
                                password: this.f.password.value
                            }), 10);
                        }else{
                            this.cookieService.deleteCookie('rememberCredentials');
                        }
                        if(data['res']['role'] == 'super_admin'){
                            this.returnUrl = '/admin/users';
                            this.success_msg = data['msg'];
                        }else{
                            if(data['res']['access'] == 'dashboard'){
                                this.historyService.logHistory('login', 'Log in');
                                this.success_msg = data['msg'];
                            }else{
                                this.error = "This user is not a dashboard user. Please try to login from other platforms.";
                            }
                        }
                        if(data['res']['access'] == 'dashboard'){
                            this.router.navigate([this.returnUrl]);
                        }else{
                            this.error = "This user is not a dashboard user. Please try to login from other platforms.";
                        }

                    }else if(data['status'] == 'failed'){
                        this.error = data['msg'];
                        this.loading = false;
                    }else{
                        this.error = 'Server error. Please try again later.';
                    }
                    this.loading = false;
                },
                error => {
                    this.error = 'Server error. Please try again later.';
                    this.loading = false;
                }
            );
    }
}
