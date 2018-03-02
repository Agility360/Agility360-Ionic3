import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../agility-signup/signup';
import { ConfirmPage } from '../agility-confirm/confirm';
import { ForgotPasswordPage } from '../agility-forgot-password/forgot-password';
import { User } from '../../providers/providers';

export class LoginDetails {
  username: string;
  password: string;
}

/*-----------------------------------------------------------------------
 * added by mcdaniel
 *-----------------------------------------------------------------------*/
import { DEBUG_MODE } from '../../shared/constants';
import { Candidate } from '../../shared/candidate';
import { CandidateProvider } from '../../providers/candidate';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/*-----------------------------------------------------------------------
 *
 *-----------------------------------------------------------------------*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginDetails: LoginDetails;
  public candidate: Candidate;
  public errMsg: string;
  public formGroup: FormGroup;


  constructor(public navCtrl: NavController,
    public user: User,
    private candidateProvider: CandidateProvider,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder) {

    if (DEBUG_MODE) console.log('LoginPage.constructor()');
    this.loginDetails = new LoginDetails();

    /* setup form validators */
      this.formGroup = formBuilder.group({
        'username': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'password': [
          '',
          Validators.compose([
            Validators.required
          ])
        ]
      });

      this.formGroup.valueChanges
        .subscribe(data => {
          if (DEBUG_MODE) console.log('formGroup.valueChanges.subscribe()');
          //this.errMsg = null;
        });

  }

  login() {
    if (DEBUG_MODE) console.log('LoginPage.login()');
    this.errMsg = '';

    let loading = this.loadingCtrl.create({
      content: 'Authenticating ...'
    });
    loading.present();

    let details = this.loginDetails;
    this.user.login(details.username, details.password)
    .then((result) => {
      if (DEBUG_MODE) console.log('LoginPage.login() - result:', result);
      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
    })
    .catch((err) => {
      if (DEBUG_MODE) console.log('LoginPage.login() - error:', err);
      loading.dismiss();
      this.errMsg = err.message;
      if (err.message === "User is not confirmed.") {
        this.candidate = this.candidateProvider.new();
        this.candidate.account_name = details.username;
        this.navCtrl.push(ConfirmPage, { candidate: this.candidate });
      }
    });
  }

  signup() {
    if (DEBUG_MODE) console.log('LoginPage.signup()');
    this.navCtrl.push(SignupPage);
  }

  forgotPassword() {
    if (DEBUG_MODE) console.log('LoginPage.forgotPassword()');
    this.navCtrl.push(ForgotPasswordPage);
  }

}
