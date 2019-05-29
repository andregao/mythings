import { NgModule } from '@angular/core';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { WelcomeEffects } from './effects/welcome.effects';
import { ProgressComponent } from './components/progress/progress.component';

@NgModule({
  declarations: [WelcomeComponent, ProgressComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature('info', reducers),
    EffectsModule.forFeature([WelcomeEffects]),
  ]
})
export class InfoModule {
}
