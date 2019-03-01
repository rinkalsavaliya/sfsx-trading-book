import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants, AuthService } from '../shared';

/**
* @class MainService - if any backend apis will be used, this service will be called
*/
@Injectable()
export class MainService {
  public apiUrl: string = constants.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}
  testApi(body) {
    return this.http.post<any>(
      `${this.apiUrl}`, body,
      {
        headers: this.authService.getHeaders(),
        observe: 'response'
      }
    );
  }
}
