import { Injectable } from '@angular/core';
import { Observable, interval, map, scan, shareReplay, startWith } from 'rxjs';

export interface LiveActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning';
}

export type ConnectionState = 'live' | 'syncing';

@Injectable({
  providedIn: 'root',
})
export class RealtimeUpdatesService {
  private readonly activityTemplates = [
    {
      title: 'Workspace synced',
      detail: 'Latest preference changes were propagated to active sessions.',
      level: 'info' as const,
    },
    {
      title: 'Subscription upgraded',
      detail: 'A Growth workspace expanded to Enterprise.',
      level: 'success' as const,
    },
    {
      title: 'Review required',
      detail: 'One user invitation has been pending for more than 24 hours.',
      level: 'warning' as const,
    },
    {
      title: 'Usage milestone reached',
      detail: 'Weekly active users crossed the current forecast threshold.',
      level: 'success' as const,
    },
  ];

  // This mimics a lightweight WebSocket stream without adding backend complexity yet.
  readonly connectionState$: Observable<ConnectionState> = interval(6000).pipe(
    startWith(0),
    map((tick) => (tick % 3 === 2 ? 'syncing' : 'live')),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly activityFeed$: Observable<LiveActivityItem[]> = interval(4500).pipe(
    startWith(0),
    scan((feed, tick) => {
      const template = this.activityTemplates[tick % this.activityTemplates.length];
      const nextItem: LiveActivityItem = {
        id: `activity-${tick}`,
        title: template.title,
        detail: template.detail,
        timestamp: new Date().toLocaleTimeString(),
        level: template.level,
      };

      return [nextItem, ...feed].slice(0, 5);
    }, [] as LiveActivityItem[]),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
