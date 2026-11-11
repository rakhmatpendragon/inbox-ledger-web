import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SharedModule } from '@app/shared/shared.module';

import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    SharedModule,
    MatSlideToggleModule,
    RouterModule.forChild([
      { path: '', component: SettingsComponent, title: 'Settings · Inbox Ledger' },
    ]),
  ],
})
export class SettingsModule {}

