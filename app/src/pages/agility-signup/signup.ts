/*-----------------------------------------------------------------------
 * from AWS starter app
 *-----------------------------------------------------------------------*/
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../agility-login/login';
import { ConfirmPage } from '../agility-confirm/confirm';
import { User } from '../../providers/user';
export class UserDetails {
  username: string;
  email: string;
  password: string;
  usernameValidationCode: number;
  emailValidationCode: number;
  passwordValidationCode: number;
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
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public userDetails: UserDetails;
  public candidate: Candidate;
  public errMsg: string;
  public error: any;
  public formGroup: FormGroup;

  private isEmailAvailable: boolean;
  private isUsernameAvailable: boolean;

  constructor(public navCtrl: NavController,
    public user: User,
    private candidateProvider: CandidateProvider,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder) {

    if (DEBUG_MODE) console.log('SignupPage.constructor()');
    this.userDetails = new UserDetails();
    this.isUsernameAvailable = false;
    this.isEmailAvailable = false;
    this.userDetails.usernameValidationCode = 0;
    this.userDetails.emailValidationCode = 0;
    this.userDetails.passwordValidationCode = 0;

    this.candidate = this.candidateProvider.new();
    this.error = null;
    this.errMsg = null;

    /* setup form validators */
      this.formGroup = formBuilder.group({
        'username': [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z0-9_]*$')
          ])
        ],
        'email': [
          '',
          Validators.compose([
            Validators.required,
            Validators.email
          ])
        ],
        'password': [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8)
          ])
        ]
      });

      this.formGroup.valueChanges
        .subscribe(data => {
          if (DEBUG_MODE) console.log('formGroup.valueChanges.subscribe()');
          //this.errMsg = null;
        });

  }

  usernameDidBlur($event) {
    if (DEBUG_MODE) console.log('SignupPage.usernameDidBlur()', $event);

    if ($event == null) return;
    if (this.userDetails.username == null) return;
    this.errMsg = null;

    let control = this.formGroup.controls['username'];
    if (!control.valid) {
      if (control.errors['required']) {
        this.errMsg = 'Username is required';
      } else if (control.errors['minlength']) {
        this.errMsg = 'Username should be at least 8 characters';
      }  else if (control.errors['pattern']) {
        this.errMsg = 'Username should be alphanumeric with no spaces nor special characters';
      }
    } else {
      // it's a syntactically valid value, so now we'll check availability in the database
      if (DEBUG_MODE) console.log('SignupPage.usernameDidBlur() -  candidateProvider.checkUsernameAvailable', this.userDetails.username);
      this.candidateProvider.checkUsernameAvailable(this.userDetails.username)
      .subscribe(
        available => {
          if (DEBUG_MODE) console.log('SignupPage.usernameDidBlur() -  candidateProvider.checkUsernameAvailable - success. Availability: ', available);
          this.isUsernameAvailable = available;
          if (!available) this.errMsg = 'That username is not available';
        },
        err => {
          if (DEBUG_MODE) console.log('SignupPage.usernameDidBlur() -  candidateProvider.checkUsernameAvailable - an error occurred', err);
        });
    }

  }

  emailDidBlur($event) {
    if (DEBUG_MODE) console.log('SignupPage.emailDidBlur()', $event);

    if ($event == null) return;
    if (this.userDetails.email == null) return;
    this.errMsg = null;

    let control = this.formGroup.controls['email'];
    if (!control.valid) {
      if (control.errors['required']) {
        this.errMsg = 'Email address is required';
      } else this.errMsg = 'Please enter a valid email. Example: address@mailserver.com';
    } else {
      // it's a syntactically valid value, so now we'll check availability in the database
      if (DEBUG_MODE) console.log('SignupPage.emailDidBlur() -  candidateProvider.checkEmailAvailability', this.userDetails.username);
      this.candidateProvider.checkEmailAvailability(this.userDetails.email)
      .subscribe(
        available => {
          if (DEBUG_MODE) console.log('SignupPage.emailDidBlur() -  candidateProvider.checkEmailAvailability - success. Availability: ', available);
          this.isEmailAvailable = available;
          if (!available) this.errMsg = 'That email address is not available';
        },
        err => {
          if (DEBUG_MODE) console.log('SignupPage.emailDidBlur() -  candidateProvider.checkEmailAvailability - an error occurred', err);
        });
    }

  }

  passwordDidBlur($event) {
    if (DEBUG_MODE) console.log('SignupPage.passwordDidBlur()', $event);

    if ($event == null) return;
    if (this.userDetails.password == null) return;
    this.errMsg = null;

    let control = this.formGroup.controls['password'];
    if (!control.valid) {
      if (control.errors['required']) {
        this.errMsg = 'Password is required';
      } else if (control.errors['minlength']) {
        this.errMsg = 'Password should be at least 8 characters';
      }
    }
  }

  signup() {

    if (DEBUG_MODE) console.log('SignupPage.signup()');
    if (!this.formValidate()) return

    let details = this.userDetails;
    this.error = null;

    if (DEBUG_MODE) console.log('SignupPage.signup() - beginning registration');
    this.user.register(details.username, details.password, { 'email': details.email })
      .then((user) => {
        if (DEBUG_MODE) console.log('SignupPage.signup() - success. registered');
        this.candidate.email = details.email;
        this.candidate.account_name = details.username;

        /*---------------------------------------------------------------*/
        if (DEBUG_MODE) console.log('SignupPage.signup() - Create new candidate object', this.candidate);
          this.candidateProvider.add(this.candidate)
          .finally(()=>{
          })
          .subscribe(
            result => {
              if (DEBUG_MODE) console.log('SignupPage.signup() - Create new candidate - success', result);

            },
            err => {
              if (DEBUG_MODE) console.log('ProfilePage.get() - Create new candidate - error', err);

            }
          );
        /*---------------------------------------------------------------*/

        this.navCtrl.push(ConfirmPage, { candidate: this.candidate });
      })
      .catch((err) => {
        if (DEBUG_MODE) console.log('SignupPage.signup() - registration error.');
        this.error = err;
        this.errMsg = err.message;
      });
  }

  login() {
    if (DEBUG_MODE) console.log('SignupPage.login()');
    this.navCtrl.push(LoginPage);
  }

  formValidate(): boolean {
    if (DEBUG_MODE) console.log('SignupPage.formValidate()');
    if (this.formGroup.valid && this.isUsernameAvailable && this.isEmailAvailable) {
      return true;
    }

    //begin investigating each control until we find the problem.

    return false;
  }



}
