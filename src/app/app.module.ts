import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects, reducers, metaReducers } from './core/reducers';
import { InfoModule } from './info/info.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    InfoModule,
    AuthModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      name: 'mathangs.com',
      logOnly: environment.production,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
