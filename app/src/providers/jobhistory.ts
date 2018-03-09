/*====================================================================
* McDaniel Aug-2017
*
* For Job History array from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { Job } from '../shared/job';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../services/http-service';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class JobHistoryProvider {


  constructor(public http: HttpService,
    private globals: GlobalStateService,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('constructor - JobHistoryProvider');
    if (DEBUG_MODE) console.log('apiURL: ', apiURL);

    /*
      headers: {'Authorization': 'xxxyyyzzz'}

      https://angular.io/api/http/RequestOptions

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post(this.url, book, options)

    */

  }


  url() {
    return apiURL + 'candidates/' + this.username() + '/jobhistory/';
  }

  get(): Observable<Job[]> {

    if (DEBUG_MODE) console.log('ProcessHttpmsgProvider.get() with username: ', this.username());

    return this.http.get(this.url(), apiHttpOptions)
      .retry(HTTP_RETRIES)
      .map(res => { return this.ProcessHttpmsgService.extractData(res) })
      .catch(error => { return this.ProcessHttpmsgService.handleError(error) });
  }

  add(job: Job): Observable<Job> {

    if (DEBUG_MODE) console.log('JobHistoryProvider.add() - adding', job);

    return this.http.post(this.url(), job, apiHttpOptions)
      .retry(HTTP_RETRIES)
      .map(
      res => {
        if (DEBUG_MODE) console.log('JobHistoryProvider.add() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('JobHistoryProvider.add() - error while posting', this.url(), apiHttpOptions, job, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );

  }

  update(job: Job): Observable<Job> {
    if (DEBUG_MODE) console.log('JobHistoryProvider.update() - updating', this.url() + job.id.toString(), apiHttpOptions, job);

    return this.http.patch(this.url() + job.id.toString(), job, apiHttpOptions)
      .retry(HTTP_RETRIES)
      .map(res => {
        if (DEBUG_MODE) console.log('JobHistoryProvider.update() - updated. result: ', res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('JobHistoryProvider.update() - error while posting', this.url() + job.id.toString(), apiHttpOptions, job, error);
        return this.ProcessHttpmsgService.handleError(error)
      });

  }

  delete(id: number): Observable<Job[]> {
    if (DEBUG_MODE) console.log('JobHistoryProvider.delete()', this.url() + id.toString(), apiHttpOptions);

    return this.http.delete(this.url() + id.toString(), apiHttpOptions)
      .retry(HTTP_RETRIES)
      .map(res => {
        if (DEBUG_MODE) console.log('JobHistoryProvider.delete() - success.', res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('JobHistoryProvider.delete() - error while deleting', this.url() + id.toString(), apiHttpOptions, error);
        return this.ProcessHttpmsgService.handleError(error)
      });

  }

  new() {
    return {
      account_name: this.username(),
      id: null,
      candidate_id: null,
      company_name: '',
      department: null,
      job_title: '',
      start_date: '',
      end_date: '',
      description: '',
      final_salary: null,
      compensation_type: 0,
      create_date: ''
    };
  }

  username() {
    return this.globals.getUsername();
  }


}
