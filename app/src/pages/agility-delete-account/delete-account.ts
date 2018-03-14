import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
//import { User } from '../../providers/providers';
import { DEBUG_MODE } from '../../shared/constants';
import { LoginPage } from '../agility-login/login';
import { UserLoginService } from '../../services/account-management.service';
import { Logger } from '../../services/logger.service';
import { GlobalStateService } from '../../services/global-state.service';
import { CandidateProvider } from '../../providers/candidate';
import { NavbarComponent } from '../../components/navbar';
import { WelcomePage } from '../welcome/welcome';

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

  constructor(
    public navCtrl: NavController,
    public app: App,
    private alertCtrl: AlertController,
    private globals: GlobalStateService,
    public navParams: NavParams,
    public candidateProvider: CandidateProvider) {

      if (DEBUG_MODE) console.log('DeleteAccountPage.constructor()');

  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('DeleteAccountPage.ionViewDidLoad()');
  }

  deleteAccount() {
    if (DEBUG_MODE) console.log('DeleteAccountPage.deleteAccount()');
    let alertConfirm = this.alertCtrl.create({
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

            //this deletes the persisted objects of the current user (ie, a cascade delete)
            this.candidateProvider.delete()
            .then(result => {
              if (DEBUG_MODE) console.log('%cDeleteAccountPage.deleteAccount() - candidateProvider.delete - success.', Logger.LeadInStyle, result);
            })
            .catch(error => {
              if (DEBUG_MODE) console.log('%cDeleteAccountPage.deleteAccount() - candidateProvider.delete - error.', Logger.LeadInErrorStyle, error);
            });

            //delete the Cognito user
            UserLoginService.deleteUser()
            .then(
              result => {
                this.globals.logout();
                this.navCtrl.setRoot(WelcomePage);
                this.navCtrl.popToRoot({animate: false});
                return;
              }
            ).catch(
              err => {
                let alertError = this.alertCtrl.create({
                  title: 'Error',
                  message: err,
                  buttons: ['OK']
                });

                alertError.present();
                return;
              }
            );


          }
        }
      ]
    }
    );

    alertConfirm.present();

  }

}
