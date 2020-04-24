import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './other/error404/error404.component';


const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
    { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
    { path: 'other', loadChildren: () => import('./other/other.module').then(m => m.OtherModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'details', loadChildren: () => import('./details/details.module').then(m => m.DetailsModule) },
    { path: 'compare', loadChildren: () => import('./compare/compare.module').then(m => m.CompareModule) },
    { path: '**', component: Error404Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
