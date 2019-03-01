import { environment } from '../../environments/environment';

let apiUrl = 'http://localhost:8080/api/v1';
if (environment.production) {
  apiUrl = '/api/v1';
}
/**
* this file defines global constants, which are used across the project
*/
export const constants = {
  /**
  * API Host Url
  */
  API_URL: apiUrl,
  sides: ['buy', 'sell'],
  allTickers: ['ZGRO', 'FB', 'ORCL', 'GOOG']
};
