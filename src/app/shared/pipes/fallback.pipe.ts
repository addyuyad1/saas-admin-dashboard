import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',
  standalone: false,
})
export class FallbackPipe implements PipeTransform {
  transform(value: string | null | undefined, fallback = 'Not provided'): string {
    return value?.trim() ? value : fallback;
  }
}
