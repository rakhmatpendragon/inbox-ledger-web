import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ReceiptsComponent } from './receipts.component';

@NgModule({
  declarations: [ReceiptsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ReceiptsComponent, title: 'Receipts · Inbox Ledger' },
    ]),
  ],
})
export class ReceiptsModule {}

