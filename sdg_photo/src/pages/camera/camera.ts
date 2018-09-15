import { Component } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController  } from 'ionic-angular';
import {HomePage} from "../home/home";
import {PreviewPage} from "../preview/preview";
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import {StatusBar} from "@ionic-native/status-bar";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery';

import {Storage} from "@ionic/storage";
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Component({
    selector: 'page-camera',
    templateUrl: 'camera.html'
})
export class CameraPage {

    btnLang : string = "";
    btnHome : string = "";
    btnBackImg : string = "";

    constructor(public navCtrl: NavController,
                private camera: CameraPreview,
                private platform: Platform,
                private orientation: ScreenOrientation,
                private statusBar: StatusBar,
                private httpClient:HttpClient,
                private storage: Storage,
                private loading: LoadingController) {
    }

    async ionViewDidEnter() {
    }

    async ionViewWillEnter() {
        this.statusBar.overlaysWebView(true);
        this.statusBar.hide();

        this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);
        this.platform.ready().then(() => {
            let options = {
                x: 0,
                y: this.platform.height() * 10 / 100,
                width: this.platform.width(),
                height: this.platform.width(),
                camera: 'front',
                tapPhoto: false,
                previewDrag: false,
                toBack: false,
                alpha: 1,
                disableExifHeaderStripping: true
            };
            this.camera.startCamera(options).then(() => {
                    console.log("Start Camera");
                },
                () => { console.log("Reject Camera"); });
        });
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
                console.log(this.btnBackImg);
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

    async GoToHome()
    {
        //this.navCtrl.push(HomePage, {});
        await this.camera.stopCamera();
        this.navCtrl.push(HomePage, {},  {animate: true, direction: 'back'});
    }

    async TakePhoto()
    {
        //this.navCtrl.push(PreviewPage, {imageUrl: ""});
        this.camera.takePicture(
            {
                width: this.platform.width(),
                height: this.platform.height() * 70 / 100,
                quality: 50
            }
        ).then((imageData) => {
            var base64Data = 'data:image/png;base64,' +imageData;

            this.camera.stopCamera();
            const loader = this.loading.create({ spinner: 'dots' });
            loader.present();
            const body = "img=" + imageData;
            this.httpClient.post("http://devwherear.com/arms/v2/ARMS/libs/api/sdg/index.php?time=2", body, {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            })
                .subscribe(data => {
                        loader.dismiss();
                        this.navCtrl.push(PreviewPage, {imageUrl: base64Data, imageHttpUrl: data["msg"]});
                    },
                    err => {
                        loader.dismiss();
                    });

        }, (err) => {
            console.log(err);
        });
    }

    async SwitchCamera() {
        await this.camera.switchCamera();
    }
}
