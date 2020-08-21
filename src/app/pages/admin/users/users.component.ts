import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    constructor(private apiService: ApiService, private parseService: ParseService, private modalService: NgbModal, private adminService: AdminService) { }

    users: Object;
    currentUser: Object;

    noUsers = false;

    // Loaders
    loading = false;

    db_loading = false;
    shop_loading = false;

    // Indicates the database has not shops
    invalid_database = false;

    server_user_fetching_error = false;
    selected_database: string;
    selected_shops: [];

    database: Object;
    shops: Object;

    // User input
    _name: string;
    _email: string;
    _password: string;
    _repassword: string;

    // Validation error
    validation_error = false;
    validation_error_msg = '';

    // succeed
    user_update_succeed = false;
    user_add_succeed = false;
    user_delete_succeed = false;

    modalRef: any;
    ngOnInit() {
        if(!this.adminService.users){
            this.loading = true;
            this.server_user_fetching_error = false;
            this._fetchUserList();
        }else{
            this.users = this.adminService.users;
        }
    }

    reset_values() {
        // Reset values
        this._name = '';
        this._email = '';
        this._password = '';
        this._repassword = '';
        this.selected_database = '';
        this.selected_shops = [];
    }

    // Api call
    _fetchUserList() {
        this.apiService.users()
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    // Database get
                    this.db_loading = true;
                    this._fetchDatabase();

                    this.adminService.users = [...data['data']];
                    this.users = [...data['data']];

                    if(!this.users){
                        this.noUsers = true;
                    }

                    // Reset messages
                    this.user_update_succeed = false;
                    this.user_add_succeed = false;
                    this.user_delete_succeed = false;
                },
                error => {
                    this.server_user_fetching_error = true;
                    this.loading = false;
                }
            )
    }
    _fetchDatabase() {
        this.apiService.database()
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
            db: db
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.shop_loading = false;
                    if(data['status'] == 'success'){
                        this.invalid_database = false;
                        this.shops = [...data['data']].map(item => item.description);
                    }else{
                        this.invalid_database = true;
                    }
                },
                error => {
                    console.log(error)
                    this.shop_loading = false;
                }
            )
    }
    _updateUser(id, name, password, shops){
        this.apiService.update_user(this.parseService.encode({
            id: id,
            name: name,
            password: password,
            shop: JSON.stringify(shops)
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this._fetchUserList();
                        this.user_update_succeed = true;
                    }
                },
                error => {
                    console.log(error)
                }
            )
    }
    _addUser(name, email, password, database, shops){
        this.apiService.add_user(this.parseService.encode({
            name: name,
            email: email,
            password: password,
            database: database,
            shop: JSON.stringify(shops)
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this._fetchUserList();
                        this.user_add_succeed = true;

                        this.reset_values();
                    }
                },
                error => {
                    console.log(error)
                }
            )
    }
    _remove_user(id){
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
    select_user(item){
        this.currentUser = item;
        this.selected_database = item.database;
        this.selected_shops = JSON.parse(item.shop_name);

        this._name = item.name;
        this._email = item.email;
        this._password = item.password;
        // select_database() without reseting selected_shops
        this.shop_loading = true;
        this._fetchShops(this.selected_database);
    }

    // Selects database from add user or edit user form
    select_database(){
        this.shop_loading = true;
        this.selected_shops = [];
        this._fetchShops(this.selected_database);
    }

    // Get the number of shops in template
    get_shop_length(data){
        return JSON.parse(data).length;
    }

    // Remove current user variable so that admin can add a new user | triggered when 'Add new user' button clicked
    remove_current_user(e){
        e.preventDefault();
        this.currentUser = null;
        this.selected_database = '';
        this.selected_shops = [];
        this.reset_values();
    }

    // Add a new user
    add_user(e){
        e.preventDefault();
        this.validation_error = false;
        if(this._name && this._email && this._password && (this._password == this._repassword) && this.selected_database && (this.selected_shops['length'] != 0)){

            this._addUser(this._name, this._email, this._password, this.selected_database, this.selected_shops);

        }else{

            this.validation_error = true;
            this.validation_error_msg = 'Validation error.';

            if(!this._name || !this._email){
                this.validation_error_msg += ' You should input your name and email.';
            }
            else if((this._password != this._repassword) || !this._password){
                this.validation_error_msg += ' Password mismatching.';
            }
            else if(!this.selected_database){
                this.validation_error_msg += ' You should select database.';
            }
            else{
                this.validation_error_msg += ' You should select at least one shop.';
            }
        }
    }
    // Remove user | opens a confirmation modal
    remove_confirm(confirmRemoveModal: any){
        this.modalRef = this.modalService.open(confirmRemoveModal, { centered: true });
    }
    remove_user(){
        this.modalRef.close();
        this._remove_user(this.currentUser['id']);
    }
    // Update user
    update_user(e){
        e.preventDefault();
        this.validation_error = false;
        if(this._name && (this.selected_shops['length'] != 0)){

            this._updateUser(this.currentUser['id'], this._name, this._password, this.selected_shops);

        }else{

            this.validation_error = true;
            this.validation_error_msg = 'Validation error.';

            if(!this._name){
                this.validation_error_msg += ' You should input your name.';
            }
            else if(this.selected_shops['length'] == 0){
                this.validation_error_msg += ' You should select at least one shop.';
            }
            else{
                // Do nothing.
            }
        }
    }
}
