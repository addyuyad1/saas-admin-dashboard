import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  NavigationItem,
  NavigationService,
} from '../../../core/services/navigation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly navigationItems: NavigationItem[];

  constructor(private readonly navigationService: NavigationService) {
    this.navigationItems = navigationService.items;
  }
}
