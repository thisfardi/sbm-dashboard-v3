import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaleComponent } from './sale/sale.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentComponent } from './payment/payment.component';
import { ArticleComponent } from './article/article.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailsRoutingModule { }
