import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { WPPost } from '../../shared/wppost';
import { NavbarComponent } from '../../components/navbar';
import { JobApplications } from '../../shared/job-applications';
import { JobApplicationsProvider } from '../../providers/job-applications';
import { Logger } from '../../services/logger.service';

@IonicPage()
@Component({
  selector: 'page-jobs-detail',
  templateUrl: 'jobs-detail.html',
})
export class JobsDetailPage {

  post: WPPost;
  errMess: string;
  public pageTitle: string = "Jobs";
  public applyNowButtonText: string = "Apply Now"

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private alertCtrl: AlertController,
      public provider: JobApplicationsProvider) {

    if (DEBUG_MODE) console.log('JobsDetailPage.constructor()');
    this.post = navParams.get('post');
    this.setApplyNowButtonText();

  }

  applyNow() {
    if (DEBUG_MODE) console.log('JobsDetailPage.applyNow()');

    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You cannot undo this selection. An Agility 360 recruiter will contact you.',
      buttons: [
        {
          text: 'Apply Now',
          handler: () => { this.addJobApplication(); }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();

  }

  setApplyNowButtonText() {
    if (!this.post.candidate_application_date) return;

    //let d = new Date(this.post.candidate_application_date).toISOString();
    //this.applyNowButtonText = "Applied: " + this.formatDate(d);

    this.applyNowButtonText = "Applied";
  }
  getApplyNowButtonText(): string {
    return this.applyNowButtonText;
  }

  private addJobApplication() {
    let jobApp = this.provider.new();

    jobApp.wordpress_post_id = this.post.id;
    this.provider.add(jobApp)
    .subscribe(
      results =>{
        if (DEBUG_MODE) console.log('%cJobsDetailPage.applyNow() - provider.add() - success', Logger.LeadInStyle, results);
        this.post.candidate_application_date = results[0].create_date;
        this.setApplyNowButtonText();

        let alert = this.alertCtrl.create({
          title: 'Success!',
          subTitle: "Thank you, we've received your application. An Agility 360 recruiter will contact you.",
          buttons: [{text: 'Ok'}]
        });
        alert.present();

      },
      error =>{
        if (DEBUG_MODE) console.log('%cJobsDetailPage.applyNow() - provider.add() - error', Logger.LeadInErrorStyle, error);

        let alert = this.alertCtrl.create({
          title: 'Oops!',
          subTitle: "Something went wrong. You might try again in a few minutes, or, you can contact us directly at info@agility360.net.",
          buttons: [{text: 'Ok'}]
        });
        alert.present();

      });
  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('ionViewDidLoad JobsDetailPage');
  }

  refreshData(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('JobhistoryPage.refresh()');

      refresher.complete();
    }, 500);
  }

  private formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  }


}
