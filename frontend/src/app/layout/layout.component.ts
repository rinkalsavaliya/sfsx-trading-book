import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

/**
* Define Layout module tag
* and it's template URL as well as stylesheets
*/
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

/**
* @class  LayoutComponent
* this class provides main layout of application
* any sub component will be loaded into layout component
*/
export class LayoutComponent implements OnInit {
  /**
  * router-outlet will emit events whenever any route component
  * is started loading and completed loading
  * according to that data, we will toggle isContentLoading
  * variable to either true or false
  * and, layout data will show a loader component if any component is being loaded
  * by using this variable
  */
  public isContentLoading = false;
  constructor(public router: Router) {
    /**
    * detect events from router-outlet component
    * if event is an instance of NavigationStart, i.e., if any component has started
    * loading, then make isContentLoading true, else if
    * event if an instance of NavigationEnd, i.e., if component has completed
    * loading, then make isContentLoading false
    */
    this.router.events.subscribe((event: object) => {
      this.isContentLoading = (event instanceof NavigationStart) ? true : this.isContentLoading;
      this.isContentLoading = (event instanceof NavigationEnd) ? false : this.isContentLoading;
      if (!this.isContentLoading) {
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
      }
    });
  }

  ngOnInit() {
  }
}
