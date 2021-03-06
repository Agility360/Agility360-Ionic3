import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';
import { GlobalStateService } from '../../services/global-state.service';
import { AccountForgotPasswordPage } from '../account-forgot-password/account-forgot-password';
import { AccountSignupPage } from '../account-signup/account-signup';
import { DEBUG_MODE } from '../../shared/constants';


import {
  UserLoginService, IUserLogin, UserState,
  UserRegistrationService, CognitoUtil
} from '../../services/account-management.service';
import { Logger } from '../../services/logger.service';
import { Config } from '../../config/config';

import { Candidate } from '../../shared/candidate';
import { CandidateProvider } from '../../providers/candidate';


@Component({
  templateUrl: 'account-signin.html',
})

export class AccountSigninPage {

  allowButtonPresses = true; // to prevent multiple clicks
  accountSignupPage = AccountSignupPage;
  accountForgotPasswordPage = AccountForgotPasswordPage;
  tabsPage = TabsPage;
  alertCtrl : AlertController = this.globals.getAlertController();

  public userData: IUserLogin = {
    username: null,
    password: null
  };

  signInButtonClicked: boolean = false;
  forgotPasswordButtonClicked: boolean = false;

  constructor(
    public navCtrl: NavController,
    private globals: GlobalStateService,
    private candidateProvider: CandidateProvider) {
    if (DEBUG_MODE) console.log('AccountSigninPage.constructor()');

  }

  onSignIn(form) {
    if (DEBUG_MODE) console.log('AccountSigninPage.onSignIn()');
    this.signInButtonClicked = true;
    this.forgotPasswordButtonClicked = false;

    if (form && form.valid) {
      this.login();
    }
  }

  onForgotPassword(form) {
    if (DEBUG_MODE) console.log('AccountSigninPage.onForgotPassword()');
    if (!this.allowButtonPresses) {
      return;
    }
    // Check for a special exception:
    // Do not allow default users to change their passwords
    if (form && this.userData.username != null) {
      if (Config['DEFAULT_USERNAMES'].findIndex((el)=>{ return el === this.userData.username; }) > -1) {
        this.globals.displayAlert('Cannot reset passwords for default users',
          `The user [${this.userData.username}] is a default user. ` +
          `Passwords for default users cannot be reset.<br/><br/>Please try ` +
          'again using a username for a user that you have manually registered.');
        return;
      }
    }
    this.signInButtonClicked = false;
    this.forgotPasswordButtonClicked = true;
    this.allowButtonPresses = false;
    if (form && this.userData.username != null) {
      UserLoginService.forgotPassword(this.userData.username).then((data) => {
        // Forgot password request successfully initiated
        this.allowButtonPresses = true;
        console.log('Forgot password request process initiated. Email sent. Data from Cognito response:\n' + data);
        this.navCtrl.push(this.accountForgotPasswordPage);
      }).catch((err: Error) => {
        this.allowButtonPresses = true;
        // Forgot password request failed to initiate
        console.log('Forgot password request failed to initiate', err);
        this.showForgotPasswordFailureAlert(err);
      });
    }
  }

  // return a LoginStatus
  login(): void {
  if (DEBUG_MODE) console.log('AccountSigninPage.login()');
    // prevent multiple clicks
    if (!this.allowButtonPresses) {
      return;
    }
    this.allowButtonPresses = false;
    this.globals.displayLoader('Signing in...').then(() => {
      UserLoginService.signIn(this.userData)
      .then(() => {
        // Login was successful

        // set candidate to local storage
        this.candidateProvider.get()
          .subscribe(
          result => {
            if (DEBUG_MODE) console.log('AccountSigninPage.login() - globals.setCandidate(). Setting candidate to local storage.', result);
            this.globals.setCandidate(result);
          },
          err => {
            if (DEBUG_MODE) console.log('AccountSigninPage.login() - error: ', err);
          });

        return this.globals.dismissLoader().then(() => {
          this.globals.userId = this.globals.getUserId();

          this.globals.setViewAdminFeaturesOverride(this.globals.isAdminRole());
          this.navCtrl.setRoot(TabsPage);
          this.navCtrl.popToRoot({animate: false});
        });
      }).catch((err: Error): void => {
        // Login was unsuccessful
        this.globals.dismissLoader();
        this.allowButtonPresses = true;
        this.displayAlertError(err);
      });
    });
  }

