import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as welcomeActions from '../actions/welcome.actions';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as fromWelcome from '../reducers';
import { DataService } from '../../core/data.service';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';

@Injectable()
export class WelcomeEffects {
  constructor(
    private actions$: Actions<welcomeActions.WelcomeActionsUnion>,
    private dataService: DataService,
    private store: Store<fromWelcome.State>,
  ) {
  }

  @Effect()
  getWelcomeContent$ = this.actions$.pipe(
    ofType(welcomeActions.WelcomeActionTypes.GetContent),
    withLatestFrom(this.store.pipe(select(fromWelcome.getWelcomeUpdateTime))),
    filter(([action, updateTime]) => {
        if (Date.now() - updateTime < 3600000) { // one hour
          this.store.dispatch(new welcomeActions.GetContentSkipped());
          return false;
        }
        return true;
      }
    ),
    switchMap(() => this.dataService.getWelcomeContent().pipe(
      map(content => new welcomeActions.GetContentSuccess(content)),
      catchError(error => of(new welcomeActions.GetContentFailure(error))),
      )
    ),
  );
}

