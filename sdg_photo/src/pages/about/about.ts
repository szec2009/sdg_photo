import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SharePage} from "../Share/share";
import {HomePage} from "../home/home";
import {CameraPage} from "../camera/camera";
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    @ViewChild(Slides) slides: Slides;
    imageUrl : string = "";
    photoFrame : string = "";

    btnLang : string = "";
    btnHome : string = "";
    btnBackImg : string = "";

    title : string = "";
    description : string = "";
    color : string = "";

    currentIndex : string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private httpClient:HttpClient,
                private storage: Storage) {

        this.imageUrl = navParams.get("imageUrl");
        this.photoFrame = navParams.get("photoFrame");
    }


    async ionViewWillEnter()
    {
        this.CameraChangeLanguage();
    }


    async ionViewDidEnter() {
        if(this.photoFrame != null)
        {
            this.slides.slideTo(Number(this.photoFrame) - 1);
            this.LoadContent(this.photoFrame);
        }
        else
        {
            this.LoadContent("1");
        }
    }

    LoadContent(index:string)
    {
        this.httpClient.get('../assets/data/content.json').subscribe(data =>
        {
            var lang = "";
            this.storage.get('lang').then((val) => {
                lang = val;
                this.color = data[index]["Color"];
                this.title = data[index]["Title"][lang];
                this.description = data[index]["Description"][lang];
                document.getElementById('contentTitle').style.color = this.color;
            });
        });
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
            this.LoadContent(this.currentIndex);
        });
    }

    GoToHome()
    {
        this.navCtrl.push(HomePage);
    }

    GoToShare()
    {
        if(this.imageUrl != null)
        {
            this.navCtrl.push(SharePage, {imageUrl: this.imageUrl, photoFrame: this.photoFrame},  {animate: true, direction: 'back'});
        }
        else
        {
            this.GoToHome();
        }
    }

    SliderPrev()
    {
        if(this.slides.getActiveIndex() > 0)
        {
            this.slides.slideTo(this.slides.getActiveIndex() - 1);
        }
    }

    SliderNext()
    {
        if(this.slides.getActiveIndex() < this.slides.length())
        {
            this.slides.slideTo(this.slides.getActiveIndex() + 1);
        }
    }

    slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
        let getContent = currentIndex + 1;
        this.LoadContent(getContent.toString());
        this.currentIndex = getContent.toString();
    }

}
