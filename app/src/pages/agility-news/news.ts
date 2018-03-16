/*------------------------------------------------------
 * written by: mcdaniel
 * date: august 2017
 *
 * usage: template controller fed by custom Wordpress provider
 *        this code is templated for use in the following
 *        page controllers:
 *        - jobs
 *        - news
 *        - resume
 *------------------------------------------------------*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { WPPost, WPCategories } from '../../shared/wppost';
import { WordpressProvider } from '../../providers/wordpress';
import { NewsDetailPage } from '../agility-news-detail/news-detail';
import { NavbarComponent } from '../../components/navbar';
import { Logger } from '../../services/logger.service';

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})

export class NewsPage {

  posts: WPPost[];
  categories: WPCategories[];

  errMess: string;
  public pageTitle: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private wpservice: WordpressProvider
  ) {
    Logger.banner("News Feed");
    if (DEBUG_MODE) console.log('constructor NewsPage');
    this.getCategories();
    this.getPosts();
  }

  refreshData(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('NewsPage.refreshData()');
      this.getPosts();
      refresher.complete();
    }, 500);
  }

  getPosts() {
    if (DEBUG_MODE) console.log('NewsPage.getPosts()');
    this.errMess = null;

    /* Note: set this to appropriate parameter factory fuction:
        paramsJobs()
        paramsNews()
        paramsResume()
    */

    let params = this.wpservice.paramsNews();

    this.wpservice.getPosts(params)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('NewsPage.getPosts() - success', results);
        this.posts = results
        var self = this;
        this.posts.forEach(function(post, id) {
          if (DEBUG_MODE) console.log(post);
          self.getMedia(post);
        });
      },
      err => {
        if (DEBUG_MODE) console.log('NewsPage.getPosts() - error', err);
        this.errMess = <any>err
      });
  }

  getCategories() {
    if (DEBUG_MODE) console.log('NewsPage.getCategories()');
    this.errMess = null;

    this.wpservice.getCategories(null)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('NewsPage.getCategories() - success', results);
        this.categories = results
      },
      err => {
        if (DEBUG_MODE) console.log('NewsPage.getCategories() - error', err);
        this.errMess = <any>err
      });
  }

  getMedia(post: WPPost) {

    if (DEBUG_MODE) console.log('NewsPage.getMedia()', post);
    if (post.featured_media == 0) {
      post.featured_media_obj = this.wpservice.newMedia();
      return;
    };

    this.wpservice.getMedia(post.featured_media)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('NewsPage.getMedia() - success', results);
        post.featured_media_obj = results;
        post.featured_media_url = results.source_url;
      },
      err => {
        if (DEBUG_MODE) console.log('NewsPage.getMedia() - error', err);
        this.errMess = <any>err;
      });

  }

  viewPost(post: WPPost) {
    if (DEBUG_MODE) console.log('NewsPage.viewPost()', post);
    this.navCtrl.push(NewsDetailPage, {
      post: post
    });

  }

  categoryName(categoryId: number): string {
    //if (DEBUG_MODE) console.log('NewsPage.categoryName()', categoryId);

    this.categories.forEach(function(category, id) {
      if (category.id == categoryId) {
        return category.name || "";
      }
    });

    return "";

  }
}
