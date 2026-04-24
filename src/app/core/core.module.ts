import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AccessDeniedComponent } from './auth/components/access-denied/access-denied.component';
import { LoginComponent } from './auth/components/login/login.component';
import { AutofocusDirective } from '../shared/directives/autofocus.directive';

@NgModule({
  declarations: [LoginComponent, AccessDeniedComponent],
  imports: [CommonModule, ReactiveFormsModule, AutofocusDirective],
  exports: [LoginComponent, AccessDeniedComponent],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule should only be imported once.');
    }
  }
}
