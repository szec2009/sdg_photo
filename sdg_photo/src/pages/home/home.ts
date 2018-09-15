import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CameraPage} from "../camera/camera";
import {AboutPage} from "../about/about";
import {StatusBar} from "@ionic-native/status-bar";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {HTTP} from "@ionic-native/http";

import {Storage} from "@ionic/storage";
import { HttpClient, HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import {SharePage} from "../Share/share";
import {PreviewPage} from "../preview/preview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    btnStart : string = "";
    btnAbout : string = "";
    btnNeedHelp : string = "";
    btnContactUs : string = "";

  constructor(public navCtrl: NavController, private statusBar: StatusBar,
              private orientation: ScreenOrientation,
              private httpClient:HttpClient,
              private storage: Storage,
              private http:HTTP
              ) {
    var bgImageUrl = "image/background.png";
      this.storage.set("lang", "EN");
      this.storage.get('lang').then((val) => {
          if(val == null)
          {
              this.storage.set("lang", "EN");
          }
          this.ChangeLanguage();
      });

  }
    async ionViewWillEnter() {
        this.statusBar.overlaysWebView(true);
        this.statusBar.hide();
        // this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);
        this.ChangeLanguage();
    }

    ChangeLanguage()
    {
        this.httpClient.get('../assets/data/content.json').subscribe(data =>
        {
            var lang = "";
            this.storage.get('lang').then((val) => {
                lang = val;
                this.btnStart = data["Start Selfie"][lang];
                this.btnAbout = data["About SDGs"][lang];
                this.btnNeedHelp = data["Need Help?"][lang];
                this.btnContactUs = data["Contact Us"][lang];
            });
        });
    }

  GoToCamera()
  {
    this.navCtrl.push(CameraPage);
    // this.navCtrl.push(PreviewPage);
  }

  GoToAbout()
  {
    this.navCtrl.push(AboutPage);
  }

}
