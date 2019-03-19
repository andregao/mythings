import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataActions } from '../actions';
import { DataService } from '../../core/data.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions<DataActions.DataActionsUnion>,
    private dataService: DataService,
  ) {
  }

  @Effect({dispatch: false})
  startSyncingData$ = this.actions$.pipe(
    ofType(DataActions.DataActionTypes.StartSyncingData),
    tap(() => this.dataService.startSyncingData()),
  );

}
