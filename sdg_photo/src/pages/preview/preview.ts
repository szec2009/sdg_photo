import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {CameraPage} from "../camera/camera";
import {SharePage} from "../Share/share";
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery';
import {SocialSharing} from "@ionic-native/social-sharing";
import {HTTP} from "@ionic-native/http";
import { AndroidPermissions } from '@ionic-native/android-permissions';

import {Storage} from "@ionic/storage";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'page-preview',
    templateUrl: 'preview.html'
})
export class PreviewPage {


    imageUrl : string = "";
    imageHttpUrl : string = "";
    photoFrame : string = "";
    frameUrl : string = "";
    frameBannerUrl : string = "";

    btnLang : string = "";
    btnHome : string = "";
    btnBackImg : string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private base64ToGallery: Base64ToGallery,
                private socialSharing : SocialSharing,
                private http:HTTP,
                private httpClient:HttpClient,
                private storage: Storage,
                private loading: LoadingController,
                private androidPermissions: AndroidPermissions
               ) {
        this.imageUrl = navParams.get("imageUrl");
        this.imageHttpUrl = navParams.get("imageHttpUrl");
    }

    async ionViewWillEnter()
    {

        // this.frameUrl = "/assets/imgs/photoframe/1.png";
        // this.frameBannerUrl = "/assets/imgs/colorbanner/1.png";
        // this.imageUrl = "http://devwherear.com/arms/v2/ARMS/libs/api/sdg/uploads/5b9b6818de3d6.png";



        const loader = this.loading.create({ spinner: 'dots' });
        loader.present();
        this.http.get('http://blacknovamedia.com/sdg_api/cam_api.php?url=' + this.imageHttpUrl, {}, {})
            .then(data => {

                this.photoFrame = data.data;
                this.frameUrl = "/assets/imgs/photoframe/" + this.photoFrame + ".png";
                this.frameBannerUrl = "/assets/imgs/colorbanner/" + this.photoFrame + ".png";
                loader.dismiss();

            })
            .catch(error => {

                console.log("Error");
                console.log(error);

                loader.dismiss();
            });

        this.CameraChangeLanguage();
    }

    GoToHome()
    {
        this.navCtrl.push(CameraPage, {},  {animate: true, direction: 'back'});
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

    ShareToFacebook()
    {

        this.socialSharing.shareViaFacebook("STGs Photo", this.imageUrl).then(() =>
        {
            this.navCtrl.push(SharePage, {imageUrl: this.imageUrl, photoFrame: this.photoFrame});
        }).catch(() => {
            console.log("Error");
        });
        //this.navCtrl.push(SharePage);
    }

    ShareToInstagram()
    {
        this.socialSharing.shareViaInstagram("STGs Photo", this.imageUrl).then(() => {

            this.navCtrl.push(SharePage, {imageUrl: this.imageUrl, photoFrame: this.photoFrame});
        }).catch(() => {
            console.log("Error");
        });
        //this.navCtrl.push(SharePage);
    }

    SavePhoto()
    {
        let options = {
            prefix: '_sdg',
            mediaScanner: true
        };
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
            result => {
                console.log("Permissions granted", result.hasPermissions);
                this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then(
                    result => {
                        this.base64ToGallery.base64ToGallery(this.imageUrl,
                            options
                        ).then(
                            res =>
                            {
                                console.log('Saved image to gallery ', res);
                                //alert("The photo is saved");
                                this.navCtrl.push(SharePage, {imageUrl: this.imageUrl, photoFrame: this.photoFrame});
                            },
                            err => console.log('Error saving image to gallery ', err)
                        );
                    }
                );
            },
            error => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
        );
    }
}
