import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';

/**
* wrap all components, which are part of declaration of this module
* into one single NgModule, and export LoaderModule
*/
@NgModule({
  /**
  * import core angular modules
  */
  imports: [
    CommonModule
  ],
  /**
  * declare loader component to use it as a tag
  */
  declarations: [LoaderComponent],
  /**
  * and export it to make it available to other modules
  */
  exports: [LoaderComponent]
})
/**
* export LoaderModule
* so it can be use in project
*/
export class LoaderModule { }
