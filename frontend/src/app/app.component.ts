import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

/**
* Define App module tag
* and it's template URL as well as stylesheets
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
* Export AppComponent so that it can be available
* to outside code for use
*/
export class AppComponent {

  public isContentLoading = false;
  /**
  * router-outlet will emit events whenever any route component
  * is started loading and completed loading
  * according to that data, we will toggle isContentLoading
  * variable to either true or false
  * and, app component will show a loader component if any component is being loaded
  */
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
    });
  }
}
