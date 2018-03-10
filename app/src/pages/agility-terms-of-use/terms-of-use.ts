import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { WPPost } from '../../shared/wppost';
import { WordpressProvider } from '../../providers/wordpress';
import { NavbarComponent } from '../../components/navbar';


@IonicPage()
@Component({
  selector: 'page-terms-of-use',
  templateUrl: 'terms-of-use.html',
})
export class TermsOfUsePage {

  posts: WPPost[];
  errMess: string;
  showLoading: boolean;
  public pageTitle = "Terms of Use";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private wpservice: WordpressProvider) {

    if (DEBUG_MODE) console.log('TermsOfUsePage.constructor()');
    this.showLoading = true;
    this.getPosts();
  }


  refreshData(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('TermsOfUsePage.refreshData()');
      this.getPosts();
      refresher.complete();
    }, 500);
  }

  getPosts() {
    if (DEBUG_MODE) console.log('TermsOfUsePage.getPosts()');

    this.wpservice.getPage(this.wpservice.urlTermsOfUse(), {})
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('TermsOfUsePage.getPosts() - success', results);
        this.posts = results
        var self = this;
        this.posts.forEach(function(post, id) {
          self.getMedia(post);
        });
      },
      err => {
        if (DEBUG_MODE) console.log('TermsOfUsePage.getPosts() - error', err);
        this.errMess = <any>err
      });
  }

  getMedia(post: WPPost) {

    if (DEBUG_MODE) console.log('TermsOfUsePage.getMedia()', post);
    if (post.featured_media == 0) {
      post.featured_media_obj = this.wpservice.newMedia();
      return;
    };

    this.wpservice.getMedia(post.featured_media)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('TermsOfUsePage.getMedia() - success', results);
        post.featured_media_obj = results;
        post.featured_media_url = results.source_url;
      },
      err => {
        if (DEBUG_MODE) console.log('TermsOfUsePage.getMedia() - error', err);
        this.errMess = <any>err;
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsOfUsePage');
  }

}
