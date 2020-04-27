import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../shared/ui/ui.module';
import { CompareRoutingModule } from './compare-routing.module';

import { ShopComponent } from './shop/shop.component';
import { PeriodComponent } from './period/period.component';

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

FusionChartsModule.fcRoot(FusionCharts, Charts, Fusion, Power);

@NgModule({
    declarations: [ ShopComponent, PeriodComponent ],
    imports: [
        CommonModule,
        CompareRoutingModule,
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
export class CompareModule { }
