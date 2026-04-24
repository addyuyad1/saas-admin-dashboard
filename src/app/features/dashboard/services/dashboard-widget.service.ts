import { Injectable } from '@angular/core';

import {
  DASHBOARD_WIDGETS,
  DashboardWidgetId,
} from '../models/dashboard-widget.model';

@Injectable()
export class DashboardWidgetService {
  private readonly storageKey = 'saas-admin-dashboard.dashboard-widgets';
  private readonly defaultWidgetIds = DASHBOARD_WIDGETS.map((widget) => widget.id);

  getVisibleWidgetIds(): DashboardWidgetId[] {
    const storedValue = localStorage.getItem(this.storageKey);

    if (!storedValue) {
      return this.defaultWidgetIds;
    }

    try {
      const parsed = JSON.parse(storedValue) as DashboardWidgetId[];
      const filtered = parsed.filter((id) => this.defaultWidgetIds.includes(id));

      return filtered.length ? filtered : this.defaultWidgetIds;
    } catch {
      localStorage.removeItem(this.storageKey);
      return this.defaultWidgetIds;
    }
  }

  removeWidget(widgetId: DashboardWidgetId): DashboardWidgetId[] {
    const nextValue = this.getVisibleWidgetIds().filter((id) => id !== widgetId);
    return this.persist(nextValue.length ? nextValue : this.defaultWidgetIds);
  }

  restoreWidget(widgetId: DashboardWidgetId): DashboardWidgetId[] {
    const nextValue = this.getVisibleWidgetIds();

    if (!nextValue.includes(widgetId)) {
      nextValue.push(widgetId);
    }

    return this.persist(nextValue);
  }

  private persist(widgetIds: DashboardWidgetId[]): DashboardWidgetId[] {
    localStorage.setItem(this.storageKey, JSON.stringify(widgetIds));
    return widgetIds;
  }
}
