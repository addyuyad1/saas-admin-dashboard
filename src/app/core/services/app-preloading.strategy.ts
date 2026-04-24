import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PreloadingStrategy, Route } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppPreloadingStrategy implements PreloadingStrategy {
  // Only routes that opt in get preloaded, which keeps admin-only or rarely used
  // areas from competing with the most common dashboard path.
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
