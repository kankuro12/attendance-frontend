import { SyncService } from './../../services/sync.service';
import { HomeService } from './../../services/home.service';
import { AppointmentDBService } from './../../services/appointmentdb.service';
import { LocalImage } from './../../model/localImage.modal';
import { ImagedbService } from './../../services/imagedb.service';
import { browser } from 'protractor';
import { Person } from './../../model/person.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Other } from 'src/app/model/other.model';
import { Capacitor } from '@capacitor/core';
import { threadId } from 'worker_threads';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  @Input() shown = false;
  @Output() shownChange = new EventEmitter<boolean>();
  person = new Person();
  allDatas = [
    'Abarth',
    'Alfa Romeo',
    'Aston Martin',
    'Audi',
    'Bentley',
    'BMW',
    'Bugatti',
    'Cadillac',
    'Chevrolet',
    'Chrysler',
    'Citroën',
    'Dacia',
    'Daewoo',
    'Daihatsu',
    'Dodge',
    'Donkervoort',
    'DS',
    'Ferrari',
    'Fiat',
    'Fisker',
    'Ford',
    'Honda',
    'Hummer',
    'Hyundai',
    'Infiniti',
    'Iveco',
    'Jaguar',
    'Jeep',
    'Kia',
    'KTM',
    'Lada',
    'Lamborghini',
    'Lancia',
    'Land Rover',
    'Landwind',
    'Lexus',
    'Lotus',
    'Maserati',
    'Maybach',
    'Mazda',
    'McLaren',
    'Mercedes-Benz',
    'MG',
    'Mini',
    'Mitsubishi',
    'Morgan',
    'Nissan',
    'Opel',
    'Peugeot',
    'Porsche',
    'Renault',
    'Rolls-Royce',
    'Rover',
    'Saab',
    'Seat',
    'Skoda',
    'Smart',
    'SsangYong',
    'Subaru',
    'Suzuki',
    'Tesla',
    'Toyota',
    'Volkswagen',
    'Volvo'
  ];
  searchItems: string[] = [];
  imageLoaded = false;
  image = '';
  constructor(private platform: Platform,
    public dom: DomSanitizer,
    private client: HttpClient,
    private router: Router,
    private imageDB: ImagedbService,
    private homeService: HomeService,
    private sync: SyncService,
    private appoitmentDB: AppointmentDBService,
    private alertController: AlertController) { }

  ngOnInit() {
    const data = new Person();
    console.log(data);
  }

  close() {
    this.router.navigate(['/home']);
    // this.shown = false;
    // this.shownChange.emit(this.shown);
  }

  focus(focused: boolean) {
    if (focused) {
      this.searchItems = this.allDatas.filter((o: string) => o.toLowerCase().startsWith(this.person.reason.toLowerCase()));
    } else {
    }
  }

  searchReason() {
    this.searchItems = this.allDatas.filter((o: string) => o.toLowerCase().startsWith(this.person.reason.toLowerCase()));
  }
  reasonSelected(val: any) {
    console.log(val);

    this.person.reason = val;
    this.searchItems = [];
  }

  capture() {
    Camera.getPhoto({
      quality: 90,
      height: 300,
      width: 300,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: false,
      source: CameraSource.Camera,

    }).then((image) => {
      console.log(image);
      this.image = image.webPath;
      this.imageLoaded = true;
    })
      .catch((err) => {
        console.log(err);
      });
  }
  clear() {
    this.alertController.create({
      header: 'Clear Data',
      message: 'Do you want to clear data?',
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
          handler: (val: any) => {
            this.image = '';
            this.imageLoaded = false;
            this.person = new Person();
          }
        },
        {
          text: 'CANCEL',
          cssClass: 'DANGER',
        }
      ]

    })
      .then((alert) => {
        alert.present();
      });


  }



  getBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = (e) => {
        console.log(e);
        resolve(e.target.result.toString());
      };
      r.onerror = e => {
        reject('error while converting');
      };
      r.readAsDataURL(blob);
    });
  }



  async dataManage() {
    let error = '';
    if (!this.imageLoaded) {

      error += 'Please select a image.<br>';
    }
    if (this.person.name === '') {
      error += 'Please enter visitor name.<br>';

    }
    if (this.person.phone === '') {
      error += 'Please enter visitor phone.<br>';

    }
    if (error !== '') {
      this.alertController.create({
        header: 'Add Appointment',
        message: error,
        buttons: ['ok']
      }).then((alert) => {
        alert.present();
      });
      return;
    }
    const blob = await (await fetch(this.image)).blob();
    const base64 = await this.getBase64(blob);
    if (this.imageDB.busy || !this.imageDB.open) {
      alert('database loading, Please try again');
      return;
    }
    const savedImage: any = await this.imageDB.insert(base64);
    console.log(savedImage);

    if (this.appoitmentDB.busy || !this.appoitmentDB.open) {
      alert('database loading, Please try again');
      this.imageDB.delete(savedImage.id);
      return;
    }
    this.person.image = savedImage.id.toString();
    this.person.imageType = 1;
    this.person.date=this.homeService.date;
    this.person.no=this.homeService.appointments.length>0? (Math.max(...this.homeService.appointments.map((o: any)=> o.no))+1):1;
    console.log(this.person.no);

    this.appoitmentDB.insert(this.person)
    .then((p: any)=>{
      this.homeService.appointments.push(p);
      this.homeService.refresh();
      this.image = '';
      this.imageLoaded = false;
      this.person = new Person();
      this.sync.addTrack(3,p.id);
      this.homeService.syncStart();
      this.router.navigate(['/home']);
    })
    .catch((err)=>{
      this.alertController.create({
        header: 'Add Appointment',
        message: 'Appointment Cannot be saved',
        buttons: ['ok']
      }).then((alert) => {
        alert.present();
      });
    });
  }

}
