import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    users: Object;
    currentUser: Object;
    noUsers = false;
    loading = false;
    server_user_fetching_error = false;

    database: Object;
    shops: Object;

    // User input
    _name: string;
    _email: string;
    _database: string;

    ngOnInit() {

        this.loading = true;
        this.server_user_fetching_error = false;
        this._fetchUserList();
    }

    _fetchUserList() {
        this.apiService.users()
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.users = [...data['data']];
                    if(!this.users){
                        this.noUsers = true;
                    }
                    console.log(this.users)
                },
                error => {
                    this.server_user_fetching_error = true;
                    this.loading = false;
                }
            )
    }
    select_shop(item){
        this.currentUser = item;
    }
    // Get the number of shops in template
    get_shop_length(data){
        return JSON.parse(data).length;
    }
    // Remove current user variable so that admin can add a new user
    remove_current_user(e){
        e.preventDefault();
        this.currentUser = null;
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
    }
    // Discard changes
    discard(e){
        e.preventDefault();
    }
}
