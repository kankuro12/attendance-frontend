import { HttpClient } from '@angular/common/http';
import { SyncService } from './sync.service';
import { ImagedbService } from './imagedb.service';
import { AppointmentDBService } from './appointmentdb.service';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { send } from 'process';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  date: string;
  appointments: any[]=[];
  showValue: any[]=[];
  currentSearchValue='';


  constructor(private appointmentDB: AppointmentDBService,
    private imageDB: ImagedbService,
    private client: HttpClient,
    private sync: SyncService) {
    this.date=formatDate(new Date(),'YYYY-MM-dd','en','+0545');
    console.log(this.date);

    this.appointmentDB.initiated.subscribe((db)=>{
      this.appointmentDB.getByDate(this.date)
      .then((datas: any[])=>{
        this.appointments=datas;
        this.makeOrder();
        console.log(this.appointments,'hoe ser');
        console.log(JSON.stringify(this.showValue));

      });
    });
  }

  setLeave(id: number){
    const item=this.appointments.find(o=>o.id===id);
    const index=this.appointments.findIndex(o=>o.id===id);

    item.leave=true;
    item.used=true;
    item.leavetime=new Date();

    this.appointmentDB.update(item)
    .then((data)=>{
      this.sync.addTrack(1,id);
      this.appointments[index].leave=true;
      this.appointments[index].used=true;
      this.appointments[index].leavetime=new Date();
      this.syncStart();

      this.refresh();
    })
    .catch((error)=>{
      console.log(error);

    });
  }
  setEnter(id: number){
    const item=this.appointments.find(o=>o.id===id);
    const index=this.appointments.findIndex(o=>o.id===id);

    item.enter=true;
    item.entertime=new Date();

    this.appointmentDB.update(item)
    .then((data)=>{
      this.sync.addTrack(1,id);
      this.appointments[index].enter=true;
      this.appointments[index].entertime=new Date();
      this.syncStart();
    })
    .catch((error)=>{
      console.log(error);

    });

  }

  dowork(){

  }
  getFormData(item){
    const fd=new FormData();

    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const val = item[key].toString();
        fd.append(key,val);
      }
    }
    return fd;
  }
  async syncStart(repeat=false){
    console.log(this.sync);
    if(!repeat){

      if(this.sync.working){
        return;
      }
    }

    if(this.sync.added.length>0){
      this.sync.working=true;
      const id =this.sync.added[0];
      const item: any=await this.appointmentDB.get(id);
      const imageData: any=await this.imageDB.get(parseInt(item.image,10));
      const image=await (await fetch(imageData.image)).blob();
      const fd=this.getFormData(item);
      fd.append('image',image);
      this.client.post('http://192.168.254.11:8000/api/send/3',fd)
      .subscribe((res: any)=>{
        this.sync.popTrack(3);
        if(this.sync.hasMore()){
          this.syncStart(true);
        }else{
          this.sync.working=false;
        }
      },err=>{this.sync.working=false;});
      console.log(item);

    }else if(this.sync.edited.length>0){
      this.sync.working=true;

      const id =this.sync.edited[0];
      const item: any=await this.appointmentDB.get(id);
      const fd=this.getFormData(item);
      this.client.post('http://192.168.254.11:8000/api/send/1',fd)
      .subscribe((res: any)=>{
        this.sync.popTrack(1);
        if(this.sync.hasMore()){
          this.syncStart(true);
        }else{
          this.sync.working=false;
        }
      },err=>{this.sync.working=false;});
    }else if(this.sync.deleted.length>0){

    }
  }

  refresh(){
    this.showValue=this.
    appointments.
    filter(o=>(o.name.startsWith(this.currentSearchValue)|| o.code===this.currentSearchValue) && o.used===false );

  }

  search(key: string,update=false){
    this.currentSearchValue=key;
    this.showValue=this.appointments.filter(o=>o.name.startsWith(key)|| o.code===key);
  }



  delete(p: any){
    this.appointmentDB.delete(p.id)
    .then((result: any)=>{
      this.appointments.splice(this.appointments.findIndex(o=>o.id===p.id),1);
      this.imageDB.delete(parseInt(p.image,10));
      this.sync.addTrack(2,p.id);

    }).catch((error)=>{
      alert('Appointment Cannot be Deleted');
    });
  }


  rescheduleLast(params){
    const item=this.appointments.find(o=>o.id===params.id);
    const index=this.appointments.findIndex(o=>o.id===params.id);
    item.enter=false;
    item.entertime='';
    item.no=(this.appointments.length>0? Math.max(...this.appointments.map(o=>o.no)):0)+1;
    this.appointmentDB.update(item)
    .then((data)=>{
      this.sync.addTrack(1,item.id);
      this.appointments[index]=item;
      this.makeOrder();
      this.syncStart();
      console.log(data);
    })
    .catch((error)=>{
      console.log(error);

    });

  }

  async rescheduleToNo(params){

    const shift=this.appointments.filter(o=>o.no>=params.num);
    const shifted=shift.map(o=>{o.no+=1;return o;});
    const item=this.appointments.find(o=>o.id===params.id);
    item.enter=false;
    item.entertime='';
    item.no=params.num;
    shifted.push(item);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < shifted.length; i++) {
      const localdata = shifted[i];
      await this.appointmentDB.update(localdata);
      this.sync.addTrack(1,localdata.id);
    }
    this.makeOrder();
    this.syncStart();
  }


  async rescheduleToDate(params){
    const no=await this.appointmentDB.getMaxDate(params.date);
    const item=this.appointments.find(o=>o.id===params.id);
    const index=this.appointments.findIndex(o=>o.id===params.id);
    item.enter=false;
    item.entertime='';
    item.no=no + 1;
    item.date=params.date;
    this.appointmentDB.update(item)
    .then((data)=>{
      if(this.date!==params.date){
        this.appointments.splice(index,1);
      }else{
        this.appointments[index]=item;
      }
      this.makeOrder();
      this.sync.addTrack(1,item.id);
      this.syncStart();

    });
  }
  makeOrder(){
    this.showValue=this.appointments.filter(o=>o.used===false ).sort((a: any,b: any)=>a.no > b.no? 1:-1);

  }



  massUpdate(arr){

  }


}
