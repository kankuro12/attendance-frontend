import { LocalImage } from '../model/localImage.modal';
import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentDBService {
  @Output() initiated=new EventEmitter<IDBDatabase>();
  db: IDBDatabase;
  open=false;
  busy=false;
  dbname='appointment';
  storename='appointment-store';

  constructor() {
    const req = window.indexedDB.open(this.dbname, 1);
    req.onupgradeneeded =  (e: IDBVersionChangeEvent)  => {
      this.db= req.result;
      const imageStore=this.db.createObjectStore(this.storename, {
        autoIncrement: true,
        keyPath: 'id'
      });
      imageStore.createIndex('name','name',{unique:false});
      imageStore.createIndex('phone','phone',{unique:false});
      imageStore.createIndex('synced','synced',{unique:false});
      imageStore.createIndex('date','date',{unique:false});
      imageStore.createIndex('no','no',{unique:false});
    };
    req.onsuccess=(e)=>{
      this.db=req.result;
      this.open=true;
      this.initiated.emit(this.db);
    };
  }

  getByDate(date: string){
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const imageStoreIndex=this.db.transaction(this.storename,'readwrite').objectStore(this.storename).index('date');
      const req=imageStoreIndex.getAll(date);
      req.onsuccess=(e: any)=>{
        this.busy=false;
        resolve(req.result);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });
  }

  appointmentAnother(){

  }

  getMaxDate(date): Promise<number>{
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const imageStoreIndex=this.db.transaction(this.storename,'readwrite').objectStore(this.storename).index('date');
      const req=imageStoreIndex.getAll(date);
      req.onsuccess=(e: any)=>{
        this.busy=false;
        let max=1;
        const datas: any[]=req.result;
        if(datas.length>0){
          this.busy=false;
          // eslint-disable-next-line @typescript-eslint/no-shadow
          max=Math.max(...datas.map(o=>o.no));
        }
        resolve(max);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });
  }

  get(id: number){
    console.log(id);

    this.busy=true;
    return new Promise((resolve,reject)=>{
      const imageStore=this.db.transaction(this.storename,'readwrite').objectStore(this.storename);
      const req=imageStore.get(id);
      req.onsuccess=(e: any)=>{
        this.busy=false;
        resolve(req.result);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });
  }
  delete(id: number){
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const imageStore=this.db.transaction(this.storename,'readwrite').objectStore(this.storename);
      const req=imageStore.delete(id);
      req.onsuccess=(e: any)=>{
        this.busy=false;
        resolve(req.result);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });
  }

  update(obj: any){
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const imageStore=this.db.transaction(this.storename,'readwrite').objectStore(this.storename);
      const req=imageStore.put(obj);
      req.onsuccess=(e: any)=>{
        this.busy=false;
        resolve(req.result);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });
  }
  getAll(){
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const imageStore=this.db.transaction(this.storename,'readwrite').objectStore(this.storename);
      const req=imageStore.getAll();
      req.onsuccess=(e: any)=>{
        this.busy=false;
        resolve(req.result);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });
  }
  insert(appoinment: any) {
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const tx=this.db.transaction(this.storename,'readwrite');
      const imageStore=tx.objectStore(this.storename);
      const req=imageStore.add(appoinment);
      req.onsuccess=(e: any)=>{
        this.busy=false;
        appoinment.id=e.target.result;
        resolve(appoinment);
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });

  }
}


