import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
  imports: [SharedModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}

