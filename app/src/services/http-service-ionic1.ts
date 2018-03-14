/*------------------------------------------------------------------------------
  McDaniel
  Date:   Aug 2017
  Usage:  HTTP Interceptor to implement app-level behavior for
          http errors, waiting prompts, timeout, etc.
  Original code base from https://github.com/appwebhouse/ionic2-interceptors-app
 ------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Http, XHRBackend, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { App, LoadingController } from 'ionic-angular';
/*
import { LoginPage } from '../pages/login/login';
*/
import { HttpErrorPage } from '../pages/agility-http-error/http-error';
import 'rxjs/Rx';
import { DEBUG_MODE } from '../shared/constants';
import { Logger } from './logger.service';


export const TIMEOUT = 10000

@Injectable()
export class HttpServiceIonic1 extends Http {

  loading: any;

  constructor(
    xhrBackend: XHRBackend,
    requestOptions: RequestOptions,
    private app: App,
    public loadingCtrl: LoadingController) {

    super(xhrBackend, requestOptions);
    if (DEBUG_MODE) console.log('%cHttpService.constructor()', Logger.LeadInStyle);


  }

  /**
   * Performs any type of http request.
   * @param url
   * @param options
   * @returns {Observable<Response>}
   */
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (DEBUG_MODE) console.log('HttpService.request()', url, options);

    return super.request(url, options)
    .timeout(TIMEOUT);

  }

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.get()', Logger.LeadInStyle, url, options);
    this.requestInterceptor();
    return super.get(this.getFullUrl(url), this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.getLocal()', Logger.LeadInStyle, url, options);
    return super.get(url, options);
  }

  /**
   * Performs a request with `post` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.post()', Logger.LeadInStyle, url, options);
    this.requestInterceptor();
    return super.post(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.put()', Logger.LeadInStyle, url, options);
    this.requestInterceptor();
    return super.put(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }

  /**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.patch()', Logger.LeadInStyle, url, options);
    this.requestInterceptor();
    return super.patch(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }


  /**
   * Performs a request with `delete` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.delete()', Logger.LeadInStyle, url, options);
    this.requestInterceptor();

    return super.delete(this.getFullUrl(url), this.requestOptions(options))
          .catch(this.onCatch)
          .do((res: Response) => {
            this.onSubscribeSuccess(res);
          }, (error: any) => {
            this.onSubscribeError(error);
          })
          .finally(() => {
            this.onFinally();
          });
  }


  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (DEBUG_MODE) console.log('HttpService.requestOptions()', options);
    return options;
  }

  /**
   * Build API url.
   * @param url
   * @returns {string}
   */
  private getFullUrl(url: string): string {
    if (DEBUG_MODE) console.log('HttpService.getFullUrl()');
    return url;
  }

  /**
   * Request interceptor.
   */
  private requestInterceptor(): void {
    if (DEBUG_MODE) console.log('HttpService.requestInterceptor()');
  }

  /**
   * Response interceptor.
   */
  private responseInterceptor(): void {
    if (DEBUG_MODE) console.log('HttpService.responseInterceptor()');
  }

  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    if (DEBUG_MODE) console.log('%cHttpService.onCatch()', Logger.LeadInErrorStyle, error);
    return Observable.throw(error);
  }

  /**
   * onSubscribeSuccess
   * @param res
   */
  private onSubscribeSuccess(res: Response): void {
    if (DEBUG_MODE) console.log('%cHttpService.onSubscribeSuccess() - res:', Logger.LeadInStyle, res);
  }

  /**
   * onSubscribeError
   * @param error
   */
  private onSubscribeError(error: any): void {
    console.log('%cHttpService.onSubscribeError() - error:', Logger.LeadInErrorStyle, error);

    //this.moveToHttpError();
    return;
  }

  /**
   * onFinally
   */
  private onFinally(): void {
    if (DEBUG_MODE) console.log('HttpService.onFinally()');
    if (this.loading != null) {
      if (DEBUG_MODE) console.log('HttpService.onFinally() - loading.dismiss()');
      this.loading.dismiss();
      this.loading = null;
        }
    this.responseInterceptor();
  }

  private moveToHttpError(): void {
    if (DEBUG_MODE) console.log('HttpService.moveToHttpError()');
//    let view = this.app.getRootNav().getActive();
//    if (view.instance instanceof HttpErrorPage) { }
//    else { this.app.getRootNav().setRoot(HttpErrorPage); }
  }

}
