import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../shared/ui/ui.module';

import { KitchenRoutingModule } from './kitchen-routing.module';

import { WidgetModule } from '../../shared/widgets/widget.module';

import { ItemComponent } from './item/item.component';
import { RawComponent } from './raw/raw.component';

@NgModule({
    imports: [
        CommonModule,
        KitchenRoutingModule,
        UIModule
    ],
    // tslint:disable-next-line: max-line-length
    declarations: [ItemComponent, RawComponent]
})

export class KitchenModule { }
