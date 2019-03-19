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
  private isLoading = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoading.asObservable();

  private loadingType = new BehaviorSubject<string>('indeterminate');
  loadingType$ = this.loadingType.asObservable();

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
      tap(title => this.titleService.setTitle(title))
    ).subscribe();
  }

  navigate(route: string) {
    this.ngZone.run(() => this.router.navigateByUrl(route)).then();
  }

  startLoading(type: string = 'indeterminate') {
    // console.log('loader starts');
    this.loadingType.next(type);
    this.isLoading.next(true);
  }

  stopLoading() {
    // console.log('loading ends');
    this.isLoading.next(false);
  }

}
