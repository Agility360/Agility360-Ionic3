import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, App, AlertController } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { NavbarComponent } from '../../components/navbar';

import { LoginPage } from '../agility-login/login';
import { ProfilePage } from '../agility-profile/profile';
import { CertificationsPage } from '../agility-certifications/certifications';
import { EducationPage } from '../agility-education/education';
import { JobhistoryPage } from '../agility-jobhistory/jobhistory';
import { ResumeUploaderPage } from '../agility-resume-uploader/resume-uploader';
import { AccountChangePasswordPage } from '../account-change-password/account-change-password';
import { DeleteAccountPage } from '../agility-delete-account/delete-account';
import { PrivacyPolicyPage } from '../agility-privacy-policy/privacy-policy';
import { TermsOfUsePage } from '../agility-terms-of-use/terms-of-use';
import { HttpErrorPage } from '../agility-http-error/http-error';

import { GlobalStateService } from '../../services/global-state.service';
import { CandidateProvider } from '../../providers/candidate';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { Config } from '../../config/config';

declare var AWS: any;


@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {

  @ViewChild('avatar') avatarInput;
  provider: CandidateProvider;
  public pageTitle = "Candidate Profile";

  private s3: any;
  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public attributes: any;
  public username: string;
  public email: string;
  public email_verified: boolean;

  public profilePage = ProfilePage;
  public certificationsPage = CertificationsPage;
  public educationPage = EducationPage;
  public jobhistoryPage = JobhistoryPage;
  public resumeUploaderPage = ResumeUploaderPage;
  public AccountChangePasswordPage = AccountChangePasswordPage;
  public deleteAccountPage = DeleteAccountPage;
  public privacyPolicyPage = PrivacyPolicyPage;
  public termsOfUsePage = TermsOfUsePage;
  public httpErrorPage = HttpErrorPage;


  constructor(public navCtrl: NavController,
    private globals: GlobalStateService,
    public app: App,
    public camera: Camera,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

    if (DEBUG_MODE) console.log('SettingsPage.constructor() - begin');

    this.attributes = [];
    this.avatarPhoto = null;
    this.selectedPhoto = null;

    this.s3 = new AWS.S3({
      'params': {
        'Bucket': Config['PROFILE_IMAGES_S3_BUCKET']
      },
      'region': Config['REGION']
    });

    this.refreshAvatar();

  }


  logout() {
    if (DEBUG_MODE) console.log('SettingsPage.logout()');
    this.globals.logout();
  }

  changePassword() {
    if (DEBUG_MODE) console.log('SettingsPage.changePassword()');
    this.app.getRootNav().setRoot(AccountChangePasswordPage);
  }

  deleteAccount() {
    if (DEBUG_MODE) console.log('SettingsPage.deleteAccount()');
    let alert = this.alertCtrl.create({
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            if (DEBUG_MODE) console.log('Delete cancelled.');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.navCtrl.push(DeleteAccountPage);
          }
        }
      ]
    }
    );

    alert.present();

  }

  refreshAvatar() {
    if (DEBUG_MODE) console.log('SettingsPage.refreshAvatar()');

    /*
    this.s3.getSignedUrl('getObject', { 'Key': 'protected/' + this.globals.getUserId() + '/avatar.jpg' }, (err, url) => {
      this.avatarPhoto = url;
      if (DEBUG_MODE) console.log('SettingsPage.refreshAvatar() - url: ', url);
    });
    */

    this.globals.setCandidateAvatarUrl()
    .then(() => {
      if (DEBUG_MODE) console.log('SettingsPage.refreshAvatar() - set was successful. now setting the image in this object.');
      this.avatarPhoto = this.globals.getCandidateAvatarUrl();
    });

  }

  dataURItoBlob(dataURI) {
    if (DEBUG_MODE) console.log('SettingsPage.dataURItoBlob()');
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };

  selectAvatar() {
    if (DEBUG_MODE) console.log('SettingsPage.selectAvatar()');
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options)
    .then(
      (imageData) => {
        this.selectedPhoto = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
        this.upload();
      },
      (err) => {
          this.avatarInput.nativeElement.click();
    });
  }

  uploadFromFile(event) {
    if (DEBUG_MODE) console.log('SettingsPage.uploadFromFile()');
    const files = (<HTMLInputElement>event.target).files;
    console.log('Uploading', files)
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.selectedPhoto = this.dataURItoBlob(reader.result);
      this.upload();
    };
    reader.onerror = (error) => {
      alert('Unable to load file. Please try another.')
    }
  }

  upload() {
    if (DEBUG_MODE) console.log('SettingsPage.upload()');
    let loading = this.loadingCtrl.create({
      content: 'Uploading image...'
    });
    loading.present();

    if (this.selectedPhoto) {
      this.s3.upload({
        'Key': 'protected/' + this.globals.getUserId() + '/avatar.jpg',
        'Body': this.selectedPhoto,
        'ContentType': 'image/jpeg'
      }).promise()
      .then(
        (data) => {
        this.refreshAvatar();
        if (DEBUG_MODE) console.log('SettingsPage.upload() - s3.upload - success');
        loading.dismiss();
      }, err => {
        if (DEBUG_MODE) console.log('SettingsPage.upload() - s3.upload - failure', err);
        loading.dismiss();
      });
    }
    loading.dismiss();

  }


}
