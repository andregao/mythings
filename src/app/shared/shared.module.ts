import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
  ]
})
export class SharedModule {
}