  displayAlertError(err: Error) {
    if (DEBUG_MODE) console.log('AccountSigninPage.displayAlertError()');
    switch (CognitoUtil.getUserState()) {
    case UserState.InvalidCredentials:
      if (DEBUG_MODE) console.log('%cSign-in failed: ', Logger.LeadInErrorStyle, err);

      let errorMessage: string;

      if (err.toString() != "NetworkingError: Network Failure") errorMessage = err.toString()
                                                                                  .replace("NotAuthorizedException:", "")
                                                                                  .replace("UserNotFoundException:", "")
      else errorMessage = 'There is no connection to the Internet. Please try again in a while.'

      this.showLoginFailureAlert(this.userData.username, errorMessage);
      break;
    case UserState.PendingConfirmation:
      // If a user has registered, but has not yet confirmed the registration code, then
      // display a dialog where he/she can input the verification code. Alternatively,
      // the user can request a new verification code be emailed.
      if (DEBUG_MODE) console.log('User has not confirmed verification code: ' + err);
      this.showOneTimeVerificationAlert(this.userData.username, () => {
        this.navCtrl.pop();
      });
      break;
    default:
      if (DEBUG_MODE) console.log('%cSign-in failed', Logger.LeadInErrorStyle, err);
      errorMessage = `The login failed: ${err}`;
      this.showLoginFailureAlert(this.userData.username, errorMessage);
      break;
    }
  }

  showLoginSuccessAlert(username: String, callbackHandler: () => void): void {
    if (DEBUG_MODE) console.log('AccountSigninPage.showLoginSuccessAlert()');
    let subtitle = `You are now signed in.`;
    if (this.globals.isAdminRole()) {
      subtitle = `You are now signed in as an Administrator.`
    }
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: subtitle,
      message: `Username: <b>${username}</b>`,
      buttons: [{
          text: 'OK',
          handler: data => {
            callbackHandler();
          }
        }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });;
  }

  showResendSuccessAlert(callbackHandler: () => void): void {
    if (DEBUG_MODE) console.log('AccountSigninPage.showResendSuccessAlert()');
    let alert = this.alertCtrl.create({
      title: 'Verification code sent',
      subTitle: `A new verification code has been emailed to your account. Once you receive it, please try signing in again.`,
      buttons: [{
        text: 'OK',
        handler: data => { callbackHandler(); }
      }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });
  }

  showOneTimeVerificationAlert(username: String, callbackHandler: () => void): void {
    if (DEBUG_MODE) console.log('AccountSigninPage.showOneTimeVerificationAlert()');
    let alert = this.alertCtrl.create({
      title: 'One-time verification',
      subTitle: `When you registered, a verification code was emailed to you. Please enter the code, and click "Verify". Or click "Re-send" to receive another code.`,
      inputs: [{
          name: 'verificationCode',
          placeholder: 'Verification code'
      }],
      buttons: [
        {
          text: 'Verify',
          handler: data => {
            UserRegistrationService.confirmSignUp(data.verificationCode)
            .then(() => {
                // now, sign in
              UserLoginService.signIn(this.userData)
              .then(() => {
                // Login was successful

              }).catch((err: Error): void => {
                // Login was unsuccessful
                this.displayAlertError(err);
              });
            }).catch((err: Error) => {
              console.error(err);
              this.showConfirmationFailureAlert(err);
            });
          }
        },
        {
          text: 'Re-send',
          handler: data => {
            UserRegistrationService.resendConfirmationCode();
            this.showResendSuccessAlert(callbackHandler);
          }
        },
        { text: 'Cancel' },
        ]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });
  }

  showConfirmationFailureAlert(err: Error): void {
    if (DEBUG_MODE) console.log('AccountSigninPage.showConfirmationFailureAlert()');
    let alert = this.alertCtrl.create({
      title: 'Verification failed',
      subTitle: err.message,
      buttons: [{ text: 'OK' }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });
  }


  showLoginFailureAlert(username: String, message: String): void {
    if (DEBUG_MODE) console.log('AccountSigninPage.showLoginFailureAlert()');
    let alert = this.alertCtrl.create({
      title: 'Login Unsuccessful',
      subTitle: `${message}`,
      buttons: [{ text: 'OK' }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });
  }

  showForgotPasswordFailureAlert(err): void {
    if (DEBUG_MODE) console.log('AccountSigninPage.showForgotPasswordFailureAlert()');
    let alert = this.alertCtrl.create({
      title: 'Error encountered',
      subTitle: `An error was encountered when attempting to initiate the password change process: [${err}]. Please try again.`,
      buttons: [{ text: 'OK' }]
    });
    alert.present().then(() => {
    }).catch((ex) => {
      console.log('Display alert exception', ex);
    });
  }


  ionViewDidEnter() {
    Logger.banner("Sign-In");
    if (DEBUG_MODE) console.log('AccountSigninPage.ionViewDidEnter()');
    this.allowButtonPresses = true;
  }
}
