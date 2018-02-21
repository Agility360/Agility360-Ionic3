import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';

import { DEBUG_MODE } from '../../shared/constants';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {

    if (DEBUG_MODE) console.log('WelcomePage.constructor()');

  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('WelcomePage.ionViewDidLoad()');
  }

  login() {
    if (DEBUG_MODE) console.log('WelcomePage.login()');
    this.navCtrl.push(LoginPage);
  }

  signup() {
    if (DEBUG_MODE) console.log('WelcomePage.signup()');
    this.navCtrl.push(SignupPage);
  }

}
