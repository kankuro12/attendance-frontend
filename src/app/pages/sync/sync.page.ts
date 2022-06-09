import { SyncService } from './../../services/sync.service';
import { HomeService } from './../../services/home.service';
import { HomePage } from './../../home/home.page';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

  constructor(public homeService: HomeService,public sync: SyncService) { }

  ngOnInit() {
  }

}
