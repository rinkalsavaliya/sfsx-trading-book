import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
* Sub components of module "dashboard"
*/
import { DashboardComponent } from './dashboard.component';

/**
* Define sub routes
*/
const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    pathMatch: 'full',
  },
  /**
  * for every request, other than the defined routes, redirect them to not-found page
  */
  { path: '**', redirectTo: '/' },
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
* Export routing module to use it in dashboard module
*/
export class DashboardRoutingModule { }
