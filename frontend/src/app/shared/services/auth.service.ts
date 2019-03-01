import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

/**
* @class AuthService
* This class provides auth service,
* to navigate on login route, if user is not logged in
*/
@Injectable()
export class AuthService {

  /**
  * return header
  */
  getHeaders() {
    /**
    * initialize headers object
    */
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type':  'application/json'
    });

    /**
    * return headers
    */
    return headers;
  }
}
