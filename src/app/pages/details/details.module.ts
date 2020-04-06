import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleComponent } from './sale/sale.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentComponent } from './payment/payment.component';
import { ArticleComponent } from './article/article.component';

import { DetailsRoutingModule } from './details-routing.module';

@NgModule({
    declarations: [SaleComponent, TransactionComponent, PaymentComponent, ArticleComponent],
    imports: [
        CommonModule,
        DetailsRoutingModule
    ]
})
export class DetailsModule { }
