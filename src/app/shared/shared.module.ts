import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';

@NgModule({
  declarations: [LoadingComponent, TruncateTextPipe],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    LoadingComponent,
    TruncateTextPipe,
  ]
})
export class SharedModule {
}
