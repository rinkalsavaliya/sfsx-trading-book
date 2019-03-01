/**
* Base routing module to define routes
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
* Define custom base routes
*/
const routes: Routes = [
  /**
  * for base route, redirect to layout module
  */
  {
    path: '', loadChildren: './layout/layout.module#LayoutModule',
    pathMatch: 'prefix'
  },

  /**
  * for every request, other than the defined routes, redirect them to layout page
  */
  { path: '**', redirectTo: '' }
];

/**
* for base routes, use forRoot,
* whereas, for child routes, use forChild
*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


/**
* Export routing module to use it in app module
*/
export class AppRoutingModule {}
