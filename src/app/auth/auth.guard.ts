import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { map, take, tap } from 'rxjs/operators';
import { DataService } from '../core/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => !!user), // map user data to boolean
      tap(user => {
        if (!user) {
          // console.log('auth guard: not signed in');
          this.router.navigateByUrl('/signin');
        }
      }),
    );
  }


}
