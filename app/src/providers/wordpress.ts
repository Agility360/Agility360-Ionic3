/*------------------------------------------------------
 * written by: mcdaniel
 * date: august 2017
 *
 * usage: Wordpress provider for Wordpress REST api
 *        see: https://developer.wordpress.org/rest-api/
 *------------------------------------------------------*/
import { Injectable } from '@angular/core';
import { WPPost, WPMedia } from '../shared/wppost';
import { Observable } from 'rxjs/Observable';
import { cmsURL, DEBUG_MODE, HTTP_RETRIES } from '../shared/constants';
import { ProcessHttpmsgProvider } from './process-httpmsg';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpServiceIonic1 } from '../services/http-service-ionic1';
import { Logger } from '../services/logger.service';


@Injectable()
export class WordpressProvider {

  config: string;

  constructor(
    public http: HttpServiceIonic1,
    private ProcessHttpmsgService: ProcessHttpmsgProvider) {

    if (DEBUG_MODE) console.log('%cWordpressProvider.constructor()', Logger.LeadInStyle);

    this.config = "{ 'contentType': 'application/json; charset=utf-8', 'dataType': 'json'}";

  }

  urlPrivacyPolicy() {
    return cmsURL + 'pages?slug=privacy-policy/';
  }

  urlTermsOfUse() {
    return cmsURL + 'pages?slug=terms-of-use/';
  }

  urlPosts() {
    return cmsURL + 'posts/';
  }

  urlMedia() {
    return cmsURL + 'media/';
  }

  paramsJobs() {
    return { categories: '5' };
  }

  paramsNews() {
    return { categories: '3' };
  }

  paramsResume() {
    return { categories: '4' };
  }

  getPage(page: any, params: any): Observable<WPPost[]> {
    if (DEBUG_MODE) console.log('WordpressProvider.getPage()');
    return this.http.get(page, {
      params: params
    })
    /*  .retry(HTTP_RETRIES) */
      .map(res => {
        if (DEBUG_MODE) console.log('%cWordpressProvider.getPage() - success', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cWordpressProvider.getPage() - error', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  getPosts(params: any): Observable<WPPost[]> {
    if (DEBUG_MODE) console.log('WordpressProvider.getPosts()');
    return this.http.get(this.urlPosts(), {
      params: params
    })
    /*  .retry(HTTP_RETRIES) */
      .map(res => {
        if (DEBUG_MODE) console.log('%cWordpressProvider.getPosts() - success', Logger.LeadInStyle, this.urlPosts(), params, res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cWordpressProvider.getPosts() - error', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }


  getMedia(id: number): Observable<WPMedia> {
    if (DEBUG_MODE) console.log('WordpressProvider.getMedia()');
    return this.http.get(this.urlMedia() + id.toString())
      .map(res => {
        if (DEBUG_MODE) console.log('%cWordpressProvider.getMedia() - success', Logger.LeadInStyle, res);
        return this.ProcessHttpmsgService.extractData(res)
      })
      .catch(error => {
        if (DEBUG_MODE) console.log('%cWordpressProvider.getMedia() - error', Logger.LeadInErrorStyle, error);
        return this.ProcessHttpmsgService.handleError(error)
      });
  }

  newMedia() {
    if (DEBUG_MODE) console.log('WordpressProvider.newMedia()');

    return {
      id: null,
      date: '',
      date_gmt: '',
      guid: {},
      modified: '',
      modified_gmt: '',
      slug: '',
      status: '',
      type: '',
      link: '',
      title: '',
      author: '',
      comment_status: '',
      ping_status: '',
      template: '',
      meta: [],
      description: {},
      caption: {},
      alt_text: '',
      media_type: '',
      mime_type: '',
      media_details: {},
      post: null,
      source_url: '',
      _links: {}
    };
  }


}
