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

@NgModule({
    imports: [
        CommonModule,
        KitchenRoutingModule,
        UIModule,
        FlatpickrModule,
        NgSelectModule,
        FormsModule,
        NgbAlertModule,
        NgApexchartsModule
    ],
    // tslint:disable-next-line: max-line-length
    declarations: [ItemComponent, RawComponent]
})

export class KitchenModule { }
