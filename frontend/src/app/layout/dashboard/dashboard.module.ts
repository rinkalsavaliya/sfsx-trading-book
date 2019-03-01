import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

/**
* import sub modules and components
*/
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

/**
* import shared modules
*/
import { LoaderModule, AuthService } from '../../shared';

/**
* import main service
*/
import { MainService } from '../main.service';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { FormsModule } from '@angular/forms';

/**
* wrap all components, which are part of declaration of this module
* into one single NgModule, and export DashboardModule
*/
@NgModule({
  /**
  * declare all modules
  */
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    DashboardRoutingModule,
    LoaderModule,
    BootstrapModalModule.forRoot({ container: document.body })
  ],

  /**
  * declare all components
  */
  declarations: [
    DashboardComponent
  ],
  /**
  * declare main and auth service as a provider
  */
  providers: [
    MainService,
    AuthService,
  ],
})
/**
* export DashboardModule
* so it can be use in project
*/
export class DashboardModule { }
