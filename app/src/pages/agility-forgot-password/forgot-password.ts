import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/providers';
import { LoginPage } from '../agility-login/login';
import { PasswordResetPage } from '../agility-password-reset/password-reset';
import { DEBUG_MODE } from '../../shared/constants';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  public errMsg: any;
  public username: string;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public navParams: NavParams) {

      if (DEBUG_MODE) console.log('ForgotPasswordPage.constructor()');


  }

  resetPassword() {
    if (DEBUG_MODE) console.log('ForgotPasswordPage.resetPassword(): ', this.username);

    if (this.username)

    this.navCtrl.push(PasswordResetPage, {
      username: this.username
    });


  }

  login() {
    if (DEBUG_MODE) console.log('ForgotPasswordPage.login()');
    this.navCtrl.push(LoginPage);
  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('ForgotPasswordPage.ionViewDidLoad()');
  }

}
