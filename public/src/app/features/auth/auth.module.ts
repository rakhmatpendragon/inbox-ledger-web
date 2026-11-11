import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { LandingComponent } from './landing/landing.component';

/** Eagerly loaded: the landing page is the app's entry point. */
@NgModule({
  declarations: [LandingComponent],
  imports: [SharedModule],
  exports: [LandingComponent],
})
export class AuthModule {}

