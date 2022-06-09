import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  edited: number[]=[];
  deleted: number[]=[];
  added: number[]=[];
  working= false;
  constructor() {
    this.initTrack();
   }

  hasMore(){
    console.log(this.added.length>0||this.edited.length>0||this.deleted.length>0);

    return (this.added.length>0||this.edited.length>0||this.deleted.length>0);

  }
  initTrack(){
    const editedStr=localStorage.getItem('edited');
    if(editedStr!=null){
      this.edited=JSON.parse(editedStr);
    }else{
      localStorage.setItem('edited',JSON.stringify(this.edited));
    }
    const deletedStr=localStorage.getItem('deleted');
    if(deletedStr!=null){
      this.deleted=JSON.parse(deletedStr);
    }else{
      localStorage.setItem('deleted',JSON.stringify(this.deleted));
    }
    const addedStr=localStorage.getItem('added');
    if(addedStr!=null){
      this.added=JSON.parse(addedStr);
    }else{
      localStorage.setItem('added',JSON.stringify(this.added));
    }
    console.log(this);

  }


  addTrack(type: number,id: any){
    if(type===1){
      this.edited.push(id);
      localStorage.setItem('edited',JSON.stringify(this.edited));

    }else if(type===2){
      this.deleted.push(id);
      localStorage.setItem('deleted',JSON.stringify(this.deleted));

    }else{
      this.added.push(id);
      localStorage.setItem('added',JSON.stringify(this.added));
    }
  }

  popTrack(type: number){
    if(type===1){
      this.edited.shift();
      localStorage.setItem('edited',JSON.stringify(this.edited));

    }else if(type===2){
      this.deleted.shift();
      localStorage.setItem('deleted',JSON.stringify(this.deleted));

    }else{
      this.added.shift();
      localStorage.setItem('added',JSON.stringify(this.added));
    }
  }
}
