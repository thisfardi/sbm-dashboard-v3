import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { ShopsComponent } from './shops/shops.component';
const routes: Routes = [
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'shops',
        component: ShopsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
