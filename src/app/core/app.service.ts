import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from './reducers';
import * as fromRoot from './reducers';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {
  titleSub: Subscription;

  constructor(
    private titleService: Title,
    private router: Router,
    private store: Store<State>,
    private ngZone: NgZone, // workaround for ngZone failure when redirect from Google
  ) {
    this.getTitle();
  }

  ngOnDestroy(): void {
    this.titleSub.unsubscribe();
  }

  getTitle() {
    this.titleSub = this.store.pipe(
      select(fromRoot.getTitle),
    ).subscribe(title => this.titleService.setTitle(title));
  }

  navigate(route: string) {
    this.ngZone.run(() => this.router.navigateByUrl(route)).then();
  }

}
