import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule, MatSidenavModule, MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

const materialComponents = [
  MatToolbarModule,
  MatSidenavModule,
  LayoutModule,
  MatListModule,
  MatButtonModule,
  MatMenuModule,
  MatDividerModule,
  MatIconModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatSelectModule,
  MatCardModule,
  MatProgressBarModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
];

@NgModule({
  imports: materialComponents,
  exports: materialComponents,
})
export class MaterialModule { }
