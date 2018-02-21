import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResumeUploaderPage } from './resume-uploader';

@NgModule({
  declarations: [
    ResumeUploaderPage,
  ],
  imports: [
    IonicPageModule.forChild(ResumeUploaderPage),
  ],
})
export class ResumeUploaderPageModule {}
