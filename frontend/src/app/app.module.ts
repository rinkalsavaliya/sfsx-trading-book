/**
* Import All Common Modules
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/**
* Import Base Routes
*/
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoaderModule } from './shared';
import { HttpClientModule } from '@angular/common/http';

/**
* App module
* The main module which wraps all it's child modules
*/
@NgModule({
  declarations: [
    /**
    * declare AppComponent as a part of AppModule
    */
    AppComponent,
  ],

  /**
  * Import necessary modules which are meant to be used within out main App-Root
  */
  imports: [
    /**
    * Browser module to make AppComponent Browsify
    */
    BrowserModule,
    AppRoutingModule,
    LoaderModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
/**
* export AppModule
* so it can be use in project
*/
export class AppModule { }
