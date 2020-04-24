import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../shared/ui/ui.module';
import { CompareRoutingModule } from './compare-routing.module';

import { ShopComponent } from './shop/shop.component';
import { PeriodComponent } from './period/period.component';

@NgModule({
    declarations: [ ShopComponent, PeriodComponent ],
    imports: [
        CommonModule,
        CompareRoutingModule,
        UIModule
    ]
})
export class CompareModule { }
