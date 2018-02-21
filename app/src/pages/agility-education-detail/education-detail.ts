import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DEBUG_MODE } from '../../shared/constants';
import { Education } from '../../shared/education';
import { EducationHistoryProvider } from '../../providers/educationhistory';


@IonicPage()
@Component({
  selector: 'page-education-detail',
  templateUrl: 'education-detail.html',
})
export class EducationDetailPage {

  public errorMsg: string;
  public error: any;
  public formGroup: FormGroup;

  public obj: Education;
  public action: string;
  public shouldConfirmWindowClose: boolean;
  public graduated: boolean;

  public start_date: string;
  public end_date: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: EducationHistoryProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder) {

    if (DEBUG_MODE) console.log('EducationDetailPage.constructor() with obj: ', this.obj, this.action);

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

     if (this.obj.start_date) {
       s = this.obj.start_date.toString();
       y = parseInt(s.substring(0, 5));
       m = parseInt(s.substring(5, 7)) - 1;
       d = parseInt(s.substring(8, 10));

       this.start_date = new Date(y, m, d, 0, 0, 0, 0).toISOString();
     }
     if (this.obj.end_date) {
       s = this.obj.end_date.toString();
       y = parseInt(s.substring(0, 5));
       m = parseInt(s.substring(5, 7)) - 1;
       d = parseInt(s.substring(8, 10));

       this.end_date = new Date(y, m, d, 0, 0, 0, 0).toISOString();
     }



     /* Ditto regarding boolean values for the Ionic Checkbox control. */
     if (this.obj.graduated == 1) this.graduated = true
     else this.graduated = false;

    /* setup form validators */
      this.formGroup = formBuilder.group({
        'institution_name': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'degree': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'graduated': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'start_date': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'end_date': [
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

  formValidate(): boolean {
    if (DEBUG_MODE) console.log('CertificationDetailPage.formValidate()');
    this.errorMsg = null;

    //begin business rule validations.
    if (this.end_date != null) {
      this.obj.start_date = new Date(this.start_date);
      this.obj.end_date = new Date(this.end_date);
      if (this.obj.end_date < this.obj.start_date) {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'The end date should be after the start date.',
          buttons: ['Dismiss']
        });
        alert.present();
        return false;
      }
    }

    if (this.formGroup.valid) {
      return true;
    }
    return false;
}

  processForm() {
    if (DEBUG_MODE) console.log('EducationDetailPage.processForm(): ', );
    if (!this.formValidate()) return

    this.obj.start_date = new Date(this.start_date);
    this.obj.end_date = new Date(this.end_date);

    /* rebind our local boolean "graduated" object to the real graduated object. */
    this.obj.graduated = this.graduated ? 1 : 0;

    if (this.action === 'add') {

      let toast = this.toastCtrl.create({
        message: 'Success.',
        duration: 2000
      });

      if (DEBUG_MODE) console.log('EducationDetailPage.processForm() - Adding obj: ', this.obj);
      this.provider.add(this.obj)
        .subscribe(job => {
          if (DEBUG_MODE) console.log('EducationDetailPage.processForm() - Added obj: ', this.obj);
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
          if (DEBUG_MODE) console.log('Updated job: ', dataObj);
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
    if (DEBUG_MODE) console.log('EducationDetailPage.ionViewDidLoad()');
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
