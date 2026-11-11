import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent, title: 'Dashboard · Inbox Ledger' },
    ]),
  ],
})
export class DashboardModule {}

