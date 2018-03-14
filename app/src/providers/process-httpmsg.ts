/*====================================================================
* McDaniel Aug-2017
*
* low-level handler for http requests. referenced by most other providers.
* ====================================================================*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { DEBUG_MODE } from '../shared/constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

/*
  Generated class for the ProcessHttpmsg provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProcessHttpmsgProvider {

  constructor(public http: Http) {
    if (DEBUG_MODE) console.log('ProcessHttpmsgProvider.constructor()');
  }

  public extractData(res: Response) {
    //if (DEBUG_MODE) console.log('ProcessHttpmsgProvider.extractData()', res);
    let body = res.json();
    return body || { };
  }

  public handleError(error: Response | any) {
    if (DEBUG_MODE) console.log('ProcessHttpmsgProvider.handleError()', error);
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    else {
      errMsg = error.message ? error.message : error.toString();
    }

    if (DEBUG_MODE) console.log(errMsg);
    return errMsg;
  }

}
