import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkeletonBlockComponent } from './components/loaders/skeleton-block/skeleton-block.component';
import { PageShellComponent } from './components/ui/page-shell/page-shell.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { FallbackPipe } from './pipes/fallback.pipe';

@NgModule({
  declarations: [PageShellComponent, FallbackPipe, SkeletonBlockComponent],
  imports: [CommonModule, AutofocusDirective],
  exports: [
    CommonModule,
    PageShellComponent,
    FallbackPipe,
    AutofocusDirective,
    SkeletonBlockComponent,
  ],
})
export class SharedModule {}
