import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-singleappointment',
  templateUrl: './singleappointment.component.html',
  styleUrls: ['./singleappointment.component.scss'],
})
export class SingleappointmentComponent implements OnInit {
@Input() person: any;
  constructor() { }
  ngOnInit() {
    console.log(this.person);

  }

}
