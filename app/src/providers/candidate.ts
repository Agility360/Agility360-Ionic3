/*====================================================================
* McDaniel Aug-2017
*
* For candidate entity from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { Cognito } from './aws.cognito';
import { Candidate } from '../shared/candidate';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../services/http-service';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class CandidateProvider {

  config: string;

  constructor(public http: HttpService,
    private cognito: Cognito,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('CandidateProvider.constructor()');
    this.config = "{ 'contentType': 'application/json; charset=utf-8', 'dataType': 'json'}";
  }

  url() {
    if (DEBUG_MODE) console.log('CandidateProvider.url()');
    return apiURL + 'candidates/' + this.username();
  }

  get(): Observable<Candidate> {
    if (DEBUG_MODE) console.log('CandidateProvider.get() with username: ', this.username());

    return this.http.get(this.url(), apiHttpOptions)
      .retry(HTTP_RETRIES)
      .map(res => {
        if (DEBUG_MODE) console.log('CandidateProvider.get() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('CandidateProvider.get() - error', error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  add(obj: Candidate): Observable<Candidate> {

    if (DEBUG_MODE) console.log('CandidateProvider.add() - adding', obj);
    var url = apiURL + 'candidates/';
    return this.http.post(url, obj, this.config)
      .retry(HTTP_RETRIES)
      .map(
      res => {
        if (DEBUG_MODE) console.log('CandidateProvider.add() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('CandidateProvider.add() - error', this.url, this.config, obj, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );

  }



  update(candidate: Candidate): Observable<Candidate[]> {

    return this.http.patch(this.url(), candidate, this.config)
      .retry(HTTP_RETRIES)
      .map(
      res => {
        if (DEBUG_MODE) console.log('CandidateProvider.update() - success', res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('CandidateProvider.update() - error while posting', this.url, this.config, candidate, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );
  }

  delete(): Observable<Candidate> {
    if (DEBUG_MODE) console.log('CandidateProvider.delete()', this.url(), apiHttpOptions);

    return this.http.delete(this.url(), apiHttpOptions)
      .retry(HTTP_RETRIES)
      .map(res => {
        if (DEBUG_MODE) console.log('CandidateProvider.delete() - success.', res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('CandidateProvider.delete() - error while deleting', this.url(), apiHttpOptions, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }



  new() {
    if (DEBUG_MODE) console.log('CandidateProvider.new()');
    return {
      candidate_id: null,
      account_name: '',
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      city: '',
      state: '',
      phone_number: '',
      job_hunting: false,
      industry_id: null,
      industry: '',
      subindustry_id: null,
      subindustry: '',
      profession_id: null,
      profession: '',
      subprofession_id: null,
      subprofession: '',
      update_date: null,
      create_date: null,
      resume_filename: null
    };
  }

  username() {
    if (DEBUG_MODE) console.log('CandidateProvider.username()');
    var user = this.cognito.getCurrentUser();
    return user.username;
  }

  checkEmailAvailability(emailAddress): Observable<boolean> {
    if (DEBUG_MODE) console.log('CandidateProvider.checkEmail() with emailAddress: ', emailAddress);

    var url = apiURL + 'candidates/' + emailAddress;

    return this.http.get(url, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('CandidateProvider.checkEmail() - success', res);
        return this.isEmpty(this.ProcessHttpmsgService.extractData(res))
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('CandidateProvider.checkEmail() - error', error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  checkUsernameAvailable(username): Observable<boolean> {
    if (DEBUG_MODE) console.log('CandidateProvider.checkUsername() with username: ', username);

    var url = apiURL + 'candidates/' + username;

    return this.http.get(url, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('CandidateProvider.checkUsername() - success', res);
        return this.isEmpty(this.ProcessHttpmsgService.extractData(res))
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('CandidateProvider.checkUsername() - error', error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  private isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

}
