import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from './reducers';
import * as fromRoot from './reducers';
import { tap } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {
  titleSub: Subscription;

  constructor(
    private titleService: Title,
    private router: Router,
    private store: Store<State>,
    private ngZone: NgZone,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.getTitle();
    iconRegistry.addSvgIcon('google',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'));
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
    // workaround for ngZone failure when redirected from Google
    this.ngZone.run(() => this.router.navigateByUrl(route)).then();
  }

}
