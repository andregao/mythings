import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/reducers';

@Component({
  selector: 'mt-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  show$ = this.store.pipe(select(fromRoot.isAppLoading));
  mode$ = this.store.pipe(select(fromRoot.getLoaderType));


  constructor(private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
  }

}
