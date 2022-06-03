import { Other } from './other.model';
export class Person {
  name='';
  address='';
  phone= '';
  reason?='';
  code?='';
  used = false;
  image='';
  others: Other[]=[];
}
