import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { Certification } from '../../shared/certification';
import { CertificationHistoryProvider } from '../../providers/certificationhistory';
import { CertificationDetailPage } from '../agility-certification-detail/certification-detail';


@IonicPage()
@Component({
  selector: 'page-certifications',
  templateUrl: 'certifications.html',
})

export class CertificationsPage {

  cards: Certification[];
  errMess: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: CertificationHistoryProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    if (DEBUG_MODE) console.log('constructor JobhistoryPage');
  }

  ionViewWillEnter() {
    if (DEBUG_MODE) console.log('JobhistoryPage.ionViewWillEnter()');
    this.get();
  }

  refresh(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('JobhistoryPage.refresh()');
      this.get();
      refresher.complete();
    }, 500);
  }


  get() {
    if (DEBUG_MODE) console.log('JobhistoryPage.get()');
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
    if (DEBUG_MODE) console.log('JobhistoryPage.add() - button clicked.');
    this.navCtrl.push(CertificationDetailPage, {
      obj: this.provider.new(),
      action: 'Add'
    });
  }

  edit(obj: Certification) {
    if (DEBUG_MODE) console.log('JobhistoryPage.edit() - button clicked for obj:', obj);
    this.navCtrl.push(CertificationDetailPage, {
      obj: obj,
      action: 'Edit'
    });
  }


  delete(obj: Certification) {
    if (DEBUG_MODE) console.log('JobhistoryPage.delete() - button clicked for obj:', obj);

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
