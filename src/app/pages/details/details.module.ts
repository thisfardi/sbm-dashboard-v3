import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleComponent } from './sale/sale.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentComponent } from './payment/payment.component';
import { ArticleComponent } from './article/article.component';

import { UIModule } from '../../shared/ui/ui.module';
import { DetailsRoutingModule } from './details-routing.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { WidgetModule } from '../../shared/widgets/widget.module';
@NgModule({
    declarations: [SaleComponent, TransactionComponent, PaymentComponent, ArticleComponent],
    imports: [
        CommonModule,
        DetailsRoutingModule,
        UIModule,
        NgSelectModule,
        FlatpickrModule,
        FormsModule,
        NgbAlertModule,
        NgApexchartsModule,
        WidgetModule
    ]
})
export class DetailsModule { }
