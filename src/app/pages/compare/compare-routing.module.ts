import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop/shop.component';
import { PeriodComponent } from './period/period.component';

const routes: Routes = [
    {
        path: 'shop',
        component: ShopComponent
    },
    {
        path: 'period',
        component: PeriodComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompareRoutingModule { }
