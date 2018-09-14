import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Camera} from '@ionic-native/camera';
import { CameraPreview} from '@ionic-native/camera-preview';
import {SocialSharing} from "@ionic-native/social-sharing";
import {Base64ToGallery} from "@ionic-native/base64-to-gallery";
import { HTTP } from '@ionic-native/http';
import { HttpClientModule } from '@angular/common/http';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicStorageModule } from '@ionic/storage';
// import { AndroidPermissions } from '@ionic-native/android-permissions';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CameraPage } from "../pages/camera/camera";
import {PreviewPage} from "../pages/preview/preview";
import {SharePage} from "../pages/Share/share";
import {AboutPage} from "../pages/about/about";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
      CameraPage,
      PreviewPage,
      SharePage,
      AboutPage
  ],
  imports: [
    BrowserModule,
      HttpClientModule,
    IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      CameraPage,
      PreviewPage,
      SharePage,
      AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
      Camera,
      CameraPreview,
      ScreenOrientation,
      SocialSharing,
      Base64ToGallery,
      // AndroidPermissions,
      HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
