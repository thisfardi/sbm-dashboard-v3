import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { CookieService } from '../../../core/services/cookie.service';

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

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private cookieService: CookieService) { }

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
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    /**
    * On submit form
    */
    onSubmit() {
        this.submitted = true;
        this.error = '';
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
                        if(this.remember){
                            this.cookieService.setCookie('rememberCredentials', JSON.stringify({
                                name: this.f.username.value,
                                password: this.f.password.value
                            }), 1);
                        }else{
                            this.cookieService.deleteCookie('rememberCredentials');
                        }
                        this.success_msg = data['msg'];
                        if(this.f.username.value == 'admin'){
                            this.returnUrl = '/admin/users';
                        }
                        this.router.navigate([this.returnUrl]);
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
