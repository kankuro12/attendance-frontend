import { HomeService } from './../services/home.service';
import { AppointmentDBService } from './../services/appointmentdb.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  person: any;
  shown=false;
  large=window.innerWidth>=768;
  schedule=false;
  constructor(public homeService: HomeService,private actionSheet: ActionSheetController) {}

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  ngOnInit(): void {



  }

  showMenu(p: any){
    const buttons: any=[{
      text: 'Delete',
      icon:'trash',
      role: 'destructive',
      id: 'delete-button',
      data: {
        type: 'delete'
      },
      handler: () => {
        this.homeService.delete(p);
      }
    }];
    if(!p.enter){
      buttons.push(
        {
          text: 'Enter',
          icon:'log-in',
          data: 10,
          handler: () => {
            this.homeService.setEnter(p.id);

          }
        }
      );
    }
    if(p.enter){
      buttons.push({
        text: 'Leave',
        icon: 'log-out',
        data: 10,
        handler: () => {
          this.homeService.setLeave(p.id);
        }
      });
    }

    buttons.push( {
      text: 'Reschedule',
      icon: 'alarm',
      handler: () => {
        this.schedule=true;
      }
    });

    buttons.push( {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    this.person=p;
    this.actionSheet.create({
      header: p.no+' - '+p.name,
      buttons
    }).then((sheet)=>{
      sheet.present();
    });
  }

  searchCode(e){

    if (e.cancelable){ e.preventDefault();}
    this.homeService.search(e.target.value);

  }


  reschedule(data){
    this.schedule=false;
    data.id=this.person.id;
    if(data.type===1){
      this.homeService.rescheduleLast(data);

    }else if(data.type===2){
      this.homeService.rescheduleToNo(data);

    }else if(data.type===3){
      this.homeService.rescheduleToDate(data);
    }
    console.log(data);

  }
}
