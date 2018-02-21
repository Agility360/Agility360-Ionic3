import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HttpErrorPage } from './http-error';

@NgModule({
  declarations: [
    HttpErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(HttpErrorPage),
  ],
})
export class HttpErrorPageModule {}
