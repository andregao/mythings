import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { WelcomeComponent } from './info/components/welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './home/home.module#HomeModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
