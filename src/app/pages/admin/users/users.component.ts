import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    constructor(private apiService: ApiService, private parseService: ParseService) { }

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
    selected_shops: Object;

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
    ngOnInit() {

        this.loading = true;
        this.server_user_fetching_error = false;
        this._fetchUserList();
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

                    this.users = [...data['data']];
                    if(!this.users){
                        this.noUsers = true;
                    }
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
    _updateUser(id, name, shops){
        this.apiService.update_user(this.parseService.encode({
            id: id,
            name: name,
            shop: JSON.stringify(shops)
        }))
            .pipe(first())
            .subscribe(
                data => {
                    if(data['status'] == 'success'){
                        this._fetchUserList();
                    }
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

    // Remove current user variable so that admin can add a new user
    remove_current_user(e){
        e.preventDefault();
        this.currentUser = null;
        this.selected_database = '';
        this.selected_shops = [];
    }
    // Add a new user
    add_user(e){
        e.preventDefault();
    }
    // Remove user | opens a confirmation modal
    remove_user(e){
        e.preventDefault();
    }
    // Update user
    update_user(e){
        e.preventDefault();
        if(this._name && (this.selected_shops.length != 0)){
            this._updateUser(this.currentUser['id'], this._name, this.selected_shops);
        }else{
            this.validation_error = true;
            this.validation_error_msg = 'Validation error. Please fill out all fields.';
        }
    }
    // Discard changes
    discard(e){
        e.preventDefault();
    }
}
