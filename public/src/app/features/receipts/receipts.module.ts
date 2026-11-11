import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedModule } from '@app/shared/shared.module';

import { ReceiptsComponent } from './receipts.component';

@NgModule({
  declarations: [ReceiptsComponent],
  imports: [
    SharedModule,
    MatTabsModule,
    RouterModule.forChild([
      { path: '', component: ReceiptsComponent, title: 'Receipts · Inbox Ledger' },
    ]),
  ],
})
export class ReceiptsModule {}

