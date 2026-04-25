import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-block',
  templateUrl: './skeleton-block.component.html',
  styleUrls: ['./skeleton-block.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonBlockComponent {
  @Input() height = 120;
  @Input() width: string | null = null;
}
