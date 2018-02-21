import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { User } from '../../providers/providers';
import { DEBUG_MODE } from '../../shared/constants';
import { LoginPage } from '../login/login';
import { Cognito } from '../../providers/aws.cognito';


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
  private cognitoUser: any;

  constructor(public navCtrl: NavController,
    public user: User,
    public app: App,
    public cognito: Cognito,
    private alertCtrl: AlertController,
    public navParams: NavParams) {

      if (DEBUG_MODE) console.log('DeleteAccountPage.constructor()');

      this.username = navParams.get('username');
      this.cognitoUser = this.cognito.makeUser(this.username);
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


            this.cognitoUser.deleteUser(function(err, result) {
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
                return;
            });

            this.user.logout();
            this.app.getRootNav().setRoot(LoginPage);
          }
        }
      ]
    }
    );

    alert.present();

  }

}
