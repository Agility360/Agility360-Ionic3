import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from '../../providers/user';

/*-----------------------------------------------------------------------
 * added by mcdaniel
 *-----------------------------------------------------------------------*/
import { DEBUG_MODE } from '../../shared/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
/*-----------------------------------------------------------------------
 *
 *-----------------------------------------------------------------------*/


@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {

  public code: number;
  public username: string;

  /* added by mcdaniel */
  public candidate: any;
  public formGroup: FormGroup;
  public systemMessage: string = null;
  public errorMsg: string = null;
  public error: any;
  /* added by mcdaniel */


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public user: User,
    public app: App,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder) {

    /* modified by mcdaniel */
    this.candidate = navParams.get('candidate');
    this.username = this.candidate.account_name;
    if (DEBUG_MODE) console.log('ConfirmPage.constructor() - begin', this.username);
    this.systemMessage = "Momentarily you should receive an email from us with a 6-digit verification code."
    /* modified by mcdaniel */

    /* setup form validators */
    this.formGroup = formBuilder.group({
      'code': [
        '',
        Validators.compose([Validators.required])
      ]
    });

    this.formGroup.valueChanges
      .subscribe(data => {
        if (DEBUG_MODE) console.log('formGroup.valueChanges.subscribe()', data);
        this.errorMsg = null;
      });

    if (DEBUG_MODE) console.log('ConfirmPage.constructor() - finished.');
  }

  codeDidBlur($event) {
    if (DEBUG_MODE) console.log('ConfirmPage.codeDidBlur()', $event);

    this.errorMsg = null;
    if ($event == null) return;

    if (this.code > 999999) {
      if (DEBUG_MODE) console.log('ConfirmPage.codeDidBlur() - validation failure - 1', $event);
      this.errorMsg = 'The verification code should be exactly 6 digits.';
      return;
    }
    if (this.code.toString().length != 6) {
      if (DEBUG_MODE) console.log('ConfirmPage.codeDidBlur() - validation failure - 2', $event);
      this.errorMsg = 'The verification code should be exactly 6 digits.';
      return;
    }

    let control = this.formGroup.controls['code'];
    if (!control.valid) {
      if (control.errors['required']) {
        if (DEBUG_MODE) console.log('ConfirmPage.codeDidBlur() - validation failure - 3', $event);
        this.errorMsg = 'Please enter the 6-digit code from the Agility360 app email address verification.';
      }
    }

  }

  confirm() {
    if (DEBUG_MODE) console.log('ConfirmPage.confirm()', this.candidate);
    this.user.confirmRegistration(this.username, this.code)
    .then(() => {
      if (DEBUG_MODE) console.log('ConfirmPage.confirm() - user.confirmRegistration() - success');

      /* mcdaniel: some user experience improvements to the starter app */

      let toast = this.toastCtrl.create({
        message: 'Your account is ready.',
        duration: 3000
      });
      toast.present();

      this.user.isAuthenticated()
      .then(() => {
        if (DEBUG_MODE) console.log('ConfirmPage.confirm() - user.isAuthenticated - Yes.');
      })
      .catch((err) => {
        if (DEBUG_MODE) console.log('ConfirmPage.confirm() - user.isAuthenticated - No.');
        this.app.getRootNav().setRoot(LoginPage);
      });


    })
    .catch((err) => {
      if (DEBUG_MODE) console.log('ConfirmPage.confirm() - user.confirmRegistration - error: ', err);
      this.error = err;
      this.errorMsg = err.message;
    })
  }

  resendCode() {
    if (DEBUG_MODE) console.log('ConfirmPage.resendCode()');
    this.errorMsg = null;
    this.user.resendRegistrationCode(this.username)
    .then(() => {
      if (DEBUG_MODE) console.log('ConfirmPage.resendCode() - success');

      let alert = this.alertCtrl.create({
        title: 'Email Resent',
        message: 'Please check your email inbox for further instructions.',
        buttons: ['OK']
      });

      alert.present(alert);
      this.systemMessage = "Verification email resent. Please check your email inbox."

    })
    .catch((err) => {
      if (DEBUG_MODE) console.log('ConfirmPage.resendCode() - error', err);
      this.error = err;
      this.errorMsg = err.message;
    });
  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('ConfirmPage.ionViewDidLoad()');
  }


}
