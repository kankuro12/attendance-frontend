import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reschedule-type',
  templateUrl: './reschedule-type.component.html',
  styleUrls: ['./reschedule-type.component.scss'],
})
export class RescheduleTypeComponent implements OnInit {
  @Output() selected=new EventEmitter<any>();
  type=1;
  num;
  date: string;
  constructor() { }

  ngOnInit() {

  }

  done(){
    console.log(this.num);
    // eslint-disable-next-line eqeqeq
    if(this.type===2 && (this.num==undefined || this.num==null)){
      alert('Please enter new number to reschedule');
      return;
    }

    // eslint-disable-next-line eqeqeq
    if(this.type===3 && (this.date==undefined || this.date==null)){
      alert('Please select a date to reschedule');
      return;

    }
    console.log(typeof this.date,this.date,this.date.slice(0,10));


    this.selected.emit({type:this.type,num:this.num,date:this.date.slice(0,10)});
  }

}
