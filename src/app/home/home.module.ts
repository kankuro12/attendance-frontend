import { RescheduleTypeComponent } from './reschedule-type/reschedule-type.component';
import { SingleappointmentComponent } from './singleappointment/singleappointment.component';
import { ExtrapersonComponent } from './add/extraperson/extraperson.component';
import { ReasonlistComponent } from './add/reasonlist/reasonlist.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule
  ],
  declarations: [HomePage,AddComponent,ReasonlistComponent,ExtrapersonComponent,SingleappointmentComponent,RescheduleTypeComponent]
})
export class HomePageModule {}
