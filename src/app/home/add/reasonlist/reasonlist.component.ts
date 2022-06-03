import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reasonlist',
  templateUrl: './reasonlist.component.html',
  styleUrls: ['./reasonlist.component.scss'],
})
export class ReasonlistComponent implements OnInit {
  @Input() reasons: string[] = [];
  @Output() reasonSelected=new EventEmitter<any>();
  constructor() { }
  ngOnInit() { }
  selected(val: string){
    console.log(val);
    this.reasonSelected.emit(val);
  }
}
