import { UIModule } from '../../shared/ui/ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';

import { WidgetModule } from '../../shared/widgets/widget.module';

import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';


import { StocksComponent } from './stocks/stocks.component';
import { UsageComponent } from './usage/usage.component';


import { FusionChartsModule } from 'angular-fusioncharts';

// Load FusionCharts
import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load fusion theme
import * as Fusion from 'fusioncharts/themes/fusioncharts.theme.fusion'
import * as Power from "fusioncharts/fusioncharts.powercharts";
import * as Widgets from "fusioncharts/fusioncharts.widgets";
FusionChartsModule.fcRoot(FusionCharts, Charts, Fusion, Power, Widgets);

@NgModule({
  declarations: [StocksComponent, UsageComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    UIModule,
    FlatpickrModule,
    NgSelectModule,
    FormsModule,
    WidgetModule,
    NgbAlertModule,
    FusionChartsModule,
    NgApexchartsModule
  ]
})
export class InventoryModule { }
