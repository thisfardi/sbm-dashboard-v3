import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { NgbTabsetModule, NgbTooltipModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
    imports: [
        CommonModule,
        AdminRoutingModule,
        NgbTabsetModule,
        NgbTooltipModule,
        NgbProgressbarModule
    ],
    // tslint:disable-next-line: max-line-length
    declarations: [UsersComponent, AddUserComponent, EditUserComponent]
})

export class AdminModule { }
