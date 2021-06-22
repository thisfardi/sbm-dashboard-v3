import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AdminService } from '../admin.service';

@Component({
    selector: 'app-shops',
    templateUrl: './shops.component.html',
    styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {

    constructor(private adminService: AdminService, private authService: AuthenticationService, private apiService: ApiService, private parseService: ParseService) { }

    shops: Object;
    database: Object;
    operators: Object;

    // Loaders
    db_loading = false;
    shop_loading = false;
    operator_loading = false;

    // Indicates the database has not shops
    invalid_database = false;

    server_fetching_error = false;
    selected_database: string;
    selected_shop: string;

    ngOnInit() {
        if(!this.adminService.database){
            this.db_loading = true;
            this.server_fetching_error = false;
            this._fetchDatabase();
        }{
            this.database = this.adminService.database;
        }
    }

    // API call
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
                    this.adminService.database = [...data['data']].map(item => item.name);
                },
                error => {
                    console.log(error)
                    this.server_fetching_error = true;
                    this.db_loading = false;
                }
            )
    }
    _fetchShops(db: string) {
        this.shops = [];
        this.shop_loading = true;
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
                    if(data['status'] == 'success'){
                        this.invalid_database = false;
                        this.shops = [...data['data']].map(item => item.description);

                        this._fetchOperatorsByDatabase(db);
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
    _fetchOperatorsByDatabase(db: string) {
        this.operators = [];
        this.operator_loading = true;
        this.apiService.all_operators(this.parseService.encode({
            db: db
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.operator_loading = false;
                    if(data['status'] == 'success'){
                        this.operators = [...data['data'].operators].map(item => {
                            return {
                                code: item.code,
                                description: item.description
                            }
                        });
                    }
                },
                error => {
                    console.log(error)
                    this.operator_loading = false;
                }
            )
    }
    _fetchOperatorsByShop(db:string, shop: string) {
        this.operators = [];
        this.operator_loading = true;
        this.apiService.operators(this.parseService.encode({
            db: db,
            shop: shop
        }))
            .pipe(first())
            .subscribe(
                data => {
                    this.operator_loading = false;
                    if(data['status'] == 'success'){
                        this.operators = [...data['data'].operators].map(item => {
                            return {
                                code: item.code,
                                description: item.description
                            }
                        });
                    }
                },
                error => {
                    console.log(error)
                    this.operator_loading = false;
                }
            )
    }

    // Component methods
    select_database(db: string){
        this.selected_database = db;
        this.selected_shop = '';
        this._fetchShops(db);
    }
    select_shop(shop: string){
        this.selected_shop = shop;
        this._fetchOperatorsByShop(this.selected_database, shop);
    }

}
