/*====================================================================
* McDaniel Aug-2017
*
* For Job Applications array from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { GlobalStateService } from '../services/global-state.service';
import { JobApplications } from '../shared/job-applications';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../services/http-service';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class JobApplicationsProvider {

  constructor(public http: HttpService,
    private globals: GlobalStateService,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('constructor - JobApplicationsProvider');
    if (DEBUG_MODE) console.log('apiURL: ', apiURL);

  }


  url() {
    return apiURL + 'candidates/' + this.username() + '/jobapplications/';
  }

  get(): Observable<JobApplications[]> {

    if (DEBUG_MODE) console.log('ProcessHttpmsgProvider.get() with username: ', this.username());

    return this.http.get(this.url(), apiHttpOptions)
      .map(jobApplications => { return this.ProcessHttpmsgService.extractData(jobApplications) })
      .catch(error => { return this.ProcessHttpmsgService.handleError(error) });
  }

  add(jobApplication: JobApplications): Observable<JobApplications> {

    if (DEBUG_MODE) console.log('JobApplicationsProvider.add() - adding', jobApplication);

    return this.http.post(this.url(), jobApplication, apiHttpOptions)
      .map(
      res => {
        if (DEBUG_MODE) console.log('JobApplicationsProvider.add() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('JobApplicationsProvider.add() - error while posting', this.url(), apiHttpOptions, jobApplication, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );

  }

  new() {
    return {
      account_name: this.username(),
      id: null,
      candidate_id: null,
      wordpress_post_id: null,
      create_date: ''
    };
  }

  username() {
    return this.globals.getUsername();
  }


}
