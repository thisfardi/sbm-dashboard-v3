import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StocksComponent } from './stocks/stocks.component';
import { UsageComponent } from './usage/usage.component';

const routes: Routes = [
    {
        path: 'stocks',
        component: StocksComponent
    },
    {
        path: 'usage',
        component: UsageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }
