import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, AlertController } from 'ionic-angular';

import { DEBUG_MODE } from '../../shared/constants';
import { GlobalStateService } from '../../services/global-state.service';
import { AccountChangePasswordPage } from '../account-change-password/account-change-password';
import { DeleteAccountPage } from '../agility-delete-account/delete-account';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public accountChangePasswordPage = AccountChangePasswordPage;
  public deleteAccountPage = DeleteAccountPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private globals: GlobalStateService,
    public app: App,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

      if (DEBUG_MODE) console.log('AccountPage.constructor() - begin');

    }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  changePassword() {
    if (DEBUG_MODE) console.log('SettingsPage.changePassword()');
    this.app.getRootNav().setRoot(AccountChangePasswordPage);
  }


  logout() {
    if (DEBUG_MODE) console.log('SettingsPage.logout()');
    this.globals.logout(null);
    this.navCtrl.setRoot(WelcomePage);
    this.navCtrl.popToRoot({animate: false});
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

}
