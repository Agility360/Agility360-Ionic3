/*====================================================================
* McDaniel Aug-2017
*
* For Job History array from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { Job } from '../shared/job';
import { Observable } from 'rxjs/Observable';
import { HttpServiceIonic1 } from '../services/http-service-ionic1';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Logger } from '../services/logger.service';


@Injectable()
export class JobHistoryProvider {


  constructor(public http: HttpServiceIonic1,
    private globals: GlobalStateService,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('JobHistoryProvider.constructor()');
    if (DEBUG_MODE) console.log('apiURL: ', apiURL);

  }


  url() {
    return apiURL + 'candidates/' + this.username() + '/jobhistory/';
  }

  get(): Observable<Job[]> {

    if (DEBUG_MODE) console.log('JobHistoryProvider.get() with username: ', this.username());

    return this.http.get(this.url(), apiHttpOptions)
      .map(
        res => {
          if (DEBUG_MODE) console.log('%cJobHistoryProvider.get() - success ', Logger.LeadInStyle, res);
          return this.ProcessHttpmsgService.extractData(res)
        })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.get() - error ', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  add(job: Job): Observable<Job> {

    if (DEBUG_MODE) console.log('JobHistoryProvider.add() - adding', job);

    return this.http.post(this.url(), job, apiHttpOptions)
      .map(
      res => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.add() - success ', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.add() - error while posting', Logger.LeadInErrorStyle, this.url(), apiHttpOptions, job, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );

  }

  update(job: Job): Observable<Job> {
    if (DEBUG_MODE) console.log('JobHistoryProvider.update() - updating', this.url() + job.id.toString(), apiHttpOptions, job);

    return this.http.patch(this.url() + job.id.toString(), job, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.update() - success ', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.update() - error while posting', Logger.LeadInErrorStyle, this.url() + job.id.toString(), apiHttpOptions, job, error);
        return this.ProcessHttpmsgService.handleError(error)
      });

  }

  delete(id: number): Observable<Job[]> {
    if (DEBUG_MODE) console.log('JobHistoryProvider.delete()', this.url() + id.toString(), apiHttpOptions);

    return this.http.delete(this.url() + id.toString(), apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.delete() - success ', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cJobHistoryProvider.delete() - error while deleting', Logger.LeadInErrorStyle, this.url() + id.toString(), apiHttpOptions, error);
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
