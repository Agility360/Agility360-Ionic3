/*====================================================================
* McDaniel Aug-2017
*
* For candidate entity from agility REST api
* ====================================================================*/
import { Injectable } from '@angular/core';
import { Http, XHRBackend, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { GlobalStateService } from '../services/global-state.service';
import { Candidate } from '../shared/candidate';
import { Observable } from 'rxjs/Observable';
import { HttpServiceIonic1 } from '../services/http-service-ionic1';
import { apiURL, apiHttpOptions, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Logger } from '../services/logger.service';


@Injectable()
export class CandidateProvider {

  //config: string;

  constructor(
    public httpX: Http,
    public http: HttpServiceIonic1,
    private globals: GlobalStateService,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('CandidateProvider.constructor()');
    //this.config = "{ 'contentType': 'application/json; charset=utf-8', 'dataType': 'json'}";
  }


  url() {
    if (DEBUG_MODE) console.log('CandidateProvider.url()');
    return apiURL + 'candidates/' + this.username();
  }

  get(): Observable<Candidate> {
    Logger.banner("Get Candidate");
    if (DEBUG_MODE) console.log('CandidateProvider.get() with username: ', this.username());

    return this.http.get(this.url(), apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.get() - success', Logger.LeadInStyle, res);
        if (this.isEmpty(this.ProcessHttpmsgService.extractData(res))) {
          //this is a new user
          return this.cloneCognitoUser();
        } else return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.get() - error', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  add(obj: Candidate): Observable<Candidate> {
    Logger.banner("Add Candidate");

    if (DEBUG_MODE) console.log('CandidateProvider.add() - adding', obj);
    var url = apiURL + 'candidates/';
    return this.http.post(url, obj, apiHttpOptions)
      .map(
      res => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.add() - success', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.add() - error', Logger.LeadInErrorStyle, this.url, obj, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );

  }



  update(candidate: Candidate): Observable<Candidate[]> {
    Logger.banner("Update Candidate");

    return this.http.patch(this.url(), candidate, apiHttpOptions)
      .map(
      res => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.update() - success', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      }
      )
      .catch(
      error => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.update() - error while posting', Logger.LeadInErrorStyle, this.url, candidate, error);
        return this.ProcessHttpmsgService.handleError(error)
      }
      );
  }

  delete() {
    Logger.banner("Delete Candidate");


    return new Promise((resolve, reject) => {

      this.http.delete(this.url(), apiHttpOptions)
      .subscribe(
        result => {
          if (DEBUG_MODE) console.log('%cCandidateProvider.delete() - success.', Logger.LeadInStyle, result);
          return this.ProcessHttpmsgService.extractData(result)
        },
        error => {
          if (DEBUG_MODE) console.log('%cCandidateProvider.delete() - error while deleting', Logger.LeadInErrorStyle, error);
          return this.ProcessHttpmsgService.handleError(error)
        }
      );

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

  cloneCognitoUser() {
    if (DEBUG_MODE) console.log('%cCandidateProvider.cloneCognitoUser()', Logger.LeadInStyle);
    let candidate = this.new();

    candidate.email = this.globals.getUserEmail();
    candidate.account_name = this.globals.getUsername();
    candidate.first_name = this.globals.getUserFirstName();
    candidate.last_name = this.globals.getUserLastName();


    let promise: Promise<void> = new Promise<void>((resolve, reject) => {

      this.add(candidate).subscribe(
        res => {
          if (DEBUG_MODE) console.log('%cCandidateProvider.cloneCognitoUser() - success', Logger.LeadInStyle, res);
          resolve();
        },
        err => {
          if (DEBUG_MODE) console.log('%cCandidateProvider.cloneCognitoUser() - success', Logger.LeadInErrorStyle, err);
          reject();
        }
      );
    });
    return promise;
  }


  username() {
    if (DEBUG_MODE) console.log('CandidateProvider.username()');
    return this.globals.getUsername();
  }

  checkEmailAvailability(emailAddress): Observable<boolean> {
    if (DEBUG_MODE) console.log('CandidateProvider.checkEmail() with emailAddress: ', emailAddress);

    var url = apiURL + 'candidates/' + emailAddress;

    return this.http.get(url, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.checkEmail() - success', Logger.LeadInStyle, res);
        return this.isEmpty(this.ProcessHttpmsgService.extractData(res))
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.checkEmail() - error', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  checkUsernameAvailable(username): Observable<boolean> {
    if (DEBUG_MODE) console.log('CandidateProvider.checkUsername() with username: ', username);

    var url = apiURL + 'candidates/' + username;

    return this.http.get(url, apiHttpOptions)
      .map(res => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.checkUsername() - success', Logger.LeadInStyle, res);
        return this.isEmpty(this.ProcessHttpmsgService.extractData(res))
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cCandidateProvider.checkUsername() - error', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  private isEmpty(obj) {
    console.log('isEmpty: ', obj);

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

}
