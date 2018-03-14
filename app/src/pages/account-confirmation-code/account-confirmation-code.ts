import { Component }                   from '@angular/core';
import { NavController }               from 'ionic-angular';
import { AlertController }             from 'ionic-angular';
import { UserRegistrationService, CognitoUtil }     from '../../services/account-management.service';
import { GlobalStateService } from '../../services/global-state.service';
import { Logger } from '../../services/logger.service';

import { DEBUG_MODE } from '../../shared/constants';


@Component({
  templateUrl: 'account-confirmation-code.html',
})
export class AccountConfirmationCodePage {
  public submitted: boolean = false;
  public registrationCode = {
    code: undefined
  };

  constructor(
      private navCtrl: NavController,
      private alertCtrl: AlertController,
      private globals: GlobalStateService) {
    if (DEBUG_MODE) console.log('AccountConfirmationCodePage.constructor()');


  }

  confirmSignUp(form) {
    if (DEBUG_MODE) console.log('AccountConfirmationCodePage.confirmSignUp()');
    this.submitted = true;
    if (form && form.valid) {
      UserRegistrationService.confirmSignUp(this.registrationCode.code.toString())
      .then(() => {
        this.showConfirmationSuccessAlert();
      }).catch((err: Error) => {
        if (DEBUG_MODE) console.log('%cAccountConfirmationCodePage.confirmSignUp() - error', Logger.LeadInErrorStyle, err);
        this.showConfirmationFailureAlert(err);
      });
    }
  }

  showConfirmationSuccessAlert(): void {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: `You are now successfully registered! You can now sign-in using your username/password.`,
      buttons: [{
          text: 'OK',
          handler: data => {
            this.navCtrl.popToRoot({animate: false});
          }
        }]
    });
    alert.present();
  }

  showConfirmationFailureAlert(err: Error): void {
    let alert = this.alertCtrl.create({
      title: 'Verification failed',
      subTitle: err.message,
      buttons: [{
          text: 'OK',
        }]
    });
    alert.present();
  }


  ionViewDidEnter() {
    Logger.banner("Confirmation Code");
  }
}
