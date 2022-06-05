import { Person } from './../../../model/person.model';
import { Other } from './../../../model/other.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-extraperson',
  templateUrl: './extraperson.component.html',
  styleUrls: ['./extraperson.component.scss'],
})
export class ExtrapersonComponent implements OnInit {
@Input() other: Other;
@Output() personChange=new EventEmitter<Person>();
  constructor() { }
  ngOnInit() {}

}
