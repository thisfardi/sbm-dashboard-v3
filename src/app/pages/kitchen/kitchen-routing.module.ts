import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemComponent } from './item/item.component';

import { UsageReportComponent } from './usage-report/usage-report.component';
import { PosReportComponent } from './pos-report/pos-report.component';
import { DailyAnalysisComponent } from './daily-analysis/daily-analysis.component';
import { InventoryAnalysisComponent } from './inventory-analysis/inventory-analysis.component';

const routes: Routes = [
  {
    path: 'item',
    component: ItemComponent
  },
  {
    path: 'usage-report',
    component: UsageReportComponent
  },
  {
    path: 'pos-report',
    component: PosReportComponent
  },
  {
    path: 'daily-analysis',
    component: DailyAnalysisComponent
  },
  {
    path: 'inventory-analysis',
    component: InventoryAnalysisComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenRoutingModule { }
