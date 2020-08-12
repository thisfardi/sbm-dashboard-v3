import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleComponent } from './sale/sale.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentComponent } from './payment/payment.component';
import { ArticleComponent } from './article/article.component';
import { WeeklyComponent } from './weekly/weekly.component';
import { HourlyComponent } from './hourly/hourly.component';

import { UIModule } from '../../shared/ui/ui.module';
import { DetailsRoutingModule } from './details-routing.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { WidgetModule } from '../../shared/widgets/widget.module';

import { FusionChartsModule } from 'angular-fusioncharts';

// Load FusionCharts
import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load fusion theme
import * as Fusion from 'fusioncharts/themes/fusioncharts.theme.fusion'

import * as Power from "fusioncharts/fusioncharts.powercharts";

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Charts, Fusion, Power);

@NgModule({
    declarations: [SaleComponent, TransactionComponent, PaymentComponent, ArticleComponent, WeeklyComponent, HourlyComponent],
    imports: [
        CommonModule,
        DetailsRoutingModule,
        UIModule,
        NgSelectModule,
        FlatpickrModule,
        FormsModule,
        NgbAlertModule,
        NgApexchartsModule,
        FusionChartsModule,
        WidgetModule
    ]
})
export class DetailsModule { }
