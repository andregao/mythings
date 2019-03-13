import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppService } from '../app.service';

@Component({
  selector: 'mt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public appService: AppService) {
  }

  ngOnInit() {
  }

}
