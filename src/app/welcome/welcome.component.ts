import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AppService } from '../core/app.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataService } from '../core/data.service';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isSignedIn$: Observable<boolean>;
  content;

  constructor(
    public authService: AuthService,
    private appService: AppService,
    private dataService: DataService,
  ) {
  }

  ngOnInit() {
    this.appService.setTitle('Welcome to MaThangs');
    this.isSignedIn$ = this.authService.currentUser$.pipe(
      map(user => !!user),
      tap(() => this.appService.stopLoading()),
    );
    this.dataService.getWelcomeContent().then(doc => {
      if (doc.exists) {
        this.content = doc.data();
      }
    });

  }

}
