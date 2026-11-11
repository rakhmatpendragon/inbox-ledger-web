import { Observable, catchError, map, of, startWith, switchMap, timer } from 'rxjs';

/**
 * UI-friendly wrapper around an async result so every page can render
 * the three required states: loading, loaded and error.
 */
export interface LoadState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

export function withLoadState<T>(source: Observable<T>): Observable<LoadState<T>> {
  return source.pipe(
    map((data): LoadState<T> => ({ loading: false, data, error: null })),
    startWith<LoadState<T>>({ loading: true, data: null, error: null }),
    catchError((err: unknown) =>
      of<LoadState<T>>({
        loading: false,
        data: null,
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      }),
    ),
  );
}

/** Simulates network latency on subscription only (later emissions are not delayed). */
export function withMockLatency<T>(source: Observable<T>, ms = 300): Observable<T> {
  return timer(ms).pipe(switchMap(() => source));
}

