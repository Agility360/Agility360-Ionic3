/*====================================================================
* McDaniel Oct-2017
*
* For States entity from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { States } from '../shared/states';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../services/http-service';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class StatesProvider {

  config: string;

  constructor(public http: HttpService,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('StatesProvider.constructor()');
    this.config = "{ 'contentType': 'application/json; charset=utf-8', 'dataType': 'json'}";
  }

  url() {
    return apiURL + 'states/';
  }

  get(): Observable<States[]> {
    if (DEBUG_MODE) console.log('StatesProvider.get()', this.url());

    let url: string = this.url();

    return this.http.get(url, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('StatesProvider.get() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('StatesProvider.get() - error', error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

}
