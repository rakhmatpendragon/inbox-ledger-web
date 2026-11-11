import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BadgeComponent } from './components/badge/badge.component';
import { BudgetBarComponent } from './components/budget-bar/budget-bar.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import {
  EmptyStateComponent,
  ErrorStateComponent,
  LoadingStateComponent,
} from './components/states/states.components';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { CurrencyIdrPipe } from './pipes/currency-idr.pipe';

const DECLARATIONS = [
  BadgeComponent,
  BudgetBarComponent,
  StatCardComponent,
  TransactionTableComponent,
  LoadingStateComponent,
  EmptyStateComponent,
  ErrorStateComponent,
  CurrencyIdrPipe,
];

const SHARED_IMPORTS = [
  CommonModule,
  RouterModule,
  ClipboardModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule,
  MatTooltipModule,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: SHARED_IMPORTS,
  exports: [...SHARED_IMPORTS, ...DECLARATIONS],
})
export class SharedModule {}

