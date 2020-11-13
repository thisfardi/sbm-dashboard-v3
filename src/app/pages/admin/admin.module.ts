import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../shared/ui/ui.module';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule, NgbTooltipModule, NgbProgressbarModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { WidgetModule } from '../../shared/widgets/widget.module';

import { UsersComponent } from './users/users.component';
import { ShopsComponent } from './shops/shops.component';
import { UserEventsComponent } from './user-events/user-events.component';

@NgModule({
    imports: [
        CommonModule,
        AdminRoutingModule,
        NgbTabsetModule,
        NgbTooltipModule,
        NgbProgressbarModule,
        NgbModule,
        UIModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        FlatpickrModule,
        WidgetModule
    ],
    // tslint:disable-next-line: max-line-length
    declarations: [UsersComponent, ShopsComponent, UserEventsComponent]
})

export class AdminModule { }
