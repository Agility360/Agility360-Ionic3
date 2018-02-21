import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { Certification } from '../../shared/certification';
import { CertificationHistoryProvider } from '../../providers/certificationhistory';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-certification-detail',
  templateUrl: 'certification-detail.html',
})
export class CertificationDetailPage {

  public errorMsg: string;
  public error: any;
  public formGroup: FormGroup;

  public obj: Certification;
  public action: string;
  public shouldConfirmWindowClose: boolean;

  public date_received: string;
  public expire_date: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: CertificationHistoryProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder) {

    if (DEBUG_MODE) console.log('CertificationDetailPage.constructor() with obj: ', this.obj, this.action);

    this.obj = navParams.get('obj');
    this.action = navParams.get('action').toLowerCase();
    this.shouldConfirmWindowClose = true;

    /*----------------------------------------------
     * some explanation is merited for the following.
     * the Ionic Date Picker control uses a 2-way to a string representation of a date
     * formatted in ISO 8601 format. meanwhile, the underlying MySQL database that stores
     * any persisted data use IOS [some other format] which will result in the Date Picker
     * object not being initialized to a value.
     *
     * to resolve this cunundrum the following code converts the string representation to a date object
     * and then back to a string; albeit in ISO 8601 format.
     */
     var s: string;
     var y, m, d: number;

     if (this.obj.date_received) {
       s = this.obj.date_received.toString();
       y = parseInt(s.substring(0, 5));
       m = parseInt(s.substring(5, 7)) - 1;
       d = parseInt(s.substring(8, 10));

       this.date_received = new Date(y, m, d, 0, 0, 0, 0).toISOString();
     }
     if (this.obj.expire_date) {
       s = this.obj.expire_date.toString();
       y = parseInt(s.substring(0, 5));
       m = parseInt(s.substring(5, 7)) - 1;
       d = parseInt(s.substring(8, 10));

       this.expire_date = new Date(y, m, d, 0, 0, 0, 0).toISOString();
     }

    /* setup form validators */
      this.formGroup = formBuilder.group({
        'institution_name': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'certification_name': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'date_received': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'expire_date': [
          '',
          Validators.compose([
          ])
        ],
        'description': [
          '',
          Validators.compose([
          ])
        ]
      });

      this.formGroup.valueChanges
        .subscribe(data => {
          if (DEBUG_MODE) console.log('formGroup.valueChanges.subscribe()');
          this.errorMsg = null;
        });


  }

  minExpirationDate(): Date {
    if (DEBUG_MODE) console.log('CertificationDetailPage.minExpirationDate()');

    if (this.obj.create_date != null)
      return this.obj.create_date
    else
      return new Date();
  }

  formValidate(): boolean {
    if (DEBUG_MODE) console.log('CertificationDetailPage.formValidate()');
    this.errorMsg = null;

    //begin business rule validations.
    if (this.obj.expire_date < this.obj.date_received) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'The expiration date should be after the date received.',
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }

    if (this.formGroup.valid) {
      return true;
    }
    return false;
  }

  processForm() {
    if (DEBUG_MODE) console.log('CertificationDetailPage.processForm(): ', );

    if (!this.formValidate()) return

    this.obj.date_received = new Date(this.date_received);
    this.obj.expire_date = new Date(this.expire_date);

    if (this.action === 'add') {
      let toast = this.toastCtrl.create({
        message: 'Success.',
        duration: 2000
      });

      if (DEBUG_MODE) console.log('CertificationDetailPage.processForm() - Adding obj: ', this.obj);
      this.provider.add(this.obj)
        .subscribe(obj => {
          if (DEBUG_MODE) console.log('CertificationDetailPage.processForm() - Added obj: ', this.obj);
          toast.present();
          this.shouldConfirmWindowClose = false;
          /* this.navCtrl.getActiveChildNav() */
          this.exitPage();
        },
        errorMsg => {
          this.shouldConfirmWindowClose = true;
          this.errorMsg = errorMsg;
        });

    };
    if (this.action === 'edit') {
      let toast = this.toastCtrl.create({
        message: 'Saved.',
        duration: 2000
      });

      if (DEBUG_MODE) console.log('Updating obj: ', this.obj);
      this.provider.update(this.obj)
        .subscribe(dataObj => {
          if (DEBUG_MODE) console.log('Updated obj: ', dataObj);
          toast.present();
          this.shouldConfirmWindowClose = false;
          this.exitPage();
        },
        errorMsg => {
          this.shouldConfirmWindowClose = true;
          this.errorMsg = errorMsg;
        });

    };


  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('CertificationDetailPage.ionViewDidLoad()');
  }


  ionViewCanLeave() {
    if (this.shouldConfirmWindowClose) {
      let alert = this.alertCtrl.create({
        title: 'Exit',
        message: 'Discard changes?',
        buttons: [{
          text: 'Discard',
          handler: () => {
            this.exitPage();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            // need to do something if the user stays?
          }
        }]
      });

      // Show the alert
      alert.present();

      // Return false to avoid the page to be popped up
      return false;
    }
  }

  private exitPage() {
    this.shouldConfirmWindowClose = false;
    this.navCtrl.pop();
  }


}
