import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { SharedModule } from '@app/shared/shared.module';

import { BudgetDialogComponent } from './budget-dialog.component';
import { BudgetsComponent } from './budgets.component';

@NgModule({
  declarations: [BudgetsComponent, BudgetDialogComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    RouterModule.forChild([
      { path: '', component: BudgetsComponent, title: 'Budgets · Inbox Ledger' },
    ]),
  ],
})
export class BudgetsModule {}

