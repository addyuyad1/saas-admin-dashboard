import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LoginComponent } from './auth/components/login/login.component';
import { AutofocusDirective } from '../shared/directives/autofocus.directive';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AutofocusDirective],
  exports: [LoginComponent],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule should only be imported once.');
    }
  }
}
