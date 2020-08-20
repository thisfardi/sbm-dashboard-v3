import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaleComponent } from './sale/sale.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentComponent } from './payment/payment.component';
import { ArticleComponent } from './article/article.component';
import { WeeklyComponent } from './weekly/weekly.component';
import { HourlyComponent } from './hourly/hourly.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { OperatorComponent } from './operator/operator.component';
import { PresenceComponent } from './presence/presence.component';

const routes: Routes = [
    {
        path: 'sale',
        component: SaleComponent
    },
    {
        path: 'transaction',
        component: TransactionComponent
    },
    {
        path: 'payment',
        component: PaymentComponent
    },
    {
        path: 'article',
        component: ArticleComponent
    },
    {
        path: 'weekly',
        component: WeeklyComponent
    },
    {
        path: 'hourly',
        component: HourlyComponent
    },
    {
        path: 'monthly',
        component: MonthlyComponent
    },
    {
        path: 'operators',
        component: OperatorComponent
    },
    {
        path: 'presence',
        component: PresenceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailsRoutingModule { }
