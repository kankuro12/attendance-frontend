import { browser } from 'protractor';
import { Person } from './../../model/person.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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
  constructor(private platform: Platform, public dom: DomSanitizer,private client: HttpClient) { }

  ngOnInit() {
    const data = new Person();
    console.log(data);
  }

  close() {
    this.shown = false;
    this.shownChange.emit(this.shown);
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

  async capture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    console.log(image);

    this.person.image = image.webPath;
    console.log(this.person);


  }

  async dataManage() {

    const blob=await (await fetch(this.person.image)).blob();
    const f=new FormData();
    f.append('lorem',blob,'lorem.png');
    for (const key in this.person) {
      if (Object.prototype.hasOwnProperty.call(this.person, key) && key !== 'image') {
        const value = this.person[key];
          f.append(key,value);
      }
    }
    this.client.post('http://localhost:8000',f)
    .subscribe((res: any)=>{
      console.log(res);
    });
  }

}
