import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

/**
* Define routes
*/
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: '', loadChildren: './dashboard/dashboard.module#DashboardModule',
        pathMatch: 'prefix',
      }
    ]
  }
];

/**
* for base routes, use forRoot,
* whereas, for child routes, use forChild
*/
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
/**
* Export routing module to use it in layout module
*/
export class LayoutRoutingModule { }
