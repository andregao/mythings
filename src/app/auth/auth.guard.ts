import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as fromAuth from './reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromAuth.State>,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.pipe(
      select(fromAuth.isSignedIn),
      takeUntil(this.router.events),
      tap(signedIn => {
        if (!signedIn) {
          this.router.navigateByUrl('/signin');
        }
      })
    );
  }


}
