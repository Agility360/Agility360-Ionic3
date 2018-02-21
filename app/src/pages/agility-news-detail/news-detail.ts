import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { WPPost } from '../../shared/wppost';

@IonicPage()
@Component({
  selector: 'page-news-detail',
  templateUrl: 'news-detail.html',
})
export class NewsDetailPage {

  post: WPPost;
  errMess: string;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams) {

    if (DEBUG_MODE) console.log('NewsDetailPage.constructor()');
    this.post = navParams.get('post');

  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('NewsDetailPage.ionViewDidLoad()');
  }

  refreshData(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('NewsDetailPage.refresh()');

      refresher.complete();
    }, 500);
  }

}
