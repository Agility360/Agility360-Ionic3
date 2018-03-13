/*====================================================================
* McDaniel Aug-2017
*
* For Industries entity from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { Industries } from '../shared/industries';
import { Observable } from 'rxjs/Observable';
import { HttpServiceIonic1 } from '../services/http-service-ionic1';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class IndustriesProvider {

  config: string;

  constructor(public http: HttpServiceIonic1,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('IndustriesProvider.constructor()');
    this.config = "{ 'contentType': 'application/json; charset=utf-8', 'dataType': 'json'}";
  }

  url() {
    return apiURL + 'industries/';
  }

  get(parent: number): Observable<Industries[]> {
    if (DEBUG_MODE) console.log('IndustriesProvider.get()', this.url());

    let url: string = this.url();
    if (parent != null) url = this.url() + parent + '/';

    return this.http.get(url, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('IndustriesProvider.get() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('IndustriesProvider.get() - error', error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }



}
