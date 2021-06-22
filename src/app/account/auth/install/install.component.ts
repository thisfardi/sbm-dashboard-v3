import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { CookieService } from '../../../core/services/cookie.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit, AfterViewInit {

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private cookieService: CookieService, private historyService: HistoryService) { }

  installForm: FormGroup;
  submitted = false;
  error = '';
  success_msg = '';
  loading = false;

  ngOnInit() {
    let name = '';
    let email = '';
    let password = '';
    let servername = '';
    let serverpassword = '';
    let uid = '';
    this.installForm = this.formBuilder.group({
      username: [name, [Validators.required]],
      email: [email, [Validators.required]],
      password: [password, Validators.required],
      servername: [servername, Validators.required],
      serverpassword: [serverpassword, Validators.required],
      uid: [uid, Validators.required],
    });
  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    document.body.classList.add('authentication-bg-pattern');
  }

  get f() { return this.installForm.controls; }
  onSubmit(){
    this.submitted = true;
    this.error = '';
    this.success_msg = ''
    if (this.installForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.install(
      this.f.username.value,
      this.f.email.value,
      this.f.password.value,
      this.f.servername.value,
      this.f.serverpassword.value,
      this.f.uid.value
    ).pipe(first())
    .subscribe(
      data => {
        if(data['status'] == 'success'){
          this.success_msg = data['msg']
          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 3000)
        }else{
          this.error = data['msg']
        }
        this.loading = false;
      },
      error => {
        this.error = 'Server error. Please try again later.';
        this.loading = false;
      }
    )
  }
}
