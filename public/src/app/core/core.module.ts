import { NgModule, Optional, SkipSelf } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

/**
 * Singleton providers. Services use `providedIn: 'root'`; this module only
 * wires app-wide infrastructure and must be imported once, by AppModule.
 */
@NgModule({
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule | null) {
    if (parent) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}

