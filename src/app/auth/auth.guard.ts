import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { map, take, tap } from 'rxjs/operators';
import { DataService } from '../core/data.service';
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
      select(fromAuth.getSignedIn),
      take(1),
      tap(signedIn => {
        if (!signedIn) {
          this.router.navigateByUrl('/signin');
        }
      })
    );
    // return this.authService.currentUser$.pipe(
    //   take(1),
    //   map(user => !!user), // map user data to boolean
    //   tap(user => {
    //     if (!user) {
    //       // console.log('auth guard: not signed in');
    //       this.router.navigateByUrl('/signin');
    //     }
    //   }),
    // );
  }


}
