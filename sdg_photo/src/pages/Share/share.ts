import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {AboutPage} from "../about/about";
import {CameraPage} from "../camera/camera";

import {Storage} from "@ionic/storage";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'page-share',
    templateUrl: 'share.html'
})
export class SharePage {

    btnColor : string = "";

    imageUrl : string = "";
    photoFrame : string = "";
    frameUrl : string = "";
    titleUrl : string = "";

    btnLang : string = "";
    btnHome : string = "";
    btnBackImg : string = "";
    btnUpload : string = "";
    btnTakeOther : string = "";
    btnOr : string = "";
    btnKnowMore : string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private httpClient:HttpClient,
                private storage: Storage) {
        this.imageUrl = navParams.get("imageUrl");
        this.photoFrame = navParams.get("photoFrame");
        this.frameUrl = "/assets/imgs/photoframe/" + this.photoFrame  + ".png";
        this.titleUrl = "/assets/imgs/logo_rectangle/" + this.photoFrame  + ".png";

        this.httpClient.get('../assets/data/content.json').subscribe(data =>
        {
            var lang = "";
            this.storage.get('lang').then((val) => {
                lang = val;
                this.btnColor = data[this.photoFrame]["Color"];
                console.log(this.photoFrame);
                console.log(this.btnColor);
            });
        });
    }

    async ionViewWillEnter()
    {
        this.CameraChangeLanguage();
    }

    CameraChangeLanguage()
    {
        this.httpClient.get('../assets/data/content.json').subscribe(data =>
        {
            var lang = "";
            this.storage.get('lang').then((val) => {
                lang = val;
                this.btnLang = data["Eng"][lang];
                this.btnHome = data["Home"][lang];
                this.btnBackImg = data["btnBackImg"][lang];
                this.btnUpload = data["Upload Was Successful"][lang];
                this.btnTakeOther = data["Take Another One"][lang];
                this.btnOr = data["Or"][lang];
                this.btnKnowMore = data["Know More"][lang];
            });
        });
    }

    CameraChangeLangClick()
    {
        var lang = "";
        this.storage.get('lang').then((val) => {
            if(val == "EN")
            {
                this.storage.set("lang", "TC");
            }
            else
            {
                this.storage.set("lang", "EN");
            }
            this.CameraChangeLanguage();
        });
    }

    GoToHome()
    {
        //this.navCtrl.push(HomePage, {});
        this.navCtrl.push(HomePage, {imageUrl: ""},  {animate: true, direction: 'back'});
    }

    TakePhoto()
    {
        this.navCtrl.push(CameraPage);
    }

    KnowMore()
    {
        this.navCtrl.push(AboutPage, {imageUrl: this.imageUrl, photoFrame: this.photoFrame});
    }

}
