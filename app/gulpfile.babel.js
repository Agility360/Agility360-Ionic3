import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import replacePath from 'gulp-replace-path';
import path  from 'path';
import htmlmin from 'gulp-htmlmin';
import image from 'gulp-image';
import stripComments from 'gulp-strip-comments';

import AWS from 'aws-sdk';
import awsPublish from 'gulp-awspublish';
import mergeStream from 'merge-stream';



export function awsPublisher() {

  // create a new publisher using S3 options
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  var publisher = awsPublish.create({
    region: 'us-east-1',
    params: {
      Bucket: 'mobile.agility360app.net'
    },
    credentials: new AWS.SharedIniFileCredentials({profile: 'agility360'})
  }, {
    cacheFileName: ''
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
    // ...
  };

  return gulp.src('./www/**/*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awsPublish.reporter());
};


const publish = gulp.series(awsPublisher);
gulp.task('publish', publish);
export default publish;
