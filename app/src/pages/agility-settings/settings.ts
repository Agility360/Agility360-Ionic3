import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, App, AlertController } from 'ionic-angular';
import { ProfilePage } from '../agility-profile/profile';
import { CertificationsPage } from '../agility-certifications/certifications';
import { EducationPage } from '../agility-education/education';
import { JobhistoryPage } from '../agility-jobhistory/jobhistory';
import { ResumeUploaderPage } from '../agility-resume-uploader/resume-uploader';
import { PrivacyPolicyPage } from '../agility-privacy-policy/privacy-policy';
import { TermsOfUsePage } from '../agility-terms-of-use/terms-of-use';
import { AccountPage } from '../account/account';

import { GlobalStateService } from '../../services/global-state.service';
//import { CandidateProvider } from '../../providers/candidate';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { DEBUG_MODE } from '../../shared/constants';
import { Config } from '../../config/config';
import { Logger } from '../../services/logger.service';

declare var AWS: any;


@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {

  @ViewChild('avatar') avatarInput;
//  provider: CandidateProvider;
//  public pageTitle = "Candidate Profile";

  private s3: any;
  public profilePhotoS3SignedUrl: string;
  public profilePhotoBlob: Blob;

  public attributes: any;
  public username: string;
  public email: string;
  public email_verified: boolean;

  public accountPage = AccountPage;
  public profilePage = ProfilePage;
  public certificationsPage = CertificationsPage;
  public educationPage = EducationPage;
  public jobhistoryPage = JobhistoryPage;
  public resumeUploaderPage = ResumeUploaderPage;
  public privacyPolicyPage = PrivacyPolicyPage;
  public termsOfUsePage = TermsOfUsePage;


  constructor(
    public navCtrl: NavController,
    private globals: GlobalStateService,
    public app: App,
    public camera: Camera,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

      Logger.banner("User Settings Page");
    if (DEBUG_MODE) console.log('SettingsPage.constructor() - begin');

    this.attributes = [];
    this.profilePhotoS3SignedUrl = null;
    this.profilePhotoBlob = null;

    this.s3 = new AWS.S3({
      'params': {
        'Bucket': Config['PROFILE_IMAGES_S3_BUCKET']
      },
      'region': Config['REGION']
    });

    this.username = globals.getUsername();
    this.email = globals.getUser()['email'];
    this.email_verified = globals.getUser()['email_verified'];

  }

  private dataURItoBlob(dataURI): Blob {
    if (DEBUG_MODE) console.log('SettingsPage.dataURItoBlob()');
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };


  public candidateProfileImageUrl(): string {
    return this.globals.getCandidateProfileImageUrl();
  }


  selectProfilePhoto() {
    if (DEBUG_MODE) console.log('SettingsPage.selectAvatar()');

    let alert = this.alertCtrl.create({
      title: 'Photo Permission',
      subTitle: 'Agility 360 would like to access your photo gallery for your profile photo upload. Your photos will not be shared without your permission.',
      buttons: [
        {
          text: 'OK',
          handler: () => { this.openDeviceCamera(); }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    alert.present().then(() => {
      console.log('Show logout alert - then');

//      this.openDeviceCamera();

    }).catch((ex) => {
      console.log('Show logout alert exception', ex);
    });;

  }
  openDeviceCamera() {
    if (DEBUG_MODE) console.log('SettingsPage.openDeviceCamera()');
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
        this.profilePhotoBlob = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
        this.uploadToS3ProtectedFolder();
      },
      (err) => {
          console.log('%cSettingsPage.openDeviceCamera() - this.camera.getPicture - error', Logger.LeadInErrorStyle, err);
          this.avatarInput.nativeElement.click();
    });
  }


  openFileExplorer(event) {
    if (DEBUG_MODE) console.log('SettingsPage.openFileExplorer()');
    const files = (<HTMLInputElement>event.target).files;
    console.log('Uploading', files)
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.profilePhotoBlob = this.dataURItoBlob(reader.result);
      this.uploadToS3ProtectedFolder();
    };
    reader.onerror = (error) => {
      console.log('%cSettingsPage.openFileExplorer() - error', Logger.LeadInErrorStyle);
      alert('Unable to load file. Please try another.')
    }
  }

  private uploadToS3ProtectedFolder() {
    if (DEBUG_MODE) console.log('SettingsPage.uploadToS3ProtectedFolder()');
    let loading = this.loadingCtrl.create({
      content: 'Uploading image...'
    });
    loading.present();

    if (this.profilePhotoBlob) {
      this.s3.upload({
        'Key': 'protected/' + this.globals.getUserId() + '/avatar.jpg',
        'Body': this.profilePhotoBlob,
        'ContentType': 'image/jpeg'
      }).promise()
      .then(
        (data) => {
        this.globals.setCandidateProfileImageUrl().then(()=>{
            // can't think of anything to do here.
        });
        if (DEBUG_MODE) console.log('SettingsPage.uploadToS3ProtectedFolder() - s3.upload - success');
        loading.dismiss();
      }, err => {
        console.log('%cSettingsPage.uploadToS3ProtectedFolder() - s3.upload - failure', Logger.LeadInErrorStyle, err);
        loading.dismiss();
      });
    }
    loading.dismiss();
  }


  private photoPermissionAlert(): void {
    let alert = this.alertCtrl.create({
      title: 'Photo Permission',
      subTitle: 'Agility 360 would like to access your photo gallery for your profile photo upload. Your photos will not be shared without your permission.',
      buttons: [
        {
          text: 'OK',
          role: 'ok'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Show logout alert exception', ex);
    });;
  }


}
