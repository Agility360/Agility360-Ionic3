import { Injectable } from '@angular/core';
import { App, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { CognitoUtil, UserLoginService, LocalStorage } from './account-management.service';
import { Logger } from './logger.service';
import { DEBUG_MODE } from '../shared/constants';
import { Config } from '../config/config';
import { Candidate } from '../shared/candidate';

declare var AWS: any;

@Injectable()
export class GlobalStateService {


  private viewAdminFeaturesOverride: boolean = false;
  private loader = null;
  private s3: any;

  // this needs to be a variable in order to support two-way binding,
  // to refresh the Angular2 templates when this value changes
  public userId = '';

  constructor(
    public app: App,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

      if (DEBUG_MODE) console.log('GlobalStateService.constructor()');

  }



  getS3(): any {
    if (DEBUG_MODE) console.log('GlobalStateService.getS3()');

    //This prevents a race situation from occurring with assignment of AWS.config.credentials in account-management.service
    //
    //more info: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
    UserLoginService.getAwsCredentials().then(() => {

      if (DEBUG_MODE) console.log('%cGlobalStateService.getS3 - instantiating AWS S3 object', Logger.LeadInStyle);

    }).catch((err)=>{
      console.log('%cGlobalStateService.getS3 - error gaining AWS Credentials', Logger.LeadInErrorStyle, err);
    });

    this.s3 = new AWS.S3({
      'params': {
        'Bucket': Config['PROFILE_IMAGES_S3_BUCKET']
        },
        'region': Config['REGION']
    });

    return this.s3;
  }

  getCandidate() : Candidate {
    if (DEBUG_MODE) console.log('GlobalStateService.getCandidate()');
    return <Candidate>CognitoUtil.getCandidate();
  }

  setCandidate(candidate: Candidate) {
    if (DEBUG_MODE) console.log('GlobalStateService.setCandidate()', candidate);
    CognitoUtil.setCandidate(candidate);
    this.setCandidateProfileImageUrl();
  }

  getCandidateProfileImageUrl() : string {
    //if (DEBUG_MODE) console.log('GlobalStateService.getCandidateProfileImageUrl()');
    return CognitoUtil.getCandidateProfileImageUrl();
  }

  setCandidateProfileImageUrl() {
    if (DEBUG_MODE) console.log('GlobalStateService.setCandidateProfileImageUrl()');


    let promise: Promise<void> = new Promise<void>((resolve, reject) => {

      //initialize persistant storage so that we're either left with the signed URL, or nothing at all.
      CognitoUtil.setCandidateProfileImageUrl(null);

      UserLoginService.getAwsCredentials().then(() => {
      if (DEBUG_MODE) console.log('GlobalStateService.setCandidateProfileImageUrl() - requesting a signed URL from AWS S3 object');
        this.getS3().getSignedUrl('getObject', { 'Key': 'protected/' + CognitoUtil.getUserId() + '/avatar.jpg' }, (err, url) => {

          if (err) {
            if (err) console.log('%cGlobalStateService.setCandidateProfileImageUrl() - error', Logger.LeadInErrorStyle, err);
            reject();
            return;
          }
          if (url) {
            if (DEBUG_MODE) console.log('%cGlobalStateService.setCandidateProfileImageUrl() - successfully retrieve signed URL from S3: ', Logger.LeadInStyle, url);
            CognitoUtil.setCandidateProfileImageUrl(url);
            resolve();
          }
          //catch all bucket.
          reject();
        });

      }).catch((err)=>{
        console.log('%cGlobalStateService.setCandidateProfileImageUrl() - error gaining AWS Credentials', Logger.LeadInErrorStyle, err);
        reject();
      });


    });
    return promise;

  }


  getUser() {
    return CognitoUtil.getUserProfile();
  }

  getUserId(): string {
    return CognitoUtil.getUserId();
  }

  getUnencodedUserId(): string {
    let userId = CognitoUtil.getUserId();
    return userId == null ? '' : userId
  }

  getUsername(): string {
    return CognitoUtil.getUsername();
  }


  getUserFirstName(): string {
    //return this.getCandidate().first_name;
    return CognitoUtil.getUserFirstName();
  }

  getUserLastName(): string {
    //return this.getCandidate().last_name;
    return CognitoUtil.getUserLastName();
  }

  getUserFullName(): string {
    return this.getUserFirstName() + ' ' + this.getUserLastName();
  }

  getUserEmail(): string {
    return CognitoUtil.getUserEmail();
  }

  getViewAdminFeaturesOverride() {
    return this.viewAdminFeaturesOverride;
  }
  setViewAdminFeaturesOverride(setting : boolean): void {
    this.viewAdminFeaturesOverride = setting;
  }

  displayAdminFeatures(): boolean {
    return this.isAdminRole() || this.viewAdminFeaturesOverride;
  }

  isSignedIn(): boolean {
    return CognitoUtil.isSignedIn();
  }

  isAdminRole(): boolean {
    return CognitoUtil.getUserGroup() == 'adminGroup';
  }

  getAlertController() {
    return this.alertCtrl;
  }

  logout(quiet?: boolean) {
    Logger.banner("Sign Out");
    if (!quiet) {
      this.showLogoutAlert();
    }
    UserLoginService.signOut();
    this.userId = '';

  }

  showLogoutAlert(): void {
    let alert = this.alertCtrl.create({
      title: 'Signed out',
      subTitle: 'You have signed out of the system.',
      buttons: [{
          text: 'OK',
        }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Show logout alert exception', ex);
    });;
  }

  displayAlert(title, subtitle, functionToRunWhenOkButtonIsPressed=null) {
    let okFunction = () => {};
    if (functionToRunWhenOkButtonIsPressed != null) {
      okFunction = functionToRunWhenOkButtonIsPressed;
    }
    let alert = this.getAlertController().create({
      title: title,
      subTitle: subtitle,
      buttons: [{ text: 'OK', handler: okFunction }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });
  }
  displayToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present().then(() => {
    }).catch((ex) => {
      console.log('Display toast exception', ex);
    });
  }

  displayLoader(message, durationInMilliseconds=3000): Promise<any> {
    this.loader = this.loadingCtrl.create({
      content: message,
      duration: durationInMilliseconds,
      dismissOnPageChange: true
    });
    return this.loader.present().then(() => {
    }).catch((ex) => {
      console.log('Display loader exception', ex);
    });
  }

  dismissLoader(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.loader != null) {
        this.loader.dismiss().then(() => {
          this.loader = null;
          resolve();
        }).catch((ex) => {
          this.loader = null;
          // TODO: Debug Ionic 2 vs 3 change with dismiss loader creating issue with RemoteView not found - https://github.com/ionic-team/ionic/issues/11443
          // console.log('Dismiss loader exception', ex);
          // reject(ex);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
