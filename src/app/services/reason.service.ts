import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReasonService {
  reasons: string[]=[];
  constructor() {
    const reasonsStr=localStorage.getItem('reasons');
    if(reasonsStr!=null){
      this.reasons=JSON.parse(reasonsStr);
    }else{
      localStorage.setItem('reasons',JSON.stringify(this.reasons));
    }
   }

   check(reason: string){
     if(!this.reasons.includes(reason)){
       this.reasons.push(reason);
       localStorage.setItem('reasons',JSON.stringify(this.reasons));
     }
   }
}
