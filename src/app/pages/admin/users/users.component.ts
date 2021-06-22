import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class UsersComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private parseService: ParseService,
    private modalService: NgbModal,
    private adminService: AdminService,
    private authService: AuthenticationService,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
  }
  USER_ACCESS = ['dashboard', 'kitchen', 'purchasing_system'];
  USER_ROLE = ['super_admin', 'customer'];
  COMPANY = ['MeetFresh', 'HappyLemon', 'Wushiland', 'Sunmerry', 'Cha2o'];
  users: any;
  currentUser: Object;

  noUsers = false;

  // Loaders
  loading = false;

  db_loading = false;
  shop_loading = false;

  // Indicates the database has not shops
  invalid_database = false;

  selected_access: string;
  selected_role: string;
  selected_company: string;

  server_user_fetching_error = false;
  selected_database: string;
  selected_shops: [];
  selected_shop = '' // For purchasing test

  database: Object;
  shops: Object;

  // User input
  _name: string;
  _email: string;
  _password: string;
  _repassword: string;
  _branch_id: string;

  // Validation error
  validation_error = false;
  validation_error_msg = '';

  // succeed
  user_update_succeed = false;
  user_add_succeed = false;
  user_delete_succeed = false;

  user_name_caption = 'User name';

  modalRef: any;
  ngOnInit() {
    if (!this.adminService.users) {
      this.loading = true;
      this.server_user_fetching_error = false;
      this._fetchUserList();
    } else {
      this.users = this.adminService.users;
    }
    this.selected_access = this.USER_ACCESS[0]
    this.selected_role = this.USER_ROLE[1]
    this.selected_company = this.COMPANY[0]
  }

  reset_values() {
    // Reset values
    this._name = '';
    this._email = '';
    this._password = '';
    this._repassword = '';
    this._branch_id = '';
    this.selected_database = '';
    this.selected_shop = '';
    this.selected_shops = [];
    this.user_name_caption = 'User name';
  }

  // Api call
  _fetchUserList() {
    this.apiService.users(this.parseService.encode({
      servername: this.authService.currentUser().servername,
      serverpassword: this.authService.currentUser().serverpassword,
      uid: this.authService.currentUser().uid
    }))
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          // Database get
          this.db_loading = true;
          this._fetchDatabase();

          this.adminService.users = [...data['data']];
          this.users = [...data['data']];
          if (!this.users) {
            this.noUsers = true;
          }

          // Reset messages
          this.user_update_succeed = false;
          this.user_add_succeed = false;
          this.user_delete_succeed = false;
          this.reset_values();
        },
        error => {
          this.server_user_fetching_error = true;
          this.loading = false;
        }
      )
  }
  _fetchDatabase() {
    this.apiService.database(this.parseService.encode({
      servername: this.authService.currentUser().servername,
      serverpassword: this.authService.currentUser().serverpassword,
      uid: this.authService.currentUser().uid
    }))
      .pipe(first())
      .subscribe(
        data => {
          this.db_loading = false;

          this.database = [...data['data']].map(item => item.name);
        },
        error => {
          console.log(error)
          this.db_loading = false;
        }
      )
  }
  _fetchShops(db: string) {
    this.apiService.shops(this.parseService.encode({
      db: db,
      servername: this.authService.currentUser().servername,
      serverpassword: this.authService.currentUser().serverpassword,
      uid: this.authService.currentUser().uid
    }))
      .pipe(first())
      .subscribe(
        data => {
          this.shop_loading = false;
          if (data['status'] == 'success') {
            this.invalid_database = false;
            this.shops = [...data['data']].map(item => item.description);
          } else {
            this.invalid_database = true;
          }
        },
        error => {
          console.log(error)
          this.shop_loading = false;
        }
      )
  }
  _updateUser(id, name, email, password, database, shops, access, role, company, branch_id) {
    this.apiService.update_user(this.parseService.encode({
      id: id,
      name: name,
      email: email,
      password: password,
      database: database,
      shop: Array.isArray(shops) ? JSON.stringify(shops) : shops,
      role: role,
      access: access,
      company: company,
      branch_id: branch_id
    }))
      .pipe(first())
      .subscribe(
        data => {
          if (data['status'] == 'success') {
            this._fetchUserList();
            this.user_update_succeed = true;
            this.currentUser = undefined;
          }
        },
        error => {
          console.log(error)
        }
      )
  }
  _addUser(name, email, password, database, shops, access, role, company, branch_id) {
    this.validation_error = false
    this.apiService.add_user(this.parseService.encode({
      name: name,
      email: email,
      password: password,
      database: database,
      shop: Array.isArray(shops) ? JSON.stringify(shops) : shops,
      access: access,
      role: role,
      company: company,
      branch_id: branch_id,
      servername: this.authService.currentUser().servername,
      serverpassword: this.authService.currentUser().serverpassword,
      uid: this.authService.currentUser().uid
    }))
      .pipe(first())
      .subscribe(
        data => {
          if (data['status'] == 'success') {
            this._fetchUserList();
            this.user_add_succeed = true;
            this.reset_values();
          }else{
            this.user_add_succeed = false;
            this.validation_error = true;
            this.validation_error_msg = data['msg'];
          }
        },
        error => {
          console.log(error)
        }
      )
  }
  _remove_user(id) {
    this.apiService.remove_user(this.parseService.encode({
      id: id
    }))
      .pipe(first())
      .subscribe(
        data => {
          this._fetchUserList();
          this.user_delete_succeed = true;
          this.currentUser = null;
          this.reset_values();
        },
        error => {
          console.log(error)
        }
      )
  }

  // Selects user from user list table
  select_user(item) {
    this.currentUser = item;
    this._name = item.name;
    this._email = item.email;
    this._password = item.password;
    this._branch_id = item.branch_id;
    this.selected_access = item.access;
    this.selected_company = item.company;
    this.access_change(item.access);
    if(item.role){
      this.selected_role = item.role;
    }
    if (item.access == 'dashboard') {
      this.selected_database = item.database;
      this.selected_shops = JSON.parse(item.shop_name);
      // select_database() without reseting selected_shops
      this.shop_loading = true;
      this._fetchShops(this.selected_database);
    }else{
      this.selected_database = item.database;
      this.selected_shop = item.shop_name;
      this.shop_loading = true;
      this._fetchShops(this.selected_database);
    }
  }

  // Selects database from add user or edit user form
  select_database() {
    this.shop_loading = true;
    this.selected_shop = '';
    this.selected_shops = [];
    this._fetchShops(this.selected_database);
  }

  // Get the number of shops in template
  get_shop_length(data) {

  }

  // Remove current user variable so that admin can add a new user | triggered when 'Add new user' button clicked
  remove_current_user(e) {
    e.preventDefault();
    this.currentUser = null;
    this.reset_values();
  }
  access_change(e) {
    if (e == 'dashboard') {
      this.USER_ROLE = ['super_admin', 'customer'];
      this.selected_company = '';
    } else if (e == 'kitchen') {
      this.USER_ROLE = ['admin', 'customer'];
    } else {
      this.USER_ROLE = ['admin', 'cooperator', 'franchisee'];
    }
    this.selected_role = this.USER_ROLE[1];
  }
  // Add a new user
  add_user(e) {
    e.preventDefault();
    this.validation_error = false;
    if (this.selected_access == 'dashboard') {
      if (this._name && this._email && this._password && (this._password == this._repassword) && this.selected_database && (this.selected_shops['length'] != 0) &&
        (this.selected_role == 'customer')
      ) {
        this._addUser(this._name, this._email, this._password, this.selected_database, this.selected_shops, this.selected_access, this.selected_role, '', '');
      } else {
        this.validation_error = true;
        this.validation_error_msg = 'Validation error.';

        if (!this._name || !this._email) {
          this.validation_error_msg += ' You should input name and email.';
        }
        else if ((this._password != this._repassword) || !this._password) {
          this.validation_error_msg += ' Password mismatching.';
        }
        else if (!this.selected_database) {
          this.validation_error_msg += ' You should select database.';
        }
        else if (this.selected_role != 'customer') {
          this.validation_error_msg += ' Dashboard user type should be \'customer\'';
        }
        else {
          this.validation_error_msg += ' You should select at least one shop.';
        }
      }
    } else if((this.selected_access == 'kitchen') && (this.selected_role == 'customer')){
      if (this._name && this._email ) {
        this._addUser(this._name, this._email, '', this.selected_database, this.selected_shop, this.selected_access, this.selected_role, this.selected_company, '');
      } else {
        this.validation_error = true;
        this.validation_error_msg = 'Validation error.';

        if (!this._name || !this._email) {
          this.validation_error_msg += ' You should input shop ID and KEY.';
        }
        else {
          //this.validation_error_msg += ' You should select at least one shop.';
        }
      }
    }else if((this.selected_access == 'kitchen') && (this.selected_role == 'admin')){
      if (this._name && this._email && this._password && (this._password == this._repassword) ) {
        this._addUser(this._name, this._email, this._password, this.selected_database, this.selected_shop, this.selected_access, this.selected_role, this.selected_company, '');
      } else {
        this.validation_error = true;
        this.validation_error_msg = 'Validation error.';

        if (!this._name || !this._email) {
          this.validation_error_msg += ' You should input shop ID and KEY.';
        }
        else {
          //this.validation_error_msg += ' You should select at least one shop.';
        }
      }
    }else {
      // Inventory or purchasing system
      if (this._name && this._email && this._branch_id && this._password && (this._password == this._repassword) && (this.selected_access != '')
        && (this.selected_role != 'super_admin') && this.selected_shop) {
        this._addUser(this._name, this._email, this._password, this.selected_database, this.selected_shop, this.selected_access, this.selected_role, this.selected_company, this._branch_id);
      } else {
        this.validation_error = true;
        this.validation_error_msg = 'Validation error.';

        if (!this._name || !this._email || !this._branch_id) {
          this.validation_error_msg += ' You should input name, branch ID and email.';
        }
        else if ((this._password != this._repassword) || !this._password) {
          this.validation_error_msg += ' Password mismatching.';
        }
        else {
          //this.validation_error_msg += ' You should select at least one shop.';
        }
      }
    }
  }
  // Remove user | opens a confirmation modal
  remove_confirm(confirmRemoveModal: any) {
    this.modalRef = this.modalService.open(confirmRemoveModal, { centered: true });
  }
  remove_user() {
    this.modalRef.close();
    this._remove_user(this.currentUser['id']);
  }

  create_new_user_modal(creatNewUserModal: any){
    //this.modalRef = this.modalService.open(creatNewUserModal, { centered: true, animation: true, size: 'lg'});
  }
  user_create_confirm(creatNewUserModal: any){
    this.modalRef.close();
  }
  // Update user
  update_user(e) {
    e.preventDefault();
    this.validation_error = false;
    if (this._name) {
      if (this.selected_access == 'kitchen') {
        // this.selected_database = '';
        // this.selected_shops = [];
      }
      this._updateUser(
        this.currentUser['id'],
        this._name,
        this._email,
        this._password,
        this.selected_database,
        this.selected_shops.length == 0 ? this.selected_shop : this.selected_shops,
        this.selected_access,
        this.selected_role,
        this.selected_company,
        this._branch_id
      );
    } else {
      this.validation_error = true;
      this.validation_error_msg = 'Validation error.';
      if (!this._name) {
        this.validation_error_msg += ' You should input name.';
      }
      else if (this.selected_shops['length'] == 0) {
        this.validation_error_msg += ' You should select at least one shop.';
      }
      else {
        // Do nothing.
      }
    }
  }
}
