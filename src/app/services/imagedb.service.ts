import { LocalImage } from './../model/localImage.modal';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagedbService {
  db: IDBDatabase;
  open=false;
  busy=false;
  dbname='imageDB';
  storename='image-store';
  constructor() {
    const req = window.indexedDB.open(this.dbname, 2);
    req.onupgradeneeded =  (e: IDBVersionChangeEvent)  => {
      this.db= req.result;
      const imageStore=this.db.createObjectStore(this.storename, {
        autoIncrement: true,
        keyPath: 'id'
      });
      imageStore.createIndex('image','image',{unique:false});
    };
    req.onsuccess=(e)=>{
      this.db=req.result;
      this.open=true;
    };
  }

  get(id: number){
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
      const req=imageStore.put(obj,obj.id);
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
  insert(image: string) {
    this.busy=true;
    return new Promise((resolve,reject)=>{
      const tx=this.db.transaction(this.storename,'readwrite');
      const imageStore=tx.objectStore(this.storename);
      const req=imageStore.add({
        image
      });
      req.onsuccess=(e: any)=>{
        this.busy=false;
        resolve({id:e.target.result,image});
      };
      req.onerror=(e: any)=>{
        this.busy=false;
        reject(e);
      };
    });

  }
}
