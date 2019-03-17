import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './components/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth.effects';
import { reducer } from './reducers/auth.reducer';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthEffects]),
  ]
})
export class AuthModule {
}
