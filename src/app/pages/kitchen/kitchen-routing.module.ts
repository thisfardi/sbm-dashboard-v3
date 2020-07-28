import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemComponent } from './item/item.component';
import { RawComponent } from './raw/raw.component';

const routes: Routes = [
    {
        path: 'item',
        component: ItemComponent
    },
    {
        path: 'raw',
        component: RawComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KitchenRoutingModule { }
