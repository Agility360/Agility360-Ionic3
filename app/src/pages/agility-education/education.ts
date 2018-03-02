/*----------------------------------------------------------
 * written by:  mcdaniel
 * date:        august 2017
 *
 * usage:
 *---------------------------------------------------------*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { Education } from '../../shared/education';
import { EducationHistoryProvider } from '../../providers/educationhistory';
import { EducationDetailPage } from '../agility-education-detail/education-detail';


@IonicPage()
@Component({
  selector: 'page-education',
  templateUrl: 'education.html',
})

export class EducationPage {

  cards: Education[];
  errMess: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: EducationHistoryProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    if (DEBUG_MODE) console.log('constructor EducationPage');
  }

  ionViewWillEnter() {
    if (DEBUG_MODE) console.log('EducationPage.ionViewWillEnter()');
    this.get();
  }

  refresh(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('EducationPage.refresh()');
      this.get();
      refresher.complete();
    }, 500);
  }


  get() {
    if (DEBUG_MODE) console.log('EducationPage.get()');
    this.provider.get()
      .subscribe(
      results => {
        this.cards = results
      },
      err => {
        this.errMess = <any>err
      });
  }

  add() {
    if (DEBUG_MODE) console.log('EducationPage.add() - button clicked.');
    this.navCtrl.push(EducationDetailPage, {
      obj: this.provider.new(),
      action: 'Add'
    });
  }

  edit(obj: Education) {
    if (DEBUG_MODE) console.log('EducationPage.edit() - button clicked for obj:', obj);
    this.navCtrl.push(EducationDetailPage, {
      obj: obj,
      action: 'Edit'
    });
  }


  delete(obj: Education) {
    if (DEBUG_MODE) console.log('EducationPage.delete() - button clicked for obj:', obj);

    let alert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Delete ' + obj.institution_name + '?',
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

            let toast = this.toastCtrl.create({
              message: obj.institution_name + ' deleted.',
              duration: 2000
            });

            this.provider.delete(obj.id)
              .subscribe(
              results => {
                this.cards = results;
                toast.present();
              },
              err => {
                this.errMess = err;
              });
          }
        }
      ]
    });

    alert.present();

  } /* delete */


}
