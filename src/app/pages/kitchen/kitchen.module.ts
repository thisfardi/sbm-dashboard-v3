import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../shared/ui/ui.module';

import { KitchenRoutingModule } from './kitchen-routing.module';

import { WidgetModule } from '../../shared/widgets/widget.module';

import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { ItemComponent } from './item/item.component';
import { RawComponent } from './raw/raw.component';


import { UsageReportComponent } from './usage-report/usage-report.component';
import { PosReportComponent } from './pos-report/pos-report.component';
import { DailyAnalysisComponent } from './daily-analysis/daily-analysis.component';
import { InventoryAnalysisComponent } from './inventory-analysis/inventory-analysis.component';
import { UsagePerThousandComponent } from './usage-per-thousand/usage-per-thousand.component';
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
    imports: [
        CommonModule,
        KitchenRoutingModule,
        UIModule,
        FlatpickrModule,
        NgSelectModule,
        FormsModule,
        WidgetModule,
        NgbAlertModule,
        NgApexchartsModule,
        FusionChartsModule
    ],
    // tslint:disable-next-line: max-line-length
    declarations: [ItemComponent, RawComponent, UsageReportComponent, PosReportComponent, DailyAnalysisComponent, InventoryAnalysisComponent, UsagePerThousandComponent]
})

export class KitchenModule { }
