/*------------------------------------------------------
 * written by: mcdaniel
 * date: august 2017
 *
 * usage: template controller fed by custom Wordpress provider
 *        this code is templated for use in the following
 *        page controllers:
 *        - jobs
 *        - news
 *        - resume
 *------------------------------------------------------*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { WPPost } from '../../shared/wppost';
import { JobApplications } from '../../shared/job-applications';
import { WordpressProvider } from '../../providers/wordpress';
import { JobApplicationsProvider } from '../../providers/job-applications';
import { JobsDetailPage } from '../agility-jobs-detail/jobs-detail';
import { NavbarComponent } from '../../components/navbar';
import { GlobalStateService } from '../../services/global-state.service';
import { Logger } from '../../services/logger.service';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})

export class JobsPage {

  posts: WPPost[];
  jobApplications: JobApplications[];
  errMess: string;
  showLoading: boolean;
  public pageTitle: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private wpService: WordpressProvider,
    private jobApplicationsService: JobApplicationsProvider,
    public globals: GlobalStateService
  ) {
    Logger.banner("Job Postings Page");
    if (DEBUG_MODE) console.log('JobsPage.constructor()');

    //this.pageTitle = globals.getUserFirstName() + "'s Job Opportunities"
    this.showLoading = true;
    this.refreshData(null);
  }

  refreshData(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('JobsPage.refreshData()');
      this.getPosts();
      if (refresher) {
        refresher.complete();
      }
    }, 500);
  }

  getJobApplications(postID: number) {
    if (DEBUG_MODE) console.log('JobsPage.getJobApplications()');
    this.errMess = null;

    this.jobApplicationsService.get(postID)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('JobsPage.getJobApplications() - success', results);
        this.jobApplications = results;
      },
      err => {
        if (DEBUG_MODE) console.log('JobsPage.getJobApplications() - error', err);
        this.errMess = <any>err;
      });
  }


  getPosts() {
    Logger.banner("Get Jobs");
    if (DEBUG_MODE) console.log('JobsPage.getPosts()');
    this.errMess = null;

    /* Note: set this to appropriate parameter factory fuction:
        paramsJobs()
        paramsNews()
        paramsResume()
    */
    let params = this.wpService.paramsJobs();

    this.wpService.getPosts(params)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('JobsPage.getPosts() - success', results);
        this.posts = results;
        var self = this;
        this.posts.forEach(function(post, id) {
          self.getMedia(post);

            //check to see if the candidate has applied for this Job Posting.
            self.jobApplicationsService.get(post.id)
              .subscribe(
              results => {
                if (DEBUG_MODE) console.log('JobsPage.getPosts() - jobApplicationsService.get()', post.id, results);
                if (typeof results !== 'undefined' && results.length > 0) {
                      // the array is defined and has at least one element
                      post.candidate_application_date = results[0].create_date;
                }
              },
              err => {
                if (DEBUG_MODE) console.log('JobsPage.getPosts() - jobApplicationsService.get() - error:', err);
              });

        });
      },
      err => {
        if (DEBUG_MODE) console.log('JobsPage.getPosts() - error', err);
        this.errMess = <any>err;
      });
  }

  getMedia(post: WPPost) {

    if (DEBUG_MODE) console.log('JobsPage.getMedia()', post);
    if (post.featured_media == 0) {
      post.featured_media_obj = this.wpService.newMedia();
      return;
    };

    this.wpService.getMedia(post.featured_media)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('JobsPage.getMedia() - success', results);
        post.featured_media_obj = results;
        post.featured_media_url = results.source_url;
      },
      err => {
        if (DEBUG_MODE) console.log('JobsPage.getMedia() - error', err);
        this.errMess = <any>err;
      });

  }

  viewPost(post: WPPost) {
    if (DEBUG_MODE) console.log('JobsPage.viewPost()', post);
    this.navCtrl.push(JobsDetailPage, {
      post: post
    });

  }
}
