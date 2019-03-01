/**
* Base routing module to define routes
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from 'ng2-bootstrap-modal';
/**
* sub routing module for layout
*/
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

/**
* import shared components
*/
import { LoaderModule } from '../shared';
import { MainService } from './main.service';
import { AuthService } from '../shared';
@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    LoaderModule
  ],
  declarations: [
    LayoutComponent
  ],
  providers: [
    MainService,
    AuthService, DialogService
  ],
})

/**
* export LayoutModule
* so it can be use in project
*/
export class LayoutModule {}
