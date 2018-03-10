import { Injectable } from '@angular/core';
import { App, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { CognitoUtil, UserLoginService, LocalStorage } from './account-management.service';
import { Logger } from './logger.service';
import { DEBUG_MODE } from '../shared/constants';
import { WelcomePage } from '../pages/welcome/welcome';
import { Config } from '../config/config';

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
      console.log('AWS.config.credentials', AWS.config.credentials);

      //This prevents a race situation from occurring with assignment of AWS.config.credentials in account-management.service
      UserLoginService.getAwsCredentials().then(() => {
        this.s3 = new AWS.S3({
          'credentials': AWS.config.credentials,
          'params': {
            'Bucket': Config['PROFILE_IMAGES_S3_BUCKET']
          },
          'region': Config['REGION']
        });
      });



  }

  getCandidate() : object {
    if (DEBUG_MODE) console.log('GlobalStateService.getCandidate()');
    return CognitoUtil.getCandidate();
  }
  setCandidate(candidate: object) {
    if (DEBUG_MODE) console.log('GlobalStateService.setCandidate()', candidate);
    CognitoUtil.setCandidate(candidate);
  }

  getCandidateAvatarUrl() : string {
    if (DEBUG_MODE) console.log('GlobalStateService.getCandidateAvatarUrl()');
    return CognitoUtil.getCandidateAvatarUrl();
  }

  setCandidateAvatarUrl() {
    if (DEBUG_MODE) console.log('CognitoUtil.setCandidateAvatarUrl()', this.s3);


    let promise: Promise<void> = new Promise<void>((resolve, reject) => {

      this.s3.getSignedUrl('getObject', { 'Key': 'protected/' + CognitoUtil.getUserId() + '/avatar.jpg' }, (err, url) => {
        if (DEBUG_MODE) console.log('CognitoUtil.setCandidateAvatarUrl() - url: ', url, err);
        CognitoUtil.setCandidateAvatarUrl(url);
        resolve();
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

/*
  getUserFirstName(): string {
    if (CognitoUtil.getUserProfile() && CognitoUtil.getUserProfile()['given_name']) {
      return (CognitoUtil.getUserProfile()['given_name'])
    }
    return '';
  }

  getUserLastName(): string {
    if (CognitoUtil.getUserProfile() && CognitoUtil.getUserProfile()['family_name']) {
      return CognitoUtil.getUserProfile()['family_name'];
    }
    return null;
  }

  getUserFullName(): string {
    if (CognitoUtil.getUserProfile() && CognitoUtil.getUserProfile()['given_name'] && CognitoUtil.getUserProfile()['family_name']) {
      return CognitoUtil.getUserProfile()['given_name'] + ' ' + CognitoUtil.getUserProfile()['family_name'];
    }
    return null;
  }
*/
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

  logout() {
    Logger.banner("Sign Out");
    this.showLogoutAlert();
    UserLoginService.signOut();
    this.userId = '';

    this.app.getRootNav().setRoot(WelcomePage);
    this.app.getRootNav().popToRoot({animate: false});
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
