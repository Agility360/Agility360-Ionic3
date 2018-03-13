/*====================================================================
* McDaniel Aug-2017
*
* For Certification array from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { Certification } from '../shared/certification';
import { Observable } from 'rxjs/Observable';
import { HttpServiceIonic1 } from '../services/http-service-ionic1';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Logger } from '../services/logger.service';


@Injectable()
export class CertificationHistoryProvider {


  constructor(public http: HttpServiceIonic1,
    private globals: GlobalStateService,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('constructor - CertificationHistoryProvider');
    if (DEBUG_MODE) console.log('apiURL: ', apiURL);

  }

  url() {
    return apiURL + 'candidates/' + this.username() + '/certifications/';
  }

  get(): Observable<Certification[]> {
    if (DEBUG_MODE) console.log('CertificationHistoryProvider.get() with username: ', this.username());

    return this.http.get(this.url(), apiHttpOptions)
      .map(
        res => {
          if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.get() - success ', Logger.LeadInStyle, res);
          return this.ProcessHttpmsgService.extractData(res)
        })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.get() - error ', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  add(obj: Certification): Observable<Certification> {

    if (DEBUG_MODE) console.log('CertificationHistoryProvider.add() - adding', obj);

    return this.http.post(this.url(), obj, apiHttpOptions)
      .map(
      res => {
        if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.add() - success ', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.add() - error', Logger.LeadInErrorStyle, this.url(), apiHttpOptions, obj, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );

  }

  update(obj: Certification): Observable<Certification> {

    return this.http.patch(this.url() + obj.id.toString(), obj, apiHttpOptions)
      .map(
        res => {
          if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.update() - success ', Logger.LeadInStyle, res);
          return this.ProcessHttpmsgService.extractData(res)
        })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.update() - error', Logger.LeadInErrorStyle, this.url() + obj.id.toString(), apiHttpOptions, obj, error);
        return this.ProcessHttpmsgService.handleError(error)
      });

  }

  delete(id: number): Observable<Certification[]> {

    return this.http.delete(this.url() + id.toString(), apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.delete() - success ', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cCertificationHistoryProvider.delete() - error', Logger.LeadInErrorStyle, this.url() + id.toString(), apiHttpOptions, error);
        return this.ProcessHttpmsgService.handleError(error)
      });

  }

  new() {
    return {
      account_name: this.username(),
      id: null,
      candidate_id: null,
      institution_name: '',
      certification_name: '',
      date_received: '',
      expire_date: '',
      create_date: '',
      description: ''
    };
  }

  username() {
    return this.globals.getUsername();
  }

}
