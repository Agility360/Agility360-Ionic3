import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DEBUG_MODE } from '../../shared/constants';
import { Job } from '../../shared/job';
import { JobHistoryProvider } from '../../providers/jobhistory';
import { NavbarComponent } from '../../components/navbar';

@IonicPage()
@Component({
  selector: 'page-jobhistory-detail',
  templateUrl: 'jobhistory-detail.html',
})
export class JobhistoryDetailPage {

  public errorMsg: string;
  public error: any;
  public formGroup: FormGroup;

  public obj: Job;
  public action: string;
  public shouldConfirmWindowClose: boolean;

  public start_date: string;
  public end_date: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: JobHistoryProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder) {

    if (DEBUG_MODE) console.log('JobhistoryDetailPage.constructor() with obj: ', this.obj, this.action);

    this.obj = navParams.get('obj');
    this.action = navParams.get('action').toLowerCase();
    this.shouldConfirmWindowClose = true;

    /*----------------------------------------------
     * some explanation is merited for the following.
     * the Ionic Date Picker control uses a 2-way to a string representation of a date
     * formatted in ISO 8601 format. meanwhile, the underlying Date object
     * uses [some other format] which will result in the Date Picker
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

    /* setup form validators */
      this.formGroup = formBuilder.group({
        'company_name': [
          '',
          Validators.compose([
            Validators.required
          ])
        ],
        'department': [
          '',
          Validators.compose([
          ])
        ],
        'job_title': [
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
        'final_salary': [
          '',
          Validators.compose([
          ])
        ],
        'compensation_type': [
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
    if (this.obj.end_date < this.obj.end_date) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'The end date should be after the start date.',
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }

    if (this.obj.final_salary < 0) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Salary should be greater than zero.',
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
    if (DEBUG_MODE) console.log('JobhistoryDetailPage.processForm(): ', );
    if (!this.formValidate()) return

    this.obj.start_date = this.start_date;
    this.obj.end_date = this.end_date;


    if (this.action === 'add') {

      let toast = this.toastCtrl.create({
        message: 'Success.',
        duration: 2000
      });

      if (DEBUG_MODE) console.log('JobhistoryDetailPage.processForm() - Adding obj: ', this.obj);
      this.provider.add(this.obj)
        .subscribe(job => {
          if (DEBUG_MODE) console.log('JobhistoryDetailPage.processForm() - Added obj: ', this.obj);
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
          /* this.obj = dataObj[0]; */
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
    if (DEBUG_MODE) console.log('JobhistoryDetailPage.ionViewDidLoad()');
  }


  ionViewCanLeave() {
    if (this.shouldConfirmWindowClose && this.formGroup.dirty) {
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
