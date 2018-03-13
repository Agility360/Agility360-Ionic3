import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
//import { User } from '../../providers/providers';
import { DEBUG_MODE } from '../../shared/constants';
import { LoginPage } from '../agility-login/login';
import { CognitoUtil } from '../../services/account-management.service';
import { GlobalStateService } from '../../services/global-state.service';
import { NavbarComponent } from '../../components/navbar';

/**
 * Generated class for the DeleteAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delete-account',
  templateUrl: 'delete-account.html',
})
export class DeleteAccountPage {
  private username: string;
  private cognitoUtil: any;

  constructor(
    public navCtrl: NavController,
    public app: App,
    private alertCtrl: AlertController,
    private globals: GlobalStateService,
    public navParams: NavParams) {

      if (DEBUG_MODE) console.log('DeleteAccountPage.constructor()');

  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('DeleteAccountPage.ionViewDidLoad()');
  }

  deleteAccount() {
    if (DEBUG_MODE) console.log('DeleteAccountPage.deleteAccount()');
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

            // hack workaround: instantiation so that the code can be loaded in time for the IonViewDidEnter() method
            this.cognitoUtil = new CognitoUtil();
            this.cognitoUtil.getCognitoUser().deleteUser(function(err, result) {
                if (err) {
                    let alert = this.alertCtrl.create({
                      title: 'Error',
                      message: err,
                      buttons: ['OK']
                    });

                    alert.present(alert);
                    return;
                }
                let alert = this.alertCtrl.create({
                  title: 'Account Deleted',
                  message: result,
                  buttons: ['OK']
                });

                alert.present(alert);
                this.globals.logout();
            });

          }
        }
      ]
    }
    );

    alert.present();

  }

}
