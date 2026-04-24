import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkeletonBlockComponent } from './components/loaders/skeleton-block/skeleton-block.component';
import { PageShellComponent } from './components/ui/page-shell/page-shell.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { HasRoleDirective } from './directives/has-role.directive';
import { FallbackPipe } from './pipes/fallback.pipe';

@NgModule({
  declarations: [PageShellComponent, FallbackPipe, SkeletonBlockComponent],
  imports: [CommonModule, AutofocusDirective, HasRoleDirective],
  exports: [
    CommonModule,
    PageShellComponent,
    FallbackPipe,
    AutofocusDirective,
    HasRoleDirective,
    SkeletonBlockComponent,
  ],
})
export class SharedModule {}
