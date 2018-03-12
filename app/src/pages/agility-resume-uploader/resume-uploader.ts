import { IonicPage, NavParams, LoadingController, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { DEBUG_MODE } from '../../shared/constants';
import { Candidate } from '../../shared/candidate';
import { CandidateProvider } from '../../providers/candidate';
import { S3File } from '../../shared/s3file';
import { GlobalStateService } from '../../services/global-state.service';
import { NavbarComponent } from '../../components/navbar';
import { Config } from '../../config/config';

declare var AWS: any;
//declare const aws_user_files_s3_bucket;
//declare const aws_user_files_s3_bucket_region;


/**
 * Generated class for the ResumeUploaderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resume-uploader',
  templateUrl: 'resume-uploader.html',
})
export class ResumeUploaderPage {

  public candidate: Candidate;

  private fileContent: Blob;
  private fileMetaData: any;
  public errMess: string;
  private documentViewerOptions: any;
  public pageTitle = "Resume Uploader";

  /* AWS variables */
  private s3: any;
  public url: string;
  public username: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private globals: GlobalStateService,
    public loadingCtrl: LoadingController,
    private candidateProvider: CandidateProvider) {

      if (DEBUG_MODE) console.log('ResumeUploaderPage.constructor()');

      this.url = null;
      this.s3 = new AWS.S3({
        'params': {
          'Bucket': Config['PROFILE_IMAGES_S3_BUCKET']
        },
        'region': Config['REGION']
      });

      this.documentViewerOptions = {
        title: 'My Resume'
      };

      this.username = this.globals.getUsername();
      this.getResume();

  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.ionViewDidLoad()');
  }

  private key(): string {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.key(): ');
    return 'public/' + this.username + '.pdf';
  }

  getResume() {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.getResume()');
      this.s3.getSignedUrl('getObject', { 'Key': this.key() }, (err, url) => {

        if (err) {
          if (DEBUG_MODE) console.log('ResumeUploaderPage.getResume() - this.s3.getSignedUrl - error', err);
          return;
        }
        if (DEBUG_MODE) console.log('ResumeUploaderPage.getResume() - this.s3.getSignedUrl - success', url);

        this.url = url;

        this.fileMetaData = null;
        this.candidate = null;
        this.candidateProvider.get()
          .subscribe(
            result => {
              this.candidate = result
              if (DEBUG_MODE) console.log('ResumeUploaderPage.getResume() - this.candidateProvider.get: - success', this.candidate);
              if (this.candidate.resume_filename) {
                this.fileMetaData = JSON.parse(this.candidate.resume_filename);
                this.fileMetaData.size = Math.round(this.fileMetaData.size / 1024);
              }
            },
            err => {
              this.errMess = <any>err
              if (DEBUG_MODE) console.log('ResumeUploaderPage.getResume() - this.candidateProvider.get - error: ', this.errMess);
          });


    });
  }

  deleteResume() {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.deleteResume()');
  }

  refresh(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('ResumeUploaderPage.refresh()');
      this.getResume();
      refresher.complete();
    }, 500);
  }


  private dataURItoBlob(dataURI) {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.dataURItoBlob()');
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };

  uploadFromFile(event) {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.uploadFromFile()');
    const files = (<HTMLInputElement>event.target).files;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      if (DEBUG_MODE) console.log('ResumeUploaderPage.uploadFromFile() - file read.');
      this.fileContent = this.dataURItoBlob(reader.result);

      let loading = this.loadingCtrl.create({
        content: 'Uploading'
      });
      loading.present();

      var s3file: S3File = this.new(this.key(), this.fileContent, files[0].type);

      this.s3.upload(s3file).promise()
      .then(
        (data) => {
          if (DEBUG_MODE) console.log('ResumeUploaderPage.uploadFromFile() - s3.upload - success');

          /* for future references, we'll store the original resume filename in the candidate profile object. */
          console.log('files[0]: ', files[0]);
          this.candidate.resume_filename = this.stringifyFile(files[0]);
          console.log('HELLO WORLD!!!!', this.candidate.resume_filename);

          this.candidateProvider.update(this.candidate)
            .subscribe(obj => {
              if (DEBUG_MODE) console.log('ResumeUploaderPage.uploadFromFile() - candidateProvider.update(this.candidate): success ', obj);
              this.getResume();
            },
            error => {
              if (DEBUG_MODE) console.log('ResumeUploaderPage.uploadFromFile() - candidateProvider.update(this.candidate): error ', error);
              this.errMess = error;
              this.getResume();
            });

        },
        (err) => {
          if (DEBUG_MODE) console.log('ResumeUploaderPage.upload() - s3.upload - failure', err);
        });

      loading.dismiss();
    };
    reader.onerror = (error) => {
      alert('Unable to load file. Please try another.')
    }
  }

  private new(Key, Body, ContentType) {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.new()');
      return {
        Key: Key,
        Body: Body,
        ContentType: ContentType
      };
  }

  private stringifyFile(file): string {
    if (DEBUG_MODE) console.log('ResumeUploaderPage.stringifyFile(file)');

    var now = new Date();

    return '{ '
          + '"name": "' + file.name
          + '", "size": ' + file.size
          + ', "type": "' + file.type
          + '", "lastModifiedDate": "' + file.lastModifiedDate
          + '", "uploadDate": "' + now.toString()
          + '" }';

  }


}
